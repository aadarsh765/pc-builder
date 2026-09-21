export type ComponentCategory = 
  | 'cpu'
  | 'gpu'
  | 'motherboard'
  | 'ram'
  | 'storage'
  | 'psu'
  | 'case'
  | 'cooler'
  | 'case_fan'
  | 'monitor'
  | 'os';

export interface BaseComponent {
  id: string;
  name: string;
  category: ComponentCategory;
  brand: string;
  model: string;
  imageUrl: string;
  powerConsumptionW: number;
  isVerifiedData: boolean;
  verificationSource?: string;
  verificationDate?: string;
  confidenceScore?: 'High' | 'Verified' | 'Estimated';
  notes?: string;
}

export interface CpuSpecs {
  socket: 'AM5' | 'AM4' | 'LGA1700' | 'LGA1851';
  coreCount: number;
  threadCount: number;
  baseClockGHz: number;
  boostClockGHz: number;
  tdpW: number;
  integratedGraphics: boolean;
  generation: string;
  memorySupport: 'DDR4' | 'DDR5' | 'DDR4/DDR5';
  pcieGen: 'PCIe 4.0' | 'PCIe 5.0';
  coolingTdpRecommendedW: number;
}

export interface GpuSpecs {
  chipmaker: 'NVIDIA' | 'AMD' | 'Intel';
  vramGB: number;
  memoryType: 'GDDR6' | 'GDDR6X' | 'GDDR7';
  memoryBusBit: number;
  tdpW: number;
  recommendedPsuW: number;
  lengthMm: number;
  thicknessSlots: number;
  pcieGen: 'PCIe 4.0' | 'PCIe 5.0';
  powerConnectors: string;
  rayTracingCapability: 'Basic' | 'High' | 'Ultra';
  tier: 'Enthusiast' | 'High-End' | 'Mid-Range' | 'Budget';
}

export interface MotherboardSpecs {
  socket: 'AM5' | 'AM4' | 'LGA1700' | 'LGA1851';
  chipset: string;
  ddrGen: 'DDR4' | 'DDR5';
  maxMemorySpeedMHz: number;
  dimmSlots: number;
  maxMemoryGB: number;
  formFactor: 'ATX' | 'Micro-ATX' | 'Mini-ITX';
  pcieGen: 'PCIe 4.0' | 'PCIe 5.0';
  m2SlotsCount: number;
  sataPortsCount: number;
  epsConnectors: '8 pin' | '8+4 pin' | '8+8 pin';
  biosUpdateRequiredFor?: string[];
}

export interface RamSpecs {
  ddrGen: 'DDR4' | 'DDR5';
  totalCapacityGB: number;
  moduleCount: number;
  speedMHz: number;
  casLatency: number;
  heightMm: number;
}

export interface StorageSpecs {
  type: 'NVMe M.2' | 'SATA SSD' | 'SATA HDD';
  capacityGB: number;
  pcieGen?: 'PCIe 5.0' | 'PCIe 4.0' | 'PCIe 3.0' | 'SATA';
  readSpeedMBs: number;
  writeSpeedMBs: number;
}

export interface CoolerSpecs {
  coolerType: 'AIO Liquid' | 'Air Cooler';
  socketSupport: string[];
  heightMm: number;
  radiatorSizeMm?: number;
  maxTdpW: number;
}

export interface PsuSpecs {
  wattageW: number;
  rating80Plus: '80+ Bronze' | '80+ Gold' | '80+ Platinum' | '80+ Titanium';
  modularity: 'Full Modular' | 'Semi Modular' | 'Non-Modular';
  atx3Support: boolean;
  native12VHPWR: boolean;
  eps8PinCount: number;
}

export interface CaseSpecs {
  formFactorSupport: ('ATX' | 'Micro-ATX' | 'Mini-ITX')[];
  maxGpuLengthMm: number;
  maxCpuCoolerHeightMm: number;
  radiatorSupportMm: number[];
  expansionSlots: number;
}

export interface Component extends BaseComponent {
  cpuSpecs?: CpuSpecs;
  gpuSpecs?: GpuSpecs;
  motherboardSpecs?: MotherboardSpecs;
  ramSpecs?: RamSpecs;
  storageSpecs?: StorageSpecs;
  coolerSpecs?: CoolerSpecs;
  psuSpecs?: PsuSpecs;
  caseSpecs?: CaseSpecs;
}

export type BuildComponents = Record<ComponentCategory, Component | null>;

export interface CompatibilityIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  category: string;
  title: string;
  message: string;
  certainty: 'Known Rule' | 'Inferred Warning';
  whyExplanation?: string;
}

export interface CompatibilityReport {
  overallStatus: 'compatible' | 'warning' | 'incompatible';
  issues: CompatibilityIssue[];
  totalWattageW: number;
  recommendedPsuW: number;
}

export interface Game {
  id: string;
  name: string;
  genre: string;
  engine: string;
  releaseYear: number;
  cpuIntensity: 'Low' | 'Medium' | 'High' | 'Extreme';
  gpuIntensity: 'Low' | 'Medium' | 'High' | 'Extreme';
  recommendedVramGB: number;
  coverImage: string;
}

export interface PerformanceFilterOptions {
  resolution: '1080p' | '1440p' | '4K';
  preset: 'Low' | 'Medium' | 'High' | 'Ultra';
  rayTracing: boolean;
  upscaler: 'Off' | 'DLSS Quality' | 'DLSS Performance' | 'FSR Quality' | 'XeSS';
  frameGen: boolean;
}

export interface FpsResult {
  avgFps: number;
  onePercentLowFps: number;
  cpuUtilPercent: number;
  gpuUtilPercent: number;
  vramUsageGB: number;
  primaryLimiter: 'CPU' | 'GPU' | 'RAM' | 'VRAM' | 'Balanced';
  isVerifiedData: boolean;
  provenanceNote: string;
}

export interface BottleneckAnalysis {
  workload: string;
  cpuUtil: number;
  gpuUtil: number;
  ramUtil: number;
  vramUtil: number;
  thermalRisk: number;
  primaryLimiter: 'CPU' | 'GPU' | 'RAM' | 'VRAM' | 'Balanced';
  limiterScoreText: string;
  detailedReason: string;
}

export interface BuildScore {
  overall: number;
  gaming: number;
  productivity: number;
  value: number;
  compatibility: number;
  upgradeability: number;
  efficiency: number;
}

export interface SavedBuild {
  id: string;
  title: string;
  description: string;
  components: BuildComponents;
  createdAt: string;
  updatedAt: string;
  shareCode: string;
}
