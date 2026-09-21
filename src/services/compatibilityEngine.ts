import type { BuildComponents, CompatibilityIssue, CompatibilityReport } from '../types/pcBuilder';

export function runCompatibilityCheck(build: BuildComponents): CompatibilityReport {
  const issues: CompatibilityIssue[] = [];
  const cpu = build.cpu;
  const gpu = build.gpu;
  const mobo = build.motherboard;
  const ram = build.ram;
  const storage = build.storage;
  const cooler = build.cooler;
  const psu = build.psu;
  const pcCase = build.case;

  let basePowerW = 50;
  if (cpu) basePowerW += cpu.powerConsumptionW;
  if (gpu) basePowerW += gpu.powerConsumptionW;
  if (ram) basePowerW += ram.powerConsumptionW;
  if (storage) basePowerW += storage.powerConsumptionW;
  if (cooler) basePowerW += cooler.powerConsumptionW;
  if (build.case_fan) basePowerW += build.case_fan.powerConsumptionW;
  if (build.monitor) basePowerW += build.monitor.powerConsumptionW;

  const totalWattageW = Math.round(basePowerW);
  const recommendedPsuW = Math.ceil((totalWattageW * 1.25) / 50) * 50;

  if (cpu && mobo) {
    const cpuSocket = cpu.cpuSpecs?.socket;
    const moboSocket = mobo.motherboardSpecs?.socket;

    if (cpuSocket && moboSocket && cpuSocket !== moboSocket) {
      issues.push({
        id: 'cpu-mobo-socket-mismatch',
        type: 'error',
        category: 'CPU ↔ Motherboard',
        title: 'Socket Mismatch',
        message: `CPU socket ${cpuSocket} is incompatible with Motherboard socket ${moboSocket}.`,
        certainty: 'Known Rule',
      });
    }

    if (mobo.motherboardSpecs?.biosUpdateRequiredFor?.includes(cpu.cpuSpecs?.generation || '')) {
      issues.push({
        id: 'cpu-mobo-bios-warning',
        type: 'warning',
        category: 'CPU ↔ Motherboard',
        title: 'BIOS Update May Be Required',
        message: `The ${mobo.name} motherboard may require BIOS update to support the ${cpu.name} (${cpu.cpuSpecs?.generation}).`,
        certainty: 'Known Rule',
      });
    }
  }

  if (ram && mobo) {
    const ramDdr = ram.ramSpecs?.ddrGen;
    const moboDdr = mobo.motherboardSpecs?.ddrGen;

    if (ramDdr && moboDdr && ramDdr !== moboDdr) {
      issues.push({
        id: 'ram-mobo-ddr-mismatch',
        type: 'error',
        category: 'RAM ↔ Motherboard',
        title: 'RAM Generation Incompatibility',
        message: `Selected RAM is ${ramDdr}, but motherboard explicitly supports ${moboDdr} slots only.`,
        certainty: 'Known Rule',
      });
    }

    if (ram.ramSpecs && mobo.motherboardSpecs) {
      if (ram.ramSpecs.moduleCount > mobo.motherboardSpecs.dimmSlots) {
        issues.push({
          id: 'ram-mobo-dimm-slots',
          type: 'error',
          category: 'RAM ↔ Motherboard',
          title: 'Insufficient RAM DIMM Slots',
          message: `Selected RAM kit requires ${ram.ramSpecs.moduleCount} slots, but motherboard only has ${mobo.motherboardSpecs.dimmSlots} slots available.`,
          certainty: 'Known Rule',
        });
      }

      if (ram.ramSpecs.speedMHz > mobo.motherboardSpecs.maxMemorySpeedMHz) {
        issues.push({
          id: 'ram-mobo-speed-downclock',
          type: 'warning',
          category: 'RAM ↔ Motherboard',
          title: 'RAM Speed Exceeds Board Maximum',
          message: `RAM rated at ${ram.ramSpecs.speedMHz}MHz exceeds motherboard max specified clock of ${mobo.motherboardSpecs.maxMemorySpeedMHz}MHz.`,
          certainty: 'Inferred Warning',
        });
      }
    }
  }

  if (cooler && cpu) {
    const coolerSockets = cooler.coolerSpecs?.socketSupport || [];
    const cpuSocket = cpu.cpuSpecs?.socket;

    if (cpuSocket && coolerSockets.length > 0 && !coolerSockets.includes(cpuSocket)) {
      issues.push({
        id: 'cooler-cpu-socket-mismatch',
        type: 'error',
        category: 'Cooler ↔ CPU',
        title: 'Cooler Mounting Bracket Incompatibility',
        message: `Cooler ${cooler.name} does not include bracket support for socket ${cpuSocket}.`,
        certainty: 'Known Rule',
      });
    }

    const coolerMaxTdp = cooler.coolerSpecs?.maxTdpW || 0;
    const cpuRecTdp = cpu.cpuSpecs?.coolingTdpRecommendedW || cpu.cpuSpecs?.tdpW || 100;
    if (coolerMaxTdp > 0 && coolerMaxTdp < cpuRecTdp) {
      issues.push({
        id: 'cooler-cpu-thermal-throttling',
        type: 'warning',
        category: 'Cooler ↔ CPU',
        title: 'Potential Thermal Throttling',
        message: `Cooler rating (${coolerMaxTdp}W TDP) is below CPU recommended thermal capacity (${cpuRecTdp}W).`,
        certainty: 'Inferred Warning',
      });
    }
  }

  if (cooler && pcCase) {
    if (cooler.coolerSpecs?.coolerType === 'Air Cooler' && cooler.coolerSpecs.heightMm) {
      const coolerHeight = cooler.coolerSpecs.heightMm;
      const caseMaxHeight = pcCase.caseSpecs?.maxCpuCoolerHeightMm || 999;
      if (coolerHeight > caseMaxHeight) {
        issues.push({
          id: 'cooler-case-height-clearance',
          type: 'error',
          category: 'Cooler ↔ Case',
          title: 'Air Cooler Clearance Limit Exceeded',
          message: `Air cooler height (${coolerHeight}mm) exceeds case maximum cooler height clearance (${caseMaxHeight}mm).`,
          certainty: 'Known Rule',
        });
      }
    }

    if (cooler.coolerSpecs?.coolerType === 'AIO Liquid' && cooler.coolerSpecs.radiatorSizeMm) {
      const radSize = cooler.coolerSpecs.radiatorSizeMm;
      const supportedRads = pcCase.caseSpecs?.radiatorSupportMm || [];
      if (supportedRads.length > 0 && !supportedRads.includes(radSize)) {
        issues.push({
          id: 'cooler-case-radiator-size',
          type: 'error',
          category: 'Cooler ↔ Case',
          title: 'AIO Radiator Fit Incompatibility',
          message: `Case does not explicitly list mounting support for ${radSize}mm AIO radiator size.`,
          certainty: 'Known Rule',
        });
      }
    }
  }

  if (gpu && pcCase) {
    const gpuLength = gpu.gpuSpecs?.lengthMm || 0;
    const caseMaxGpu = pcCase.caseSpecs?.maxGpuLengthMm || 999;
    if (gpuLength > caseMaxGpu) {
      issues.push({
        id: 'gpu-case-length-clearance',
        type: 'error',
        category: 'GPU ↔ Case',
        title: 'GPU Length Clearance Limit Exceeded',
        message: `GPU length (${gpuLength}mm) exceeds case maximum clearance (${caseMaxGpu}mm).`,
        certainty: 'Known Rule',
      });
    }
  }

  if (psu) {
    const psuWattage = psu.psuSpecs?.wattageW || 0;
    if (psuWattage < totalWattageW) {
      issues.push({
        id: 'psu-insufficient-wattage-error',
        type: 'error',
        category: 'PSU ↔ Build',
        title: 'Critical Power Supply Deficit',
        message: `PSU rating (${psuWattage}W) is lower than estimated system power consumption (${totalWattageW}W).`,
        certainty: 'Known Rule',
      });
    } else if (psuWattage < recommendedPsuW) {
      issues.push({
        id: 'psu-low-overhead-warning',
        type: 'warning',
        category: 'PSU ↔ Build',
        title: 'Low Power Supply Overhead Reserve',
        message: `System total load (${totalWattageW}W) leaves less than 20% overhead headroom on ${psuWattage}W PSU.`,
        certainty: 'Inferred Warning',
      });
    }

    if (gpu && gpu.gpuSpecs?.powerConnectors?.includes('16-pin 12VHPWR') && !psu.psuSpecs?.native12VHPWR) {
      issues.push({
        id: 'psu-gpu-12vhpwr-adapter',
        type: 'info',
        category: 'PSU ↔ Build',
        title: 'Adapter Required for 16-pin 12VHPWR GPU',
        message: `The ${gpu.name} requires a 16-pin 12VHPWR cable. Selected PSU lacks native 12VHPWR output and will require adapter dongles.`,
        certainty: 'Known Rule',
      });
    }
  } else {
    issues.push({
      id: 'psu-missing',
      type: 'warning',
      category: 'PSU ↔ Build',
      title: 'Power Supply Not Selected',
      message: `No Power Supply Unit (PSU) added yet. Estimated build requirement: ${recommendedPsuW}W Gold rated PSU.`,
      certainty: 'Known Rule',
    });
  }

  let overallStatus: 'compatible' | 'warning' | 'incompatible' = 'compatible';
  if (issues.some((i) => i.type === 'error')) {
    overallStatus = 'incompatible';
  } else if (issues.some((i) => i.type === 'warning')) {
    overallStatus = 'warning';
  }

  return {
    overallStatus,
    issues,
    totalWattageW,
    recommendedPsuW,
  };
}
