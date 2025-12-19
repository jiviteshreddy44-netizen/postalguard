
export enum ComplaintStatus {
  OPEN = 'OPEN',
  PENDING = 'PENDING',
  SOLVED = 'SOLVED',
  CLOSED = 'CLOSED'
}

export interface TicketUpdate {
  timestamp: string;
  author: string;
  message: string;
  isInternal: boolean;
}

export interface Feedback {
  rating: number;
  comment: string;
  timestamp: string;
}

export interface ComplaintEntities {
  location?: string;
  post_office?: string;
  tracking_number?: string;
  pin_code?: string;
}

export interface ComplaintAnalysis {
  category: 'Delivery Delay' | 'Lost Parcel' | 'Damaged Item' | 'Wrong Delivery' | 'Staff Misconduct' | 'Refund/Payment Issue' | 'Other';
  sentiment: 'Positive' | 'Neutral' | 'Frustrated' | 'Angry';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  suggestedResponse: string;
  summary: string;
  tags: string[];
  translatedText: string;
  entities: ComplaintEntities;
  isPotentialDuplicate?: boolean;
  duplicateConfidence?: number;
  routingOffice?: string;
  slaDeadline?: string;
}

export interface Complaint {
  id: string;
  userId: string;
  description: string;
  imageUrl?: string;
  postOffice: string;
  date: string;
  status: ComplaintStatus;
  analysis?: ComplaintAnalysis;
  assignedAgent?: string;
  updates: TicketUpdate[];
  feedback?: Feedback;
}

export interface User {
  id: string;
  phone: string;
  name: string;
  email: string;
  role: 'user' | 'staff'; // Added role
}

export interface NewsUpdate {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
}
