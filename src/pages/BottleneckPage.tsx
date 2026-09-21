import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import type { BuildComponents } from '../types/pcBuilder';
import { analyzeBuildBottleneck } from '../services/bottleneckEngine';
import { GlassCard } from '../components/glass/GlassCard';
import { GlassChip } from '../components/glass/GlassChip';
import { AnimatedProgressBar } from '../components/motion/AnimatedProgressBar';
import { AnimatedNumber } from '../components/motion/AnimatedNumber';

interface BottleneckPageProps {
  build: BuildComponents;
}

export const BottleneckPage: React.FC<BottleneckPageProps> = ({ build }) => {
  const [workload, setWorkload] = useState<'1080p Gaming' | '1440p Gaming' | '4K Gaming' | 'Content Creation / Rendering'>('1440p Gaming');

  const analysis = analyzeBuildBottleneck(build, workload);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-amber-400" />
          <span>Workload Bottleneck Analyzer & Telemetry Visualizer</span>
        </h1>
        <p className="text-xs text-slate-400">Multi-dimensional hardware bottleneck diagnostic evaluating CPU, GPU, RAM, VRAM, and thermal headroom.</p>
      </div>

      {/* Workload Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {workloadTypes.map((wl) => (
          <GlassChip
            key={wl.id}
            active={workload === wl.id}
            color="amber"
            onClick={() => setWorkload(wl.id as any)}
          >
            {wl.label}
          </GlassChip>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (7 cols): Visual Progress Bar Meter Terminals */}
        <GlassCard className="lg:col-span-7 p-6 space-y-6 font-mono shadow-2xl border-amber-500/20">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs uppercase text-slate-400">Hardware Utilization Telemetry ({workload})</span>
            <span className="text-xs font-bold text-amber-400">{analysis.limiterScoreText}</span>
          </div>

          {/* Visualization Bars */}
          <div className="space-y-5">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">CPU Load: {build.cpu ? build.cpu.name : 'Processor'}</span>
                <span className="text-white font-bold">
                  <AnimatedNumber value={analysis.cpuUtil} suffix="%" />
                </span>
              </div>
              <AnimatedProgressBar
                progress={analysis.cpuUtil}
                color={analysis.cpuUtil > 90 ? 'red' : analysis.cpuUtil > 75 ? 'amber' : 'cyan'}
                height="h-3"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">GPU Load: {build.gpu ? build.gpu.name : 'Graphics Card'}</span>
                <span className="text-white font-bold">
                  <AnimatedNumber value={analysis.gpuUtil} suffix="%" />
                </span>
              </div>
              <AnimatedProgressBar
                progress={analysis.gpuUtil}
                color={analysis.gpuUtil > 95 ? 'green' : 'cyan'}
                height="h-3"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">RAM Capacity Utilization</span>
                <span className="text-white font-bold">
                  <AnimatedNumber value={analysis.ramUtil} suffix="%" />
                </span>
              </div>
              <AnimatedProgressBar
                progress={analysis.ramUtil}
                color={analysis.ramUtil > 85 ? 'amber' : 'purple'}
                height="h-3"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">GPU VRAM Usage</span>
                <span className="text-white font-bold">
                  <AnimatedNumber value={analysis.vramUtil} suffix="%" />
                </span>
              </div>
              <AnimatedProgressBar
                progress={analysis.vramUtil}
                color={analysis.vramUtil > 90 ? 'red' : 'cyan'}
                height="h-3"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Thermal Throttling Risk</span>
                <span className={analysis.thermalRisk > 50 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                  <AnimatedNumber value={analysis.thermalRisk} suffix="%" />
                </span>
              </div>
              <AnimatedProgressBar
                progress={analysis.thermalRisk}
                color={analysis.thermalRisk > 50 ? 'red' : 'green'}
                height="h-3"
              />
            </div>
          </div>

          <GlassCard variant="subtle" className="p-4 space-y-2 border-amber-500/30">
            <div className="text-xs uppercase text-slate-400">Primary Bottleneck Component</div>
            <div className="text-lg font-bold text-amber-400">{analysis.limiterScoreText}</div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{analysis.detailedReason}</p>
          </GlassCard>
        </GlassCard>

        {/* Right Column (5 cols): Risk Breakdown Cards */}
        <div className="lg:col-span-5 space-y-4">
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-sm font-mono uppercase text-slate-400 tracking-wider">Bottleneck Risk Ratings</h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-white/10 flex items-center justify-between">
                <span>CPU Bottleneck Risk</span>
                <span className="text-amber-400 font-bold">{analysis.cpuUtil > 90 ? 'High Risk' : 'Low / Moderate'}</span>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-white/10 flex items-center justify-between">
                <span>GPU Bottleneck Risk</span>
                <span className="text-emerald-400 font-bold">Standard (Optimal)</span>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-white/10 flex items-center justify-between">
                <span>RAM Capacity Risk</span>
                <span className="text-cyan-400 font-bold">{analysis.ramUtil > 80 ? 'Upgrade Recommended' : 'Optimal'}</span>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-white/10 flex items-center justify-between">
                <span>Thermal Throttling Risk</span>
                <span className={analysis.thermalRisk > 50 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {analysis.thermalRisk > 50 ? 'Cooler Upgrade Needed' : 'Safe Headroom'}
                </span>
              </div>
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
};

const workloadTypes = [
  { id: '1080p Gaming', label: '1080p Esports' },
  { id: '1440p Gaming', label: '1440p QHD Ultra' },
  { id: '4K Gaming', label: '4K UHD Path Tracing' },
  { id: 'Content Creation / Rendering', label: 'Workstation' },
];
