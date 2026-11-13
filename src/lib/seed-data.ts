import bcrypt from "bcryptjs";

export const DEMO_PASSWORD = "CivicPulse2026!";
export const DEMO_PASSWORD_HASH = bcrypt.hashSync(DEMO_PASSWORD, 10);

export interface SeedUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "WORKER" | "CITIZEN";
  city: string;
  department?: string;
  passwordHash: string;
}

export interface SeedIssue {
  id: string;
  title: string;
  description: string;
  category: "POTHOLE" | "STREETLIGHT" | "GARBAGE" | "WATER_LEAK" | "DRAINAGE";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  imageUrl?: string;
  resolutionNote?: string;
  resolvedAt?: string;
  upvotes: number;
  citizenEmail: string;
  assignedWorkerEmail?: string;
  createdAt: string;
}

export const SEED_USERS: SeedUser[] = [
  {
    id: "usr_admin_01",
    name: "Suresh Kumar (Chief Admin)",
    email: "admin@civicpulse.in",
    role: "ADMIN",
    city: "Chennai",
    passwordHash: DEMO_PASSWORD_HASH,
  },
  {
    id: "usr_worker_01",
    name: "R. Murugan (Field Engineer)",
    email: "worker@civicpulse.in",
    role: "WORKER",
    city: "Chennai",
    department: "Roads & Electrical",
    passwordHash: DEMO_PASSWORD_HASH,
  },
  {
    id: "usr_citizen_01",
    name: "Ananya Ramachandran",
    email: "citizen@civicpulse.in",
    role: "CITIZEN",
    city: "Chennai",
    passwordHash: DEMO_PASSWORD_HASH,
  },
];

