export interface DashboardBanner {
  id: string;
  title: string;
  tag: string;
  image: string;
  shortDescription: string;
  registrationUrl?: string;
  actionText?: string;
  deadlineText: string;
  startDate?: string;
  endDate?: string;
  venue?: string;
  isFeatured?: boolean;
  status?: 'open' | 'closing-soon' | 'closed';
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const initialMockBanners: DashboardBanner[] = [
  {
    id: 'evt-1',
    title: "National Innovation Hackathon '24",
    tag: 'HACKATHON',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    shortDescription: '24-hour national level software and hardware sprint with cash prizes exceeding ₹2,50,000.',
    registrationUrl: 'https://indiraicem.ac.in/hackathon24',
    actionText: 'Register',
    deadlineText: 'Registration closes Sept 20',
    startDate: 'Nov 15, 2023',
    endDate: 'Nov 16, 2023',
    venue: 'ICEM Innovation Lab & Engineering Quad',
    isFeatured: true,
    status: 'closing-soon',
    isActive: true,
  },
  {
    id: 'evt-2',
    title: 'AI & Cloud Infrastructure Bootcamp',
    tag: 'WORKSHOP',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Hands-on industrial masterclass on LLMs, Kubernetes, and scalable distributed systems by Google Architects.',
    registrationUrl: 'https://indiraicem.ac.in/ai-bootcamp',
    actionText: 'Register',
    deadlineText: 'Oct 26 • Limited 60 Seats',
    startDate: 'Oct 26, 2023',
    endDate: 'Oct 27, 2023',
    venue: 'Central Seminar Hall (Block B, 3rd Floor)',
    isFeatured: true,
    status: 'open',
    isActive: true,
  },
  {
    id: 'evt-3',
    title: "Innovate '24 — Technical & Robotic Fest",
    tag: 'TECH FEST',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Flagship engineering extravaganza featuring RoboWars, Drone Racing, and Project Exhibition.',
    registrationUrl: 'https://indiraicem.ac.in/innovate24',
    actionText: 'Register',
    deadlineText: 'Nov 15-17 • Registration Open',
    startDate: 'Nov 15, 2023',
    endDate: 'Nov 17, 2023',
    venue: 'ICEM Main Auditorium & Ground',
    isFeatured: true,
    status: 'open',
    isActive: true,
  }
];

export const sampleBannerPresets = [
  {
    name: 'Hackathon / Tech Sprint',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    tag: 'HACKATHON',
  },
  {
    name: 'AI & Cloud Computing Workshop',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    tag: 'WORKSHOP',
  },
  {
    name: 'Robotics & Innovation Fest',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    tag: 'TECH FEST',
  },
  {
    name: 'Campus Recruitment / Placement Drive',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80',
    tag: 'PLACEMENT',
  },
  {
    name: 'Academic Conference & Seminar',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    tag: 'CONFERENCE',
  },
];
