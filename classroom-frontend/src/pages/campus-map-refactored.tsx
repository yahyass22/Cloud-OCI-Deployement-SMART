import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, X, Plus, Minus, Maximize, Search, ChevronRight } from 'lucide-react';

// ============================================================================
// CONFIGURATION & THEME (MATCHING TARGET DESIGN)
// ============================================================================

const THEME = {
  colors: {
    bg: '#F5F5F0',           // Warm beige/grey background
    grid: '#D1D1CA',         // Clear grid lines
    
    // Building Materials - Solid Volumes
    building: {
      top: '#FFFFFF',        // Pure white top face
      left: '#E2E2E2',       // Light grey left face
      right: '#BDBDBD',      // Darker grey right face
      outline: '#2A2A2A',    // Strong dark outline (0.5px)
      shadow: 'rgba(0, 0, 0, 0.12)', // Ground shadow
    },
    
    // Accents
    accent: '#F4CE14',       // Vibrant Yellow
    text: '#000000',         // High contrast text
    textMuted: '#666666',
    
    // Environment
    road: '#333333',         // Dark grey roads
    roadMarking: '#FFFFFF',  // Dashed white lines
    tree: '#94A38A',
  },
  isoAngle: 30,
  gridSize: 55, // Larger scale for better definition
};

// ============================================================================
// MATH & PROJECTION
// ============================================================================

const toScreen = (x: number, y: number, z: number = 0) => {
  const angleRad = (THEME.isoAngle * Math.PI) / 180;
  // Standard Isometric formula
  const screenX = (x - y) * Math.cos(angleRad) * THEME.gridSize;
  const screenY = (x + y) * Math.sin(angleRad) * THEME.gridSize - (z * THEME.gridSize);
  return { x: screenX, y: screenY };
};

// = :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// BUILDING DATA
// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

interface BuildingData {
  id: number;
  name: string;
  dept: string;
  desc: string;
  type: 'block' | 'complex' | 'organic' | 'tower' | 'courtyard';
  x: number;
  y: number;
  w: number;
  d: number;
  h: number;
  features?: string[];
}

const BUILDINGS: BuildingData[] = [
  { id: 1, name: "Physics Hall", dept: "Core Innovation Cluster", desc: "Physics Hall is a core research facility: components, health, and laboratory arts.", type: 'complex', x: 2, y: 10, w: 5, d: 4, h: 3 },
  { id: 2, name: "Computer Science", dept: "Core Innovation Cluster", desc: "Technology hub and advanced computing research center.", type: 'tower', x: 3, y: 6, w: 3, d: 3, h: 8, features: ['dishes'] },
  { id: 3, name: "Engineering", dept: "Core Innovation Cluster", desc: "Mechanical labs and robotics workshops.", type: 'block', x: 8, y: 5, w: 4, d: 4, h: 3.5 },
  { id: 4, name: "Mathematics", dept: "Core Innovation Cluster", desc: "Department of theoretical and applied mathematics.", type: 'block', x: 10, y: 2, w: 4, d: 2.5, h: 4 },
  { id: 5, name: "Fine Kinall", dept: "Core Innovation Cluster", desc: "Interdisciplinary study space and resource library.", type: 'block', x: 13, y: 3, w: 3, d: 3, h: 3 },
  { id: 7, name: "Fine Arts Center", dept: "Core Innovation Cluster", desc: "Contemporary art galleries and creative studios.", type: 'organic', x: 8, y: 13, w: 5, d: 4, h: 2 },
  { id: 8, name: "Business School", dept: "Core Innovation Cluster", desc: "Finance, management, and executive leadership center.", type: 'tower', x: 13, y: 10, w: 2, d: 2, h: 8 },
  { id: 9, name: "Mathematics II", dept: "Core Innovation Cluster", desc: "Secondary math building and archives.", type: 'courtyard', x: 14, y: 14, w: 6, d: 6, h: 2.5 },
  { id: 10, name: "Language Arts", dept: "Core Innovation Cluster", desc: "Department of literature and world languages.", type: 'block', x: 16, y: 8, w: 3, d: 3, h: 3 },
  { id: 11, name: "Creative Studios", dept: "Core Innovation Cluster", desc: "Design and multimedia production labs.", type: 'organic', x: 13, y: 0, w: 4, d: 3, h: 2.5 },
];

// =::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// COMPONENTS
// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

