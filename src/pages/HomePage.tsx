import React from 'react';
import { 
  Cpu, 
  Gamepad2, 
  BarChart3, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Layers,
  Sparkles,
  Zap,
  Target,
  Scale
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
      title: 'Ultimate 4K Path Tracing Beast',
      tier: 'Enthusiast',
      fps1440p: 185,
      fps4K: 120,
      cpu: 'AMD Ryzen 7 7800X3D',
      gpu: 'NVIDIA RTX 5090 (32GB)',
      badge: 'Max FPS',
    },
    {
      title: 'Sweet Spot 1440p Gaming Rig',
      tier: 'High-End',
      fps1440p: 132,
      fps4K: 74,
      cpu: 'AMD Ryzen 5 7600X',
      gpu: 'NVIDIA RTX 4070 Super (12GB)',
      badge: 'Balanced',
    },
    {
      title: 'Budget Esports Starter PC',
      tier: 'Budget',
      fps1440p: 84,
      fps4K: 45,
      cpu: 'AMD Ryzen 5 5600',
      gpu: 'AMD RX 6600 (8GB)',
      badge: 'Esports',
    },
  ];

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Section: Refined Engineering Hero Composition */}
      <GlassCard className="p-8 sm:p-12 border-white/20 overflow-hidden relative shadow-2xl">
        {/* Subtle radial ambient glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 blur-3xl rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          
          {/* Left Column: Brand Identity & High Contrast Headline */}
          <div className="lg:col-span-7 space-y-6">
            <GlassChip active color="slate" icon={<Sparkles className="w-3.5 h-3.5 text-white" />}>
              NEXT-GEN HARDWARE ENGINEERING LAB
            </GlassChip>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Engineer your dream PC.
              </h1>
              <div className="text-xl sm:text-2xl font-mono text-zinc-300 font-semibold tracking-wide flex items-center gap-2">
                <span>Build.</span>
                <span className="text-zinc-600">•</span>
                <span>Analyze.</span>
                <span className="text-zinc-600">•</span>
                <span>Optimize.</span>
              </div>
            </div>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Real-time hardware compatibility, bottleneck analysis, FPS estimation, thermal analysis, power analysis, and performance insights.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <GlassButton
                variant="primary"
                size="lg"
                icon={<Cpu className="w-4 h-4 text-black" />}
                onClick={() => onNavigate('builder')}
              >
                <span>BUILD YOUR PC</span>
                <ArrowRight className="w-4 h-4 ml-1 text-black" />
              </GlassButton>

              <GlassButton
                variant="secondary"
                size="lg"
                icon={<Gamepad2 className="w-4 h-4 text-white" />}
                onClick={() => onNavigate('fps')}
              >
                <span>ANALYZE PERFORMANCE</span>
              </GlassButton>

              <GlassButton
                variant="secondary"
                size="lg"
                icon={<Scale className="w-4 h-4 text-white" />}
                onClick={() => onNavigate('compare')}
              >
                <span>COMPARE HARDWARE</span>
              </GlassButton>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-white/10 font-mono text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span>Socket & Clearance Check</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span>Multi-Workload Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span>Empirical Benchmark Data</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Telemetry Glass Panel */}
          <div className="lg:col-span-5 w-full">
            <GlassCard variant="subtle" className="p-6 font-mono border-white/20 space-y-5 shadow-2xl backdrop-blur-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-white tracking-wider">
                  <Zap className="w-4 h-4 text-white" />
                  <span>ACTIVE BUILD TELEMETRY</span>
                </div>
                <GlassChip active color="slate">LIVE STATE</GlassChip>
              </div>

              {/* Status List */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/80 border border-white/10">
                  <span className="text-zinc-400">Compatibility Verification</span>
                  {compatibility.overallStatus === 'compatible' ? (
                    <span className="flex items-center gap-1.5 text-white font-bold">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      Compatible
                    </span>
                  ) : (
                    <span className="text-zinc-300 font-bold">Check Required</span>
                  )}
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/80 border border-white/10">
                  <span className="text-zinc-400">Estimated Power Load</span>
                  <span className="text-white font-bold">
                    ⚡ <AnimatedNumber value={compatibility.totalWattageW} suffix="W" />
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/80 border border-white/10">
                  <span className="text-zinc-400">System Limiter State</span>
                  <span className="text-white font-bold">{fpsPreview.primaryLimiter}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/80 border border-white/10">
                  <span className="text-zinc-400">1440p Framerate Estimate</span>
                  <span className="text-white font-bold">
                    <AnimatedNumber value={fpsPreview.avgFps} suffix=" FPS" />
                  </span>
                </div>
              </div>

              {/* Quick Jump Action */}
              <button
                onClick={() => onNavigate('builder')}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/30 text-xs font-bold transition active:scale-95 flex items-center justify-center gap-2"
              >
                <span>OPEN SYSTEM IN BUILDER</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </GlassCard>
          </div>

        </div>
      </GlassCard>

      {/* Primary Action Buttons Bar above Floating Dock */}
      <div className="flex flex-wrap items-center justify-center gap-4 py-2">
        <GlassButton
          variant="primary"
          size="md"
          icon={<Cpu className="w-4 h-4" />}
          onClick={() => onNavigate('builder')}
        >
          Build Your PC
        </GlassButton>

        <GlassButton
          variant="secondary"
          size="md"
          icon={<BarChart3 className="w-4 h-4 text-amber-400" />}
          onClick={() => onNavigate('bottleneck')}
        >
          Analyze Performance
        </GlassButton>

        <GlassButton
          variant="secondary"
          size="md"
          icon={<Target className="w-4 h-4 text-cyan-400" />}
          onClick={() => onNavigate('target')}
        >
          Target Builder
        </GlassButton>
      </div>

      {/* Feature Grid Shortcut Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard 
          variant="interactive"
          onClick={() => onNavigate('fps')}
          className="p-6 space-y-3"
        >
          <div className="w-12 h-12 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-500/40 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
            Game FPS Calculator
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Predict average FPS and 1% low stutter metrics across 1080p, 1440p, and 4K presets with DLSS, FSR, and Ray Tracing toggle support.
          </p>
        </GlassCard>

        <GlassCard 
          variant="interactive"
          onClick={() => onNavigate('bottleneck')}
          className="p-6 space-y-3"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-500/40 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
            Bottleneck Analyzer
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Multi-workload bottleneck visualization. See real CPU, GPU, RAM, and VRAM utilization meters per gaming resolution.
          </p>
        </GlassCard>

        <GlassCard 
          variant="interactive"
          onClick={() => onNavigate('target')}
          className="p-6 space-y-3"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-950/80 text-purple-400 border border-purple-500/40 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
            Performance Target Builder
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Select your desired resolution, target frame rate (144 FPS / 240 FPS), and workload (Gaming, 3D Rendering, AI) to generate an optimal hardware specification.
          </p>
        </GlassCard>
      </section>

      {/* Featured Hardware Reference Builds */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Reference Hardware Configurations</h2>
            <p className="text-xs text-zinc-400">Balanced hardware configurations benchmarked for modern PC engineering workloads.</p>
          </div>
          <button 
            onClick={() => onNavigate('builder')}
            className="text-xs font-mono text-white hover:underline flex items-center gap-1"
          >
            Create Custom Build <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredBuilds.map((buildItem, idx) => (
            <GlassCard key={idx} className="p-5 space-y-4 hover:border-white/40 transition-all">
              <div className="flex items-center justify-between">
                <GlassChip active color="slate">{buildItem.badge}</GlassChip>
                <span className="text-xs text-zinc-400 font-mono">{buildItem.tier}</span>
              </div>

              <h3 className="text-base font-bold text-white">{buildItem.title}</h3>

              <div className="space-y-2 text-xs text-zinc-300 bg-zinc-950/80 p-3 rounded-xl border border-white/10 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">CPU</span>
                  <span className="text-white truncate max-w-[180px]">{buildItem.cpu}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">GPU</span>
                  <span className="text-white truncate max-w-[180px]">{buildItem.gpu}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">1440p FPS</span>
                  <span className="text-white font-bold">
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

      {/* Hardware Spotlight Ticker */}
      <GlassCard className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-mono uppercase text-zinc-300 tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-white" />
            Verified Hardware Component Database
          </h3>
          <button 
            onClick={() => onNavigate('hardware')}
            className="text-xs text-zinc-400 hover:text-white font-mono"
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
              <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded-xl bg-zinc-900 border border-white/10" />
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">{item.name}</div>
                <div className="text-[10px] text-zinc-400 uppercase font-mono">{item.brand} • {item.category}</div>
                <div className="text-[10px] font-mono text-white mt-0.5 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-white" />
                  <span>{item.powerConsumptionW}W TDP</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </GlassCard>

      {/* Provenance & Transparency Banner */}
      <GlassCard className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-white/20">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-white/10 text-white border border-white/20 shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white mb-1 tracking-tight">Transparent Data Provenance Guarantee</h3>
            <p className="text-xs text-zinc-300 max-w-2xl leading-relaxed">
              We never fabricate benchmark numbers. Every performance metrics output clearly displays whether it originates from <strong className="text-white">⚡ Empirical Verified Test Bench Runs</strong> or <strong className="text-white">📊 Physics-Based Mathematical Estimates</strong>.
            </p>
          </div>
        </div>
        <GlassButton
          variant="secondary"
          size="sm"
          onClick={() => onNavigate('fps')}
        >
          Learn More
        </GlassButton>
      </GlassCard>

    </div>
  );
};
