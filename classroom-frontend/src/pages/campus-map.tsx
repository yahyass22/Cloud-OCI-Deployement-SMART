import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Navigation, X, Plus, Minus, Maximize, Search, ChevronRight, 
  Keyboard, Info, Filter, MapPin, Users
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { 
  THEME, BUILDINGS, VIEWPORT_LIMITS, CATEGORIES, 
  BuildingData, ViewportState,
} from '@/constants/campus';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Get category key from label
const getCategoryKey = (label: string): keyof typeof CATEGORIES => {
  return label.replace(' ', '') as keyof typeof CATEGORIES;
};

// ============================================================================
// MATH & PROJECTION - MATCHING REFERENCE IMAGE
// ============================================================================

const toScreen = (x: number, y: number, z: number = 0) => {
  const angleRad = (THEME.isoAngle * Math.PI) / 180;
  const screenX = (x - y) * Math.cos(angleRad) * THEME.gridSize;
  const screenY = ((x + y) * Math.sin(angleRad) - z) * THEME.gridSize;
  return { x: screenX, y: screenY };
};

const getBuildingPoints = (x: number, y: number, w: number, d: number, h: number) => {
  return {
    ground: {
      front: toScreen(x, y, 0),
      right: toScreen(x + w, y, 0),
      back: toScreen(x + w, y + d, 0),
      left: toScreen(x, y + d, 0),
    },
    top: {
      front: toScreen(x, y, h),
      right: toScreen(x + w, y, h),
      back: toScreen(x + w, y + d, h),
      left: toScreen(x, y + d, h),
    },
  };
};

// ============================================================================
// UTILITY COMPONENTS - MATCHING REFERENCE STYLE
// ============================================================================

const ScaleBar = ({ scale }: { scale: number }) => {
  const barLength = 100 * scale;
  
  return (
    <div className="absolute bottom-6 left-6 bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 z-20">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div 
            className="h-3 bg-black rounded-full"
            style={{ width: Math.max(60, Math.min(150, barLength)) }}
          />
          <div className="absolute left-0 top-0 w-0.5 h-3 bg-black" />
          <div className="absolute right-0 top-0 w-0.5 h-3 bg-black" />
        </div>
        <span className="text-xs font-black uppercase tracking-wider">100M</span>
      </div>
    </div>
  );
};

const MiniMap = ({ 
  view, 
  onViewChange 
}: { 
  view: ViewportState; 
  onViewChange: (view: ViewportState) => void;
}) => {
  const miniMapRef = useRef<SVGSVGElement>(null);
  
  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!miniMapRef.current) return;
    const rect = miniMapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const scale = 2;
    onViewChange({
      ...view,
      x: -x * scale,
      y: -y * scale,
    });
  };
  
  return (
    <div className="absolute top-6 right-6 z-20">
      <div className="bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3">
        <svg
          ref={miniMapRef}
          viewBox="-150 -150 300 300"
          className="w-40 h-40 cursor-pointer"
          onClick={handleClick}
          role="img"
          aria-label="Mini-map overview. Click to navigate."
        >
          <rect x="-150" y="-150" width="300" height="300" fill="white" rx="8" />
          
          {/* Category zones */}
          <rect x="-100" y="-100" width="80" height="80" fill={CATEGORIES.Sciences.color} opacity="0.2" rx="4" />
          <rect x="20" y="-100" width="80" height="80" fill={CATEGORIES.Engineering.color} opacity="0.2" rx="4" />
          <rect x="-100" y="20" width="80" height="80" fill={CATEGORIES.Arts.color} opacity="0.2" rx="4" />
          <rect x="20" y="20" width="80" height="80" fill={CATEGORIES.Professional.color} opacity="0.2" rx="4" />
          
          {/* Building dots */}
          {BUILDINGS.map(b => {
            const categoryColor = CATEGORIES[b.category].color;
            const mapX = (b.x - b.y) * 8;
            const mapY = (b.x + b.y) * 4;
            return (
              <rect
                key={b.id}
                x={mapX - 3}
                y={mapY - 3}
                width={6}
                height={6}
                fill={categoryColor}
                opacity="0.6"
              />
            );
          })}
          
          {/* Viewport */}
          <rect
            x={-view.x / 3 - 60 / view.scale}
            y={-view.y / 3 - 45 / view.scale}
            width={120 / view.scale}
            height={90 / view.scale}
            fill="none"
            stroke={THEME.colors.accent}
            strokeWidth="2"
            strokeDasharray="4,2"
            rx="2"
          />
          
          <circle cx="0" cy="0" r="4" fill={THEME.colors.accent} />
        </svg>
      </div>
    </div>
  );
};