const BuildingBlock = ({ data, isSelected, onClick }: { data: BuildingData; isSelected: boolean; onClick: () => void }) => {
  const { x, y, w, d, h, type } = data;
  
  // Projection points
  const p_ground = toScreen(x, y, 0);
  const p_right = toScreen(x + w, y, 0);
  const p_back = toScreen(x + w, y + d, 0);
  const p_left = toScreen(x, y + d, 0);
  
  const p_top_front = toScreen(x, y, h);
  const p_top_right = toScreen(x + w, y, h);
  const p_top_back = toScreen(x + w, y + d, h);
  const p_top_left = toScreen(x, y + d, h);

  // Ground Shadow (skewed polygon)
  const shadowPath = `M${p_ground.x},${p_ground.y} L${p_right.x},${p_right.y} L${p_right.x + 20},${p_right.y + 10} L${p_ground.x + 20},${p_ground.y + 10} Z`;

  const renderVolume = () => {
    switch (type) {
      case 'organic':
        const center = toScreen(x + w/2, y + d/2, 0);
        return (
          <g>
            <path
              d={`M ${center.x - 45},${center.y} Q ${center.x},${center.y + 40} ${center.x + 45},${center.y} L ${center.x + 45},${center.y - 40} Q ${center.x},${center.y} ${center.x - 45},${center.y - 40} Z`}
              fill={THEME.colors.building.left}
              stroke={THEME.colors.building.outline}
              strokeWidth="0.5"
            />
            <path
              d={`M ${center.x - 45},${center.y - 40} Q ${center.x},${center.y} ${center.x + 45},${center.y - 40} L ${center.x + 45},${center.y - 45} Q ${center.x},${center.y - 5} ${center.x - 45},${center.y - 45} Z`}
              fill={THEME.colors.building.top}
              stroke={THEME.colors.building.outline}
              strokeWidth="0.5"
            />
          </g>
        );
      case 'courtyard':
        return (
          <g>
             {/* Simple hollow rectangle representation */}
             <path d={`M${p_top_front.x},${p_top_front.y} L${p_top_right.x},${p_top_right.y} L${p_top_back.x},${p_top_back.y} L${p_top_left.x},${p_top_left.y} Z`} fill={THEME.colors.building.top} stroke={THEME.colors.building.outline} strokeWidth="0.5" />
             <path d={`M${p_ground.x},${p_ground.y} L${p_left.x},${p_left.y} L${p_top_left.x},${p_top_left.y} L${p_top_front.x},${p_top_front.y} Z`} fill={THEME.colors.building.left} stroke={THEME.colors.building.outline} strokeWidth="0.5" />
             <path d={`M${p_ground.x},${p_ground.y} L${p_right.x},${p_right.y} L${p_top_right.x},${p_top_right.y} L${p_top_front.x},${p_top_front.y} Z`} fill={THEME.colors.building.right} stroke={THEME.colors.building.outline} strokeWidth="0.5" />
             {/* Hollow center */}
             <path d={`M${toScreen(x+2, y+2, h+0.1).x},${toScreen(x+2, y+2, h+0.1).y} L${toScreen(x+4, y+2, h+0.1).x},${toScreen(x+4, y+2, h+0.1).y} L${toScreen(x+4, y+4, h+0.1).x},${toScreen(x+4, y+4, h+0.1).y} L${toScreen(x+2, y+4, h+0.1).x},${toScreen(x+2, y+4, h+0.1).y} Z`} fill="#D1D1CA" stroke={THEME.colors.building.outline} strokeWidth="0.5" />
          </g>
        )
      default:
        return (
          <g>
            {/* Left Face */}
            <path d={`M${p_ground.x},${p_ground.y} L${p_left.x},${p_left.y} L${p_top_left.x},${p_top_left.y} L${p_top_front.x},${p_top_front.y} Z`} fill={THEME.colors.building.left} stroke={THEME.colors.building.outline} strokeWidth="0.5" />
            {/* Right Face */}
            <path d={`M${p_ground.x},${p_ground.y} L${p_right.x},${p_right.y} L${p_top_right.x},${p_top_right.y} L${p_top_front.x},${p_top_front.y} Z`} fill={THEME.colors.building.right} stroke={THEME.colors.building.outline} strokeWidth="0.5" />
            {/* Top Face */}
            <path d={`M${p_top_front.x},${p_top_front.y} L${p_top_right.x},${p_top_right.y} L${p_top_back.x},${p_top_back.y} L${p_top_left.x},${p_top_left.y} Z`} fill={THEME.colors.building.top} stroke={THEME.colors.building.outline} strokeWidth="0.5" />
          </g>
        );
    }
  };

  const labelPos = toScreen(x + w/2, y + d/2, h + 1.2);

  return (
    <motion.g 
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="cursor-pointer"
      whileHover={{ y: -5 }}
      animate={isSelected ? { y: -8 } : { y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Ground Shadow */}
      <path d={shadowPath} fill={THEME.colors.building.shadow} />

      {/* Volumetric Building */}
      {renderVolume()}

      {/* Marker - Tooltip style from image */}
      <g transform={`translate(${labelPos.x}, ${labelPos.y})`}>
         <motion.g initial={false} animate={isSelected ? { scale: 1.2 } : { scale: 1 }}>
            {/* Speech bubble shape */}
            <path d="M-15,-30 L15,-30 L15,-10 L4,-10 L0,0 L-4,-10 L-15,-10 Z" fill={THEME.colors.accent} stroke="#000" strokeWidth="1.5" />
            <text x="0" y="-17" textAnchor="middle" fontSize="12" fontWeight="900" fill="#000">{data.id}</text>
         </motion.g>
      </g>
    </motion.g>
  );
};

const Environment = () => {
  const road = (pts: {x:number, y:number}[], w: number = 20) => {
    const d = pts.map((p, i) => `${i===0?'M':'L'}${toScreen(p.x, p.y).x},${toScreen(p.x, p.y).y}`).join(' ');
    return (
      <g>
        <path d={d} stroke={THEME.colors.road} strokeWidth={w} fill="none" strokeLinecap="round" />
        <path d={d} stroke={THEME.colors.roadMarking} strokeWidth="2" strokeDasharray="10,12" fill="none" opacity="0.6" />
      </g>
    );
  };

  const lib = toScreen(8, 8, 0);

  return (
    <g className="pointer-events-none">
      {/* Infrastructure */}
      {road([{x:0, y:20}, {x:20, y:0}])}
      {road([{x:4, y:8}, {x:16, y:8}])}
      {road([{x:8, y:4}, {x:8, y:16}])}

      {/* Main Library */}
      <g>
         <ellipse cx={lib.x} cy={lib.y} rx="60" ry="35" fill={THEME.colors.road} />
         <ellipse cx={lib.x} cy={lib.y - 10} rx="50" ry="30" fill="#E2E2E2" stroke="#000" strokeWidth="1" />
         <ellipse cx={lib.x} cy={lib.y - 20} rx="40" ry="24" fill="#FFFFFF" stroke="#000" strokeWidth="1" />
         <text x={lib.x} y={lib.y - 15} textAnchor="middle" fontSize="8" fontWeight="bold" letterSpacing="2" fill="#000">MAIN LIBRARY</text>
      </g>

      {/* Trees */}
      {[{x:5, y:4}, {x:15, y:5}, {x:4, y:15}, {x:12, y:13}, {x:18, y:10}].map((t, i) => {
        const p = toScreen(t.x, t.y);
        return (
          <g key={i} transform={`translate(${p.x}, ${p.y})`}>
            <circle cx="0" cy="0" r="10" fill="#94A38A" stroke="#444" strokeWidth="0.5" />
            <circle cx="-3" cy="-3" r="6" fill="#A8B8A0" />
          </g>
        );
      })}
    </g>
  );
};

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

const CampusMapRefactored: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number | null>(1); // Default select 1 to match target img
  
  // Navigation State
  const [view, setView] = useState({ 
    x: 0, 
    y: 100, // Center offset
    scale: 0.9,
    isDragging: false,
    startX: 0,
    startY: 0
  });

  const selectedBuilding = useMemo(() => BUILDINGS.find(b => b.id === selectedId), [selectedId]);
  
  // Strict Painter's Algorithm Sort: Sort by furthest back corner (x + w + y + d)
  const sortedBuildings = useMemo(() => {
    return [...BUILDINGS].sort((a, b) => (a.x + a.w + a.y + a.d) - (b.x + b.w + b.y + b.d));
  }, []);

  // PAN / ZOOM HANDLERS
  const handleMouseDown = (e: React.MouseEvent) => {
    setView(prev => ({
      ...prev,
      isDragging: true,
      startX: e.clientX - prev.x,
      startY: e.clientY - prev.y,
    }));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!view.isDragging) return;
    setView(prev => ({
      ...prev,
      x: e.clientX - prev.startX,
      y: e.clientY - prev.startY,
    }));
  };

  const handleMouseUp = () => {
    setView(prev => ({ ...prev, isDragging: false }));
  };

  const handleWheel = (e: React.WheelEvent) => {
    const scaleFactor = 0.001;
    const newScale = Math.min(Math.max(0.4, view.scale - e.deltaY * scaleFactor), 3);
    setView(prev => ({ ...prev, scale: newScale }));
  };

  return (
    <div className="flex w-full h-screen bg-[#F5F5F0] overflow-hidden">
      
      {/* ---------------- LEFT SIDEBAR ---------------- */}
      <aside className="w-80 bg-[#F5F5F0] border-r border-[#D1D1CA] flex flex-col z-20 shadow-sm relative p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 bg-[#F4CE14] rounded-2xl flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-3xl font-black text-black">U</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-black leading-none">UNITED<br/>ISOMETRIC<br/>UNIVERSITY</h1>
            <p className="text-[10px] font-bold text-gray-500 mt-2 tracking-widest uppercase">Campus Map 2026</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input className="w-full bg-white border-2 border-black rounded-xl py-3 pl-10 pr-4 text-sm font-bold placeholder:text-gray-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" placeholder="Search buildings..." />
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          {BUILDINGS.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedId(b.id)}
              className={`w-full group relative flex items-center gap-4 p-4 rounded-xl transition-all border-2 ${
                selectedId === b.id 
                  ? 'bg-[#F4CE14] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1' 
                  : 'bg-white border-gray-100 hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-colors border-2 ${
                selectedId === b.id ? 'bg-black text-[#F4CE14] border-black' : 'bg-gray-100 text-gray-600 border-transparent group-hover:bg-black group-hover:text-white'
              }`}>
                {b.id}
              </div>
              <div className="text-left overflow-hidden">
                <div className="text-sm font-black text-black truncate">{b.name}</div>
                <div className={`text-[10px] font-bold uppercase tracking-wider ${selectedId === b.id ? 'text-black opacity-60' : 'text-gray-400'}`}>
                  {b.dept}
                </div>
              </div>
              {selectedId === b.id && <ChevronRight className="ml-auto w-4 h-4 text-black" />}
            </button>
          ))}
        </div>
      </aside>

      {/* ---------------- MAIN CANVAS ---------------- */}
      <main 
        className="flex-1 relative overflow-hidden cursor-move active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        
        {/* SVG ISOMETRIC VIEWPORT */}
        <div className="absolute inset-0 flex items-center justify-center">
           <svg 
             viewBox="-500 -400 1000 800" 
             className="w-full h-full"
             style={{ background: `radial-gradient(circle at center, #F5F5F0 0%, #E2E2DB 100%)` }}
           >
              <defs>
                <pattern id="isoGrid" width="95.26" height="55" patternUnits="userSpaceOnUse">
                   <path d="M 47.63 0 L 95.26 27.5 L 47.63 55 L 0 27.5 Z" fill="none" stroke={THEME.colors.grid} strokeWidth="1" />
                </pattern>
              </defs>
              
              <g transform={`translate(${view.x}, ${view.y}) scale(${view.scale})`}>
                <rect x="-4000" y="-4000" width="8000" height="8000" fill="url(#isoGrid)" />
                
                <g transform="translate(0, -100)">
                  <Environment />
                  
                  {/* Sorted Buildings */}
                  {sortedBuildings.map(b => (
                     <BuildingBlock 
                       key={b.id} 
                       data={b} 
                       isSelected={selectedId === b.id} 
                       onClick={() => setSelectedId(b.id)} 
                     />
                  ))}
                </g>
              </g>
           </svg>
        </div>

        {/* ---------------- TOP RIGHT INFO CARD ---------------- */}
        <AnimatePresence>
          {selectedBuilding && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="absolute top-10 right-10 w-[380px] bg-white border-2 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden z-30"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-lg font-black text-[#F4CE14]">
                      {selectedBuilding.id}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-black leading-tight">{selectedBuilding.name}</h2>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{selectedBuilding.dept}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedId(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>
                
                <p className="text-sm text-gray-700 leading-relaxed font-medium mb-8">
                  {selectedBuilding.desc}
                </p>
                
                <button className="w-full bg-black text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-[#F4CE14] hover:text-black transition-all group">
                  <Navigation className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span>NAVIGATE TO BUILDING</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---------------- FLOATING CONTROLS ---------------- */}
        <div className="absolute bottom-10 right-10 flex flex-col gap-4">
           <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden">
              <button 
                onClick={() => setView(v => ({ ...v, scale: Math.min(v.scale + 0.2, 2.5) }))}
                className="p-4 hover:bg-[#F4CE14] transition-colors border-b-2 border-black"
              >
                <Plus size={24} />
              </button>
              <button 
                onClick={() => setView(v => ({ ...v, scale: Math.max(v.scale - 0.2, 0.4) }))}
                className="p-4 hover:bg-[#F4CE14] transition-colors"
              >
                <Minus size={24} />
              </button>
           </div>
           <button 
             onClick={() => setView({ x: 0, y: 0, scale: 0.9 })}
             className="bg-white border-2 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#F4CE14] transition-all active:translate-y-1 active:shadow-none"
           >
              <Maximize size={24} />
           </button>
        </div>

      </main>
    </div>
  );
};

export default CampusMapRefactored;
