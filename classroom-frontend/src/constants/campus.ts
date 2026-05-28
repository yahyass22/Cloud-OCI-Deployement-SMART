/**
 * Campus Map Constants
 * Single source of truth for all campus map data
 * Based on actual departments from the backend schema
 */

// ============================================================================
// TYPES
// ============================================================================

export type BuildingType = 'academic' | 'science' | 'engineering' | 'arts' | 'sports' | 'admin' | 'library';
export type DepartmentCategory = 'Sciences' | 'Engineering' | 'Humanities' | 'Arts' | 'SocialSciences' | 'Professional' | 'Athletics';

export interface BuildingData {
  id: number;
  name: string;
  code: string;
  description: string;
  type: BuildingType;
  x: number;
  y: number;
  w: number;
  d: number;
  h: number;
  category: DepartmentCategory;
  departments: string[]; // List of actual departments housed here
  rooms?: number;
  capacity?: number;
}

export interface ViewportState {
  x: number;
  y: number;
  scale: number;
}

// ============================================================================
// THEME
// ============================================================================

export const THEME = {
  colors: {
    bg: '#F0F0F0',
    grid: '#E8E8E8',
    building: {
      top: '#FFFFFF',
      shadow: 'rgba(0, 0, 0, 0.08)',
    },
    accent: '#F4CE14',
    text: '#000000',
    textMuted: '#666666',
    road: '#2D2D2D',
    roadMarking: '#FFD700',
    tree: '#8FB88A',
    helipad: '#E63946',
    // Category colors - matching reference
    categories: {
      Sciences: '#A8DADC',
      Engineering: '#457B9D',
      Humanities: '#A8B8A0',
      Arts: '#9D4EDD',
      SocialSciences: '#F4A261',
      Professional: '#6C757D',
      Athletics: '#E63946',
    }
  },
  isoAngle: 30,
  gridSize: 40,
} as const;

// ============================================================================
// VIEWPORT LIMITS
// ============================================================================

export const VIEWPORT_LIMITS = {
  PAN: {
    minX: -1000,
    maxX: 1000,
    minY: -1000,
    maxY: 1000,
  },
  ZOOM: {
    min: 0.3,
    max: 3.0,
    default: 0.7,
  },
  INITIAL: {
    x: 0,
    y: 150,
    scale: 0.7,
  },
} as const;

// ============================================================================
// DEPARTMENT CATEGORIES
// ============================================================================

export const CATEGORIES = {
  Sciences: { label: 'Sciences', color: '#219ebc', description: 'Natural & Physical Sciences' },
  Engineering: { label: 'Engineering', color: '#457b9d', description: 'Engineering & Technology' },
  Humanities: { label: 'Humanities', color: '#a8b8a0', description: 'Literature, Languages, History' },
  Arts: { label: 'Arts', color: '#bc6c25', description: 'Fine Arts & Music' },
  SocialSciences: { label: 'Social Sciences', color: '#9d4edd', description: 'Psychology, Sociology, Economics' },
  Professional: { label: 'Professional', color: '#2d3748', description: 'Business, Law, Education' },
  Athletics: { label: 'Athletics', color: '#e63946', description: 'Sports & Physical Education' },
} as const;

export type DepartmentCategoryKey = keyof typeof CATEGORIES;

// ============================================================================
// BUILDING DATA - Organized Campus Layout
// ============================================================================

