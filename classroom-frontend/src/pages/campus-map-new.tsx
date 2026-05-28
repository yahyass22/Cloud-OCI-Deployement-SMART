import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Compass, 
  X, 
  ChevronRight,
  Navigation,
  MousePointer2
} from "lucide-react";

/**
 * UNITED ISOMETRIC UNIVERSITY CAMPUS MAP - REBUILT
 * 
 * Recreated with a strict grid-based isometric projection for architectural uniformity.
 * Style: Clean, technical, modern architectural illustration.
 */

// ============================================================================
// CONSTANTS & PALETTE
// ============================================================================

const PALETTE = {
  bg: "#fdfaf5",         // Subtle cream
  grid: "#e5e1d8",       // Engineering blueprint lines
  ground: "#f8f5f0",     // Ground plane
  road: "#e0dcd3",       // Major roads
  canal: "#2c7a7b",      // Rich teal
  foliage: "#718061",    // Natural green
  accent: "#ffcc33",      // Bright gold/yellow
  text: "#1f2a33",
  glass: "#6fb1fc",      // CS building blue
  concrete: "#cbd5e0",   // Physics/Engineering grey
  brick: "#c5a386",      // Humanities beige/brown
};

// Isometric Projection Parameters (2:1 Ratio)
const GW = 45; // Grid Width
const GH = 22.5; // Grid Height

const toIso = (x: number, y: number, z: number = 0) => ({
  x: (x - y) * GW,
  y: (x + y) * GH - z
});

interface BuildingProps {
  gx: number; // Grid X
  gy: number; // Grid Y
  gw: number; // Grid Width (length along X axis)
  gl: number; // Grid Length (length along Y axis)
  gh: number; // Height (Z axis)
  color: string;
  id?: number;
  isSelected?: boolean;
  onClick?: () => void;
  isGlass?: boolean;
}

// ============================================================================
// ATOMIC COMPONENTS
// ============================================================================

const IsoBuilding = ({ gx, gy, gw, gl, gh, color, isSelected, onClick, isGlass }: BuildingProps) => {
  // Vertices for the building
  const base_p0 = toIso(gx, gy);
  const base_p1 = toIso(gx + gw, gy);
  const base_p2 = toIso(gx + gw, gy + gl);
  const base_p3 = toIso(gx, gy + gl);

  const top_p0 = toIso(gx, gy, gh);
  const top_p1 = toIso(gx + gw, gy, gh);
  const top_p2 = toIso(gx + gw, gy + gl, gh);
  const top_p3 = toIso(gx, gy + gl, gh);

  return (
    <g onClick={onClick} className="cursor-pointer group">
      {/* Shadow */}
      <path 
        d={`M ${base_p0.x} ${base_p0.y} L ${base_p1.x} ${base_p1.y} L ${base_p2.x} ${base_p2.y} L ${base_p3.x} ${base_p3.y} Z`} 
        fill="rgba(0,0,0,0.04)" 
        transform="translate(10, 10)"
      />
      
      {/* Right Face */}
      <path 
        d={`M ${base_p1.x} ${base_p1.y} L ${base_p2.x} ${base_p2.y} L ${top_p2.x} ${top_p2.y} L ${top_p1.x} ${top_p1.y} Z`} 
        fill={color} 
        filter="brightness(0.85)"
      />
      
      {/* Left Face */}
      <path 
        d={`M ${base_p0.x} ${base_p0.y} L ${base_p3.x} ${base_p3.y} L ${top_p3.x} ${top_p3.y} L ${top_p0.x} ${top_p0.y} Z`} 
        fill={color} 
        filter="brightness(0.95)"
      />
      
      {/* Top Face */}
      <path 
        d={`M ${top_p0.x} ${top_p0.y} L ${top_p1.x} ${top_p1.y} L ${top_p2.x} ${top_p2.y} L ${top_p3.x} ${top_p3.y} Z`} 
        fill={color} 
        filter="brightness(1.1)"
      />

      {isGlass && (
        <path 
          d={`M ${top_p0.x} ${top_p0.y} L ${top_p1.x} ${top_p1.y} L ${top_p2.x} ${top_p2.y} L ${top_p3.x} ${top_p3.y} Z`} 
          fill="url(#glassGradient)" 
          opacity="0.3"
        />
      )}

      {/* Selection Highlight */}
      {isSelected && (
        <path 
          d={`M ${top_p0.x} ${top_p0.y-5} L ${top_p1.x} ${top_p1.y-5} L ${top_p2.x} ${top_p2.y-5} L ${top_p3.x} ${top_p3.y-5} Z`} 
          fill="none" 
          stroke={PALETTE.accent} 
          strokeWidth="3" 
          strokeDasharray="4,4"
        />
      )}
    </g>
  );
};

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