export const SEED_ISSUES: SeedIssue[] = [
  // 5 RESOLVED ISSUES
  {
    id: "iss_res_01",
    title: "Deep crater pothole on Velachery Main Road",
    description: "Dangerous 4-foot pothole near Vijayanagar bus terminus causing frequent two-wheeler skids during peak hours.",
    category: "POTHOLE",
    status: "RESOLVED",
    latitude: 12.9815,
    longitude: 80.2180,
    address: "Velachery Main Road, near Vijayanagar Bus Terminus",
    city: "Chennai",
    imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80",
    resolutionNote: "Road maintenance squad repaired 14 sqm area with dense bituminous macadam and vibratory roller compaction. High durability seal applied.",
    resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    upvotes: 42,
    citizenEmail: "citizen@civicpulse.in",
    assignedWorkerEmail: "worker@civicpulse.in",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "iss_res_02",
    title: "Defective high-mast streetlight at Marina Promenade",
    description: "High-mast lighting fixture completely dark between Light House and Vivekanandar Illam, reducing pedestrian safety at night.",
    category: "STREETLIGHT",
    status: "RESOLVED",
    latitude: 13.0544,
    longitude: 80.2825,
    address: "Marina Beach Road, Opp. Vivekanandar Illam",
    city: "Chennai",
    imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    resolutionNote: "Replaced faulty phase switchgear and upgraded 400W LED luminaire unit. Full luminescence and timer auto-cutoff verified.",
    resolvedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    upvotes: 28,
    citizenEmail: "citizen@civicpulse.in",
    assignedWorkerEmail: "worker@civicpulse.in",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "iss_res_03",
    title: "Overflowing commercial dumpster at Gandhipuram Cross Cut",
    description: "Large volume of retail packaging and vegetable refuse overflowing onto pedestrian footpath blocking market access.",
    category: "GARBAGE",
    status: "RESOLVED",
    latitude: 11.0168,
    longitude: 76.9558,
    address: "7th Cross Cut Road, Gandhipuram Market Area",
    city: "Coimbatore",
    imageUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80",
    resolutionNote: "Sanitation response vehicle evacuated 2.4 metric tons of commercial waste, disinfected pavement with bleaching powder, and placed two 1100L bins.",
    resolvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    upvotes: 35,
    citizenEmail: "citizen@civicpulse.in",
    assignedWorkerEmail: "worker@civicpulse.in",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "iss_res_04",
    title: "Drinking water pipeline rupture on DB Road",
    description: "Pressurized municipal drinking water gushing from underground pipe joint, flooding shop fronts and wasting treated water.",
    category: "WATER_LEAK",
    status: "RESOLVED",
    latitude: 11.0117,
    longitude: 76.9452,
    address: "Diwan Bahadur Road, RS Puram",
    city: "Coimbatore",
    imageUrl: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=600&q=80",
    resolutionNote: "Excavated line, isolated feeding valve, replaced fractured 200mm ductile iron flange connector, backfilled with gravel and restored supply.",
    resolvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    upvotes: 51,
    citizenEmail: "citizen@civicpulse.in",
    assignedWorkerEmail: "worker@civicpulse.in",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "iss_res_05",
    title: "Clogged stormwater channel at North Chithirai Street",
    description: "Silt and plastic waste blocking stone-lined conduit near temple boundary, causing backflow during sudden downpours.",
    category: "DRAINAGE",
    status: "RESOLVED",
    latitude: 9.9195,
    longitude: 78.1194,
    address: "North Chithirai Street, Outer Temple Ring",
    city: "Madurai",
    imageUrl: "https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=600&q=80",
    resolutionNote: "Deployed desilting super-sucker truck. Cleared 60 meters of subterranean canal. Runoff channel is now 100% free-flowing.",
    resolvedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    upvotes: 64,
    citizenEmail: "citizen@civicpulse.in",
    assignedWorkerEmail: "worker@civicpulse.in",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },

  // 4 IN_PROGRESS ISSUES
  {
    id: "iss_inp_01",
    title: "Dangerous asphalt crater near T. Nagar Panagal Park",
    description: "Sub-surface subsidence has created an uneven sinkhole right before the signal. Traffic is forced to swerve abruptly.",
    category: "POTHOLE",
    status: "IN_PROGRESS",
    latitude: 13.0418,
    longitude: 80.2341,
    address: "Usman Road approach, Panagal Park Junction",
    city: "Chennai",
    imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80",
    upvotes: 19,
    citizenEmail: "citizen@civicpulse.in",
    assignedWorkerEmail: "worker@civicpulse.in",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "iss_inp_02",
    title: "Continuous streetlight blackout in Saravanampatti tech hub",
    description: "12 consecutive poles unlit from Vilankurichi cutoff to tech park entrance. Dark stretches pose risk to night-shift employees.",
    category: "STREETLIGHT",
    status: "IN_PROGRESS",
    latitude: 11.0797,
    longitude: 76.9997,
    address: "Saravanampatti Main Road, near CHIL SEZ",
    city: "Coimbatore",
    imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    upvotes: 23,
    citizenEmail: "citizen@civicpulse.in",
    assignedWorkerEmail: "worker@civicpulse.in",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "iss_inp_03",
    title: "Stagnant wastewater pooling behind KK Nagar bus terminus",
    description: "Broken drainage outflow leaking stagnant greywater into roadside ditch, breeding mosquitoes and causing foul odor.",
    category: "DRAINAGE",
    status: "IN_PROGRESS",
    latitude: 9.9252,
    longitude: 78.1481,
    address: "80 Feet Road, Behind KK Nagar Bus Stand",
    city: "Madurai",
    imageUrl: "https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=600&q=80",
    upvotes: 15,
    citizenEmail: "citizen@civicpulse.in",
    assignedWorkerEmail: "worker@civicpulse.in",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "iss_inp_04",
    title: "Damaged distribution valve spraying water on Poonamallee High Road",
    description: "Underground supply valve cover broken by heavy vehicle; continuous water jet spraying onto roadway near Kilpauk Medical College.",
    category: "WATER_LEAK",
    status: "IN_PROGRESS",
    latitude: 13.0827,
    longitude: 80.2443,
    address: "Poonamallee High Road, near Kilpauk Medical College",
    city: "Chennai",
    imageUrl: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=600&q=80",
    upvotes: 38,
    citizenEmail: "citizen@civicpulse.in",
    assignedWorkerEmail: "worker@civicpulse.in",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },

  // 3 OPEN ISSUES (Unassigned)
  {
    id: "iss_opn_01",
    title: "Construction debris dumped along OMR Thoraipakkam service lane",
    description: "Truckloads of demolished concrete and rebars dumped overnight blocking the bicycle lane and bus bay.",
    category: "GARBAGE",
    status: "OPEN",
    latitude: 12.9348,
    longitude: 80.2312,
    address: "Old Mahabalipuram Road (OMR), Thoraipakkam Signal",
    city: "Chennai",
    imageUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80",
    upvotes: 11,
    citizenEmail: "citizen@civicpulse.in",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "iss_opn_02",
    title: "Severely unpaved utility trench on Avinashi Road near Peelamedu",
    description: "Cable trench left unpaved with sharp aggregate gravel exposed; heavy two-wheeler slip hazard opposite PSG Tech.",
    category: "POTHOLE",
    status: "OPEN",
    latitude: 11.0289,
    longitude: 77.0028,
    address: "Avinashi Road, Opposite PSG College of Technology",
    city: "Coimbatore",
    imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80",
    upvotes: 17,
    citizenEmail: "citizen@civicpulse.in",
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "iss_opn_03",
    title: "Blocked storm runoff culvert flooding Goripalayam junction",
    description: "Storm culvert choked with coconut husks and plastic bottles. Water accumulates knee-deep even with moderate showers.",
    category: "DRAINAGE",
    status: "OPEN",
    latitude: 9.9324,
    longitude: 78.1328,
    address: "Goripalayam Circle, Albert Victor Bridge approach",
    city: "Madurai",
    imageUrl: "https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=600&q=80",
    upvotes: 29,
    citizenEmail: "citizen@civicpulse.in",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
];