export const BUILDINGS: readonly BuildingData[] = [
  // ==================== SCIENCES QUADRANT (North-East) ====================
  {
    id: 1,
    name: "Physics Building",
    code: "PHY",
    description: "Home to the Department of Physics with advanced laboratories for quantum mechanics, thermodynamics, and astrophysics research.",
    type: 'science',
    x: 8, y: -8, w: 4, d: 3, h: 3,
    category: 'Sciences',
    departments: ['Physics'],
    rooms: 24,
    capacity: 800,
  },
  {
    id: 2,
    name: "Chemistry Building",
    code: "CHE",
    description: "State-of-the-art chemistry laboratories and research facilities for analytical, organic, and biochemistry studies.",
    type: 'science',
    x: 14, y: -8, w: 4, d: 3, h: 3,
    category: 'Sciences',
    departments: ['Chemistry'],
    rooms: 20,
    capacity: 600,
  },
  {
    id: 3,
    name: "Biology Sciences Complex",
    code: "BIO",
    description: "Comprehensive biology facilities including genetics, ecology, neuroscience, and molecular biology laboratories.",
    type: 'science',
    x: 11, y: -3, w: 5, d: 4, h: 2.5,
    category: 'Sciences',
    departments: ['Biology'],
    rooms: 28,
    capacity: 900,
  },
  {
    id: 4,
    name: "Mathematics Tower",
    code: "MAT",
    description: "Tall academic building housing pure mathematics, applied math, statistics, and mathematics education departments.",
    type: 'academic',
    x: 8, y: -2, w: 3, d: 3, h: 6,
    category: 'Sciences',
    departments: ['Mathematics'],
    rooms: 32,
    capacity: 1000,
  },

  // ==================== ENGINEERING QUADRANT (South-East) ====================
  {
    id: 5,
    name: "Engineering Hall",
    code: "ENG",
    description: "Main engineering building with workshops, CAD labs, and project spaces for mechanical and electrical engineering programs.",
    type: 'engineering',
    x: 10, y: 6, w: 6, d: 4, h: 3,
    category: 'Engineering',
    departments: ['Engineering'],
    rooms: 36,
    capacity: 1200,
  },
  {
    id: 6,
    name: "Computer Science Building",
    code: "CSC",
    description: "Modern technology hub featuring AI labs, cybersecurity center, software development studios, and data science facilities.",
    type: 'engineering',
    x: 6, y: 8, w: 4, d: 4, h: 4,
    category: 'Engineering',
    departments: ['Computer Science'],
    rooms: 30,
    capacity: 1000,
  },

  // ==================== HUMANITIES QUADRANT (North-West) ====================
  {
    id: 7,
    name: "English & Literature Building",
    code: "ENG",
    description: "Home to English literature, creative writing, rhetoric, and composition programs with writing centers and literature archives.",
    type: 'academic',
    x: -8, y: -8, w: 4, d: 3, h: 2.5,
    category: 'Humanities',
    departments: ['English'],
    rooms: 22,
    capacity: 700,
  },
  {
    id: 8,
    name: "History & Philosophy Hall",
    code: "HIS",
    description: "Classical architecture housing history archives, philosophy departments, and seminar rooms for humanities discourse.",
    type: 'academic',
    x: -13, y: -8, w: 4, d: 3, h: 2.5,
    category: 'Humanities',
    departments: ['History', 'Philosophy'],
    rooms: 26,
    capacity: 800,
  },
  {
    id: 9,
    name: "Languages Center",
    code: "LAN",
    description: "Modern language labs and translation centers for world languages, linguistics, and international studies.",
    type: 'academic',
    x: -10, y: -3, w: 4, d: 3, h: 3,
    category: 'Humanities',
    departments: ['Geography'],
    rooms: 20,
    capacity: 600,
  },

  // ==================== ARTS QUADRANT (South-West) ====================
  {
    id: 10,
    name: "Fine Arts Center",
    code: "ART",
    description: "Creative studios for painting, sculpture, digital arts, and design with gallery spaces for student exhibitions.",
    type: 'arts',
    x: -8, y: 6, w: 5, d: 4, h: 2,
    category: 'Arts',
    departments: ['Fine Arts'],
    rooms: 18,
    capacity: 500,
  },
  {
    id: 11,
    name: "Music & Performing Arts",
    code: "MUS",
    description: "Performance halls, practice rooms, recording studios, and music theory classrooms for music education programs.",
    type: 'arts',
    x: -13, y: 8, w: 4, d: 4, h: 2.5,
    category: 'Arts',
    departments: ['Music'],
    rooms: 24,
    capacity: 600,
  },

  // ==================== SOCIAL SCIENCES (Central-West) ====================
  {
    id: 12,
    name: "Psychology Building",
    code: "PSY",
    description: "Behavioral sciences facility with research labs, counseling training rooms, and cognitive studies centers.",
    type: 'academic',
    x: -6, y: 2, w: 4, d: 3, h: 3,
    category: 'SocialSciences',
    departments: ['Psychology'],
    rooms: 22,
    capacity: 700,
  },
  {
    id: 13,
    name: "Economics & Sociology Hall",
    code: "ECO",
    description: "Social sciences research center with economics labs, sociology study rooms, and policy analysis facilities.",
    type: 'academic',
    x: -11, y: 3, w: 4, d: 3, h: 3,
    category: 'SocialSciences',
    departments: ['Economics', 'Sociology'],
    rooms: 24,
    capacity: 750,
  },
  {
    id: 14,
    name: "Political Science Center",
    code: "POL",
    description: "Dedicated to political science, international relations, and public policy studies with debate halls.",
    type: 'academic',
    x: -8, y: -2, w: 3, d: 3, h: 3,
    category: 'SocialSciences',
    departments: ['Political Science'],
    rooms: 18,
    capacity: 550,
  },

  // ==================== PROFESSIONAL SCHOOLS (Central-South) ====================
  {
    id: 15,
    name: "Business School",
    code: "BUS",
    description: "Premier business education facility with trading rooms, case study halls, entrepreneurship incubator, and MBA programs.",
    type: 'admin',
    x: 0, y: 10, w: 5, d: 4, h: 5,
    category: 'Professional',
    departments: ['Business Administration'],
    rooms: 40,
    capacity: 1500,
  },
  {
    id: 16,
    name: "Law School",
    code: "LAW",
    description: "Professional law school with moot court, legal research library, and clinical practice facilities.",
    type: 'admin',
    x: 5, y: 12, w: 4, d: 3, h: 4,
    category: 'Professional',
    departments: ['Law'],
    rooms: 28,
    capacity: 900,
  },
  {
    id: 17,
    name: "Education Building",
    code: "EDU",
    description: "Teacher training facility with model classrooms, education technology labs, and practicum coordination offices.",
    type: 'academic',
    x: -3, y: 12, w: 4, d: 3, h: 3,
    category: 'Professional',
    departments: ['Education'],
    rooms: 26,
    capacity: 800,
  },

  // ==================== CENTRAL CAMPUS (Core) ====================
  {
    id: 18,
    name: "Main Library",
    code: "LIB",
    description: "Central academic library with extensive collections, study spaces, research assistance, and digital resources center.",
    type: 'admin',
    x: 0, y: 0, w: 6, d: 5, h: 2,
    category: 'Professional',
    departments: [],
    rooms: 50,
    capacity: 2000,
  },
  {
    id: 19,
    name: "Administration Building",
    code: "ADM",
    description: "Main administrative offices including registrar, student services, financial aid, and university leadership.",
    type: 'admin',
    x: 0, y: -5, w: 4, d: 3, h: 4,
    category: 'Professional',
    departments: [],
    rooms: 35,
    capacity: 400,
  },

  // ==================== ATHLETICS (Far South) ====================
  {
    id: 20,
    name: "Sports Complex",
    code: "SPT",
    description: "Comprehensive athletics facility with gymnasium, fitness center, swimming pool, and sports medicine clinic.",
    type: 'sports',
    x: 0, y: 18, w: 8, d: 6, h: 1.5,
    category: 'Athletics',
    departments: ['Physical Education'],
    rooms: 15,
    capacity: 3000,
  },
];

