import React, { useState } from 'react';
import { Target, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Zap, Activity } from 'lucide-react';
import type { BuildComponents } from '../types/pcBuilder';
import { SEED_COMPONENTS } from '../data/seedData';
import { GlassCard } from '../components/glass/GlassCard';
import { GlassButton } from '../components/glass/GlassButton';
import { GlassChip } from '../components/glass/GlassChip';

interface TargetPageProps {
  onLoadBuildIntoBuilder: (build: BuildComponents) => void;
}

export const TargetPage: React.FC<TargetPageProps> = ({ onLoadBuildIntoBuilder }) => {
  const [workload, setWorkload] = useState<'Gaming' | 'Streaming' | 'Video Editing' | '3D Rendering' | 'AI / ML'>('Gaming');
  const [resolution, setResolution] = useState<'1080p' | '1440p' | '4K'>('1440p');
  const [targetFps, setTargetFps] = useState<number>(144);
  const [preset, setPreset] = useState<'High' | 'Ultra'>('Ultra');
  const [rayTracing, setRayTracing] = useState<boolean>(true);

  // Generate recommended target spec based on performance goal
  const generateTargetSpec = (): { build: BuildComponents; estimatedPowerW: number; thermalRating: string; reasoning: string[] } => {
    let cpuId = 'cpu-ryzen-7800x3d';
    let gpuId = 'gpu-rtx-4070-super';
    let ramId = 'ram-gskill-ddr5-6000-32gb';
    let psuId = 'psu-corsair-rm850e';

    if (resolution === '4K' || targetFps >= 180) {
      cpuId = 'cpu-ryzen-7950x3d';
      gpuId = 'gpu-rtx-5090';
      ramId = 'ram-corsair-ddr5-64gb';
      psuId = 'psu-seasonic-vertex-1200w';
    } else if (resolution === '1080p' && targetFps <= 120) {
      cpuId = 'cpu-ryzen-5600';
      gpuId = 'gpu-rx-6600';
      ramId = 'ram-corsair-ddr4-3600-16gb';
      psuId = 'psu-deepcool-pk650d';
    }

    if (workload === '3D Rendering' || workload === 'AI / ML') {
      gpuId = resolution === '4K' ? 'gpu-rtx-5090' : 'gpu-rtx-4080-super';
      ramId = 'ram-corsair-ddr5-64gb';
    }

    const build: BuildComponents = {
      cpu: SEED_COMPONENTS.find((c) => c.id === cpuId) || SEED_COMPONENTS[0],
      gpu: SEED_COMPONENTS.find((c) => c.id === gpuId) || SEED_COMPONENTS[1],
      motherboard: SEED_COMPONENTS.find((c) => c.category === 'motherboard') || null,
      ram: SEED_COMPONENTS.find((c) => c.id === ramId) || null,
      storage: SEED_COMPONENTS.find((c) => c.category === 'storage') || null,
      cooler: SEED_COMPONENTS.find((c) => c.category === 'cooler') || null,
      psu: SEED_COMPONENTS.find((c) => c.id === psuId) || null,
      case: SEED_COMPONENTS.find((c) => c.category === 'case') || null,
      case_fan: null,
      monitor: null,
      os: null,
    };

    let estPower = 0;
    Object.values(build).forEach((c) => {
      if (c) estPower += c.powerConsumptionW;
    });
    estPower += 70; // system board overhead

    const reasoning = [
      `Targeting ${targetFps} FPS at ${resolution} (${preset} Preset, Ray Tracing: ${rayTracing ? 'ON' : 'OFF'}).`,
      `Selected ${build.gpu?.name} for hardware acceleration and frame generation capability.`,
      `Paired with ${build.cpu?.name} to eliminate micro-stutter and maintain high 1% lows.`,
      `Allocated ${build.ram?.ramSpecs?.totalCapacityGB || 32}GB system RAM for ${workload} stability.`,
      `Power load estimated at ~${estPower}W with 25%+ PSU headroom buffer.`,
    ];

    return { build, estimatedPowerW: estPower, thermalRating: estPower > 450 ? 'Liquid AIO 360mm Recommended' : 'Dual-Tower Air Cooler', reasoning };
  };

  const specResult = generateTargetSpec();

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Target className="w-6 h-6 text-cyan-400" />
          <span>Performance Target Spec Generator</span>
        </h1>
        <p className="text-xs text-slate-400">Specify your desired resolution, frame rate target, and workload to engineer the optimal component specification.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (5 cols): Target Constraints Form */}
        <GlassCard className="lg:col-span-5 p-6 space-y-6 border-cyan-500/20">
          <h3 className="text-sm font-mono uppercase text-slate-300 tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Performance Target Inputs
          </h3>

          {/* Workload Selector */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-300">Target Workload</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(['Gaming', 'Streaming', 'Video Editing', '3D Rendering', 'AI / ML'] as const).map((wl) => (
                <GlassChip
                  key={wl}
                  active={workload === wl}
                  color="cyan"
                  onClick={() => setWorkload(wl)}
                  className="w-full justify-center"
                >
                  {wl}
                </GlassChip>
              ))}
            </div>
          </div>

          {/* Resolution Selector */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-300">Target Resolution</label>
            <div className="grid grid-cols-3 gap-2">
              {(['1080p', '1440p', '4K'] as const).map((res) => (
                <button
                  key={res}
                  onClick={() => setResolution(res)}
                  className={`py-2 px-3 rounded-xl font-mono text-xs font-bold border transition active:scale-95 ${
                    resolution === res
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                      : 'bg-slate-950/60 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {res}
                </button>
              ))}
            </div>
          </div>

          {/* Target FPS Slider */}
          <div className="space-y-2 font-mono">
            <div className="flex items-center justify-between text-xs">
              <label className="text-slate-300">Target Framerate</label>
              <span className="text-base font-bold text-cyan-400">{targetFps} FPS</span>
            </div>
            <input
              type="range"
              min={60}
              max={240}
              step={30}
              value={targetFps}
              onChange={(e) => setTargetFps(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>60 FPS (Cinematic)</span>
              <span>144 FPS (Competitive)</span>
              <span>240 FPS (Esports)</span>
            </div>
          </div>

          {/* Preset & Ray Tracing */}
          <div className="grid grid-cols-2 gap-4 font-mono text-xs pt-2">
            <div className="space-y-1">
              <label className="text-slate-400">Quality Preset</label>
              <select
                value={preset}
                onChange={(e: any) => setPreset(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/10 text-white rounded-xl p-2.5 focus:outline-none"
              >
                <option value="High">High</option>
                <option value="Ultra">Ultra Path Tracing</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">Ray Tracing</label>
              <button
                onClick={() => setRayTracing(!rayTracing)}
                className={`w-full py-2.5 px-3 rounded-xl border text-center font-mono font-bold transition active:scale-95 ${
                  rayTracing
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                    : 'bg-slate-950/80 border-white/10 text-slate-500'
                }`}
              >
                {rayTracing ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Right Column (7 cols): Engineered Spec Output */}
        <GlassCard className="lg:col-span-7 p-6 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span>Engineered Spec for {targetFps} FPS @ {resolution}</span>
              </h3>
              <p className="text-xs text-slate-400">Tailored hardware allocation for {workload}.</p>
            </div>

            <GlassButton
              variant="primary"
              size="sm"
              icon={<ArrowRight className="w-4 h-4" />}
              onClick={() => onLoadBuildIntoBuilder(specResult.build)}
            >
              Load into PC Builder
            </GlassButton>
          </div>

          {/* Component Allocation */}
          <div className="space-y-3 font-mono text-xs">
            {Object.entries(specResult.build).map(([catKey, comp]) => {
              if (!comp) return null;
              return (
                <div key={catKey} className="p-3 bg-slate-950/60 rounded-xl border border-white/10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={comp.imageUrl} alt={comp.name} className="w-10 h-10 object-cover rounded-lg bg-slate-900 border border-white/10" />
                    <div>
                      <div className="text-white font-bold">{comp.name}</div>
                      <div className="text-[10px] text-slate-400 uppercase">{comp.category} • {comp.brand}</div>
                    </div>
                  </div>
                  <GlassChip active color="green">Verified Spec</GlassChip>
                </div>
              );
            })}
          </div>

          {/* Power & Thermal Headroom Analytics */}
          <div className="grid grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-4 bg-slate-950/60 rounded-xl border border-white/10 space-y-1">
              <span className="text-slate-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Estimated System Power Load
              </span>
              <span className="text-lg font-bold text-amber-400">{specResult.estimatedPowerW} Watts</span>
            </div>

            <div className="p-4 bg-slate-950/60 rounded-xl border border-white/10 space-y-1">
              <span className="text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                Recommended Thermal Solution
              </span>
              <span className="text-sm font-bold text-cyan-300">{specResult.thermalRating}</span>
            </div>
          </div>

          {/* Technical Rationale */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <h4 className="text-xs font-mono uppercase text-slate-400">Engineering Rationale</h4>
            <div className="space-y-1.5 text-xs text-slate-300">
              {specResult.reasoning.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

      </div>
    </div>
  );
};
