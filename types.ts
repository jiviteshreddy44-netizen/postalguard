
export enum ComplaintStatus {
  OPEN = 'OPEN',
  PENDING = 'PENDING',
  SOLVED = 'SOLVED',
  CLOSED = 'CLOSED',
  ESCALATED = 'ESCALATED'
}

export type UserRole = 'user' | 'agent' | 'supervisor' | 'admin';

export interface TicketUpdate {
  timestamp: string;
  author: string;
  message: string;
  isInternal: boolean;
  type?: 'status_change' | 'assignment' | 'message' | 'escalation';
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
  priorityScore: number; // 1 to 100
  suggestedResponse: string;
  summary: string;
  tags: string[];
  translatedText: string;
  entities: ComplaintEntities;
  isPotentialDuplicate?: boolean;
  duplicateConfidence?: number;
  duplicateOfId?: string;
  routingOffice?: string;
  slaDeadline: string; // ISO string
}

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  description: string;
  trackingNumber?: string;
  imageUrl?: string;
  postOffice: string;
  date: string;
  status: ComplaintStatus;
  analysis?: ComplaintAnalysis;
  assignedAgentId?: string;
  assignedAgentName?: string;
  updates: TicketUpdate[];
  feedback?: Feedback;
}

export interface User {
  id: string;
  phone: string;
  name: string;
  email: string;
  role: UserRole;
  region?: string;
  employeeId?: string;
}
