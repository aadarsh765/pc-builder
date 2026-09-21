import React, { useState } from 'react';
import { Database, Search, Zap } from 'lucide-react';
import type { Component } from '../types/pcBuilder';
import { SEED_COMPONENTS } from '../data/seedData';
import { GlassCard } from '../components/glass/GlassCard';
import { GlassChip } from '../components/glass/GlassChip';

interface HardwarePageProps {
  onSelectComponent: (comp: Component) => void;
}

export const HardwarePage: React.FC<HardwarePageProps> = ({ onSelectComponent }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  let filtered = SEED_COMPONENTS;

  if (selectedCategory !== 'all') {
    filtered = filtered.filter((c) => c.category === selectedCategory);
  }

  if (search.trim()) {
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.brand.toLowerCase().includes(search.toLowerCase())
    );
  }

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Categories' },
    { id: 'cpu', label: 'CPUs' },
    { id: 'gpu', label: 'GPUs' },
    { id: 'motherboard', label: 'Motherboards' },
    { id: 'ram', label: 'RAM' },
    { id: 'storage', label: 'Storage' },
    { id: 'cooler', label: 'Coolers' },
    { id: 'psu', label: 'PSUs' },
    { id: 'case', label: 'Cases' },
  ];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-brand font-bold text-white flex items-center gap-2">
          <Database className="w-6 h-6 text-cyan-400" />
          <span>Hardware Specification & Benchmark Hub</span>
        </h1>
        <p className="text-xs text-slate-400">Explore technical specs, socket compatibility, thermal TDPs, and verified benchmark provenance.</p>
      </div>

      {/* Category Pills & Search */}
      <GlassCard className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 font-mono">
          {categories.map((cat) => (
            <GlassChip
              key={cat.id}
              active={selectedCategory === cat.id}
              color="cyan"
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </GlassChip>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search specs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950/80 border border-white/10 text-xs text-white rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>
      </GlassCard>

      {/* Grid of Components */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((comp) => (
          <GlassCard
            key={comp.id}
            variant="interactive"
            onClick={() => onSelectComponent(comp)}
            className="p-5 space-y-4 cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <img src={comp.imageUrl} alt={comp.name} className="w-14 h-14 object-cover rounded-xl bg-slate-900 border border-white/10 shrink-0" />
              <div className="overflow-hidden">
                <GlassChip active={false}>{comp.category}</GlassChip>
                <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors truncate mt-1">
                  {comp.name}
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{comp.notes}</p>

            <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs font-mono">
              <div className="flex items-center gap-1 text-amber-400">
                <Zap className="w-3.5 h-3.5" />
                <span className="font-bold">{comp.powerConsumptionW}W TDP</span>
              </div>
              <span className="text-xs text-slate-400 group-hover:text-cyan-400 transition-colors flex items-center gap-1">
                View Spec Details →
              </span>
            </div>
          </GlassCard>
        ))}
      </div>

    </div>
  );
};
