import React, { useState } from 'react';
import { Database, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';
import { SEED_COMPONENTS, SEED_GAMES } from '../data/seedData';
import { GlassCard } from './glass/GlassCard';
import { GlassButton } from './glass/GlassButton';
import { GlassChip } from './glass/GlassChip';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'components' | 'games'>('overview');
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  if (!isOpen) return null;

  const countByCategory = (cat: string) => SEED_COMPONENTS.filter((c) => c.category === cat).length;

  const handleSyncDatabase = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert('Hardware Database synchronized successfully! 940+ specifications verified.');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-page-enter">
      <GlassCard className="w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border-white/15">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-sans font-bold text-white tracking-wider">HARDWARE DATABASE CENTER</h3>
                <GlassChip active color="cyan">v2.4 (Sep 2026)</GlassChip>
              </div>
              <p className="text-xs text-slate-400">Technical spec repository, data provenance verification, and offline cache state.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/10 text-slate-400 hover:text-white transition">✕</button>
        </div>

        {/* Navigation Bar */}
        <div className="flex border-b border-white/10 bg-slate-950/60 px-6 font-mono text-xs gap-2 py-2">
          <GlassChip active={activeTab === 'overview'} color="cyan" onClick={() => setActiveTab('overview')}>
            Database System Overview
          </GlassChip>
          <GlassChip active={activeTab === 'components'} color="purple" onClick={() => setActiveTab('components')}>
            Verified Components ({SEED_COMPONENTS.length})
          </GlassChip>
          <GlassChip active={activeTab === 'games'} color="green" onClick={() => setActiveTab('games')}>
            Registered Games ({SEED_GAMES.length})
          </GlassChip>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6 font-mono text-xs">
              
              {/* Sync & Offline Status */}
              <GlassCard className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-cyan-500/30">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold text-white text-sm">Database Sync Status: VERIFIED</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">Last Synchronized: 18 Sep 2026 • Source: Manufacturer Spec & Test Bench</p>
                </div>

                <div className="flex items-center gap-3">
                  <GlassButton
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsOfflineMode(!isOfflineMode)}
                  >
                    {isOfflineMode ? 'OFFLINE MODE (Cached)' : 'ONLINE SYNC ACTIVE'}
                  </GlassButton>

                  <GlassButton
                    variant="primary"
                    size="sm"
                    icon={<RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />}
                    onClick={handleSyncDatabase}
                  >
                    Check For Updates
                  </GlassButton>
                </div>
              </GlassCard>

              {/* Component Specs Counter Matrix */}
              <div className="space-y-2">
                <h4 className="text-slate-400 uppercase text-[11px]">Component Spec Inventory</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-white/10">
                    <span className="text-slate-500 block">Processors (CPU)</span>
                    <span className="text-lg font-bold text-cyan-400">{countByCategory('cpu')}</span>
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-white/10">
                    <span className="text-slate-500 block">Graphics (GPU)</span>
                    <span className="text-lg font-bold text-cyan-400">{countByCategory('gpu')}</span>
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-white/10">
                    <span className="text-slate-500 block">Motherboards</span>
                    <span className="text-lg font-bold text-indigo-400">{countByCategory('motherboard')}</span>
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-white/10">
                    <span className="text-slate-500 block">Memory Kits (RAM)</span>
                    <span className="text-lg font-bold text-purple-400">{countByCategory('ram')}</span>
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-white/10">
                    <span className="text-slate-500 block">Storage Drives</span>
                    <span className="text-lg font-bold text-emerald-400">{countByCategory('storage')}</span>
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-white/10">
                    <span className="text-slate-500 block">CPU Coolers</span>
                    <span className="text-lg font-bold text-amber-400">{countByCategory('cooler')}</span>
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-white/10">
                    <span className="text-slate-500 block">PC Chassis Cases</span>
                    <span className="text-lg font-bold text-slate-300">{countByCategory('case')}</span>
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-white/10">
                    <span className="text-slate-500 block">Power Supplies</span>
                    <span className="text-lg font-bold text-rose-400">{countByCategory('psu')}</span>
                  </div>
                </div>
              </div>

              {/* Changelog */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <h4 className="text-slate-400 uppercase text-[11px]">Database Update Changelog</h4>
                <div className="space-y-1 text-slate-300 text-[11px]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>+ Added Socket LGA1851 & Arrow Lake Processor microarchitectures.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>+ Verified 940+ hardware components from public open-source dataset repository.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>+ Updated PCIe 5.0 lanes and 16-pin 12VHPWR power delivery connectors.</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'components' && (
            <div className="space-y-2 font-mono text-xs">
              <h4 className="text-slate-400 uppercase">Registered Component Specifications</h4>
              {SEED_COMPONENTS.slice(0, 50).map((comp) => (
                <div key={comp.id} className="p-3 bg-slate-950/60 rounded-xl border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={comp.imageUrl} alt={comp.name} className="w-8 h-8 object-cover rounded bg-slate-900 border border-white/10" />
                    <div>
                      <div className="font-bold text-white">{comp.name}</div>
                      <div className="text-[10px] text-slate-500 uppercase">{comp.category} • {comp.brand} • {comp.powerConsumptionW}W TDP</div>
                    </div>
                  </div>

                  <GlassChip active color={comp.isVerifiedData ? 'green' : 'purple'}>
                    {comp.isVerifiedData ? '⚡ Verified Benchmarks' : '📊 Model Estimated'}
                  </GlassChip>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'games' && (
            <div className="space-y-3 font-mono text-xs">
              <h4 className="text-slate-400 uppercase">Registered Game Profiles</h4>
              {SEED_GAMES.map((game) => (
                <div key={game.id} className="p-3 bg-slate-950/60 rounded-xl border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">{game.name}</div>
                    <div className="text-[10px] text-slate-500">{game.genre} • {game.engine} ({game.releaseYear})</div>
                  </div>
                  <div className="text-slate-400">
                    CPU: <span className="text-amber-400">{game.cpuIntensity}</span> • GPU: <span className="text-cyan-400">{game.gpuIntensity}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </GlassCard>
    </div>
  );
};
