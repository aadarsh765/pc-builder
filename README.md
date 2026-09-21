# ⚡ RIGLAB — PC Engineering & Performance Analysis Platform

> **Build. Analyze. Optimize.**  
> RIGLAB is a technical PC engineering laboratory and hardware performance analysis platform designed for real-time compatibility verification, bottleneck visualizers, multi-resolution framerate estimation, thermal diagnostics, and target spec generation.

🌐 **Live Application**: [https://pc-builder-peach.vercel.app/](https://pc-builder-peach.vercel.app/)

---

## 🌟 Key Features

* **⚡ Real-Time Socket & Clearance Verification**: Automated validation of CPU sockets, motherboard chipsets, RAM form factors, GPU length clearance, PSU wattage headroom, and cooler TDP capacities across **940+ hardware specs**.
* **🌐 Interactive Kinetic Grid Background**: Ambient interactive canvas grid featuring real-time physics cursor warping, node influence highlighting, and click ripple effects.
* **💎 Reusable Liquid Glass System**: Translucent UI components with backdrop-blur, subtle specular upper-edge highlights, and dark navy glass panel aesthetics (`GlassCard`, `GlassDock`, `GlassButton`, `GlassChip`).
* **📊 Multi-Workload Bottleneck Analyzer**: Workload-aware bottleneck detection for Gaming, Streaming, 3D Rendering, and AI/ML across 1080p, 1440p, and 4K resolutions.
* **🎮 Resolution & Quality FPS Calculator**: Framerate estimation with 1% low metrics, DLSS/FSR upscaling, and Ray Tracing path-tracing support.
* **🎯 Performance Target Builder**: Target-driven spec generator based on resolution, target FPS (60–240 FPS), and compute workload.
* **🔒 Data Provenance & Explainable Diagnostics**: Transparent hardware spec source tracking and collapsible technical "WHY?" diagnostic breakdowns.
* **💾 Build Snapshots & Offline Cache**: Save custom system builds locally and access offline cached hardware data seamlessly.

---

## 🛠️ Technology Stack

* **Frontend Framework**: React 19, TypeScript
* **Build Tool**: Vite 8, Tailwind CSS v4
* **Icons**: Lucide React
* **Typography**: ROUND 8-FOUR Webfont (`/fonts/round8-four-webfont.woff2`) & System Sans
* **State Management**: React Hooks & Local Storage
* **Deployment**: Vercel

---

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* `npm` or `yarn`

### Installation

```bash
# Clone the repository
git clone https://github.com/aadarsh765/pc-builder.git

# Navigate into project directory
cd pc-builder

# Install dependencies
npm install

# Start local dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
# Compile TypeScript and bundle production assets
npm run build

# Preview production build locally
npm run preview
```

---

## 📄 Data Provenance & Specification Accuracy

All hardware specifications in RIGLAB are derived from verified manufacturer spec sheets and empirical test bench data across 940+ hardware components. RIGLAB never fabricates benchmark values and distinguishes verified test runs from physics-based mathematical performance models.

---

© 2026 **RIGLAB Technical Platform** • All rights reserved.