// ============================================================================
// DERIVED DATA & HELPERS
// ============================================================================

export const BUILDING_TYPES_INFO: Record<BuildingType, { label: string; description: string }> = {
  academic: { label: 'Academic', description: 'Teaching and research facilities' },
  science: { label: 'Science', description: 'Laboratories and research centers' },
  engineering: { label: 'Engineering', description: 'Workshops and technical labs' },
  arts: { label: 'Arts', description: 'Creative and performance spaces' },
  sports: { label: 'Sports', description: 'Athletics and recreation' },
  admin: { label: 'Administration', description: 'Administrative and support services' },
  library: { label: 'Library', description: 'Library and information services' },
} as const;

export const getBuildingById = (id: number): BuildingData | undefined => {
  return BUILDINGS.find(b => b.id === id);
};

export const getBuildingsByCategory = (category: DepartmentCategory): BuildingData[] => {
  return BUILDINGS.filter(b => b.category === category);
};

export const getDepartmentsList = (): string[] => {
  const allDeps = BUILDINGS.flatMap(b => b.departments);
  return [...new Set(allDeps)].sort();
};

export const searchBuildings = (query: string): BuildingData[] => {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return [];
  
  return BUILDINGS.filter(b => 
    b.name.toLowerCase().includes(normalizedQuery) ||
    b.code.toLowerCase().includes(normalizedQuery) ||
    b.description.toLowerCase().includes(normalizedQuery) ||
    b.departments.some(d => d.toLowerCase().includes(normalizedQuery)) ||
    b.category.toLowerCase().includes(normalizedQuery)
  );
};

export const getBuildingIcon = (type: BuildingType): string => {
  const icons: Record<BuildingType, string> = {
    academic: '📚',
    science: '🔬',
    engineering: '⚙️',
    arts: '🎨',
    sports: '⚽',
    admin: '🏛️',
    library: '📖',
  };
  return icons[type];
};
