import React, { useState } from 'react';
import { 
  Cpu, 
  Gamepad2, 
  BarChart3, 
  Scale, 
  Database, 
  SlidersHorizontal, 
  Search,
  AlertTriangle,
  XCircle,
  Home,
  ShieldCheck,
  Menu,
  X
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchResults = searchQuery.trim()
    ? SEED_COMPONENTS.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const mainNavItems = [
    { id: 'home', label: 'Home', shortLabel: 'Home', icon: Home },
    { id: 'builder', label: 'PC Builder', shortLabel: 'Builder', icon: Cpu },
    { id: 'hardware', label: 'Hardware Hub', shortLabel: 'Hardware', icon: Database },
    { id: 'fps', label: 'FPS', shortLabel: 'FPS', icon: Gamepad2 },
    { id: 'bottleneck', label: 'Bottleneck', shortLabel: 'Bottleneck', icon: BarChart3 },
    { id: 'compare', label: 'Compare', shortLabel: 'Compare', icon: Scale },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#05070d]/85 backdrop-blur-md border-b border-white/[0.08] text-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px] gap-2 lg:gap-4">
          
          {/* LEFT: Logo Wordmark & Version */}
          <div 
            onClick={() => {
              setActiveTab('home');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center transition-all duration-200 group-hover:border-cyan-400/50">
              <Cpu className="w-4.5 h-4.5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-brand text-lg font-bold tracking-wider text-white">RIGLAB</span>
                <span className="text-[9px] font-mono tracking-wider px-1.5 py-0.5 rounded bg-slate-900/90 text-cyan-400 border border-cyan-500/30">
                  V2.4
                </span>
              </div>
              <p className="text-[8.5px] text-slate-400 tracking-wider uppercase font-mono leading-none">ENGINEERING & ANALYSIS</p>
            </div>
          </div>

          {/* CENTER: Clean quiet toolbar navigation (Desktop & Tablet) */}
          <nav className="hidden md:flex items-center gap-1.5 font-sans">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 active:scale-95 ${
                    isActive
                      ? 'bg-white/10 text-cyan-300 border border-cyan-500/30 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span className="hidden lg:inline">{item.label}</span>
                  <span className="lg:hidden">{item.shortLabel}</span>
                </button>
              );
            })}
          </nav>

          {/* RIGHT: Search, Compact System Status, Settings */}
          <div className="flex items-center gap-2 font-sans">
            
            {/* Command Search */}
            <button
              onClick={() => setShowSearchModal(true)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900/60 text-slate-400 text-xs border border-white/10 hover:border-cyan-500/30 hover:text-slate-200 transition-all font-sans"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline text-slate-400">Search hardware...</span>
              <kbd className="hidden lg:inline-block text-[9.5px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono border border-white/10">⌘K</kbd>
            </button>

            {/* Compact System Status Indicator */}
            <div 
              onClick={() => setActiveTab('builder')}
              title="Click to open System Status in Builder"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900/60 border border-white/10 cursor-pointer hover:border-cyan-500/30 transition-all text-xs font-mono"
            >
              {compatibility.overallStatus === 'compatible' && (
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="hidden sm:inline">Compatible</span>
                </span>
              )}
              {compatibility.overallStatus === 'warning' && (
                <span className="flex items-center gap-1 text-amber-400 font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Warning</span>
                </span>
              )}
              {compatibility.overallStatus === 'incompatible' && (
                <span className="flex items-center gap-1 text-rose-400 font-semibold">
                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden sm:inline">Issue</span>
                </span>
              )}

              <span className="text-slate-500">|</span>

              <span className="text-slate-300">
                {compatibility.totalWattageW}W load
              </span>
            </div>

            {/* Hardware Database Settings */}
            <button
              onClick={onOpenAdmin}
              title="Hardware Database Center"
              className="p-2 rounded-lg bg-slate-900/60 text-slate-400 hover:text-cyan-400 border border-white/10 hover:border-cyan-500/30 transition-all active:scale-95"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-900/60 text-slate-400 hover:text-white border border-white/10 transition"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-white/10 font-sans space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-slate-900 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}

      </div>

      {/* Global Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-20 px-4">
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

export default Navbar;
