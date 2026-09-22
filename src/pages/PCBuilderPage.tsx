import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  RefreshCw, 
  Zap, 
  BarChart2, 
  Bookmark, 
  Scale, 
  Search,
  ShieldCheck,
  Activity,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import type { BuildComponents, Component, ComponentCategory, CompatibilityReport, BuildScore } from '../types/pcBuilder';
import { SEED_COMPONENTS } from '../data/seedData';
import { calculateFpsPerformance, calculateBuildScores } from '../services/performanceEngine';
import { GlassCard } from '../components/glass/GlassCard';
import { GlassButton } from '../components/glass/GlassButton';
import { GlassChip } from '../components/glass/GlassChip';
import { StatusIndicator } from '../components/motion/StatusIndicator';
import { AnimatedNumber } from '../components/motion/AnimatedNumber';
import { AnimatedProgressBar } from '../components/motion/AnimatedProgressBar';

interface PCBuilderPageProps {
  build: BuildComponents;
  setBuild: React.Dispatch<React.SetStateAction<BuildComponents>>;
  compatibility: CompatibilityReport;
  onNavigate: (tab: string) => void;
  onSelectComponentDetail: (comp: Component) => void;
  onSaveBuild: () => void;
}

export const PCBuilderPage: React.FC<PCBuilderPageProps> = ({
  build,
  setBuild,
  compatibility,
  onNavigate,
  onSelectComponentDetail,
  onSaveBuild,
}) => {
  const [activeCategoryModal, setActiveCategoryModal] = useState<ComponentCategory | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStepIndex, setScanStepIndex] = useState<number>(-1);
  const [expandedWhyId, setExpandedWhyId] = useState<string | null>(null);
  
  const [modalSearch, setModalSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedSocketFilter, setSelectedSocketFilter] = useState<string>('all');

  const categories: { id: ComponentCategory; label: string; icon: string }[] = [
    { id: 'cpu', label: 'Processor (CPU)', icon: '💻' },
    { id: 'gpu', label: 'Graphics Card (GPU)', icon: '🎮' },
    { id: 'motherboard', label: 'Motherboard', icon: '🔌' },
    { id: 'cooler', label: 'CPU Cooler', icon: '❄️' },
    { id: 'ram', label: 'Memory (RAM)', icon: '⚡' },
    { id: 'storage', label: 'Storage (SSD / HDD)', icon: '💾' },
    { id: 'psu', label: 'Power Supply (PSU)', icon: '🔋' },
    { id: 'case', label: 'PC Case (Chassis)', icon: '🖥️' },
    { id: 'case_fan', label: 'Case Fans', icon: '🌀' },
    { id: 'monitor', label: 'Monitor', icon: '🖥️' },
    { id: 'os', label: 'Operating System', icon: '💿' },
  ];

  const scanSteps = ['CPU Socket', 'Motherboard Bios', 'RAM Clearance', 'GPU Length', 'PSU Load', 'Cooler Radiator', 'Case Airflow'];

  const triggerScanAnimation = () => {
    setIsScanning(true);
    setScanStepIndex(0);
  };

  useEffect(() => {
    if (isScanning && scanStepIndex >= 0 && scanStepIndex < scanSteps.length) {
      const timer = setTimeout(() => {
        setScanStepIndex((prev) => prev + 1);
      }, 90);
      return () => clearTimeout(timer);
    } else if (isScanning && scanStepIndex >= scanSteps.length) {
      setIsScanning(false);
    }
  }, [isScanning, scanStepIndex]);

  const handleRemoveComponent = (category: ComponentCategory) => {
    setBuild((prev) => ({ ...prev, [category]: null }));
    triggerScanAnimation();
  };

  const handleAddComponent = (comp: Component) => {
    setBuild((prev) => ({ ...prev, [comp.category]: comp }));
    setActiveCategoryModal(null);
    triggerScanAnimation();
  };

  const buildScore: BuildScore = calculateBuildScores(build);

  const fpsPreview = calculateFpsPerformance(
    build.cpu?.id,
    build.gpu?.id,
    build.ram?.ramSpecs?.totalCapacityGB || 16
  );

  let categoryComponents = activeCategoryModal
    ? SEED_COMPONENTS.filter((c) => c.category === activeCategoryModal)
    : [];

  if (modalSearch.trim()) {
    categoryComponents = categoryComponents.filter(
      (c) =>
        c.name.toLowerCase().includes(modalSearch.toLowerCase()) ||
        c.brand.toLowerCase().includes(modalSearch.toLowerCase())
    );
  }

  if (selectedBrand !== 'all') {
    categoryComponents = categoryComponents.filter((c) => c.brand.toLowerCase() === selectedBrand.toLowerCase());
  }

  if (selectedSocketFilter !== 'all') {
    categoryComponents = categoryComponents.filter(
      (c) => c.cpuSpecs?.socket === selectedSocketFilter || c.motherboardSpecs?.socket === selectedSocketFilter
    );
  }

  // Rig Health Calculations
  const powerHeadroomW = (build.psu?.psuSpecs?.wattageW || 750) - compatibility.totalWattageW;
  const powerHeadroomPercent = Math.max(0, Math.min(100, Math.round((powerHeadroomW / (build.psu?.psuSpecs?.wattageW || 750)) * 100)));

  return (
    <div className="space-y-6 pb-16">
      
      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-sans font-bold text-white flex items-center gap-2">
            <span>Custom PC Builder</span>
            <GlassChip active color="cyan">Engineering Analysis Mode</GlassChip>
          </h1>
          <p className="text-xs text-slate-400">Select components to evaluate physical socket compatibility, power draw, and workload performance.</p>
        </div>

        <div className="flex items-center gap-2">
          <GlassButton
            variant="secondary"
            size="sm"
            icon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={() => {
              setBuild({
                cpu: null, gpu: null, motherboard: null, ram: null, storage: null,
                psu: null, case: null, cooler: null, case_fan: null, monitor: null, os: null
              });
              triggerScanAnimation();
            }}
          >
            Reset Build
          </GlassButton>

          <GlassButton
            variant="primary"
            size="sm"
            icon={<Bookmark className="w-3.5 h-3.5" />}
            onClick={onSaveBuild}
          >
            Save Snapshot
          </GlassButton>
        </div>
      </div>

      {/* Main Two-Column Desktop Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8 cols): Slot Selection Rows */}
        <div className="lg:col-span-8 space-y-4">
          {categories.map((cat) => {
            const selectedComp = build[cat.id];
            return (
              <GlassCard
                key={cat.id}
                variant={selectedComp ? 'default' : 'subtle'}
                className={`p-4 ${
                  !selectedComp ? 'border-dashed border-white/10' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider w-44 shrink-0">
                    <span className="text-base">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </div>

                  <div className="flex-1">
                    {selectedComp ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={selectedComp.imageUrl}
                          alt={selectedComp.name}
                          className="w-12 h-12 object-cover rounded-xl bg-slate-900 border border-white/10 shrink-0"
                        />
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-2">
                            <h4 
                              onClick={() => onSelectComponentDetail(selectedComp)}
                              className="text-sm font-bold text-white hover:text-cyan-400 cursor-pointer transition truncate"
                            >
                              {selectedComp.name}
                            </h4>
                            {selectedComp.isVerifiedData ? (
                              <GlassChip active color="green">⚡ Verified Spec</GlassChip>
                            ) : (
                              <GlassChip active color="purple">📊 Model Est.</GlassChip>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2 mt-1 font-mono text-xs">
                            <span className="spec-tag">{selectedComp.brand}</span>
                            {selectedComp.cpuSpecs && (
                              <span className="spec-tag">{selectedComp.cpuSpecs.socket} • {selectedComp.cpuSpecs.coreCount}C/{selectedComp.cpuSpecs.threadCount}T</span>
                            )}
                            {selectedComp.gpuSpecs && (
                              <span className="spec-tag">{selectedComp.gpuSpecs.vramGB}GB VRAM • {selectedComp.gpuSpecs.memoryType}</span>
                            )}
                            {selectedComp.ramSpecs && (
                              <span className="spec-tag">{selectedComp.ramSpecs.totalCapacityGB}GB • {selectedComp.ramSpecs.ddrGen}-{selectedComp.ramSpecs.speedMHz}</span>
                            )}
                            {selectedComp.psuSpecs && (
                              <span className="spec-tag">{selectedComp.psuSpecs.wattageW}W • {selectedComp.psuSpecs.rating80Plus}</span>
                            )}
                            <span className="text-slate-400 text-xs font-mono ml-auto">
                              ⚡ {selectedComp.powerConsumptionW}W TDP
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 italic">No component selected</div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {selectedComp ? (
                      <>
                        <button
                          onClick={() => {
                            setActiveCategoryModal(cat.id);
                            setModalSearch('');
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition font-mono"
                          title="Choose Different Component"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Replace</span>
                        </button>

                        <button
                          onClick={() => handleRemoveComponent(cat.id)}
                          className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-rose-950 hover:text-rose-400 text-slate-400 border border-white/10 transition"
                          title="Remove Component"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <GlassButton
                        variant="secondary"
                        size="sm"
                        icon={<Plus className="w-3.5 h-3.5 text-cyan-400" />}
                        onClick={() => {
                          setActiveCategoryModal(cat.id);
                          setModalSearch('');
                        }}
                      >
                        Add {cat.label.split(' ')[0]}
                      </GlassButton>
                    )}
                  </div>

                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Right Column (4 cols): Sticky Persistent Build Summary Drawer */}
        <div className="lg:col-span-4 sticky top-20 space-y-6">
          <GlassCard className="p-6 space-y-5 shadow-2xl border-cyan-500/20">
            
            {/* Real-time compatibility scan indicator */}
            {isScanning && (
              <div className="p-3 bg-cyan-950/60 border border-cyan-500/40 rounded-xl space-y-2 animate-shimmer font-mono">
                <div className="flex items-center justify-between text-xs text-cyan-300">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                    Scanning Compatibility Rules...
                  </span>
                  <span>{scanSteps[Math.min(scanStepIndex, scanSteps.length - 1)]}</span>
                </div>
                <AnimatedProgressBar progress={((scanStepIndex + 1) / scanSteps.length) * 100} color="cyan" height="h-1.5" />
              </div>
            )}

            {/* Estimated System Power Load */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Estimated Power Load:
                </span>
                <span className="text-white font-bold text-sm">
                  <AnimatedNumber value={compatibility.totalWattageW} suffix=" Watts" />
                </span>
              </div>
              <AnimatedProgressBar
                progress={Math.min(100, (compatibility.totalWattageW / (compatibility.recommendedPsuW || 750)) * 100)}
                color="cyan"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Power Headroom: {powerHeadroomW}W ({powerHeadroomPercent}%)</span>
                <span>Recommended PSU: {compatibility.recommendedPsuW}W+</span>
              </div>
            </div>

            {/* Compatibility Alerts & WHY? Explanations */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-400">Compatibility Diagnostics</span>
                <StatusIndicator status={compatibility.overallStatus} />
              </div>

              {compatibility.issues.length > 0 ? (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {compatibility.issues.map((issue) => {
                    const isExpanded = expandedWhyId === issue.id;
                    return (
                      <div
                        key={issue.id}
                        className={`p-3 rounded-xl border text-xs space-y-2 transition-all ${
                          issue.type === 'error'
                            ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                            : issue.type === 'warning'
                            ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                            : 'bg-slate-950 border-white/10 text-slate-300'
                        }`}
                      >
                        <div className="font-bold flex items-center justify-between">
                          <span>{issue.title}</span>
                          <span className="text-[10px] opacity-75 font-mono">{issue.certainty}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed opacity-90">{issue.message}</p>

                        {/* Collapsible WHY? Explanation */}
                        <div className="pt-1">
                          <button
                            onClick={() => setExpandedWhyId(isExpanded ? null : issue.id)}
                            className="text-[10px] font-mono uppercase text-cyan-400 hover:underline flex items-center gap-1"
                          >
                            <HelpCircle className="w-3 h-3 text-cyan-400" />
                            <span>WHY? Technical Reason</span>
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>

                          {isExpanded && (
                            <div className="mt-2 p-2.5 rounded-lg bg-slate-950/80 border border-white/10 font-mono text-[11px] text-slate-300 leading-relaxed space-y-1">
                              <div className="text-cyan-300 font-bold">ANALYSIS DIAGNOSTIC:</div>
                              <div>
                                {issue.category === 'power' ? (
                                  `System load estimated at ${compatibility.totalWattageW}W. PSU capacity is ${build.psu?.psuSpecs?.wattageW || 0}W, leaving ${powerHeadroomW}W headroom. Recommended safety margin is 20%+ buffer.`
                                ) : issue.category === 'socket' ? (
                                  `Processor socket is ${build.cpu?.cpuSpecs?.socket} while Motherboard socket is ${build.motherboard?.motherboardSpecs?.socket}. CPU cannot physically mount on incompatible pin layouts.`
                                ) : (
                                  `Motherboard memory generation (${build.motherboard?.motherboardSpecs?.ddrGen}) must match system RAM module generation (${build.ram?.ramSpecs?.ddrGen}).`
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-xs text-emerald-400/90 bg-emerald-950/30 p-3 rounded-xl border border-emerald-500/40 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>No socket, physical clearance, or power delivery conflicts detected.</span>
                </div>
              )}
            </div>

            {/* Rig Health Breakdown */}
            <div className="pt-3 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-400">Rig Health & Scores</span>
                <span className="text-lg font-bold text-white font-mono">
                  <AnimatedNumber value={buildScore.overall} suffix=" / 100" />
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                <div className="p-2 bg-slate-950/60 rounded-xl border border-white/10">
                  <div className="text-slate-400">Gaming</div>
                  <div className="text-cyan-400 font-bold text-xs">
                    <AnimatedNumber value={buildScore.gaming} />
                  </div>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-xl border border-white/10">
                  <div className="text-slate-400">Workstation</div>
                  <div className="text-indigo-400 font-bold text-xs">
                    <AnimatedNumber value={buildScore.productivity} />
                  </div>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-xl border border-white/10">
                  <div className="text-slate-400">Efficiency</div>
                  <div className="text-emerald-400 font-bold text-xs">
                    <AnimatedNumber value={buildScore.efficiency} />
                  </div>
                </div>
              </div>
            </div>

            {/* 1440p Gaming Preview */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">1440p Gaming Estimate</span>
                <span className="text-emerald-400 font-bold">
                  <AnimatedNumber value={fpsPreview.avgFps} suffix=" FPS Avg" />
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                1% Low: {fpsPreview.onePercentLowFps} FPS • Primary Limiter: {fpsPreview.primaryLimiter}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <GlassButton
                variant="secondary"
                size="sm"
                icon={<BarChart2 className="w-3.5 h-3.5 text-amber-400" />}
                onClick={() => onNavigate('bottleneck')}
              >
                Bottlenecks
              </GlassButton>

              <GlassButton
                variant="secondary"
                size="sm"
                icon={<Scale className="w-3.5 h-3.5 text-cyan-400" />}
                onClick={() => onNavigate('compare')}
              >
                Compare
              </GlassButton>
            </div>

          </GlassCard>
        </div>

      </div>

      {/* Component Selection Modal */}
      {activeCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <GlassCard className="w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border-white/15">
            <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2 uppercase font-mono">
                  <span>Select Component: {activeCategoryModal}</span>
                </h3>
                <p className="text-xs text-slate-400">Filter hardware specs, socket compatibility, and thermal TDP.</p>
              </div>
              <button
                onClick={() => setActiveCategoryModal(null)}
                className="p-1.5 rounded-lg bg-white/10 text-slate-400 hover:text-white font-mono"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-950/70 border-b border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Filter name..."
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg pl-8 pr-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none"
              >
                <option value="all">All Brands</option>
                <option value="amd">AMD</option>
                <option value="intel">Intel</option>
                <option value="nvidia">NVIDIA</option>
                <option value="corsair">Corsair</option>
                <option value="msi">MSI</option>
                <option value="g.skill">G.Skill</option>
                <option value="samsung">Samsung</option>
              </select>

              <select
                value={selectedSocketFilter}
                onChange={(e) => setSelectedSocketFilter(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none"
              >
                <option value="all">All Sockets</option>
                <option value="AM5">Socket AM5</option>
                <option value="AM4">Socket AM4</option>
                <option value="LGA1700">Socket LGA1700</option>
                <option value="LGA1851">Socket LGA1851</option>
              </select>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
              {categoryComponents.length > 0 ? (
                categoryComponents.map((comp) => (
                  <GlassCard
                    key={comp.id}
                    variant="interactive"
                    className="p-4 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img src={comp.imageUrl} alt={comp.name} className="w-14 h-14 object-cover rounded-xl bg-slate-900 border border-white/10" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{comp.name}</h4>
                          <span className="spec-tag">{comp.brand}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{comp.notes}</p>
                        
                        <div className="flex flex-wrap items-center gap-2 mt-2 font-mono text-xs">
                          {comp.cpuSpecs && (
                            <span className="spec-tag">Socket {comp.cpuSpecs.socket} • {comp.cpuSpecs.coreCount} Cores • {comp.cpuSpecs.tdpW}W TDP</span>
                          )}
                          {comp.gpuSpecs && (
                            <span className="spec-tag">{comp.gpuSpecs.vramGB}GB {comp.gpuSpecs.memoryType} • {comp.gpuSpecs.tdpW}W TDP • {comp.gpuSpecs.powerConnectors}</span>
                          )}
                          {comp.motherboardSpecs && (
                            <span className="spec-tag">{comp.motherboardSpecs.socket} • {comp.motherboardSpecs.ddrGen} • {comp.motherboardSpecs.formFactor}</span>
                          )}
                          {comp.ramSpecs && (
                            <span className="spec-tag">{comp.ramSpecs.totalCapacityGB}GB ({comp.ramSpecs.moduleCount}x{comp.ramSpecs.totalCapacityGB / comp.ramSpecs.moduleCount}GB) • {comp.ramSpecs.ddrGen}-{comp.ramSpecs.speedMHz}</span>
                          )}
                          {comp.storageSpecs && (
                            <span className="spec-tag">{comp.storageSpecs.capacityGB}GB • {comp.storageSpecs.type} • {comp.storageSpecs.readSpeedMBs} MB/s</span>
                          )}
                          {comp.psuSpecs && (
                            <span className="spec-tag">{comp.psuSpecs.wattageW}W • {comp.psuSpecs.rating80Plus} • {comp.psuSpecs.modularity}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 space-y-2 font-mono">
                      <div className="text-xs text-cyan-400 font-bold flex items-center justify-end gap-1">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>{comp.powerConsumptionW}W TDP</span>
                      </div>
                      <GlassButton
                        variant="primary"
                        size="sm"
                        onClick={() => handleAddComponent(comp)}
                      >
                        Select
                      </GlassButton>
                    </div>
                  </GlassCard>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400 text-sm font-mono">
                  No components matched your filter criteria in this category.
                </div>
              )}
            </div>

          </GlassCard>
        </div>
      )}

    </div>
  );
};
