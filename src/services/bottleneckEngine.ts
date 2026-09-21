import type { BottleneckAnalysis, BuildComponents } from '../types/pcBuilder';

export function analyzeBuildBottleneck(
  build: BuildComponents,
  workload: '1080p Gaming' | '1440p Gaming' | '4K Gaming' | 'Content Creation / Rendering' = '1440p Gaming'
): BottleneckAnalysis {
  const cpu = build.cpu;
  const gpu = build.gpu;
  const ram = build.ram;
  const storage = build.storage;
  const cooler = build.cooler;

  const cpuCores = cpu?.cpuSpecs?.coreCount || 6;
  const cpuBoost = cpu?.cpuSpecs?.boostClockGHz || 4.2;
  const cpuPowerScore = cpuCores * 4 + cpuBoost * 12;

  const gpuVram = gpu?.gpuSpecs?.vramGB || 8;
  const gpuPowerScore = (gpu?.gpuSpecs?.tdpW || 150) * 0.35 + gpuVram * 5;

  const ramCapacity = ram?.ramSpecs?.totalCapacityGB || 16;
  const storageType = storage?.storageSpecs?.type || 'SATA SSD';

  let cpuUtil = 50;
  let gpuUtil = 50;
  let ramUtil = Math.round((8 / ramCapacity) * 100);
  let vramUtil = Math.round((6 / gpuVram) * 100);
  let thermalRisk = 20;

  if (cooler && cpu) {
    const coolerMaxTdp = cooler.coolerSpecs?.maxTdpW || 100;
    const cpuTdp = cpu.cpuSpecs?.tdpW || 100;
    if (coolerMaxTdp < cpuTdp) {
      thermalRisk = 85;
    } else if (coolerMaxTdp < cpuTdp * 1.3) {
      thermalRisk = 50;
    } else {
      thermalRisk = 15;
    }
  }

  let limiter: 'CPU' | 'GPU' | 'RAM' | 'VRAM' | 'Balanced' = 'Balanced';
  let limiterText = 'Balanced System';
  let detailedReason = '';

  if (workload === '1080p Gaming') {
    vramUtil = Math.min(95, Math.round((5 / gpuVram) * 100));
    if (cpuPowerScore < gpuPowerScore * 0.75) {
      cpuUtil = 96;
      gpuUtil = 68;
      limiter = 'CPU';
      limiterText = 'Primary Limiter: CPU Limited';
      detailedReason = `At 1080p resolution, frame rendering relies heavily on CPU single-thread throughput. Your ${cpu ? cpu.name : 'CPU'} limits the GPU potential.`;
    } else {
      cpuUtil = 72;
      gpuUtil = 95;
      limiter = 'GPU';
      limiterText = 'Primary Limiter: GPU Limited';
      detailedReason = `Even at 1080p, your graphics processor is working near full capacity while your CPU maintains plenty of headroom.`;
    }
  } else if (workload === '1440p Gaming') {
    vramUtil = Math.min(99, Math.round((8.5 / gpuVram) * 100));
    if (vramUtil > 95) {
      limiter = 'VRAM';
      limiterText = 'Primary Limiter: VRAM Capacity Risk';
      detailedReason = `Your GPU's ${gpuVram}GB VRAM capacity is near its maximum limit at 1440p Ultra textures.`;
    } else if (Math.abs(cpuPowerScore - gpuPowerScore) < 25) {
      cpuUtil = 82;
      gpuUtil = 92;
      limiter = 'Balanced';
      limiterText = 'Optimal Balance';
      detailedReason = `Your CPU and GPU are exceptionally well matched for 1440p gaming.`;
    } else if (gpuPowerScore < cpuPowerScore) {
      cpuUtil = 65;
      gpuUtil = 98;
      limiter = 'GPU';
      limiterText = 'Primary Limiter: GPU Limited';
      detailedReason = `At 1440p, pixel rendering workload increases significantly. The ${gpu ? gpu.name : 'GPU'} is the primary bottleneck.`;
    } else {
      cpuUtil = 92;
      gpuUtil = 78;
      limiter = 'CPU';
      limiterText = 'Primary Limiter: CPU Limited';
      detailedReason = `The ${cpu ? cpu.name : 'CPU'} is restricting high framerate delivery to the GPU in CPU-bound titles.`;
    }
  } else if (workload === '4K Gaming') {
    vramUtil = Math.min(100, Math.round((12.5 / gpuVram) * 100));
    cpuUtil = 48;
    gpuUtil = 99;
    limiter = 'GPU';
    limiterText = 'Primary Limiter: GPU Bound';
    detailedReason = `At 4K resolution (8.3 Million Pixels), graphics rendering load dominates system bottlenecks.`;
  } else {
    ramUtil = Math.min(100, Math.round((28 / ramCapacity) * 100));
    if (ramCapacity < 32) {
      limiter = 'RAM';
      limiterText = 'Primary Limiter: RAM Capacity';
      detailedReason = `Multi-track video editing and 3D rendering heavily benefit from 32GB+ RAM.`;
    } else if (cpuCores < 12) {
      limiter = 'CPU';
      limiterText = 'Primary Limiter: CPU Core Count';
      detailedReason = `Heavy rendering workloads utilize all available CPU threads.`;
    } else {
      limiter = 'Balanced';
      limiterText = 'High Productivity Rating';
      detailedReason = `Excellent workstation capability for video production, 3D modelling, and code compilation.`;
    }
  }

  if (storageType === 'SATA HDD') {
    detailedReason += ' Note: Mechanical HDD will cause asset streaming hitches in modern open-world games.';
  }

  return {
    workload,
    cpuUtil,
    gpuUtil,
    ramUtil,
    vramUtil,
    thermalRisk,
    primaryLimiter: limiter,
    limiterScoreText: limiterText,
    detailedReason,
  };
}
