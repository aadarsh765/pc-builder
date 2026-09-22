import React from 'react';
import { ArrowRight, BarChart3, Database, Gamepad2, Scale, Thermometer, Cpu, Zap, ShieldCheck } from 'lucide-react';
import { LiquidGlassButton } from '../components/ui/liquid-glass-button';
import { LiquidGlassCard } from '../components/ui/liquid-glass-card';

interface HomePageProps { onNavigate: (tab: string) => void; }

const analysisAreas = [
  { title: 'Compatibility', description: 'Check component compatibility and platform constraints.', icon: ShieldCheck },
  { title: 'Performance', description: 'Estimate workload and gaming performance.', icon: BarChart3 },
  { title: 'Power', description: 'Estimate system power requirements.', icon: Zap },
  { title: 'Thermals', description: 'Analyze expected thermal behavior.', icon: Thermometer },
];

const modules = [
  { title: 'Hardware Database', description: 'Browse component specifications and platform details.', icon: Database, tab: 'hardware' },
  { title: 'PC Builder', description: 'Assemble a configuration and check its constraints.', icon: Cpu, tab: 'builder' },
  { title: 'FPS Calculator', description: 'Estimate gaming performance at common resolutions.', icon: Gamepad2, tab: 'fps' },
  { title: 'Bottleneck Analyzer', description: 'Explore workload limits across a selected build.', icon: BarChart3, tab: 'bottleneck' },
  { title: 'Compare Builds', description: 'Review configurations side by side.', icon: Scale, tab: 'compare' },
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => (
  <div className="home-page pb-16">
    <section className="home-hero">
      <p className="home-eyebrow">RIGLAB / HARDWARE ANALYSIS</p>
      <h1>Engineer your PC with data.</h1>
      <p className="home-intro">Build and analyze PC configurations using compatibility, power, thermal, bottleneck and performance data.</p>
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <LiquidGlassButton variant="primary" size="md" onClick={() => onNavigate('builder')}>Build a PC →</LiquidGlassButton>
        <LiquidGlassButton variant="secondary" size="md" onClick={() => onNavigate('bottleneck')}>Analyze a system</LiquidGlassButton>
      </div>
      <p className="home-supporting-line">Compatibility <span>·</span> Performance <span>·</span> Power <span>·</span> Thermal</p>
    </section>

    <section className="home-section" aria-labelledby="analysis-heading">
      <div className="home-section-heading"><p className="home-eyebrow">ANALYSIS</p><h2 id="analysis-heading">What you can analyze</h2></div>
      <div className="analysis-grid">
        {analysisAreas.map(({ title, description, icon: Icon }) => <div key={title} className="analysis-item">
          <Icon className="h-4 w-4" aria-hidden="true" /><h3>{title}</h3><p>{description}</p>
        </div>)}
      </div>
    </section>

    <section className="home-section" aria-labelledby="tools-heading">
      <div className="home-section-heading split-heading"><div><p className="home-eyebrow">WORKSPACE</p><h2 id="tools-heading">Tools for the build process</h2></div><p>Move from parts research to a more informed configuration.</p></div>
      <div className="module-grid">
        {modules.map(({ title, description, icon: Icon, tab }) => <LiquidGlassCard key={title} variant="interactive" draggable={false} onClick={() => onNavigate(tab)} className="module-card">
          <Icon className="h-5 w-5" aria-hidden="true" /><div><h3>{title}</h3><p>{description}</p></div><ArrowRight className="module-arrow h-4 w-4" aria-hidden="true" />
        </LiquidGlassCard>)}
      </div>
    </section>
  </div>
);

export default HomePage;
