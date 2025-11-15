
export enum UserRole {
  RECOMMENDER = 'Recomendador',
  SEEKER = 'Buscador',
  PROFESSIONAL = 'Profesional',
  ADMIN = 'Admin',
}

export enum RequestStatus {
  LOCKED = 'locked',
  UNLOCKED = 'unlocked',
}

export interface User {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  averageRating?: number;
  ratingCount?: number;
}

export interface Membership {
    id: string;
    name: string;
    price: number;
    durationDays: number;
}

export interface ServiceRequest {
    id: string;
    seekerId: string;
    seekerName: string;
    seekerEmail: string;
    seekerPhone?: string;
    professionalId: string;
    professionalName: string;
    requestDetails: string;
    status: RequestStatus;
    createdAt: any; // Firestore Timestamp
    attendedDate?: any; // Firestore Timestamp
    clientRating?: number;
    professionalRating?: number;
    serviceDate?: any; // Firestore Timestamp
    serviceTime?: string;
}

export interface ProfessionalProfile {
  specialty: string;
  bio: string;
  services: string[];
  status?: 'pending' | 'approved' | 'rejected';
  activeMembershipId?: string;
  membershipEndDate?: any; // Firestore Timestamp
  isVerified?: boolean;
  availability?: string;
  phone?: string;
  photoURL?: string;
  idDocumentName?: string;
}

export interface SeekerProfile {
  phoneNumber?: string;
  address?: string;
  areaCode?: string;
  activeMembershipId?: string | null;
  membershipEndDate?: any | null; // Firestore Timestamp
}

export interface RecommenderProfile {
  phone?: string;
  photoURL?: string;
  bio?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  recommenderId: string;
  recommenderName: string;
  createdAt: any; // Firestore Timestamp
  maxApplicants?: number;
  applicantCount?: number;
}

export interface JobApplication {
    id: string;
    jobId: string;
    seekerId: string;
    recommenderId: string;
    cvUrl: string; // For simulation, this will be the file name
    coverLetter: string;
    appliedAt: any; // Firestore Timestamp
    recommenderRating?: number;
    // Denormalized data for easier display
    jobTitle?: string;
    jobCompany?: string;
    recommenderName?: string;
}


// Add Stripe to the global window object for TypeScript
declare global {
    interface Window {
        Stripe: any;
    }
}