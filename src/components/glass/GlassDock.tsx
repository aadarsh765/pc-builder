import React, { useRef, useState } from 'react';
import { 
  Home, 
  Cpu, 
  Database, 
  Gamepad2, 
  BarChart3, 
  Scale, 
  SlidersHorizontal
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface GlassDockProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAdmin: () => void;
}

interface DockItem {
  id: string;
  label: string;
  icon: LucideIcon;
  action?: () => void;
}

export const GlassDock: React.FC<GlassDockProps> = ({
  activeTab,
  setActiveTab,
  onOpenAdmin,
}) => {
  const dockRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState<number | null>(null);

  const items: DockItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'builder', label: 'Build', icon: Cpu },
    { id: 'hardware', label: 'Hardware', icon: Database },
    { id: 'fps', label: 'FPS', icon: Gamepad2 },
    { id: 'bottleneck', label: 'Analyze', icon: BarChart3 },
    { id: 'compare', label: 'Compare', icon: Scale },
    { id: 'admin', label: 'Database Center', icon: SlidersHorizontal, action: onOpenAdmin },
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dockRef.current) {
      const rect = dockRef.current.getBoundingClientRect();
      setMouseX(e.clientX - rect.left);
    }
  };

  const handleMouseLeave = () => {
    setMouseX(null);
  };

  const getScaleFactor = (index: number) => {
    if (mouseX === null || !dockRef.current) return 1;
    const itemWidth = 44;
    const itemCenter = index * (itemWidth + 8) + itemWidth / 2 + 16;
    const distance = Math.abs(mouseX - itemCenter);
    const maxDistance = 110;

    if (distance > maxDistance) return 1;

    const factor = 1 + 0.45 * Math.cos((distance / maxDistance) * (Math.PI / 2));
    return Math.min(Math.max(factor, 1.0), 1.45);
  };

  return (
    <aside
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 pointer-events-auto hidden sm:block"
      aria-label="Floating Action Dock"
    >
      <div
        ref={dockRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="glass-dock px-3.5 py-2 rounded-2xl flex items-center gap-2 border border-white/12 backdrop-blur-2xl relative shadow-[0_16px_40px_rgba(0,0,0,0.6)]"
      >
        {items.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const scale = getScaleFactor(index);

          return (
            <div key={item.id} className="relative group flex flex-col items-center">
              
              {/* Tooltip on hover */}
              <div className="absolute -top-9 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap px-2 py-0.5 rounded-md bg-slate-900/90 text-[10px] font-mono text-white border border-white/20 shadow-md">
                {item.label}
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                style={{
                  transform: `scale(${scale}) translateY(${scale > 1.1 ? -(scale - 1) * 10 : 0}px)`,
                  transition: mouseX === null ? 'transform 180ms ease-out' : 'transform 40ms linear',
                }}
                className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-150 active:scale-95 ${
                  isActive
                    ? 'bg-cyan-500/20 border border-cyan-400/60 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-900/80 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Icon
                  strokeWidth={isActive ? 2.2 : 1.8}
                  className="w-4.5 h-4.5"
                />
                
                {/* Active Dot Indicator */}
                {isActive && (
                  <span className="absolute -bottom-1 w-1.2 h-1.2 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default GlassDock;
