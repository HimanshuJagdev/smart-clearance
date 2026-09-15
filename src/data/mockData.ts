export type ApprovalStatus = 'approved' | 'review' | 'query' | 'pending';

export interface Application {
  id: string;
  name: string;
  department: string;
  status: ApprovalStatus;
  submittedDate: string;
  progress: number;
  currentStage: string;
  nextAction: string;
  lastUpdated: string;
  timeline: TimelineStep[];
  documents: { name: string; verified: boolean }[];
  delayRisk?: number;
  riskLevel?: 'Low' | 'Medium' | 'High';
  expectedDays?: string;
  shapFactors?: { label: string; value: number }[];
}

export interface TimelineStep {
  label: string;
  status: 'done' | 'current' | 'pending';
  date?: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: 'PDF' | 'JPG' | 'PNG' | 'DOCX';
  status: 'verified' | 'extracted' | 'pending';
  size: string;
  uploadDate: string;
  extractedData?: { label: string; value: string }[];
}

export interface NotificationItem {
  id: string;
  type: 'action' | 'deadline' | 'update';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface ComplianceItem {
  id: string;
  name: string;
  dueDate: string;
  status: 'completed' | 'upcoming' | 'overdue';
  category: string;
}

export interface GovernmentService {
  id: string;
  name: string;
  description: string;
  category: string;
}

export const company = {
  name: 'Shree Industries Pvt. Ltd.',
  industry: 'Manufacturing',
  location: 'Pune, Maharashtra',
  registrationId: 'IND-2026-10482',
  investment: '₹8.5 Crore',
  employees: 125,
  owner: 'Rajesh Sharma',
  email: 'rajesh@shreeindustries.in',
};

export const dashboardStats = {
  total: 12,
  approved: 7,
  inProgress: 3,
  actionRequired: 2,
  overallProgress: 72,
};

export const applications: Application[] = [
  {
    id: 'SC-FIRE-2026-00124',
    name: 'Fire NOC',
    department: 'Maharashtra Fire Services',
    status: 'review',
    submittedDate: '28 Aug 2026',
    progress: 68,
    currentStage: 'Department Review',
    nextAction: 'Inspection report is awaiting department verification.',
    lastUpdated: '10 Sep 2026',
    delayRisk: 64,
    riskLevel: 'Medium',
    expectedDays: '8–12 days',
    shapFactors: [
      { label: 'Missing document', value: 18 },
      { label: 'Previous query', value: 14 },
      { label: 'Application complexity', value: 11 },
      { label: 'Processing history', value: 8 },
    ],
    timeline: [
      { label: 'Application Submitted', status: 'done', date: '28 Aug 2026' },
      { label: 'Documents Verified', status: 'done', date: '02 Sep 2026' },
      { label: 'Inspection Scheduled', status: 'done', date: '05 Sep 2026' },
      { label: 'Department Review', status: 'current', date: 'In Progress' },
      { label: 'Final Approval', status: 'pending' },
    ],
    documents: [
      { name: 'Application Form', verified: true },
      { name: 'Identity Proof', verified: true },
      { name: 'Building Plan', verified: true },
      { name: 'Fire Safety Plan', verified: true },
    ],
  },
  {
    id: 'SC-FACT-2026-00891',
    name: 'Factory License',
    department: 'DISH Maharashtra',
    status: 'review',
    submittedDate: '02 Sep 2026',
    progress: 45,
    currentStage: 'Under Review',
    nextAction: 'Application is under department review.',
    lastUpdated: '09 Sep 2026',
    delayRisk: 28,
    riskLevel: 'Low',
    expectedDays: '5–7 days',
    shapFactors: [
      { label: 'Complete documentation', value: -12 },
      { label: 'Processing history', value: 6 },
      { label: 'Application complexity', value: 4 },
    ],
    timeline: [
      { label: 'Application Submitted', status: 'done', date: '02 Sep 2026' },
      { label: 'Documents Verified', status: 'done', date: '06 Sep 2026' },
      { label: 'Under Review', status: 'current', date: 'In Progress' },
      { label: 'Inspection', status: 'pending' },
      { label: 'Final Approval', status: 'pending' },
    ],
    documents: [
      { name: 'Application Form', verified: true },
      { name: 'Factory Layout', verified: true },
      { name: 'Safety Compliance Certificate', verified: true },
      { name: 'Land Ownership Document', verified: false },
    ],
  },
  {
    id: 'SC-ELEC-2026-00452',
    name: 'Electricity Connection',
    department: 'MSEDCL',
    status: 'query',
    submittedDate: '30 Aug 2026',
    progress: 52,
    currentStage: 'Query Raised',
    nextAction: 'MSEDCL has raised a query regarding load requirements. Please respond.',
    lastUpdated: '10 Sep 2026',
    delayRisk: 78,
    riskLevel: 'High',
    expectedDays: '12–18 days',
    shapFactors: [
      { label: 'Unresolved query', value: 22 },
      { label: 'Missing load certificate', value: 16 },
      { label: 'Previous query', value: 14 },
      { label: 'Application complexity', value: 9 },
    ],
    timeline: [
      { label: 'Application Submitted', status: 'done', date: '30 Aug 2026' },
      { label: 'Documents Verified', status: 'done', date: '03 Sep 2026' },
      { label: 'Query Raised', status: 'current', date: '10 Sep 2026' },
      { label: 'Response Review', status: 'pending' },
      { label: 'Connection Approval', status: 'pending' },
    ],
    documents: [
      { name: 'Application Form', verified: true },
      { name: 'Load Requirement Sheet', verified: false },
      { name: 'Site Plan', verified: true },
      { name: 'Electrical Layout', verified: true },
    ],
  },
  {
    id: 'SC-ENV-2026-00317',
    name: 'Environmental Clearance',
    department: 'SEIAA',
    status: 'review',
    submittedDate: '01 Sep 2026',
    progress: 38,
    currentStage: 'Under Review',
    nextAction: 'Environmental impact assessment is under review.',
    lastUpdated: '08 Sep 2026',
    delayRisk: 41,
    riskLevel: 'Medium',
    expectedDays: '10–15 days',
    shapFactors: [
      { label: 'Application complexity', value: 15 },
      { label: 'Processing history', value: 10 },
      { label: 'Missing EIA supplement', value: 8 },
    ],
    timeline: [
      { label: 'Application Submitted', status: 'done', date: '01 Sep 2026' },
      { label: 'Initial Screening', status: 'done', date: '04 Sep 2026' },
      { label: 'Under Review', status: 'current', date: 'In Progress' },
      { label: 'Public Consultation', status: 'pending' },
      { label: 'Final Approval', status: 'pending' },
    ],
    documents: [
      { name: 'Application Form', verified: true },
      { name: 'Environmental Impact Report', verified: true },
      { name: 'Site Assessment', verified: true },
      { name: 'Pollution Control Plan', verified: false },
    ],
  },
  {
    id: 'SC-LAND-2026-00205',
    name: 'Industrial Land Allotment',
    department: 'MIDC',
    status: 'approved',
    submittedDate: '15 Aug 2026',
    progress: 100,
    currentStage: 'Approved',
    nextAction: 'Allotment letter issued. Download from documents.',
    lastUpdated: '05 Sep 2026',
    timeline: [
      { label: 'Application Submitted', status: 'done', date: '15 Aug 2026' },
      { label: 'Documents Verified', status: 'done', date: '20 Aug 2026' },
      { label: 'Land Assessment', status: 'done', date: '28 Aug 2026' },
      { label: 'Approval Committee', status: 'done', date: '02 Sep 2026' },
      { label: 'Allotment Approved', status: 'done', date: '05 Sep 2026' },
    ],
    documents: [
      { name: 'Application Form', verified: true },
      { name: 'Project Report', verified: true },
      { name: 'Investment Proof', verified: true },
      { name: 'Land Requirement Plan', verified: true },
    ],
  },
];

export const documents: DocumentItem[] = [
  {
    id: 'DOC-001',
    name: 'PAN Card',
    type: 'PDF',
    status: 'verified',
    size: '124 KB',
    uploadDate: '20 Aug 2026',
  },
  {
    id: 'DOC-002',
    name: 'Land Ownership Document',
    type: 'PDF',
    status: 'extracted',
    size: '342 KB',
    uploadDate: '22 Aug 2026',
    extractedData: [
      { label: 'Company Name', value: 'Shree Industries Pvt. Ltd.' },
      { label: 'Applicant Name', value: 'Rajesh Sharma' },
      { label: 'Registration Number', value: 'IND-2026-10482' },
      { label: 'Project Location', value: 'Pune, Maharashtra' },
      { label: 'Investment', value: '₹8.5 Crore' },
    ],
  },
  {
    id: 'DOC-003',
    name: 'Factory Layout',
    type: 'JPG',
    status: 'pending',
    size: '1.2 MB',
    uploadDate: '25 Aug 2026',
  },
  {
    id: 'DOC-004',
    name: 'Environmental Report',
    type: 'PDF',
    status: 'verified',
    size: '2.8 MB',
    uploadDate: '01 Sep 2026',
  },
];

export const notifications: NotificationItem[] = [
  {
    id: 'N1',
    type: 'action',
    title: 'Action Required',
    message: 'MSEDCL has raised a query on your electricity connection application.',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 'N2',
    type: 'deadline',
    title: 'Upcoming Deadline',
    message: 'Factory Safety compliance is due in 7 days.',
    time: '5 hours ago',
    read: false,
  },
  {
    id: 'N3',
    type: 'update',
    title: 'Approval Update',
    message: 'Your Fire NOC application has moved to Department Review.',
    time: '1 day ago',
    read: false,
  },
  {
    id: 'N4',
    type: 'update',
    title: 'Approval Update',
    message: 'Industrial Land Allotment has been approved by MIDC.',
    time: '2 days ago',
    read: true,
  },
  {
    id: 'N5',
    type: 'deadline',
    title: 'Upcoming Deadline',
    message: 'Environmental Compliance Report is due on 25 Sep 2026.',
    time: '3 days ago',
    read: true,
  },
];

export const complianceItems: ComplianceItem[] = [
  {
    id: 'C1',
    name: 'Factory Safety Renewal',
    dueDate: '18 Sep 2026',
    status: 'upcoming',
    category: 'Safety',
  },
  {
    id: 'C2',
    name: 'Environmental Compliance Report',
    dueDate: '25 Sep 2026',
    status: 'upcoming',
    category: 'Environment',
  },
  {
    id: 'C3',
    name: 'Fire Safety Inspection',
    dueDate: '03 Oct 2026',
    status: 'upcoming',
    category: 'Fire Safety',
  },
  {
    id: 'C4',
    name: 'GST Registration Renewal',
    dueDate: '15 Oct 2026',
    status: 'upcoming',
    category: 'Tax',
  },
  {
    id: 'C5',
    name: 'Pollution Control Certificate',
    dueDate: '08 Sep 2026',
    status: 'overdue',
    category: 'Environment',
  },
];

export const complianceStats = {
  health: 86,
  completed: 14,
  upcoming: 5,
  overdue: 1,
};

export const governmentServices: GovernmentService[] = [
  {
    id: 'G1',
    name: 'Maharashtra RTS — Aaple Sarkar',
    description: 'Application tracking and government services',
    category: 'State Government',
  },
  {
    id: 'G2',
    name: 'DISH Maharashtra',
    description: 'Factory safety and licensing',
    category: 'Industrial Safety',
  },
  {
    id: 'G3',
    name: 'MSEDCL',
    description: 'Electricity connection services',
    category: 'Power & Energy',
  },
  {
    id: 'G4',
    name: 'MIDC',
    description: 'Industrial land and infrastructure',
    category: 'Land & Infrastructure',
  },
  {
    id: 'G5',
    name: 'Maharashtra Fire Services',
    description: 'Fire NOC and safety services',
    category: 'Fire Safety',
  },
  {
    id: 'G6',
    name: 'SEIAA Maharashtra',
    description: 'Environmental clearance',
    category: 'Environment',
  },
  {
    id: 'G7',
    name: 'DPIIT',
    description: 'Industrial licensing and support',
    category: 'Central Government',
  },
];

export const navigatorApprovals = [
  {
    category: 'Factory/Safety Approval',
    department: 'DISH Maharashtra',
    documents: ['Application Form', 'Factory Layout', 'Safety Compliance Certificate', 'Identity Proof'],
    estimatedStage: 'Initial Review',
    status: 'pending' as ApprovalStatus,
  },
  {
    category: 'Fire NOC',
    department: 'Maharashtra Fire Services',
    documents: ['Application Form', 'Building Plan', 'Fire Safety Plan', 'Identity Proof'],
    estimatedStage: 'Not Started',
    status: 'pending' as ApprovalStatus,
  },
  {
    category: 'Electricity Connection',
    department: 'MSEDCL',
    documents: ['Application Form', 'Load Requirement Sheet', 'Site Plan', 'Electrical Layout'],
    estimatedStage: 'Not Started',
    status: 'pending' as ApprovalStatus,
  },
  {
    category: 'Environmental Clearance',
    department: 'SEIAA',
    documents: ['Application Form', 'Environmental Impact Report', 'Site Assessment', 'Pollution Control Plan'],
    estimatedStage: 'Not Started',
    status: 'pending' as ApprovalStatus,
  },
  {
    category: 'Industrial Land/Infrastructure Approval',
    department: 'MIDC',
    documents: ['Application Form', 'Project Report', 'Investment Proof', 'Land Requirement Plan'],
    estimatedStage: 'Not Started',
    status: 'pending' as ApprovalStatus,
  },
];

export const industryTypes = [
  'Manufacturing',
  'Food Processing',
  'Textile',
  'Chemical',
  'Automobile',
  'Electronics',
  'Other',
];

export const states = ['Maharashtra', 'Gujarat', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Rajasthan'];

export const districts: Record<string, string[]> = {
  Maharashtra: ['Pune', 'Mumbai', 'Nashik', 'Nagpur', 'Aurangabad'],
  Gujarat: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
  Karnataka: ['Bengaluru', 'Mysuru', 'Hubli', 'Mangaluru'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem'],
  Delhi: ['New Delhi', 'South Delhi', 'North Delhi', 'West Delhi'],
  Rajasthan: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'],
};

export const industrialAreas: Record<string, string[]> = {
  Pune: ['Bhosari MIDC', 'Chakan MIDC', 'Hinjewadi', 'Talegaon MIDC'],
  Mumbai: ['Andheri MIDC', 'Marol MIDC', 'SEEPZ', 'Navi MIDC'],
  Nashik: ['Ambad MIDC', 'Satpur MIDC', 'Sinnar MIDC'],
  Nagpur: ['Butibori MIDC', 'Hingna MIDC'],
  Aurangabad: ['Chikalthana MIDC', 'Shendra MIDC', 'Waluj MIDC'],
  Ahmedabad: ['Naroda GIDC', 'Vatva GIDC', 'Odhav GIDC'],
  Surat: ['Sachin GIDC', 'Pandesara GIDC'],
  Vadodara: ['Savli GIDC', 'Makarpura GIDC'],
  Rajkot: ['Aji GIDC', 'Bhavanagar GIDC'],
  Bengaluru: ['Peenya Industrial Area', 'Electronic City', 'Whitefield'],
  Mysuru: ['Hebbal Industrial Area', 'Belavadi'],
  Hubli: ['Kotas Industrial Area', 'Gokul Road'],
  Mangaluru: ['Baikampady Industrial Area'],
  Chennai: ['Ambattur Industrial Estate', 'Guindy Industrial Estate', 'SIPCOT'],
  Coimbatore: ['SIDCO', 'Peelamedu Industrial Area'],
  Madurai: ['SIDCO', 'Kappalur Industrial Area'],
  Salem: ['SIDCO', 'Mettur Industrial Area'],
  'New Delhi': ['Okhla Industrial Area', 'Patparganj Industrial Area'],
  'South Delhi': ['Mohan Cooperative', 'Okhla Phase 2'],
  'North Delhi': ['Alipur Industrial Area', 'Narela Industrial Area'],
  'West Delhi': ['Mangolpuri Industrial Area', 'Peeragarhi'],
  Jaipur: ['Sitapura Industrial Area', 'Malviya Nagar'],
  Jodhpur: ['MIA Boranada', 'Basni Industrial Area'],
  Udaipur: ['Surajpol Industrial Area', 'Dabok'],
  Kota: ['Ranpur Industrial Area', 'Indra Vihar'],
};
