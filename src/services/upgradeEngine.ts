import { SEED_COMPONENTS } from '../data/seedData';
import type { BuildComponents, Component } from '../types/pcBuilder';

export interface UpgradeRecommendation {
  targetCategory: 'gpu' | 'cpu' | 'ram' | 'storage' | 'psu';
  currentComponent: Component | null;
  recommendedComponent: Component;
  expectedPerformanceGainPercent: number;
  estimatedPowerDeltaW: number;
  valueRating: 'Maximum Gain' | 'High Impact' | 'Moderate Gain';
  explanation: string;
}

export interface UpgradeAdviceReport {
  primaryUpgrade: UpgradeRecommendation;
  alternativeUpgrades: UpgradeRecommendation[];
  weakestLinkReason: string;
}

export function generateUpgradeAdvice(currentBuild: BuildComponents): UpgradeAdviceReport | null {
  const currentCpu = currentBuild.cpu;
  const currentGpu = currentBuild.gpu;

  const gpus = SEED_COMPONENTS.filter((c) => c.category === 'gpu');
  const cpus = SEED_COMPONENTS.filter((c) => c.category === 'cpu');

  if (!currentGpu || currentGpu.id === 'gpu-rx-6600' || currentGpu.id === 'gpu-rtx-4060-ti') {
    const recGpu = gpus.find((g) => g.id === 'gpu-rtx-4070-super') || gpus[0];
    const gain = currentGpu?.id === 'gpu-rx-6600' ? 145 : 75;
    const pwrDelta = recGpu.powerConsumptionW - (currentGpu?.powerConsumptionW || 130);

    const primaryUpgrade: UpgradeRecommendation = {
      targetCategory: 'gpu',
      currentComponent: currentGpu,
      recommendedComponent: recGpu,
      expectedPerformanceGainPercent: gain,
      estimatedPowerDeltaW: pwrDelta,
      valueRating: 'Maximum Gain',
      explanation: `Upgrading from ${currentGpu ? currentGpu.name : 'integrated graphics'} to ${recGpu.name} provides ~${gain}% higher 1440p gaming framerate and unlocks DLSS 3 Frame Generation.`,
    };

    const altGpu = gpus.find((g) => g.id === 'gpu-rx-7800-xt') || gpus[1];
    const altUpgrade: UpgradeRecommendation = {
      targetCategory: 'gpu',
      currentComponent: currentGpu,
      recommendedComponent: altGpu,
      expectedPerformanceGainPercent: gain - 15,
      estimatedPowerDeltaW: altGpu.powerConsumptionW - (currentGpu?.powerConsumptionW || 130),
      valueRating: 'High Impact',
      explanation: `Alternative 16GB VRAM AMD option providing raw rasterization power.`,
    };

    return {
      primaryUpgrade,
      alternativeUpgrades: [altUpgrade],
      weakestLinkReason: `Your GPU (${currentGpu ? currentGpu.name : 'Basic GPU'}) is currently the primary bottleneck limiting 1440p High framerates.`,
    };
  } else {
    const recCpu = cpus.find((c) => c.id === 'cpu-ryzen-7800x3d') || cpus[0];
    const gain = 45;
    const pwrDelta = recCpu.powerConsumptionW - (currentCpu?.powerConsumptionW || 65);

    const primaryUpgrade: UpgradeRecommendation = {
      targetCategory: 'cpu',
      currentComponent: currentCpu,
      recommendedComponent: recCpu,
      expectedPerformanceGainPercent: gain,
      estimatedPowerDeltaW: pwrDelta,
      valueRating: 'Maximum Gain',
      explanation: `Upgrading to the ${recCpu.name} with 3D V-Cache eliminates 1% low frame drops in CPU-heavy esports and open-world titles.`,
    };

    return {
      primaryUpgrade,
      alternativeUpgrades: [],
      weakestLinkReason: `Your CPU is holding back minimum 1% low framerates in competitive titles.`,
    };
  }
}
