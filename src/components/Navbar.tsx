import React, { useState } from 'react';
import { Cpu, Gamepad2, BarChart3, Scale, Database, Search, Settings, Home, Menu, X, ShieldCheck } from 'lucide-react';
import type { Component } from '../types/pcBuilder';
import { SEED_COMPONENTS } from '../data/seedData';

interface NavbarProps { activeTab: string; setActiveTab: (tab: string) => void; onOpenAdmin: () => void; onSelectComponentDetail: (component: Component) => void; }
const mainNavItems = [{ id: 'home', label: 'Home', icon: Home }, { id: 'builder', label: 'PC Builder', icon: Cpu }, { id: 'hardware', label: 'Hardware', icon: Database }, { id: 'fps', label: 'FPS', icon: Gamepad2 }, { id: 'bottleneck', label: 'Bottleneck', icon: BarChart3 }, { id: 'compare', label: 'Compare', icon: Scale }];

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenAdmin, onSelectComponentDetail }) => {
  const [searchQuery, setSearchQuery] = useState(''); const [showSearchModal, setShowSearchModal] = useState(false); const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchResults = searchQuery.trim() ? SEED_COMPONENTS.filter((component) => [component.name, component.brand, component.category].some((value) => value.toLowerCase().includes(searchQuery.toLowerCase()))).slice(0, 6) : [];
  const selectTab = (tab: string) => { setActiveTab(tab); setMobileMenuOpen(false); };
  return <header className="app-header">
    <div className="app-header-inner">
      <button type="button" onClick={() => selectTab('home')} className="brand-mark" aria-label="RigLab home"><span className="font-brand">RIGLAB</span><span>v2.4</span></button>
      <nav className="app-nav" aria-label="Main navigation">{mainNavItems.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => selectTab(id)} className={activeTab === id ? 'is-active' : ''}><Icon className="h-3.5 w-3.5" aria-hidden="true" />{label}</button>)}</nav>
      <div className="header-actions"><button type="button" onClick={() => setShowSearchModal(true)} className="header-search" aria-label="Search hardware"><Search className="h-4 w-4" /><span>Search</span></button><button type="button" onClick={onOpenAdmin} className="header-icon" aria-label="Settings"><Settings className="h-4 w-4" /></button><button type="button" onClick={() => setMobileMenuOpen((open) => !open)} className="mobile-toggle" aria-label="Toggle navigation">{mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}</button></div>
    </div>
    {mobileMenuOpen && <nav className="mobile-nav" aria-label="Mobile navigation">{mainNavItems.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => selectTab(id)} className={activeTab === id ? 'is-active' : ''}><Icon className="h-4 w-4" /> {label}</button>)}</nav>}
    {showSearchModal && <div className="search-modal" role="dialog" aria-modal="true" aria-label="Search hardware"><div className="search-dialog"><div className="search-input-row"><Search className="h-5 w-5" /><input autoFocus value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search hardware specs" /><button type="button" onClick={() => { setShowSearchModal(false); setSearchQuery(''); }}>ESC</button></div><div className="search-results">{searchQuery.trim() && searchResults.length === 0 && <p>No components found.</p>}{!searchQuery.trim() && <p>Search the hardware database by model, brand, or category.</p>}{searchResults.map((item) => <button type="button" key={item.id} onClick={() => { onSelectComponentDetail(item); setShowSearchModal(false); setSearchQuery(''); }}><img src={item.imageUrl} alt="" /><span><strong>{item.name}</strong><small>{item.category} · {item.brand}</small></span><ShieldCheck className="h-4 w-4" /></button>)}</div></div></div>}
  </header>;
};
export default Navbar;