const CampusMapFinal = () => {
  const [selectedId, setSelectedId] = useState<number | null>(1);

  const departments = [
    { id: 1, name: "Computer Science", gx: -4, gy: -2, gw: 2, gl: 2, gh: 120, color: PALETTE.glass, isGlass: true, title: "Computer Science Department", subtitle: "Core Innovation Cluster" },
    { id: 2, name: "Physics", gx: -6, gy: 0, gw: 1, gl: 1, gh: 180, color: PALETTE.concrete, title: "Physics Department", subtitle: "Astro-Physical Observatory" },
    { id: 3, name: "Engineering", gx: -6, gy: -4, gw: 4, gl: 1.5, gh: 60, color: PALETTE.concrete, title: "Engineering Labs", subtitle: "Robotics & Structures" },
    { id: 4, name: "Math & Chem", gx: -3, gy: 2, gw: 2.5, gl: 2.5, gh: 80, color: "#f7fafc", title: "Chemistry & Mathematics", subtitle: "Molecular Sciences Wing" },
    { id: 12, name: "Library", gx: 0, gy: 0, gw: 2, gl: 2, gh: 40, color: "#ffffff", title: "Main Library", subtitle: "Academic Knowledge Dome" },
    { id: 11, name: "Business", gx: 1, gy: 4, gw: 2, gl: 2, gh: 250, color: "#2d3748", isGlass: true, title: "Business School", subtitle: "International Finance Center" },
    { id: 5, name: "Biology", gx: 4, gy: -1, gw: 2, gl: 2, gh: 50, color: "#9ae6b4", title: "Biology Department", subtitle: "Bio-Diversity Greenhouse" },
    { id: 10, name: "Fine Arts", gx: 3, gy: -5, gw: 3, gl: 3, gh: 70, color: "#b794f4", title: "Fine Arts Plaza", subtitle: "Avant-Garde Sculpture Hub" },
    { id: 6, name: "Psychology", gx: 6, gy: 2, gw: 1.5, gl: 2, gh: 90, color: PALETTE.brick, title: "Psychology Hub", subtitle: "Behavioral Sciences" },
    { id: 7, name: "Economics", gx: 6, gy: 5, gw: 1.5, gl: 2, gh: 90, color: PALETTE.brick, title: "Economics Center", subtitle: "Global Market Studies" },
  ];

  const selectedDept = departments.find(d => d.id === selectedId);

  return (
    <div className="relative w-full h-[calc(100vh-64px)] bg-[#fdfaf5] overflow-hidden font-sans">
      
      {/* Title Overlay */}
      <div className="absolute top-10 left-10 z-10 pointer-events-none">
        <h1 className="text-3xl font-black tracking-tighter text-[#1f2a33] uppercase leading-none mb-2">
          United Isometric <br/> University Map
        </h1>
        <div className="w-20 h-2 bg-[#ffcc33]"></div>
      </div>

      <main className="w-full h-full flex items-center justify-center">
        <svg 
          viewBox="-800 -600 1600 1200" 
          className="w-full h-full p-20"
          style={{ cursor: 'grab' }}
        >
          <defs>
            <pattern id="isoGrid" width="90" height="45" patternUnits="userSpaceOnUse">
              <path d="M 45 0 L 90 22.5 L 45 45 L 0 22.5 Z" fill="none" stroke={PALETTE.grid} strokeWidth="1" />
            </pattern>
            <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            <linearGradient id="canalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2c7a7b" />
              <stop offset="100%" stopColor="#319795" />
            </linearGradient>
          </defs>

          {/* --- Ground Plane --- */}
          <rect x="-1200" y="-1200" width="2400" height="2400" fill="url(#isoGrid)" />
          
          {/* Main Axis Roads */}
          <path d="M -1000 0 L 1000 0" stroke={PALETTE.road} strokeWidth="110" />
          <path d="M 0 -1000 L 0 1000" stroke={PALETTE.road} strokeWidth="110" />

          {/* Grand Canal */}
          <path d="M 300 -800 Q 400 0 300 800 L 420 800 Q 520 0 420 -800 Z" fill="url(#canalGrad)" opacity="0.9" />

          {/* Zones Labels */}
          <g opacity="0.3" className="select-none pointer-events-none font-black uppercase tracking-[0.4em] fill-[#a39e93]">
            <text x="-400" y="300" fontSize="14">STEM Innovation Core</text>
            <text x="400" y="500" fontSize="14">Humanities & Life Sciences</text>
            <text x="400" y="-300" fontSize="14">Creative & Business</text>
          </g>

          {/* --- Buildings --- */}
          {departments.map((dept) => (
            <IsoBuilding 
              key={dept.id}
              {...dept}
              isSelected={selectedId === dept.id}
              onClick={() => setSelectedId(dept.id)}
            />
          ))}

          {/* Library Dome Detail */}
          <g transform="translate(0, -40)">
            <path d="M -45 0 A 45 35 0 0 1 45 0" fill="#ffffff" stroke="#e0dcd3" strokeWidth="2" />
            <circle cy="-10" r="5" fill={PALETTE.accent} />
          </g>

          {/* --- Numbered Markers --- */}
          {departments.map((dept) => {
            const pos = toIso(dept.gx + dept.gw/2, dept.gy + dept.gl/2, dept.gh + 20);
            return (
              <g 
                key={`marker-${dept.id}`} 
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => setSelectedId(dept.id)}
                className="cursor-pointer"
              >
                <motion.circle 
                  r="16" 
                  fill={PALETTE.accent} 
                  stroke="white" 
                  strokeWidth="3"
                  initial={false}
                  animate={{ 
                    scale: selectedId === dept.id ? 1.3 : 1,
                    y: selectedId === dept.id ? -10 : 0
                  }}
                  className="shadow-xl"
                />
                <text 
                  y="4" 
                  textAnchor="middle" 
                  className="text-[10px] font-black fill-[#1f2a33]"
                >
                  {dept.id}
                </text>
              </g>
            );
          })}

          {/* --- Floating Info Card (Pure SVG ForeignObject for precise positioning) --- */}
          <AnimatePresence>
            {selectedId && selectedDept && (
              <foreignObject 
                key="info-card"
                {...toIso(selectedDept.gx + selectedDept.gw/2, selectedDept.gy + selectedDept.gl/2, selectedDept.gh + 180)}
                x={toIso(selectedDept.gx + selectedDept.gw/2, selectedDept.gy + selectedDept.gl/2, selectedDept.gh + 180).x - 110}
                y={toIso(selectedDept.gx + selectedDept.gw/2, selectedDept.gy + selectedDept.gl/2, selectedDept.gh + 180).y}
                width="220" 
                height="150"
                className="overflow-visible"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-xl shadow-2xl p-5 border border-[#e0dcd3] relative"
                >
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-[#e0dcd3] rotate-45" />
                  
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedId(null); }}
                    className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-3 h-3 text-gray-400" />
                  </button>

                  <h3 className="text-sm font-bold text-[#1f2a33] leading-tight mb-1">
                    {selectedDept.title}
                  </h3>
                  <p className="text-[11px] font-medium text-[#716c62] mb-4">
                    {selectedDept.subtitle}
                  </p>
                  
                  <button className="flex items-center gap-2 text-[10px] font-black text-[#6fb1fc] hover:underline uppercase tracking-wider">
                    <span>Navigation Details</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </motion.div>
              </foreignObject>
            )}
          </AnimatePresence>
        </svg>

        {/* --- Static Compass UI --- */}
        <div className="absolute bottom-10 right-10 flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-white/50 backdrop-blur-sm border border-[#e0dcd3] shadow-lg flex items-center justify-center relative">
            <div className="absolute top-2 text-[10px] font-black text-[#a39e93]">N</div>
            <div className="absolute bottom-2 text-[10px] font-black text-[#a39e93]">S</div>
            <div className="absolute left-2 text-[10px] font-black text-[#a39e93]">W</div>
            <div className="absolute right-2 text-[10px] font-black text-[rgb(111,177,252)] font-black">E</div>
            <Compass className="w-10 h-10 text-[rgb(111,177,252)] rotate-[30deg]" />
          </div>
          <p className="text-[10px] font-bold text-[#a39e93] uppercase tracking-[0.2em]">Orientation: 30° Iso</p>
        </div>

        {/* Instructions Overlay */}
        <div className="absolute bottom-10 left-10 text-[10px] font-bold text-[#a39e93] uppercase tracking-widest flex items-center gap-3">
          <MousePointer2 className="w-4 h-4" />
          <span>Click a building to inspect</span>
        </div>

      </main>
    </div>
  );
};

export default CampusMapFinal;
