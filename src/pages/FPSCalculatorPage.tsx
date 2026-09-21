import React, { useState } from 'react';
import { Gamepad2, Sliders } from 'lucide-react';
import type { BuildComponents, PerformanceFilterOptions } from '../types/pcBuilder';
import { SEED_COMPONENTS, SEED_GAMES } from '../data/seedData';
import { calculateFpsPerformance } from '../services/performanceEngine';
import { GlassCard } from '../components/glass/GlassCard';
import { GlassChip } from '../components/glass/GlassChip';
import { AnimatedNumber } from '../components/motion/AnimatedNumber';
import { AnimatedProgressBar } from '../components/motion/AnimatedProgressBar';

interface FPSCalculatorPageProps {
  build: BuildComponents;
}

export const FPSCalculatorPage: React.FC<FPSCalculatorPageProps> = ({ build }) => {
  const cpus = SEED_COMPONENTS.filter((c) => c.category === 'cpu');
  const gpus = SEED_COMPONENTS.filter((c) => c.category === 'gpu');

  const [selectedCpuId, setSelectedCpuId] = useState<string>(build.cpu?.id || cpus[0].id);
  const [selectedGpuId, setSelectedGpuId] = useState<string>(build.gpu?.id || gpus[0].id);
  const [ramGb, setRamGb] = useState<number>(build.ram?.ramSpecs?.totalCapacityGB || 32);
  const [selectedGameId, setSelectedGameId] = useState<string>(SEED_GAMES[0].id);

  const [options, setOptions] = useState<PerformanceFilterOptions>({
    resolution: '1440p',
    preset: 'Ultra',
    rayTracing: true,
    upscaler: 'DLSS Quality',
    frameGen: true,
  });

  const selectedGame = SEED_GAMES.find((g) => g.id === selectedGameId) || SEED_GAMES[0];
  const selectedGpu = gpus.find((g) => g.id === selectedGpuId);

  const fpsResult = calculateFpsPerformance(selectedCpuId, selectedGpuId, ramGb, selectedGame, options);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Gamepad2 className="w-6 h-6 text-cyan-400" />
          <span>Dedicated Game FPS & Stutter Calculator</span>
        </h1>
        <p className="text-xs text-slate-400">Model frame rate metrics across games, presets, upscalers, and resolutions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (7 cols): Simulator Controls */}
        <GlassCard className="lg:col-span-7 p-6 space-y-6">
          <h3 className="text-sm font-mono uppercase text-slate-300 tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            Hardware & Game Configuration
          </h3>

          {/* Game Selector */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-300">Select Game Title</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SEED_GAMES.map((game) => (
                <button
                  key={game.id}
                  onClick={() => setSelectedGameId(game.id)}
                  className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all duration-150 active:scale-95 ${
                    selectedGameId === game.id
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-white shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)]'
                      : 'bg-slate-950/60 border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="text-xs font-bold truncate">{game.name}</span>
                  <span className="text-[10px] font-mono text-slate-500">{game.genre}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hardware selection controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="space-y-1">
              <label className="text-slate-400">Processor (CPU)</label>
              <select
                value={selectedCpuId}
                onChange={(e) => setSelectedCpuId(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/10 text-white rounded-xl p-2.5 focus:outline-none focus:border-cyan-500"
              >
                {cpus.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">Graphics Card (GPU)</label>
              <select
                value={selectedGpuId}
                onChange={(e) => setSelectedGpuId(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/10 text-white rounded-xl p-2.5 focus:outline-none focus:border-cyan-500"
              >
                {gpus.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">System RAM</label>
              <select
                value={ramGb}
                onChange={(e) => setRamGb(Number(e.target.value))}
                className="w-full bg-slate-950/80 border border-white/10 text-white rounded-xl p-2.5 focus:outline-none focus:border-cyan-500"
              >
                <option value={16}>16 GB RAM</option>
                <option value={32}>32 GB RAM</option>
                <option value={64}>64 GB RAM</option>
              </select>
            </div>
          </div>

          {/* Game Settings Filters */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h4 className="text-xs font-mono uppercase text-slate-400">Graphic Preset & Technology Settings</h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-slate-400">Resolution</label>
                <select
                  value={options.resolution}
                  onChange={(e: any) => setOptions({ ...options, resolution: e.target.value })}
                  className="w-full bg-slate-950/80 border border-white/10 text-white rounded-lg p-2 focus:outline-none"
                >
                  <option value="1080p">1080p (FHD)</option>
                  <option value="1440p">1440p (QHD)</option>
                  <option value="4K">4K (UHD)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Preset</label>
                <select
                  value={options.preset}
                  onChange={(e: any) => setOptions({ ...options, preset: e.target.value })}
                  className="w-full bg-slate-950/80 border border-white/10 text-white rounded-lg p-2 focus:outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Ultra">Ultra</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Upscaler</label>
                <select
                  value={options.upscaler}
                  onChange={(e: any) => setOptions({ ...options, upscaler: e.target.value })}
                  className="w-full bg-slate-950/80 border border-white/10 text-white rounded-lg p-2 focus:outline-none"
                >
                  <option value="Off">Native (Off)</option>
                  <option value="DLSS Quality">DLSS Quality</option>
                  <option value="DLSS Performance">DLSS Performance</option>
                  <option value="FSR Quality">FSR Quality</option>
                  <option value="XeSS">XeSS Ultra Quality</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Ray Tracing</label>
                <button
                  onClick={() => setOptions({ ...options, rayTracing: !options.rayTracing })}
                  className={`w-full py-2 px-3 rounded-lg border text-left font-mono font-bold transition active:scale-95 ${
                    options.rayTracing
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                      : 'bg-slate-950/80 border-white/10 text-slate-500'
                  }`}
                >
                  {options.rayTracing ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-white/10">
              <span className="text-xs font-mono text-slate-300">Frame Generation (DLSS 3 / FSR 3)</span>
              <button
                onClick={() => setOptions({ ...options, frameGen: !options.frameGen })}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition active:scale-95 ${
                  options.frameGen ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-900 text-slate-500'
                }`}
              >
                {options.frameGen ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Right Column (5 cols): Results Terminal Output */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard className="p-6 space-y-6 font-mono relative overflow-hidden border-cyan-500/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-2xl rounded-full" />

            <div className="border-b border-white/10 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">{selectedGame.name}</h3>
                <div className="text-xs text-slate-400 mt-0.5">
                  {options.resolution} {options.preset} • RT: {options.rayTracing ? 'ON' : 'OFF'} • {options.upscaler}
                </div>
              </div>
              <GlassChip active color="purple">{selectedGame.engine}</GlassChip>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center py-2">
              <GlassCard variant="subtle" className="p-4 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase">Average FPS</div>
                <div className="text-4xl font-extrabold text-cyan-400">
                  <AnimatedNumber value={fpsResult.avgFps} />
                </div>
                <div className="text-[10px] text-slate-400">Smooth Gaming</div>
              </GlassCard>

              <GlassCard variant="subtle" className="p-4 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase">1% Low FPS</div>
                <div className="text-3xl font-bold text-emerald-400">
                  <AnimatedNumber value={fpsResult.onePercentLowFps} />
                </div>
                <div className="text-[10px] text-slate-400">Frame Pacing</div>
              </GlassCard>
            </div>

            <div className="space-y-4 pt-2 text-xs">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">GPU Utilization</span>
                  <span className="text-white font-bold">~{fpsResult.gpuUtilPercent}%</span>
                </div>
                <AnimatedProgressBar progress={fpsResult.gpuUtilPercent} color="cyan" height="h-2" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">CPU Utilization</span>
                  <span className="text-white font-bold">~{fpsResult.cpuUtilPercent}%</span>
                </div>
                <AnimatedProgressBar progress={fpsResult.cpuUtilPercent} color="purple" height="h-2" />
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-white/10">
                <span className="text-slate-400">VRAM Usage</span>
                <span className="text-amber-400 font-bold">~{fpsResult.vramUsageGB} GB / {selectedGpu?.gpuSpecs?.vramGB || 8} GB</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-white/10">
                <span className="text-slate-400">Primary Limiter</span>
                <span className="text-rose-400 font-bold">{fpsResult.primaryLimiter}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10 text-[11px] text-slate-300 leading-relaxed font-sans">
              {fpsResult.provenanceNote}
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
};
