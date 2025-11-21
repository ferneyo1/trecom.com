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
  isVerified?: boolean;
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
    requestSubject?: string;
    requestPhotoURL?: string;
    status: RequestStatus;
    createdAt: string;
    attendedDate?: string;
    clientRating?: number;
    professionalRating?: number;
    serviceDate?: string;
    serviceTime?: string;
    seekerLocation?: { latitude: number; longitude: number; } | string;
}

export interface ProfessionalProfile {
  specialty: string;
  bio: string;
  services: string[];
  status?: 'pending' | 'approved' | 'rejected';
  activeMembershipId?: string;
  membershipEndDate?: string;
  isVerified?: boolean;
  availability?: string;
  phone?: string;
  photoURL?: string;
  idDocumentName?: string;
  idDocumentURL?: string;
}

export interface SeekerProfile {
  phoneNumber?: string;
  address?: string;
  areaCode?: string; // postal code
  activeMembershipId?: string | null;
  membershipEndDate?: string | null;
  unlockedJobs?: string[];
  documentType?: string;
  documentNumber?: string;
  city?: string;
  photoURL?: string;
  favoriteJobs?: string[];
}

export interface RecommenderProfile {
  phone?: string;
  photoURL?: string;
}

export interface RecommenderPayoutSettings {
  perVerifiedJob: number;
  perApplication: number;
  perConfirmedHire: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  recommenderId: string;
  recommenderName: string;
  createdAt: string;
  applicantCount?: number;
  tasks?: string[];
  city?: string;
  areaCode?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  status?: 'active' | 'pending_deletion' | 'full';
  salaryAmount?: number;
  salaryType?: 'per_hour' | 'per_year';
  jobType?: 'remote' | 'part_time' | 'full_time';
  isVerified?: boolean;
}

export type ApplicationStatus =
  | 'submitted' // Seeker sends application to recommender
  | 'recommender_rejected' // Recommender rejects the application
  | 'forwarded_to_company' // Recommender approves and sends to company
  | 'under_review' // Company is reviewing (set by recommender)
  | 'interviewing' // Company wants to interview (set by recommender)
  | 'company_rejected' // Company rejects (set by recommender)
  | 'hired'; // Admin confirms hire

export interface JobApplication {
    id: string;
    jobId: string;
    seekerId: string;
    seekerName?: string;
    recommenderId: string;
    cvUrl: string; // For simulation, this will be the file name
    coverLetter: string;
    appliedAt: string;
    recommenderRating?: number;
    status: ApplicationStatus;
    // Denormalized data for easier display
    jobTitle?: string;
    jobCompany?: string;
    recommenderName?: string;
}

export interface Earning {
  id: string;
  recommenderId: string;
  amount: number;
  type: 'verifiedJob' | 'application' | 'confirmedHire';
  status: 'pending' | 'paid';
  createdAt: string;
  jobId?: string;
  applicationId?: string;
  paymentId?: string;
  jobTitle?: string; // Denormalized for easier display
}

export interface Payment {
  id: string;
  recommenderId: string;
  recommenderName: string;
  adminId: string;
  amount: number;
  createdAt: string;
  notes?: string;
  proofURL?: string;
  earningIds: string[];
}