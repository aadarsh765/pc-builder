import React, { useState } from 'react';
import { 
  Cpu, 
  Gamepad2, 
  BarChart3, 
  Scale, 
  Target, 
  Database, 
  BookmarkCheck, 
  SlidersHorizontal, 
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Home,
  ShieldCheck
} from 'lucide-react';
import type { BuildComponents, CompatibilityReport, Component } from '../types/pcBuilder';
import { SEED_COMPONENTS } from '../data/seedData';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  build: BuildComponents;
  compatibility: CompatibilityReport;
  onOpenAdmin: () => void;
  onSelectComponentDetail: (component: Component) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  build: _build,
  compatibility,
  onOpenAdmin,
  onSelectComponentDetail,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);

  const searchResults = searchQuery.trim()
    ? SEED_COMPONENTS.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'builder', label: 'PC Builder', icon: Cpu },
    { id: 'hardware', label: 'Hardware Hub', icon: Database },
    { id: 'fps', label: 'FPS Calculator', icon: Gamepad2 },
    { id: 'bottleneck', label: 'Bottleneck Analyzer', icon: BarChart3 },
    { id: 'compare', label: 'Compare', icon: Scale },
    { id: 'target', label: 'Target Builder', icon: Target },
    { id: 'dashboard', label: 'Snapshots', icon: BookmarkCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/75 backdrop-blur-xl border-b border-white/10 text-slate-100 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      {/* Specular top glow line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center shadow-lg shadow-white/10 group-hover:scale-105 group-active:scale-95 transition-all duration-200 border border-white">
              <Cpu className="w-6 h-6 text-black stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sans font-black text-xl tracking-widest text-white">RIGLAB</span>
                <span className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-white/10 text-white border border-white/20 backdrop-blur-md">
                  v2.4
                </span>
              </div>
              <p className="text-[9px] text-zinc-400 tracking-widest uppercase font-mono">ENGINEERING & ANALYSIS</p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-1 overflow-x-auto py-1 font-mono">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 active:scale-95 ${
                    isActive
                      ? 'bg-white/15 text-white border border-white/35 shadow-[0_0_15px_-3px_rgba(255,255,255,0.25)]'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Search & Build Power Load Status */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSearchModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/80 text-zinc-300 text-xs border border-white/10 hover:border-white/30 hover:text-white transition-all active:scale-95 backdrop-blur-md font-mono"
            >
              <Search className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">Search hardware...</span>
              <kbd className="hidden md:inline-block text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded font-mono border border-white/10">⌘K</kbd>
            </button>

            <div 
              onClick={() => setActiveTab('builder')}
              className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-white/10 cursor-pointer hover:border-white/30 transition-all active:scale-95 backdrop-blur-md font-mono"
            >
              <div className="flex items-center gap-1.5 text-xs font-medium">
                {compatibility.overallStatus === 'compatible' && (
                  <span className="flex items-center gap-1 text-white">
                    <CheckCircle2 className="w-4 h-4 text-white animate-pulse-gentle" />
                    <span className="hidden md:inline">Compatible</span>
                  </span>
                )}
                {compatibility.overallStatus === 'warning' && (
                  <span className="flex items-center gap-1 text-zinc-300">
                    <AlertTriangle className="w-4 h-4 text-zinc-300 animate-pulse-warning" />
                    <span className="hidden md:inline">Warning</span>
                  </span>
                )}
                {compatibility.overallStatus === 'incompatible' && (
                  <span className="flex items-center gap-1 text-white">
                    <XCircle className="w-4 h-4 text-white" />
                    <span className="hidden md:inline">Issue</span>
                  </span>
                )}
              </div>

              <div className="h-4 w-[1px] bg-white/10" />

              <div className="text-xs text-white font-mono">
                ⚡ {compatibility.totalWattageW}W Load
              </div>
            </div>

            <button
              onClick={onOpenAdmin}
              title="Hardware Database Center"
              className="p-2 rounded-xl bg-zinc-900/80 text-zinc-400 hover:text-white border border-white/10 hover:border-white/30 transition-all active:scale-95"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

          </div>
        </div>

        {/* Mobile Nav Bar */}
        <div className="xl:hidden flex items-center gap-1.5 overflow-x-auto py-2 border-t border-white/5 no-scrollbar font-mono">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all active:scale-95 ${
                  isActive ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Global Search Drawer */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-start justify-center pt-20 px-4 animate-page-enter">
          <div className="glass-panel border border-white/15 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
              <Search className="w-5 h-5 text-cyan-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search hardware specs (RTX 4070, AM5, DDR5)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white text-sm focus:outline-none placeholder-slate-500 font-mono"
              />
              <button
                onClick={() => {
                  setShowSearchModal(false);
                  setSearchQuery('');
                }}
                className="text-slate-400 hover:text-white text-xs px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition font-mono"
              >
                ESC
              </button>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 gap-2">
                  {searchResults.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        onSelectComponentDetail(item);
                        setShowSearchModal(false);
                        setSearchQuery('');
                      }}
                      className="p-3 flex items-center justify-between glass-card glass-card-interactive rounded-xl cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <img src={item.imageUrl} alt={item.name} className="w-10 h-10 object-cover rounded-lg bg-slate-900 border border-white/10" />
                        <div>
                          <div className="text-sm font-bold text-white">{item.name}</div>
                          <div className="text-xs text-slate-400 uppercase font-mono">
                            {item.category} • {item.brand} • {item.powerConsumptionW}W TDP
                          </div>
                        </div>
                      </div>
                      <div className="text-xs font-mono text-cyan-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Verified</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchQuery.trim() ? (
                <div className="text-center py-8 text-slate-400 text-sm font-mono">
                  No components found matching "{searchQuery}".
                </div>
              ) : (
                <div className="text-slate-500 text-xs text-center py-4 font-mono">
                  Start typing to search 940+ hardware specs...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
