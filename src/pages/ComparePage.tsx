import React from 'react';
import { Scale, Trophy } from 'lucide-react';
import type { BuildComponents } from '../types/pcBuilder';
import { SEED_COMPONENTS } from '../data/seedData';
import { calculateFpsPerformance, calculateBuildScores } from '../services/performanceEngine';
import { GlassCard } from '../components/glass/GlassCard';
import { AnimatedNumber } from '../components/motion/AnimatedNumber';
import { AnimatedProgressBar } from '../components/motion/AnimatedProgressBar';

interface ComparePageProps {
  currentBuild: BuildComponents;
}

export const ComparePage: React.FC<ComparePageProps> = ({ currentBuild }) => {
  const buildAComponents = currentBuild;

  const buildBComponents: BuildComponents = {
    cpu: SEED_COMPONENTS.find((c) => c.id === 'cpu-ryzen-7800x3d') || null,
    gpu: SEED_COMPONENTS.find((c) => c.id === 'gpu-rtx-4070-super') || null,
    motherboard: SEED_COMPONENTS.find((c) => c.id === 'mb-msi-b650-tomahawk') || null,
    ram: SEED_COMPONENTS.find((c) => c.id === 'ram-gskill-ddr5-6000-32gb') || null,
    storage: SEED_COMPONENTS.find((c) => c.id === 'storage-samsung-990-pro-2tb') || null,
    cooler: SEED_COMPONENTS.find((c) => c.id === 'cooler-deepcool-ak620') || null,
    psu: SEED_COMPONENTS.find((c) => c.id === 'psu-corsair-rm850e') || null,
    case: SEED_COMPONENTS.find((c) => c.id === 'case-corsair-4000d') || null,
    case_fan: null,
    monitor: null,
    os: null,
  };

  const fpsA = calculateFpsPerformance(buildAComponents.cpu?.id, buildAComponents.gpu?.id);
  const fpsB = calculateFpsPerformance(buildBComponents.cpu?.id, buildBComponents.gpu?.id);

  const scoreA = calculateBuildScores(buildAComponents);
  const scoreB = calculateBuildScores(buildBComponents);

  const powerA = (buildAComponents.cpu?.powerConsumptionW || 100) + (buildAComponents.gpu?.powerConsumptionW || 150) + 80;
  const powerB = (buildBComponents.cpu?.powerConsumptionW || 120) + (buildBComponents.gpu?.powerConsumptionW || 220) + 80;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-brand font-bold text-white flex items-center gap-2">
          <Scale className="w-6 h-6 text-cyan-400" />
          <span>Side-by-Side PC Build Comparison</span>
        </h1>
        <p className="text-xs text-slate-400">Evaluate gaming performance, power draw, thermal load, and hardware score indices.</p>
      </div>

      {/* Side-by-Side Table */}
      <GlassCard className="overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/80 border-b border-white/10 font-mono text-xs uppercase text-slate-400">
              <th className="p-4 w-1/3">Metric / Component</th>
              <th className="p-4 w-1/3 text-cyan-400 font-bold border-l border-white/10">
                Build A (Active Build)
              </th>
              <th className="p-4 w-1/3 text-purple-400 font-bold border-l border-white/10">
                Build B (Reference AM5 Rig)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-xs font-mono">
            <tr>
              <td className="p-4 text-slate-400">CPU Processor</td>
              <td className="p-4 text-white border-l border-white/10">{buildAComponents.cpu?.name || 'Not Selected'}</td>
              <td className="p-4 text-white border-l border-white/10">{buildBComponents.cpu?.name}</td>
            </tr>

            <tr>
              <td className="p-4 text-slate-400">Graphics Card</td>
              <td className="p-4 text-white border-l border-white/10">{buildAComponents.gpu?.name || 'Not Selected'}</td>
              <td className="p-4 text-white border-l border-white/10">{buildBComponents.gpu?.name}</td>
            </tr>

            <tr className="bg-slate-900/40">
              <td className="p-4 font-bold text-slate-200">1440p Gaming FPS Avg</td>
              <td className="p-4 text-emerald-400 font-bold text-sm border-l border-white/10">
                <AnimatedNumber value={fpsA.avgFps} suffix=" FPS" />
              </td>
              <td className="p-4 text-emerald-400 font-bold text-sm border-l border-white/10">
                <AnimatedNumber value={fpsB.avgFps} suffix=" FPS" />
              </td>
            </tr>

            <tr>
              <td className="p-4 text-slate-400">1% Low Stutter FPS</td>
              <td className="p-4 text-white border-l border-white/10">
                <AnimatedNumber value={fpsA.onePercentLowFps} suffix=" FPS" />
              </td>
              <td className="p-4 text-white border-l border-white/10">
                <AnimatedNumber value={fpsB.onePercentLowFps} suffix=" FPS" />
              </td>
            </tr>

            <tr>
              <td className="p-4 text-slate-400">System Power Draw</td>
              <td className="p-4 text-amber-400 border-l border-white/10">
                <AnimatedNumber value={powerA} suffix=" Watts" />
              </td>
              <td className="p-4 text-amber-400 border-l border-white/10">
                <AnimatedNumber value={powerB} suffix=" Watts" />
              </td>
            </tr>

            <tr className="bg-slate-900/40">
              <td className="p-4 font-bold text-slate-200">Overall Hardware Score</td>
              <td className="p-4 text-cyan-400 font-bold border-l border-white/10">
                <AnimatedNumber value={scoreA.overall} suffix=" / 100" />
              </td>
              <td className="p-4 text-purple-400 font-bold border-l border-white/10">
                <AnimatedNumber value={scoreB.overall} suffix=" / 100" />
              </td>
            </tr>
          </tbody>
        </table>
      </GlassCard>

      {/* Visual Chart Comparison */}
      <GlassCard className="p-6 space-y-6 font-mono">
        <h3 className="text-xs uppercase text-slate-400 tracking-wider">Visual Metrics Chart Comparison</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 p-4 bg-slate-950/60 rounded-xl border border-white/10">
            <div className="text-xs text-slate-300">Gaming Score (0-100)</div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Build A</span>
                  <span>{scoreA.gaming} pts</span>
                </div>
                <AnimatedProgressBar progress={scoreA.gaming} color="cyan" height="h-2.5" />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Build B</span>
                  <span>{scoreB.gaming} pts</span>
                </div>
                <AnimatedProgressBar progress={scoreB.gaming} color="purple" height="h-2.5" />
              </div>
            </div>
          </div>

          <div className="space-y-2 p-4 bg-slate-950/60 rounded-xl border border-white/10">
            <div className="text-xs text-slate-300">Workstation Score (0-100)</div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Build A</span>
                  <span>{scoreA.productivity} pts</span>
                </div>
                <AnimatedProgressBar progress={scoreA.productivity} color="cyan" height="h-2.5" />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Build B</span>
                  <span>{scoreB.productivity} pts</span>
                </div>
                <AnimatedProgressBar progress={scoreB.productivity} color="purple" height="h-2.5" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 flex items-start gap-3">
          <Trophy className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-bold text-white uppercase font-mono">Automated Platform Recommendation</div>
            <p className="text-slate-300 leading-relaxed font-sans">
              {scoreA.overall >= scoreB.overall
                ? 'Build A achieves higher overall technical score and workstation efficiency.'
                : 'Build B delivers higher maximum 1440p framerates and future AM5 upgrade path stability.'}
            </p>
          </div>
        </div>
      </GlassCard>

    </div>
  );
};
