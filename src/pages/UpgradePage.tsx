import React from 'react';
import { Zap, AlertTriangle, RefreshCw, ShieldCheck } from 'lucide-react';
import type { BuildComponents, Component } from '../types/pcBuilder';
import { generateUpgradeAdvice } from '../services/upgradeEngine';
import { GlassCard } from '../components/glass/GlassCard';
import { GlassButton } from '../components/glass/GlassButton';
import { GlassChip } from '../components/glass/GlassChip';
import { AnimatedNumber } from '../components/motion/AnimatedNumber';

interface UpgradePageProps {
  currentBuild: BuildComponents;
  onApplyUpgrade: (category: string, comp: Component) => void;
}

export const UpgradePage: React.FC<UpgradePageProps> = ({ currentBuild, onApplyUpgrade }) => {
  const report = generateUpgradeAdvice(currentBuild);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-sans font-bold text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-amber-400" />
          <span>Hardware Upgrade Advisor</span>
        </h1>
        <p className="text-xs text-slate-400">Analyze your current PC build to identify weakest link bottlenecks and optimal component upgrade paths.</p>
      </div>

      {report ? (
        <div className="space-y-8">
          
          {/* Weakest Link Alert Banner */}
          <GlassCard state="warning" className="p-5 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5 animate-pulse-warning" />
            <div>
              <h3 className="text-sm font-bold uppercase font-mono text-amber-300">Weakest Component Identified</h3>
              <p className="text-xs text-amber-200/90 mt-1 leading-relaxed font-sans">{report.weakestLinkReason}</p>
            </div>
          </GlassCard>

          {/* Primary Recommendation Card */}
          <GlassCard className="p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden border-cyan-500/30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <GlassChip active color="cyan">★ Recommended Upgrade Path</GlassChip>
                <h2 className="text-xl font-bold text-white mt-2">
                  Upgrade {report.primaryUpgrade.targetCategory.toUpperCase()} → {report.primaryUpgrade.recommendedComponent.name}
                </h2>
              </div>

              <div className="text-right font-mono">
                <div className="text-xs text-slate-400 uppercase">Impact Rating</div>
                <div className="text-xl font-bold text-cyan-400 flex items-center justify-end gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{report.primaryUpgrade.valueRating}</span>
                </div>
              </div>
            </div>

            {/* Current vs Recommended Visual */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="p-4 bg-slate-950/60 rounded-xl border border-white/10 space-y-2 font-mono">
                <div className="text-xs text-slate-400 uppercase">Current Component</div>
                <div className="text-sm font-bold text-slate-300">
                  {report.primaryUpgrade.currentComponent ? report.primaryUpgrade.currentComponent.name : 'Basic / None'}
                </div>
              </div>

              <div className="p-4 bg-cyan-950/40 rounded-xl border border-cyan-500/40 space-y-2 font-mono">
                <div className="text-xs text-cyan-400 uppercase">Recommended Upgrade</div>
                <div className="text-sm font-bold text-white">{report.primaryUpgrade.recommendedComponent.name}</div>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 bg-slate-950/60 rounded-xl border border-white/10 space-y-1">
                <div className="text-slate-400">Expected Performance Gain</div>
                <div className="text-2xl font-extrabold text-emerald-400">
                  +<AnimatedNumber value={report.primaryUpgrade.expectedPerformanceGainPercent} suffix="% FPS" />
                </div>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-xl border border-white/10 space-y-1">
                <div className="text-slate-400">Estimated Power Delta</div>
                <div className="text-2xl font-extrabold text-amber-400">
                  +<AnimatedNumber value={report.primaryUpgrade.estimatedPowerDeltaW} suffix=" Watts" />
                </div>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-xl border border-white/10 space-y-1">
                <div className="text-slate-400">Impact Rating</div>
                <div className="text-xl font-bold text-cyan-400">{report.primaryUpgrade.valueRating}</div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-white/10 font-sans">
              {report.primaryUpgrade.explanation}
            </p>

            <GlassButton
              variant="primary"
              size="lg"
              icon={<RefreshCw className="w-4 h-4" />}
              onClick={() => onApplyUpgrade(report.primaryUpgrade.targetCategory, report.primaryUpgrade.recommendedComponent)}
            >
              Apply Upgrade to Active Build
            </GlassButton>
          </GlassCard>

          {/* Alternative Upgrade Options */}
          {report.alternativeUpgrades.length > 0 && (
            <div className="space-y-4 font-mono">
              <h3 className="text-sm uppercase text-slate-400">Alternative Upgrade Paths</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {report.alternativeUpgrades.map((alt, idx) => (
                  <GlassCard key={idx} className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <GlassChip active color="purple">{alt.valueRating}</GlassChip>
                      <span className="text-xs font-bold text-cyan-400">
                        +{alt.expectedPerformanceGainPercent}% FPS Gain
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white">{alt.recommendedComponent.name}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">{alt.explanation}</p>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

        </div>
      ) : (
        <div className="text-center py-16 text-slate-500 text-sm font-mono">
          Please add components in the PC Builder tab to receive personalized upgrade suggestions.
        </div>
      )}

    </div>
  );
};
