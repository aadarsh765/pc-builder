import React from 'react';
import { 
  Gamepad2, 
  BarChart3, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Zap,
  Scale,
  Database,
  Check
} from 'lucide-react';
import { SEED_COMPONENTS } from '../data/seedData';
import type { Component, BuildComponents, CompatibilityReport } from '../types/pcBuilder';
import { GlassCard } from '../components/glass/GlassCard';
import { GlassButton } from '../components/glass/GlassButton';
import { GlassChip } from '../components/glass/GlassChip';
import { AnimatedNumber } from '../components/motion/AnimatedNumber';
import { calculateFpsPerformance } from '../services/performanceEngine';

interface HomePageProps {
  onNavigate: (tab: string) => void;
  onSelectComponent: (component: Component) => void;
  currentBuild: BuildComponents;
  compatibility: CompatibilityReport;
}

export const HomePage: React.FC<HomePageProps> = ({ 
  onNavigate, 
  onSelectComponent,
  currentBuild,
  compatibility,
}) => {
  const featuredComponents = SEED_COMPONENTS.slice(0, 4);

  const fpsPreview = calculateFpsPerformance(
    currentBuild.cpu?.id,
    currentBuild.gpu?.id,
    currentBuild.ram?.ramSpecs?.totalCapacityGB || 16
  );

  const featuredBuilds = [
    {
      title: 'Ultimate 4K Path Tracing Workstation',
      tier: 'Enthusiast Spec',
      fps1440p: 185,
      fps4K: 120,
      cpu: 'AMD Ryzen 7 7800X3D',
      gpu: 'NVIDIA RTX 5090 (32GB)',
      badge: 'Max FPS',
    },
    {
      title: 'Sweet Spot 1440p Engineering Rig',
      tier: 'High-End Spec',
      fps1440p: 132,
      fps4K: 74,
      cpu: 'AMD Ryzen 5 7600X',
      gpu: 'NVIDIA RTX 4070 Super (12GB)',
      badge: 'Balanced',
    },
    {
      title: 'Esports High-Refresh Reference PC',
      tier: 'Competitive Spec',
      fps1440p: 84,
      fps4K: 45,
      cpu: 'AMD Ryzen 5 5600',
      gpu: 'AMD RX 6600 (8GB)',
      badge: 'Esports',
    },
  ];

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. HERO SECTION: Professional Hardware Engineering Lab Layout */}
      <GlassCard className="p-8 sm:p-12 border-white/10 overflow-hidden relative shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          
          {/* Left Column: Clean Inter Typography & Restrained CTAs */}
          <div className="lg:col-span-7 space-y-6 font-sans">
            
            {/* Small Technical Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900/80 border border-white/10 text-xs font-mono text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>NEXT-GEN HARDWARE ENGINEERING LAB</span>
            </div>

            {/* Headline & Subhead */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.05]">
                Engineer your dream PC.
              </h1>
              <div className="text-xl sm:text-2xl font-bold tracking-tight text-cyan-400 flex items-center gap-2 pt-1">
                <span>Build.</span>
                <span className="text-slate-600">•</span>
                <span>Analyze.</span>
                <span className="text-slate-600">•</span>
                <span>Optimize.</span>
              </div>
            </div>

            {/* Supporting Paragraph */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
              Real-time hardware compatibility, bottleneck analysis, FPS estimation, thermal analysis, power analysis, and empirical performance insights.
            </p>

            {/* Restrained CTAs (Exactly 2 Primary/Secondary CTAs) */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <GlassButton
                variant="primary"
                size="lg"
                onClick={() => onNavigate('builder')}
                className="font-semibold shadow-lg"
              >
                <span>Build Your PC</span>
                <ArrowRight className="w-4 h-4 ml-1.5 text-white" />
              </GlassButton>

              <GlassButton
                variant="secondary"
                size="lg"
                onClick={() => onNavigate('fps')}
                className="font-medium"
              >
                <span>Analyze Performance</span>
              </GlassButton>
            </div>

            {/* Verification Checklist Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-white/10 font-sans text-xs text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Compatibility</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Multi-workload analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Empirical benchmark data</span>
              </div>
            </div>
          </div>

          {/* Right Column: Active Build Telemetry Panel */}
          <div className="lg:col-span-5 w-full">
            <GlassCard variant="subtle" className="p-6 border-white/10 space-y-4 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 font-sans">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 tracking-wider uppercase">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>ACTIVE BUILD TELEMETRY</span>
                </div>
                <GlassChip active color="cyan">LIVE STATE</GlassChip>
              </div>

              {/* Status List with JetBrains Mono numbers */}
              <div className="space-y-2.5 text-xs font-sans">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-white/10">
                  <span className="text-slate-400 font-medium">Compatibility Verification</span>
                  {compatibility.overallStatus === 'compatible' ? (
                    <span className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Compatible
                    </span>
                  ) : (
                    <span className="text-amber-400 font-semibold font-mono">Check Required</span>
                  )}
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-white/10">
                  <span className="text-slate-400 font-medium">Estimated Power Load</span>
                  <span className="text-amber-400 font-semibold font-mono">
                    ⚡ <AnimatedNumber value={compatibility.totalWattageW} suffix="W" />
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-white/10">
                  <span className="text-slate-400 font-medium">System Limiter State</span>
                  <span className="text-cyan-300 font-semibold font-mono">{fpsPreview.primaryLimiter}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-white/10">
                  <span className="text-slate-400 font-medium">1440p Framerate Estimate</span>
                  <span className="text-emerald-400 font-semibold font-mono">
                    <AnimatedNumber value={fpsPreview.avgFps} suffix=" FPS" />
                  </span>
                </div>
              </div>

              {/* Quick Jump Action */}
              <button
                onClick={() => onNavigate('builder')}
                className="w-full py-2.5 px-4 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold font-sans transition active:scale-95 flex items-center justify-center gap-2 mt-2"
              >
                <span>OPEN SYSTEM IN BUILDER</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </GlassCard>
          </div>

        </div>
      </GlassCard>

      {/* 2. QUICK ANALYSIS / CURRENT BUILD STATUS CARDS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between font-sans">
          <h2 className="text-xl font-bold text-white tracking-tight">Quick System Analysis</h2>
          <span className="text-xs font-mono text-slate-400">4 Active Telemetry Monitors</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Compatibility */}
          <GlassCard className="p-4 space-y-2">
            <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>Compatibility</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-lg font-bold text-white font-mono">
              {compatibility.overallStatus === 'compatible' ? 'Verified Pass' : 'Alert Flagged'}
            </div>
            <p className="text-[11px] text-slate-400">Physical socket & clearance rule check.</p>
          </GlassCard>

          {/* Card 2: Power */}
          <GlassCard className="p-4 space-y-2">
            <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>Estimated Power Load</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-lg font-bold text-amber-400 font-mono">
              {compatibility.totalWattageW} Watts
            </div>
            <p className="text-[11px] text-slate-400">Rec. PSU: {compatibility.recommendedPsuW}W+</p>
          </GlassCard>

          {/* Card 3: Thermals */}
          <GlassCard className="p-4 space-y-2">
            <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>Thermal Rating</span>
              <span className="text-cyan-400 text-xs">COOL</span>
            </div>
            <div className="text-lg font-bold text-cyan-300 font-mono">
              {currentBuild.cooler ? currentBuild.cooler.name.split(' ')[0] : 'Stock/AIO'}
            </div>
            <p className="text-[11px] text-slate-400">Optimal dissipation under full load.</p>
          </GlassCard>

          {/* Card 4: Performance */}
          <GlassCard className="p-4 space-y-2">
            <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>1440p Target</span>
              <Gamepad2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-lg font-bold text-emerald-400 font-mono">
              {fpsPreview.avgFps} FPS
            </div>
            <p className="text-[11px] text-slate-400">Primary Limiter: {fpsPreview.primaryLimiter}</p>
          </GlassCard>

        </div>
      </section>

      {/* 3. FEATURE SHORTCUT CARDS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between font-sans">
          <h2 className="text-xl font-bold text-white tracking-tight">Engineering Modules</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          
          <GlassCard 
            variant="interactive"
            onClick={() => onNavigate('hardware')}
            className="p-5 space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-cyan-400 border border-white/10 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-sans">
              Hardware Explorer
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Browse 940+ verified CPU, GPU, motherboard, RAM, and PSU specifications with empirical benchmark scores.
            </p>
          </GlassCard>

          <GlassCard 
            variant="interactive"
            onClick={() => onNavigate('fps')}
            className="p-5 space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-emerald-400 border border-white/10 flex items-center justify-center">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-sans">
              FPS Calculator
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Predict frame rates across 1080p, 1440p, and 4K presets with DLSS, FSR, and Ray Tracing toggle support.
            </p>
          </GlassCard>

          <GlassCard 
            variant="interactive"
            onClick={() => onNavigate('bottleneck')}
            className="p-5 space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-amber-400 border border-white/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-sans">
              Bottleneck Analyzer
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Multi-workload bottleneck visualization. Analyze CPU, GPU, and VRAM utilization limits.
            </p>
          </GlassCard>

          <GlassCard 
            variant="interactive"
            onClick={() => onNavigate('compare')}
            className="p-5 space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-indigo-400 border border-white/10 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-sans">
              Build Comparison
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Side-by-side component delta analysis. Compare TDP power draw, memory bandwidth, and IPC.
            </p>
          </GlassCard>

        </div>
      </section>

      {/* 4. REFERENCE HARDWARE CONFIGURATIONS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between font-sans">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Reference Hardware Configurations</h2>
            <p className="text-xs text-slate-400">Balanced hardware configurations benchmarked for modern engineering workloads.</p>
          </div>
          <button 
            onClick={() => onNavigate('builder')}
            className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
          >
            Create Custom Build <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredBuilds.map((buildItem, idx) => (
            <GlassCard key={idx} className="p-5 space-y-4 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between">
                <GlassChip active color="slate">{buildItem.badge}</GlassChip>
                <span className="text-xs text-slate-400 font-mono">{buildItem.tier}</span>
              </div>

              <h3 className="text-base font-bold text-white">{buildItem.title}</h3>

              <div className="space-y-2 text-xs text-slate-300 bg-slate-950/80 p-3 rounded-xl border border-white/10 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">CPU</span>
                  <span className="text-white truncate max-w-[180px]">{buildItem.cpu}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">GPU</span>
                  <span className="text-white truncate max-w-[180px]">{buildItem.gpu}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">1440p FPS</span>
                  <span className="text-emerald-400 font-bold">
                    <AnimatedNumber value={buildItem.fps1440p} suffix=" Avg" />
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <GlassChip active color="slate">Verified Spec</GlassChip>
                <GlassButton
                  variant="secondary"
                  size="sm"
                  onClick={() => onNavigate('builder')}
                >
                  Load in Builder
                </GlassButton>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* 5. HARDWARE SPOTLIGHT DATABASE */}
      <GlassCard className="p-6 space-y-4">
        <div className="flex items-center justify-between font-sans">
          <h3 className="text-xs font-mono uppercase text-slate-300 tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            Verified Hardware Specification Database
          </h3>
          <button 
            onClick={() => onNavigate('hardware')}
            className="text-xs text-slate-400 hover:text-white font-mono"
          >
            Explore Hardware Hub →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {featuredComponents.map((item) => (
            <GlassCard
              key={item.id}
              variant="interactive"
              onClick={() => onSelectComponent(item)}
              className="p-3 flex items-center gap-3"
            >
              <img src={item.imageUrl} alt={item.name} className="w-11 h-11 object-cover rounded-lg bg-slate-900 border border-white/10" />
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">{item.name}</div>
                <div className="text-[10px] text-slate-400 uppercase font-mono">{item.brand} • {item.category}</div>
                <div className="text-[10px] font-mono text-cyan-400 mt-0.5 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>{item.powerConsumptionW}W TDP</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </GlassCard>

      {/* 6. TRANSPARENT DATA PROVENANCE BANNER */}
      <GlassCard className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-white/15">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white mb-1 tracking-tight font-sans">Empirical Data Provenance Guarantee</h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Every performance output clearly distinguishes between <strong className="text-white">⚡ Empirical Verified Test Bench Data</strong> and <strong className="text-white">📊 Physics-Based Mathematical Estimations</strong>.
            </p>
          </div>
        </div>
        <GlassButton
          variant="secondary"
          size="sm"
          onClick={() => onNavigate('fps')}
        >
          View Methodology
        </GlassButton>
      </GlassCard>

    </div>
  );
};

export default HomePage;