const CompassWidget = () => (
  <div className="absolute bottom-6 right-6 z-20">
    <div className="bg-white border-2 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 40 40" className="w-12 h-12">
            <polygon points="20,5 23,18 20,22 17,18" fill="#E63946" />
            <polygon points="20,35 23,22 20,18 17,22" fill="#457B9D" />
            <polygon points="35,20 22,23 18,20 22,17" fill="#457B9D" />
            <polygon points="5,20 18,23 22,20 18,17" fill="#457B9D" />
            <circle cx="20" cy="20" r="3" fill="#2D2D2D" />
          </svg>
        </div>
        <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] font-black text-[#E63946]">N</span>
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-black text-gray-500">S</span>
        <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[9px] font-black text-gray-500">W</span>
        <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] font-black text-gray-500">E</span>
      </div>
    </div>
  </div>
);

// ============================================================================
// BUILDING COMPONENT - MATCHING REFERENCE STYLE
// ============================================================================

const BuildingBlock = ({ 
  data, 
  isSelected, 
  onClick,
  tabIndex 
}: { 
  data: BuildingData; 
  isSelected: boolean; 
  onClick: () => void;
  tabIndex: number;
}) => {
  const { x, y, w, d, h } = data;
  const categoryColor = CATEGORIES[data.category].color;

  const points = getBuildingPoints(x, y, w, d, h);
  const { ground, top } = points;

  const renderVolume = () => {
    return (
      <g>
        {/* Left face - colored, semi-transparent */}
        <path
          d={`M${ground.left.x},${ground.left.y} L${top.left.x},${top.left.y} L${top.front.x},${top.front.y} L${ground.front.x},${ground.front.y} Z`}
          fill={categoryColor}
          opacity="0.6"
        />
        {/* Right face - colored, semi-transparent */}
        <path
          d={`M${ground.front.x},${ground.front.y} L${top.front.x},${top.front.y} L${top.right.x},${top.right.y} L${ground.right.x},${ground.right.y} Z`}
          fill={categoryColor}
          opacity="0.8"
        />
        {/* Top face - WHITE */}
        <path
          d={`M${top.front.x},${top.front.y} L${top.right.x},${top.right.y} L${top.back.x},${top.back.y} L${top.left.x},${top.left.y} Z`}
          fill={THEME.colors.building.top}
        />
      </g>
    );
  };

  const markerPos = toScreen(x + w/2, y + d/2, h + 1.5);

  return (
    <motion.g
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="cursor-pointer outline-none"
      tabIndex={tabIndex}
      role="button"
      aria-label={`${data.name}, ${data.category}. Press Enter or Space to select.`}
      aria-pressed={isSelected}
      whileHover={{ scale: 1.02 }}
      animate={isSelected ? { scale: 1.05, y: -5 } : { scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      {/* Ground shadow */}
      <path
        d={`M${ground.front.x},${ground.front.y + 10} L${ground.right.x + 10},${ground.right.y + 10} L${ground.back.x + 10},${ground.back.y + 10} L${ground.left.x + 10},${ground.left.y + 10} Z`}
        fill={THEME.colors.building.shadow}
      />

      {/* 3D Building */}
      {renderVolume()}

      {/* Selection highlight */}
      {isSelected && (
        <ellipse
          cx={markerPos.x}
          cy={markerPos.y + 12}
          rx="20"
          ry="10"
          fill="none"
          stroke={THEME.colors.accent}
          strokeWidth="2"
          strokeDasharray="4,2"
          opacity="0.6"
        />
      )}

      {/* Yellow speech bubble marker */}
      <g transform={`translate(${markerPos.x}, ${markerPos.y})`}>
        <motion.g
          initial={false}
          animate={isSelected ? { scale: 1.2, y: -5 } : { scale: 1, y: 0 }}
        >
          <path
            d="M-12,-25 L12,-25 L12,-12 L3,-12 L0,-6 L-3,-12 L-12,-12 Z"
            fill={THEME.colors.accent}
          />
          <text
            x="0"
            y="-14"
            textAnchor="middle"
            fontSize="10"
            fontWeight="900"
            fill="#000"
          >
            {data.id}
          </text>
        </motion.g>
      </g>
    </motion.g>
  );
};

// ============================================================================
// ENVIRONMENT - MATCHING REFERENCE STYLE
// ============================================================================

const Environment = React.memo(() => {
  const road = (pts: {x: number, y: number}[], w: number = 14) => {
    const d = pts.map((p, i) => `${i===0?'M':'L'}${toScreen(p.x, p.y).x},${toScreen(p.x, p.y).y}`).join(' ');
    return (
      <g>
        <path d={d} stroke={THEME.colors.road} strokeWidth={w} fill="none" strokeLinecap="round" />
        <path d={d} stroke={THEME.colors.roadMarking} strokeWidth="2" strokeDasharray="6,8" fill="none" opacity="0.8" />
      </g>
    );
  };

  return (
    <g className="pointer-events-none">
      {/* Grid roads */}
      {road([{x:-10, y:-10}, {x:20, y:20}])}
      {road([{x:-10, y:15}, {x:20, y:-15}])}
      {road([{x:-5, y:-15}, {x:-5, y:20}])}
      {road([{x:15, y:-15}, {x:15, y:20}])}

      {/* Helipad */}
      <g transform={`translate(${toScreen(-8, 25).x}, ${toScreen(-8, 25).y})`}>
        <ellipse
          cx="0"
          cy="0"
          rx="25"
          ry="12"
          fill="white"
          stroke={THEME.colors.helipad}
          strokeWidth="3"
        />
      </g>

      {/* Small trees */}
      {[
        {x: -12, y: -8}, {x: -12, y: 5}, {x: -12, y: 18},
        {x: 18, y: -8}, {x: 18, y: 5}, {x: 18, y: 18},
        {x: -3, y: -18}, {x: 8, y: -18},
        {x: -3, y: 23}, {x: 8, y: 23},
        {x: -15, y: 0}, {x: 23, y: 0},
      ].map((t, i) => {
        const p = toScreen(t.x, t.y);
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3"
            fill={THEME.colors.tree}
            opacity="0.6"
          />
        );
      })}
    </g>
  );
});

Environment.displayName = 'Environment';

// ============================================================================
// INFO CARD COMPONENT
// ============================================================================

const InfoCard = ({ 
  building, 
  onClose 
}: { 
  building: BuildingData; 
  onClose: () => void;
}) => {
  const categoryColor = CATEGORIES[building.category].color;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="absolute top-6 right-80 w-96 bg-white border-2 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden z-30"
      role="dialog"
      aria-label={`${building.name} information`}
      aria-modal="true"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-3 items-center">
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: categoryColor }}
            >
              🏢
            </div>
            <div>
              <h2 className="text-xl font-black text-black leading-tight">{building.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="text-[10px] font-bold uppercase" style={{ backgroundColor: categoryColor, color: 'white' }}>
                  {building.category.replace('Sciences', 'Sci').replace('Engineering', 'Eng').replace('Humanities', 'Hum').replace('Professional', 'Prof')}
                </Badge>
                <span className="text-xs font-mono text-gray-500">{building.code}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close building information"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          {building.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {building.rooms && (
            <div className="bg-gray-50 rounded-lg p-2 text-center border border-gray-200">
              <MapPin className="w-3 h-3 mx-auto mb-1 text-gray-500" />
              <div className="text-sm font-black">{building.rooms}</div>
              <div className="text-[8px] uppercase font-bold text-gray-500">Rooms</div>
            </div>
          )}
          {building.capacity && (
            <div className="bg-gray-50 rounded-lg p-2 text-center border border-gray-200">
              <Users className="w-3 h-3 mx-auto mb-1 text-gray-500" />
              <div className="text-sm font-black">{building.capacity.toLocaleString()}</div>
              <div className="text-[8px] uppercase font-bold text-gray-500">Capacity</div>
            </div>
          )}
          <div className="bg-gray-50 rounded-lg p-2 text-center border border-gray-200">
            <Info className="w-3 h-3 mx-auto mb-1 text-gray-500" />
            <div className="text-sm font-black">{building.type}</div>
            <div className="text-[8px] uppercase font-bold text-gray-500">Type</div>
          </div>
        </div>

        {/* Departments */}
        {building.departments.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xs font-bold uppercase text-gray-500 mb-2 flex items-center gap-2">
              <Filter className="w-3 h-3" /> Departments
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {building.departments.map(dept => (
                <Badge key={dept} variant="secondary" className="text-[9px] font-semibold px-2 py-0.5">
                  {dept}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <Button className="flex-1 bg-black text-white font-bold py-2.5 rounded-xl hover:bg-gray-800 transition-all">
            <Navigation className="w-4 h-4 mr-2" />
            Get Directions
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

const CampusMap: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategories, setActiveCategories] = useState<keyof typeof CATEGORIES[]>(Object.keys(CATEGORIES) as keyof typeof CATEGORIES[]);
  const [view, setView] = useState<ViewportState>({
    x: 0,
    y: 200,
    scale: 0.75,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // URL Sync
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const buildingParam = params.get('building');
    const viewParam = params.get('view');
    
    if (buildingParam) {
      const id = parseInt(buildingParam, 10);
      if (!isNaN(id) && BUILDINGS.some(b => b.id === id)) {
        setSelectedId(id);
      }
    }
    
    if (viewParam) {
      try {
        const parsed = JSON.parse(viewParam) as ViewportState;
        setView(parsed);
      } catch {
        // Ignore invalid
      }
    }
  }, [location.search]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedId) params.set('building', selectedId.toString());
    params.set('view', JSON.stringify(view));
    navigate(`/campus-map?${params.toString()}`, { replace: true });
  }, [selectedId, view, navigate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedId(null);
        setShowKeyboardHelp(false);
        return;
      }
      
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setShowKeyboardHelp(prev => !prev);
        return;
      }

      if (document.activeElement?.tagName === 'INPUT') return;

      const PAN_SPEED = 80 / view.scale;
      
      switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          setView(v => ({ ...v, y: v.y + PAN_SPEED }));
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          setView(v => ({ ...v, y: v.y - PAN_SPEED }));
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          setView(v => ({ ...v, x: v.x + PAN_SPEED }));
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          setView(v => ({ ...v, x: v.x - PAN_SPEED }));
          break;
        case '+':
        case '=':
          e.preventDefault();
          setView(v => ({ ...v, scale: Math.min(v.scale + 0.2, VIEWPORT_LIMITS.ZOOM.max) }));
          break;
        case '-':
          e.preventDefault();
          setView(v => ({ ...v, scale: Math.max(v.scale - 0.2, VIEWPORT_LIMITS.ZOOM.min) }));
          break;
        case '0':
          e.preventDefault();
          setView({ x: 0, y: 200, scale: 0.75 });
          break;
        case '1':
          e.preventDefault();
          setView({ x: -200, y: 100, scale: 1.0 });
          break;
        case '2':
          e.preventDefault();
          setView({ x: 200, y: 300, scale: 1.0 });
          break;
        case '3':
          e.preventDefault();
          setView({ x: 0, y: 200, scale: 1.2 });
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view.scale]);

  // Filter buildings
  const filteredBuildings = useMemo(() => {
    return BUILDINGS.filter(b => {
      const matchesSearch = !searchQuery || 
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.departments.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = activeCategories.includes(b.category);
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategories]);

  const sortedBuildings = useMemo(() => {
    return [...filteredBuildings].sort((a, b) => 
      (a.x + a.w + a.y + a.d) - (b.x + b.w + b.y + b.d)
    );
  }, [filteredBuildings]);

  const selectedBuilding = useMemo(() => 
    BUILDINGS.find(b => b.id === selectedId), 
    [selectedId]
  );

  // Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX - view.x, y: e.clientY - view.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - startPos.x;
    const newY = e.clientY - startPos.y;
    setView(v => ({
      ...v,
      x: Math.max(VIEWPORT_LIMITS.PAN.minX, Math.min(VIEWPORT_LIMITS.PAN.maxX, newX)),
      y: Math.max(VIEWPORT_LIMITS.PAN.minY, Math.min(VIEWPORT_LIMITS.PAN.maxY, newY)),
    }));
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleZoomIn = () => setView(v => ({ ...v, scale: Math.min(v.scale + 0.2, VIEWPORT_LIMITS.ZOOM.max) }));
  const handleZoomOut = () => setView(v => ({ ...v, scale: Math.max(v.scale - 0.2, VIEWPORT_LIMITS.ZOOM.min) }));
  const handleResetView = () => setView({ x: 0, y: 200, scale: 0.75 });
  
  const handleCategoryToggle = (category: keyof typeof CATEGORIES) => {
    setActiveCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="flex w-full h-screen bg-[#F0F0F0] overflow-hidden" role="application" aria-label="Campus Map">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-72 bg-white border-r border-[#D1D1CA] flex flex-col z-20 shadow-sm">
        {/* Header */}
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#F4CE14] rounded-lg flex items-center justify-center border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-lg font-black text-black">U</span>
            </div>
            <div>
              <h1 className="text-base font-black text-black leading-none">Campus Map</h1>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">{BUILDINGS.length} Buildings</p>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              className="w-full bg-white border-2 border-black rounded-lg py-2.5 pl-10 pr-4 text-sm font-bold placeholder:text-gray-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-2 focus:ring-[#F4CE14]"
              placeholder="Search buildings..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search buildings"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-3 h-3 text-gray-500" />
            <span className="text-xs font-bold uppercase text-gray-500">Filters</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(CATEGORIES) as Array<keyof typeof CATEGORIES>).map(cat => (
              <Badge
                key={cat}
                variant={activeCategories.includes(cat) ? 'default' : 'outline'}
                className={cn(
                  "text-[9px] font-bold cursor-pointer transition-all px-2 py-1",
                  activeCategories.includes(cat) 
                    ? "text-white" 
                    : "bg-white text-gray-500 hover:bg-gray-100"
                )}
                style={activeCategories.includes(cat) ? { backgroundColor: CATEGORIES[cat].color } : {}}
                onClick={() => handleCategoryToggle(cat)}
                role="checkbox"
                aria-checked={activeCategories.includes(cat)}
                tabIndex={0}
              >
                {cat.replace('Sciences', 'Sci').replace('Engineering', 'Eng').replace('Humanities', 'Hum').replace('Professional', 'Prof').replace('Social', 'Soc')}
              </Badge>
            ))}
          </div>
        </div>

        {/* Building List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredBuildings.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="text-center py-8 text-gray-400 text-sm">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No buildings found</p>
              </CardContent>
            </Card>
          ) : (
            filteredBuildings.map((b) => (
              <Card
                key={b.id}
                className={cn(
                  "cursor-pointer transition-all border-2 hover:shadow-md",
                  selectedId === b.id
                    ? 'border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                    : 'border-gray-200 hover:border-gray-300'
                )}
                style={selectedId === b.id ? { backgroundColor: `${CATEGORIES[b.category].color}20` } : {}}
                onClick={() => setSelectedId(b.id)}
                role="listitem"
                aria-selected={selectedId === b.id}
                tabIndex={0}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black text-white shrink-0"
                      style={{ backgroundColor: CATEGORIES[b.category].color }}
                    >
                      {b.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-black truncate">{b.name}</div>
                      <div className="text-[10px] text-gray-500 truncate">
                        {b.departments.join(', ') || b.category}
                      </div>
                    </div>
                    {selectedId === b.id && (
                      <ChevronRight className="w-4 h-4 text-black shrink-0" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Keyboard Help */}
        <div className="p-3 border-t border-gray-200">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs font-bold"
            onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
          >
            <Keyboard className="w-3 h-3 mr-2" />
            Shortcuts
          </Button>
        </div>
      </aside>

      {/* MAIN CANVAS */}
      <main
        className="flex-1 relative overflow-hidden cursor-move active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={(e) => {
          e.preventDefault();
          const scaleFactor = 0.002;
          const newScale = Math.min(
            Math.max(VIEWPORT_LIMITS.ZOOM.min, view.scale - e.deltaY * scaleFactor),
            VIEWPORT_LIMITS.ZOOM.max
          );
          setView(v => ({ ...v, scale: newScale }));
        }}
        onClick={() => setSelectedId(null)}
        role="region"
        aria-label="Interactive campus map"
      >
        {/* SVG VIEWPORT */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            viewBox="-700 -600 1400 1200"
            className="w-full h-full"
            style={{ background: `radial-gradient(circle at center, #F0F0F0 0%, #E8E8E8 100%)` }}
          >
            <defs>
              <pattern id="isoGrid" width="69.28" height="40" patternUnits="userSpaceOnUse">
                <path d="M 34.64 0 L 69.28 20 L 34.64 40 L 0 20 Z" fill="none" stroke={THEME.colors.grid} strokeWidth="0.5" />
              </pattern>
            </defs>

            <g transform={`translate(${view.x}, ${view.y}) scale(${view.scale})`}>
              <rect x="-5000" y="-5000" width="10000" height="10000" fill="url(#isoGrid)" />
              <Environment />
              
              {sortedBuildings.map((b) => (
                <BuildingBlock
                  key={b.id}
                  data={b}
                  isSelected={selectedId === b.id}
                  onClick={() => setSelectedId(b.id)}
                  tabIndex={0}
                />
              ))}
            </g>
          </svg>
        </div>

        {/* INFO CARD */}
        <AnimatePresence>
          {selectedBuilding && (
            <InfoCard 
              building={selectedBuilding} 
              onClose={() => setSelectedId(null)}
            />
          )}
        </AnimatePresence>

        {/* CONTROLS */}
        <div className="absolute bottom-6 left-32 flex flex-col gap-2 z-20">
          <div className="bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden">
            <button onClick={handleZoomIn} className="p-3 hover:bg-[#F4CE14] transition-colors border-b-2 border-black" aria-label="Zoom in">
              <Plus size={20} />
            </button>
            <button onClick={handleZoomOut} className="p-3 hover:bg-[#F4CE14] transition-colors" aria-label="Zoom out">
              <Minus size={20} />
            </button>
          </div>
          <button
            onClick={handleResetView}
            className="bg-white border-2 border-black p-3 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#F4CE14] transition-all"
            aria-label="Reset view"
          >
            <Maximize size={20} />
          </button>
        </div>

        {/* WIDGETS */}
        <ScaleBar scale={view.scale} />
        <MiniMap view={view} onViewChange={setView} />
        <CompassWidget />

        {/* KEYBOARD HELP MODAL */}
        <AnimatePresence>
          {showKeyboardHelp && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setShowKeyboardHelp(false)}
            >
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="bg-white border-2 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 max-w-lg"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-black">⌨️ Keyboard Shortcuts</h2>
                  <button onClick={() => setShowKeyboardHelp(false)} className="p-1 hover:bg-gray-100 rounded">
                    <X size={20} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h3 className="font-bold text-gray-700 mb-2">Navigation</h3>
                    <div className="space-y-1.5">
                      <div className="flex justify-between"><span className="font-semibold">Pan</span><span className="text-gray-600">WASD / Arrows</span></div>
                      <div className="flex justify-between"><span className="font-semibold">Zoom</span><span className="text-gray-600">+ / -</span></div>
                      <div className="flex justify-between"><span className="font-semibold">Reset</span><span className="text-gray-600">0</span></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-700 mb-2">Quick Views</h3>
                    <div className="space-y-1.5">
                      <div className="flex justify-between"><span className="font-semibold">Sciences</span><span className="text-gray-600">1</span></div>
                      <div className="flex justify-between"><span className="font-semibold">Engineering</span><span className="text-gray-600">2</span></div>
                      <div className="flex justify-between"><span className="font-semibold">Central</span><span className="text-gray-600">3</span></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-700 mb-2">Selection</h3>
                    <div className="space-y-1.5">
                      <div className="flex justify-between"><span className="font-semibold">Select</span><span className="text-gray-600">Enter</span></div>
                      <div className="flex justify-between"><span className="font-semibold">Close</span><span className="text-gray-600">Esc</span></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-700 mb-2">Other</h3>
                    <div className="space-y-1.5">
                      <div className="flex justify-between"><span className="font-semibold">Help</span><span className="text-gray-600">?</span></div>
                      <div className="flex justify-between"><span className="font-semibold">Search</span><span className="text-gray-600">Type in search</span></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SCREEN READER */}
        <div role="status" aria-live="polite" className="sr-only">
          {selectedId ? `Selected: ${selectedBuilding?.name}` : 'No building selected'}
          {filteredBuildings.length} buildings visible. Zoom: {Math.round(view.scale * 100)}%.
        </div>
      </main>
    </div>
  );
};

export default CampusMap;
