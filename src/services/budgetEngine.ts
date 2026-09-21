import { SEED_COMPONENTS } from '../data/seedData';
import type { BuildComponents } from '../types/pcBuilder';

export interface TargetBuildRequest {
  workload: 'Gaming' | 'Streaming' | 'Video Editing' | '3D Rendering' | 'AI / ML';
  resolution: '1080p' | '1440p' | '4K';
  targetFps: number;
}

export interface TargetBuildResult {
  build: BuildComponents;
  estimatedPowerW: number;
  reasoning: string[];
}

export function generateTargetBuild(req: TargetBuildRequest): TargetBuildResult {
  const cpus = SEED_COMPONENTS.filter((c) => c.category === 'cpu');
  const gpus = SEED_COMPONENTS.filter((c) => c.category === 'gpu');
  const mobos = SEED_COMPONENTS.filter((c) => c.category === 'motherboard');
  const rams = SEED_COMPONENTS.filter((c) => c.category === 'ram');
  const storages = SEED_COMPONENTS.filter((c) => c.category === 'storage');
  const coolers = SEED_COMPONENTS.filter((c) => c.category === 'cooler');
  const psus = SEED_COMPONENTS.filter((c) => c.category === 'psu');
  const cases = SEED_COMPONENTS.filter((c) => c.category === 'case');

  let selectedCpu = cpus.find((c) => c.id === 'cpu-ryzen-7800x3d') || cpus[0];
  let selectedGpu = gpus.find((g) => g.id === 'gpu-rtx-4070-super') || gpus[0];

  if (req.resolution === '4K' || req.targetFps >= 180) {
    selectedCpu = cpus.find((c) => c.id === 'cpu-ryzen-7950x3d') || cpus[0];
    selectedGpu = gpus.find((g) => g.id === 'gpu-rtx-5090') || gpus[0];
  }

  const cpuSocket = selectedCpu.cpuSpecs?.socket || 'AM5';
  const selectedMobo = mobos.find((m) => m.motherboardSpecs?.socket === cpuSocket) || mobos[0];
  const ddrGen = selectedMobo.motherboardSpecs?.ddrGen || 'DDR5';
  const selectedRam = rams.find((r) => r.ramSpecs?.ddrGen === ddrGen) || rams[0];
  const selectedStorage = storages[0];
  const selectedCooler = coolers.find((c) => c.coolerSpecs?.socketSupport.includes(cpuSocket)) || coolers[0];

  const estPower = selectedCpu.powerConsumptionW + selectedGpu.powerConsumptionW + 80;
  const selectedPsu = psus.find((p) => (p.psuSpecs?.wattageW || 500) >= estPower * 1.2) || psus[0];
  const selectedCase = cases[0];

  const build: BuildComponents = {
    cpu: selectedCpu,
    gpu: selectedGpu,
    motherboard: selectedMobo,
    ram: selectedRam,
    storage: selectedStorage,
    cooler: selectedCooler,
    psu: selectedPsu,
    case: selectedCase,
    case_fan: null,
    monitor: null,
    os: null,
  };

  const reasoning: string[] = [
    `Selected ${selectedGpu.name} to deliver target performance for ${req.workload} at ${req.resolution}.`,
    `Paired with ${selectedCpu.name} on socket ${cpuSocket} for minimal latency.`,
    `Allocated ${selectedRam.name} matching motherboard ${ddrGen} specification.`,
    `Guaranteed ${selectedPsu.psuSpecs?.wattageW || 650}W power supply headroom for stability.`,
  ];

  return {
    build,
    estimatedPowerW: estPower,
    reasoning,
  };
}
