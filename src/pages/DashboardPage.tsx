import React, { useState } from 'react';
import { BookmarkCheck, Copy, Trash2, Check, Zap } from 'lucide-react';
import type { BuildComponents, SavedBuild } from '../types/pcBuilder';
import { SEED_COMPONENTS } from '../data/seedData';
import { GlassCard } from '../components/glass/GlassCard';
import { GlassButton } from '../components/glass/GlassButton';

interface DashboardPageProps {
  currentBuild: BuildComponents;
  onLoadBuild: (build: BuildComponents) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ currentBuild, onLoadBuild }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>([
    {
      id: 'build-abc123',
      title: 'My Dream 1440p Gaming PC',
      description: 'AM5 Ryzen 7 7800X3D + RTX 4070 Super Build',
      components: currentBuild,
      createdAt: '2024-09-18',
      updatedAt: '2024-09-21',
      shareCode: 'abc123',
    },
    {
      id: 'build-def456',
      title: 'Budget Esports Rig',
      description: 'Ryzen 5 5600 + RX 6600 1080p Value Rig',
      components: {
        cpu: SEED_COMPONENTS.find((c) => c.id === 'cpu-ryzen-5600') || null,
        gpu: SEED_COMPONENTS.find((c) => c.id === 'gpu-rx-6600') || null,
        motherboard: SEED_COMPONENTS.find((c) => c.id === 'mb-msi-b550m-pro') || null,
        ram: SEED_COMPONENTS.find((c) => c.id === 'ram-corsair-ddr4-3600-16gb') || null,
        storage: SEED_COMPONENTS.find((c) => c.id === 'storage-crucial-p3-1tb') || null,
        cooler: null,
        psu: SEED_COMPONENTS.find((c) => c.id === 'psu-deepcool-pk650d') || null,
        case: SEED_COMPONENTS.find((c) => c.id === 'case-ant-esports-ice511') || null,
        case_fan: null,
        monitor: null,
        os: null,
      },
      createdAt: '2024-09-15',
      updatedAt: '2024-09-15',
      shareCode: 'def456',
    },
  ]);

  const handleCopyLink = (code: string) => {
    const url = `${window.location.origin}?build=${code}`;
    navigator.clipboard.writeText(url);
    setCopiedId(code);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteBuild = (id: string) => {
    setSavedBuilds((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-brand font-bold text-white flex items-center gap-2">
            <BookmarkCheck className="w-6 h-6 text-cyan-400" />
            <span>Saved PC Build Snapshots</span>
          </h1>
          <p className="text-xs text-slate-400">Manage saved custom configurations, generate public share links, and restore build states.</p>
        </div>
      </div>

      {/* Grid of Saved Builds */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {savedBuilds.map((build) => {
          let totalPower = 0;
          Object.values(build.components).forEach((c) => {
            if (c) totalPower += c.powerConsumptionW;
          });

          return (
            <GlassCard key={build.id} className="p-6 space-y-4 shadow-xl">
              <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white">{build.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{build.description}</p>
                </div>
                <div className="text-right font-mono">
                  <span className="text-xs text-slate-400 block">Est. Load</span>
                  <span className="text-sm font-bold text-amber-400 flex items-center justify-end gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>{totalPower}W</span>
                  </span>
                </div>
              </div>

              {/* Hardware summary chips */}
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">CPU</span>
                  <span className="truncate max-w-[220px]">{build.components.cpu?.name || 'None'}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">GPU</span>
                  <span className="truncate max-w-[220px]">{build.components.gpu?.name || 'None'}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">RAM</span>
                  <span className="truncate max-w-[220px]">{build.components.ram?.name || 'None'}</span>
                </div>
              </div>

              {/* Public Link Share Bar */}
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 truncate">Share URL: /build/{build.shareCode}</span>
                <button
                  onClick={() => handleCopyLink(build.shareCode)}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] flex items-center gap-1 transition shrink-0"
                >
                  {copiedId === build.shareCode ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                <GlassButton
                  variant="secondary"
                  size="sm"
                  onClick={() => onLoadBuild(build.components)}
                >
                  Load into PC Builder
                </GlassButton>

                <button
                  onClick={() => handleDeleteBuild(build.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition"
                  title="Delete Build"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>

    </div>
  );
};
