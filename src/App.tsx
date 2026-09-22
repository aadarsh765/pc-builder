import { useState } from 'react';
import type { BuildComponents, Component, CompatibilityReport } from './types/pcBuilder';
import { SEED_COMPONENTS } from './data/seedData';
import { runCompatibilityCheck } from './services/compatibilityEngine';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { PCBuilderPage } from './pages/PCBuilderPage';
import { FPSCalculatorPage } from './pages/FPSCalculatorPage';
import { BottleneckPage } from './pages/BottleneckPage';
import { ComparePage } from './pages/ComparePage';
import { TargetPage } from './pages/TargetPage';
import { UpgradePage } from './pages/UpgradePage';
import { HardwarePage } from './pages/HardwarePage';
import { HardwareDetailPage } from './pages/HardwareDetailPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminModal } from './components/AdminModal';
import { AmbientBackground } from './components/motion/AmbientBackground';
import { AnimatedPage } from './components/motion/AnimatedPage';
import { GlassDock } from './components/glass/GlassDock';
import { KineticGrid } from './components/ui/kinetic-grid';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedDetailComponent, setSelectedDetailComponent] = useState<Component | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const [build, setBuild] = useState<BuildComponents>({
    cpu: SEED_COMPONENTS.find((c) => c.id === 'cpu-ryzen-7800x3d') || null,
    gpu: SEED_COMPONENTS.find((c) => c.id === 'gpu-rtx-4070-super') || null,
    motherboard: SEED_COMPONENTS.find((c) => c.id === 'mb-msi-b650-tomahawk') || null,
    ram: SEED_COMPONENTS.find((c) => c.id === 'ram-gskill-ddr5-6000-32gb') || null,
    storage: SEED_COMPONENTS.find((c) => c.id === 'storage-samsung-990-pro-2tb') || null,
    cooler: SEED_COMPONENTS.find((c) => c.id === 'cooler-deepcool-ak620') || null,
    psu: SEED_COMPONENTS.find((c) => c.id === 'psu-corsair-rm850e') || null,
    case: SEED_COMPONENTS.find((c) => c.id === 'case-corsair-4000d') || null,
    case_fan: SEED_COMPONENTS.find((c) => c.id === 'fan-arctic-p12-5pack') || null,
    monitor: SEED_COMPONENTS.find((c) => c.id === 'monitor-lg-27gr83q') || null,
    os: SEED_COMPONENTS.find((c) => c.id === 'os-windows-11-home') || null,
  });

  const compatibility: CompatibilityReport = runCompatibilityCheck(build);

  const handleSelectComponentDetail = (comp: Component) => {
    setSelectedDetailComponent(comp);
  };

  const handleLoadTargetBuild = (generatedBuild: BuildComponents) => {
    setBuild(generatedBuild);
    setActiveTab('builder');
  };

  const handleApplyUpgrade = (category: string, comp: Component) => {
    setBuild((prev) => ({ ...prev, [category]: comp }));
    setActiveTab('builder');
  };

  return (
    <div className="min-h-screen bg-[#05070d] text-slate-100 flex flex-col font-sans relative selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Interactive Kinetic Grid Canvas Layer */}
      <KineticGrid />

      {/* Slow moving ambient light background */}
      <AmbientBackground />

      {/* Header / Liquid Glass Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setSelectedDetailComponent(null);
          setActiveTab(tab);
        }}
        build={build}
        compatibility={compatibility}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onSelectComponentDetail={handleSelectComponentDetail}
      />

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-28 z-10">
        {selectedDetailComponent ? (
          <AnimatedPage key="hardware-detail">
            <HardwareDetailPage
              component={selectedDetailComponent}
              onBack={() => setSelectedDetailComponent(null)}
              onSelectComponent={handleSelectComponentDetail}
            />
          </AnimatedPage>
        ) : (
          <AnimatedPage key={activeTab}>
            {activeTab === 'home' && (
              <HomePage
                onNavigate={setActiveTab}
                onSelectComponent={handleSelectComponentDetail}
                currentBuild={build}
                compatibility={compatibility}
              />
            )}

            {activeTab === 'builder' && (
              <PCBuilderPage
                build={build}
                setBuild={setBuild}
                compatibility={compatibility}
                onNavigate={setActiveTab}
                onSelectComponentDetail={handleSelectComponentDetail}
                onSaveBuild={() => {
                  alert('Build snapshot saved to your dashboard successfully!');
                  setActiveTab('dashboard');
                }}
              />
            )}

            {activeTab === 'fps' && <FPSCalculatorPage build={build} />}

            {activeTab === 'bottleneck' && <BottleneckPage build={build} />}

            {activeTab === 'compare' && <ComparePage currentBuild={build} />}

            {activeTab === 'target' && (
              <TargetPage onLoadBuildIntoBuilder={handleLoadTargetBuild} />
            )}

            {activeTab === 'upgrade' && (
              <UpgradePage
                currentBuild={build}
                onApplyUpgrade={handleApplyUpgrade}
              />
            )}

            {activeTab === 'hardware' && (
              <HardwarePage onSelectComponent={handleSelectComponentDetail} />
            )}

            {activeTab === 'dashboard' && (
              <DashboardPage
                currentBuild={build}
                onLoadBuild={(b) => {
                  setBuild(b);
                  setActiveTab('builder');
                }}
              />
            )}
          </AnimatedPage>
        )}
      </div>

      {/* Persistent MacOS-Style Floating Liquid Glass Dock */}
      <GlassDock
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setSelectedDetailComponent(null);
          setActiveTab(tab);
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950/80 backdrop-blur-md py-8 text-center text-xs font-mono text-slate-500 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-slate-200 font-bold tracking-wider font-brand">RIGLAB</span> <span className="text-slate-400 font-medium">TECHNICAL PLATFORM</span> • PC Engineering & Hardware Analysis
          </div>
          <div>
            Data provenance: ⚡ Empirical Verified Benchmarks & 📊 Physics Performance Models
          </div>
        </div>
      </footer>

      {/* Hardware Database Center Modal */}
      <AdminModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />

    </div>
  );
}

export default App;
