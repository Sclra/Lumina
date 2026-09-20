export type NewsCategory = 'All' | 'Water' | 'Gas' | 'Energy' | 'General' | 'Golden';

export interface NewsItem {
  id: number;
  category: Exclude<NewsCategory, 'All'>;
  title: string;
  date: string;
  desc: string;
  image: string | null;
  featured: boolean;
  golden: boolean;
  read: boolean;
  content: string;
}

export const newsData: NewsItem[] = [
  {
    id: 1, category: 'Water', title: 'Scheduled Water Main Maintenance',
    date: 'Oct 18, 2026',
    desc: 'Hot water pressure may be slightly reduced on Tuesday morning between 9 AM and 11:30 AM due to pump inspection.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=280&fit=crop&auto=format',
    featured: true, golden: false, read: false,
    content: `Building management will be conducting routine water main maintenance on Tuesday, October 20th, between 9:00 AM and 11:30 AM.\n\nDuring this period, residents may experience slightly reduced water pressure in their units. Hot water pressure may be more noticeably affected on floors 8 and above.\n\nThe maintenance team will be working to inspect and service the building's primary pump system, which ensures optimal water distribution throughout The Lumina Residences.\n\nCold water supply will not be interrupted. We expect the work to be completed well within the stated window.\n\nIf you have any concerns, please contact the building management office at ext. 200 or via the app's messaging feature.\n\nWe apologize in advance for any inconvenience and appreciate your understanding.`,
  },
  {
    id: 2, category: 'Gas', title: 'Gas System Safety Certification',
    date: 'Oct 18, 2026',
    desc: 'Annual state compliance test will take place on Wednesday. Individual unit access is not required for this phase.',
    image: null, featured: false, golden: false, read: true,
    content: `The annual gas system safety certification for The Lumina Residences will take place on Wednesday, October 21st.\n\nThis mandatory state compliance inspection covers the building's main gas lines, distribution system, and mechanical room equipment. Individual unit access is not required for this phase of the inspection.\n\nResidents do not need to be present or make any arrangements. A qualified gas safety inspector will conduct all work in the building's common areas and utility spaces.\n\nCertification results will be posted in the building lobby and made available via this app within 5 business days.\n\nFor questions, contact the building management office.`,
  },
  {
    id: 3, category: 'Energy', title: 'Electric Vehicle Charger Upgrade',
    date: 'Oct 05, 2026',
    desc: '4 charging bays in basement one & B2 now upgraded with faster charging capabilities. Please update your building app to book slots.',
    image: null, featured: false, golden: false, read: false,
    content: `We are pleased to announce that The Lumina Residences has completed an upgrade to our electric vehicle charging infrastructure.\n\nThe 4 charging bays located in Basement Level 1 and Level B2 have been upgraded from 7 kW to 22 kW AC charging units, significantly reducing average charging time for compatible vehicles.\n\nHow to book:\n- Navigate to Reservations in the app\n- Select "EV Charging Bay"\n- Choose your preferred time slot\n\nAll existing booking reservations remain valid. The new faster-charging capabilities are available immediately.`,
  },
  {
    id: 4, category: 'General', title: 'Main Entrance Awning Repairs',
    date: 'Oct 04, 2026',
    desc: 'Cosmetic repairs to the front entry overhang will begin on Friday. Resident walkway access remains unhindered.',
    image: null, featured: false, golden: false, read: true,
    content: `Weather-related cosmetic repairs to the main entrance awning at The Lumina Residences will begin on Friday, October 7th.\n\nThe repair work involves repainting and re-sealing the front entry overhang, which sustained minor cosmetic damage during the recent storm season. The structural integrity of the awning has been assessed and is fully sound.\n\nWhat to expect:\n- Scaffolding will be erected along the front facade (left side only)\n- Resident walkway access remains fully unhindered\n- Vehicles in designated spaces 1–8 near the main entrance should temporarily relocate to visitor parking\n- Works are expected to take 3–4 business days to complete\n\nWe appreciate your patience during this maintenance period.`,
  },
  {
    id: 5, category: 'Golden', title: 'Annual Building Gala — Save the Date',
    date: 'Oct 20, 2026',
    desc: 'You are cordially invited to The Lumina Residences Annual Gala on November 15th. Rooftop terrace. Black tie optional. RSVP by Nov 1st.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=280&fit=crop&auto=format',
    featured: true, golden: true, read: false,
    content: `Dear Lumina Residents,\n\nYou are cordially invited to The Lumina Residences Annual Gala — our signature celebration of community, excellence, and the year's highlights.\n\nDate: Saturday, November 15th, 2026\nTime: 7:00 PM – 11:00 PM\nVenue: Rooftop Terrace, Level 42\nDress Code: Black tie optional\n\nThe evening will feature:\n- Welcome cocktails and canapés\n- Live jazz ensemble\n- Award ceremony recognizing outstanding community contributions\n- Three-course dinner\n- Dancing until 11 PM\n\nRSVP is required by November 1st via this app or at the front desk.\n\nComplimentary valet parking will be available for all residents and their guests.\n\nWe look forward to an exceptional evening in your company.`,
  },
  {
    id: 6, category: 'Golden', title: 'Lobby Renovation — New Look Unveiled',
    date: 'Oct 15, 2026',
    desc: 'Our award-winning renovation of the main lobby is now complete. Come discover the new concierge desk, lounge seating, and art installations.',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=280&fit=crop&auto=format',
    featured: false, golden: true, read: false,
    content: `We are thrilled to announce the completion of The Lumina Residences lobby renovation — a transformation that reflects our commitment to delivering a world-class living environment.\n\nThe redesigned lobby features:\n- A new bespoke concierge desk crafted from Italian marble\n- Curated contemporary art installations from local artists\n- Expanded lounge seating with premium upholstery\n- Enhanced lighting design with natural material accents\n- A dedicated package management alcove with smart lockers\n\nThe renovation was completed ahead of schedule and within budget. We extend our sincere thanks to all residents for their patience during the construction period.\n\nWe invite you to visit and experience the new lobby at your convenience. Your feedback is always welcome.`,
  },
];
