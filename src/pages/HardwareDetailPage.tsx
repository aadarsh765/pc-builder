import React from 'react';
import { ArrowLeft, ShieldCheck, Zap } from 'lucide-react';
import type { Component } from '../types/pcBuilder';
import { SEED_COMPONENTS } from '../data/seedData';
import { GlassCard } from '../components/glass/GlassCard';
import { GlassButton } from '../components/glass/GlassButton';
import { GlassChip } from '../components/glass/GlassChip';

interface HardwareDetailPageProps {
  component: Component;
  onBack: () => void;
  onSelectComponent: (comp: Component) => void;
}

export const HardwareDetailPage: React.FC<HardwareDetailPageProps> = ({
  component,
  onBack,
  onSelectComponent,
}) => {
  const alternatives = SEED_COMPONENTS.filter(
    (c) => c.category === component.category && c.id !== component.id
  ).slice(0, 3);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Back button */}
      <GlassButton
        variant="secondary"
        size="sm"
        icon={<ArrowLeft className="w-3.5 h-3.5" />}
        onClick={onBack}
      >
        Back to Hardware Hub
      </GlassButton>

      {/* Main Spec Card */}
      <GlassCard className="p-6 sm:p-8 space-y-6 shadow-2xl border-cyan-500/20">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 border-b border-white/10 pb-6">
          <div className="flex items-center gap-5">
            <img src={component.imageUrl} alt={component.name} className="w-20 h-20 object-cover rounded-2xl bg-slate-900 border border-white/10 shrink-0" />
            <div>
              <GlassChip active color="cyan">{component.category} • {component.brand}</GlassChip>
              <h1 className="text-2xl font-sans font-extrabold text-white tracking-tight">{component.name}</h1>
              <p className="text-xs text-slate-400 mt-1">{component.notes}</p>
            </div>
          </div>

          <div className="text-right shrink-0 font-mono">
            <div className="text-xs text-slate-400 uppercase">Power Consumption</div>
            <div className="text-2xl font-extrabold text-amber-400 flex items-center justify-end gap-1">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>{component.powerConsumptionW} Watts</span>
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5 flex items-center justify-end gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{component.confidenceScore || 'Verified'} Confidence</span>
            </div>
          </div>
        </div>

        {/* Specifications Matrix */}
        <div className="space-y-3 font-mono">
          <h3 className="text-xs uppercase text-slate-400 tracking-wider">Technical Specifications</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-white/10">
              <span className="text-slate-400 block">Manufacturer</span>
              <span className="text-white font-bold">{component.brand}</span>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-white/10">
              <span className="text-slate-400 block">TDP / Board Power</span>
              <span className="text-amber-400 font-bold">{component.powerConsumptionW} Watts</span>
            </div>

            {component.cpuSpecs && (
              <>
                <div className="p-3 bg-slate-950/60 rounded-xl border border-white/10">
                  <span className="text-slate-400 block">Socket</span>
                  <span className="text-cyan-400 font-bold">{component.cpuSpecs.socket}</span>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-xl border border-white/10">
                  <span className="text-slate-400 block">Cores / Threads</span>
                  <span className="text-white font-bold">{component.cpuSpecs.coreCount}C / {component.cpuSpecs.threadCount}T</span>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-xl border border-white/10">
                  <span className="text-slate-400 block">Boost Frequency</span>
                  <span className="text-white font-bold">{component.cpuSpecs.boostClockGHz} GHz</span>
                </div>
              </>
            )}

            {component.gpuSpecs && (
              <>
                <div className="p-3 bg-slate-950/60 rounded-xl border border-white/10">
                  <span className="text-slate-400 block">VRAM Capacity</span>
                  <span className="text-cyan-400 font-bold">{component.gpuSpecs.vramGB} GB {component.gpuSpecs.memoryType}</span>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-xl border border-white/10">
                  <span className="text-slate-400 block">Recommended PSU</span>
                  <span className="text-amber-400 font-bold">{component.gpuSpecs.recommendedPsuW}W</span>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-xl border border-white/10">
                  <span className="text-slate-400 block">Dimensions</span>
                  <span className="text-white font-bold">{component.gpuSpecs.lengthMm}mm Length</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Technical Data Provenance Bar */}
        <div className="space-y-3 font-mono pt-4 border-t border-white/10">
          <h3 className="text-xs uppercase text-slate-400 tracking-wider">Data Provenance Metadata</h3>
          <div className="p-4 bg-slate-950/60 rounded-xl border border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs gap-4">
            <div>
              <span className="text-slate-500 block">Verification Source</span>
              <span className="text-white font-bold">{component.verificationSource || 'Manufacturer Specification & Test Bench'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Verification Date</span>
              <span className="text-cyan-400 font-bold">{component.verificationDate || '18 Sep 2026'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Confidence Status</span>
              <GlassChip active color="green">{component.confidenceScore || 'Verified'}</GlassChip>
            </div>
          </div>
        </div>

      </GlassCard>

      {/* Alternative Recommendations */}
      <div className="space-y-4 font-mono">
        <h3 className="text-sm uppercase text-slate-400">Alternative Hardware in Category</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {alternatives.map((alt) => (
            <GlassCard
              key={alt.id}
              variant="interactive"
              onClick={() => onSelectComponent(alt)}
              className="p-4 flex items-center gap-3 cursor-pointer"
            >
              <img src={alt.imageUrl} alt={alt.name} className="w-10 h-10 object-cover rounded-lg bg-slate-900 border border-white/10" />
              <div>
                <div className="text-xs font-bold text-white truncate">{alt.name}</div>
                <div className="text-[10px] text-cyan-400 mt-0.5 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>{alt.powerConsumptionW}W TDP</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

    </div>
  );
};
