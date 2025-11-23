// Fix: Removed invalid 'aistudio' token from import statement to resolve syntax error.
import React from 'react';
import { User, UserRole, ProfessionalProfile, RequestStatus, SeekerProfile, Job, Membership, JobApplication, ServiceRequest, RecommenderProfile, RecommenderPayoutSettings, ApplicationStatus } from '../../types';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { db, auth, storage } from '../../firebase';
import { Modal } from '../shared/Modal';
import { collection, query, where, getDocs, doc, getDoc, addDoc, onSnapshot, updateDoc, setDoc, serverTimestamp, Timestamp, increment, runTransaction, deleteDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytesResumable, UploadTaskSnapshot, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import VerifiedBadge from '../shared/VerifiedBadge';
import Toast from '../shared/Toast';
import StripeCheckoutForm from '../shared/StripeCheckoutForm';
import StarRating from '../shared/StarRating';
import { useLanguage } from '../../contexts/LanguageContext';

interface SeekerDashboardProps {
  user: User;
}

interface Professional extends User {
    profile: ProfessionalProfile;
}

interface ProfessionalWithStats extends Professional {
    averageRating: number;
    reviewCount: number;
    successfulServices: number;
}

interface JobWithRecommenderRating extends Job {
    recommenderAverageRating: number;
    recommenderPhotoURL?: string;
}

type PurchaseAction = 
    | { type: 'unlock_job', job: Job }
    | { type: 'buy_membership', membership: Membership };
    
interface ShareContent {
    title: string;
    text: string;
    url: string;
}

const ApplicationStatusTracker: React.FC<{ status: ApplicationStatus }> = ({ status }) => {
    const { t } = useLanguage();
    const steps = [
        { name: t('seeker.tracker.step1') },
        { name: t('seeker.tracker.step2') },
        { name: t('seeker.tracker.step3') },
        { name: t('seeker.tracker.step4') },
    ];

    let currentStepIndex = 0;
    if (['recommender_rejected', 'forwarded_to_company', 'under_review', 'interviewing', 'company_rejected', 'hired'].includes(status)) {
        currentStepIndex = 1;
    }
    if (['forwarded_to_company', 'under_review', 'interviewing', 'company_rejected', 'hired'].includes(status)) {
        currentStepIndex = 2;
    }
    if (['under_review', 'interviewing', 'company_rejected', 'hired'].includes(status)) {
        currentStepIndex = 3;
    }

    const isRejected = status === 'recommender_rejected' || status === 'company_rejected';
    const isHired = status === 'hired';

    return (
        <div className="w-full mt-2">
            <h4 className="text-sm font-semibold mb-2">{t('seeker.applicationStatusTracker')}</h4>
            <div className="flex items-center">
                {steps.map((step, index) => (
                    <React.Fragment key={index}>
                        <div className="flex flex-col items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${
                                index <= currentStepIndex ? (isRejected ? 'bg-red-500' : isHired ? 'bg-green-500' : 'bg-indigo-600') : 'bg-slate-300 dark:bg-slate-600'
                            }`}>
                                {index < currentStepIndex || isHired ? '✓' : index + 1}
                            </div>
                            <p className="text-xs text-center mt-1 w-20">{step.name}</p>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`flex-auto border-t-2 ${
                                index < currentStepIndex ? (isRejected ? 'border-red-500' : isHired ? 'border-green-500' : 'border-indigo-600') : 'border-slate-300 dark:border-slate-600'
                            }`}></div>
                        )}
                    </React.Fragment>
                ))}
            </div>
            <p className="text-xs text-center mt-3 p-2 bg-slate-100 dark:bg-slate-800 rounded-md">
                <strong>{t('admin.status')}:</strong> {t(`seeker.applicationStatus.${status}`)}
            </p>
        </div>
    );
};


const MagnifyingGlassIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
    </svg>
);
const UserCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
    </svg>
);
const ClipboardDocumentListIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z" clipRule="evenodd" />
    </svg>
);
const ShareIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M13 13.5a2.5 2.5 0 11.702-4.289l-3.296 1.648a2.504 2.504 0 010 1.126l3.296 1.648A2.5 2.5 0 1113 15.5v-1.615a2.5 2.5 0 01-1.298-2.201l-3.296-1.648a2.5 2.5 0 010-1.126l3.296-1.648A2.5 2.5 0 0113 4.5z" />
    </svg>
);
const PencilIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
        <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25-1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
    </svg>
);
const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25-.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
    </svg>
);
const HeartIcon: React.FC<{ className?: string, solid?: boolean }> = ({ className, solid }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={solid ? "currentColor" : "none"} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
);
const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
      <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.18l.88-1.48a1.651 1.651 0 011.332-.906H4.25a1.651 1.651 0 011.332.906l.88 1.48a1.651 1.651 0 010 1.18l-.88 1.48a1.651 1.651 0 01-1.332.906H2.876a1.651 1.651 0 01-1.332-.906L.664 10.59zM10 15.25a5.25 5.25 0 005.25-5.25.75.75 0 00-1.5 0 3.75 3.75 0 01-3.75 3.75.75.75 0 000 1.5z" clipRule="evenodd" />
    </svg>
);


// FIX: Export function directly to create a named export.
export function SeekerDashboard({ user }: SeekerDashboardProps) {
  const { t } = useLanguage();
  // Search State
  const [activeTab, setActiveTab] = React.useState<'professionals' | 'jobs'>('professionals');
  const [professionalSearchName, setProfessionalSearchName] = React.useState('');
  const [professionalSearchSpecialty, setProfessionalSearchSpecialty] = React.useState('');
  const [jobSearchKeyword, setJobSearchKeyword] = React.useState('');
  const [jobSearchCity, setJobSearchCity] = React.useState('');
  const [professionalResults, setProfessionalResults] = React.useState<ProfessionalWithStats[]>([]);
  const [jobResults, setJobResults] = React.useState<JobWithRecommenderRating[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searched, setSearched] = React.useState(false);

  // Profile State
  const [seekerProfile, setSeekerProfile] = React.useState<SeekerProfile | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editName, setEditName] = React.useState(user.name);
  const [editPhoneNumber, setEditPhoneNumber] = React.useState('');
  const [editAddress, setEditAddress] = React.useState('');
  const [editAreaCode, setEditAreaCode] = React.useState('');
  const [editDocumentType, setEditDocumentType] = React.useState('');
  const [editDocumentNumber, setEditDocumentNumber] = React.useState('');
  const [editCity, setEditCity] = React.useState('');
  const [editPhotoURL, setEditPhotoURL] = React.useState('');
  const [editPhotoFile, setEditPhotoFile] = React.useState<File | null>(null);
  const [editPhotoPreview, setEditPhotoPreview] = React.useState<string | null>(null);

  const [isSaving, setIsSaving] = React.useState(false);
  const [notification, setNotification] = React.useState<string | null>(null);
  const [hasActiveMembership, setHasActiveMembership] = React.useState(false);
  const [memberships, setMemberships] = React.useState<Membership[]>([]);
  const [globalMaxApplicants, setGlobalMaxApplicants] = React.useState<number | null>(null);

  // Modals State
  const [isContactModalOpen, setIsContactModalOpen] = React.useState(false);
  const [selectedProfessional, setSelectedProfessional] = React.useState<ProfessionalWithStats | null>(null);
  const [requestSubject, setRequestSubject] = React.useState('');
  const [requestDetails, setRequestDetails] = React.useState('');
  const [serviceDate, setServiceDate] = React.useState('');
  const [serviceTime, setServiceTime] = React.useState('');
  const [requestLocation, setRequestLocation] = React.useState<{ latitude: number, longitude: number } | null>(null);
  const [requestLocationInput, setRequestLocationInput] = React.useState('');
  const [requestPhotoFile, setRequestPhotoFile] = React.useState<File | null>(null);
  const [requestPhotoUploadProgress, setRequestPhotoUploadProgress] = React.useState<number | null>(null);
  const [isSending, setIsSending] = React.useState(false);

  const [isJobDetailsModalOpen, setIsJobDetailsModalOpen] = React.useState(false);
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null);
  const [selectedJobRecommenderDetails, setSelectedJobRecommenderDetails] = React.useState<{email: string; phone: string} | null>(null);
  
  // History and Rating State
  const [jobApplications, setJobApplications] = React.useState<JobApplication[]>([]);
  const [serviceRequests, setServiceRequests] = React.useState<ServiceRequest[]>([]);
  const [isRecommenderRatingModalOpen, setIsRecommenderRatingModalOpen] = React.useState(false);
  const [selectedApplication, setSelectedApplication] = React.useState<JobApplication | null>(null);
  const [recommenderRating, setRecommenderRating] = React.useState(0);
  const [isProfRatingModalOpen, setIsProfRatingModalOpen] = React.useState(false);
  const [selectedRequest, setSelectedRequest] = React.useState<ServiceRequest | null>(null);
  const [professionalRating, setProfessionalRating] = React.useState(0);

  // Pagination State
  const [jobAppsPage, setJobAppsPage] = React.useState(1);
  const [serviceRequestsPage, setServiceRequestsPage] = React.useState(1);
  const JOB_APPS_PER_PAGE = 5;
  const SERVICE_REQUESTS_PER_PAGE = 2;

  // Job Application Flow State
  const [isPaywallModalOpen, setIsPaywallModalOpen] = React.useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = React.useState(false);
  const [coverLetter, setCoverLetter] = React.useState('');
  const [cvFile, setCvFile] = React.useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = React.useState<number | null>(null);
  const [editUploadProgress, setEditUploadProgress] = React.useState<number | null>(null);
  const [unlockedJobs, setUnlockedJobs] = React.useState<string[]>([]);
  const [favoriteJobs, setFavoriteJobs] = React.useState<string[]>([]);
  const [sendToCompany, setSendToCompany] = React.useState(true);
  const [sendToRecommender, setSendToRecommender] = React.useState(true);


  // --- REFACTORED PAYMENT STATE ---
  const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);
  const [paymentClientSecret, setPaymentClientSecret] = React.useState<string | null>(null);
  const [purchaseAction, setPurchaseAction] = React.useState<PurchaseAction | null>(null);
  const [purchaseDisplay, setPurchaseDisplay] = React.useState<{ name: string; price: number } | null>(null);
  
  // --- APPLICATION & REQUEST MANAGEMENT STATE ---
  const [jobAppSearchTerm, setJobAppSearchTerm] = React.useState('');
  const [filteredJobApps, setFilteredJobApps] = React.useState<JobApplication[]>([]);
  const [isEditAppModalOpen, setIsEditAppModalOpen] = React.useState(false);
  const [appToEdit, setAppToEdit] = React.useState<JobApplication | null>(null);
  const [editCoverLetter, setEditCoverLetter] = React.useState('');
  const [editCvFile, setEditCvFile] = React.useState<File | null>(null);
  const [isDeleteAppModalOpen, setIsDeleteAppModalOpen] = React.useState(false);
  const [appToDelete, setAppToDelete] = React.useState<JobApplication | null>(null);
  
  const [serviceRequestSearchTerm, setServiceRequestSearchTerm] = React.useState('');
  const [filteredServiceRequests, setFilteredServiceRequests] = React.useState<ServiceRequest[]>([]);
  const [isEditRequestModalOpen, setIsEditRequestModalOpen] = React.useState(false);
  const [requestToEdit, setRequestToEdit] = React.useState<ServiceRequest | null>(null);
  const [editRequestDetails, setEditRequestDetails] = React.useState('');
  const [editServiceDate, setEditServiceDate] = React.useState('');
  const [editServiceTime, setEditServiceTime] = React.useState('');
  const [isDeleteRequestModalOpen, setIsDeleteRequestModalOpen] = React.useState(false);
  const [requestToDelete, setRequestToDelete] = React.useState<ServiceRequest | null>(null);
  
  // --- SHARE MODAL STATE ---
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);
  const [shareContent, setShareContent] = React.useState<ShareContent | null>(null);


  const jobTypeLabels: { [key in Job['jobType'] & string]: string } = {
    full_time: t('recommender.fullTime'),
    part_time: t('recommender.partTime'),
    remote: t('recommender.remote')
  };

  React.useEffect(() => {
    const seekerDocRef = doc(db, 'seekers', user.uid);
    const unsubscribeProfile = onSnapshot(seekerDocRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            const sanitizedData: any = {};
            for (const key in data) {
                if (data[key] instanceof Timestamp) {
                    sanitizedData[key] = data[key].toDate().toISOString();
                } else {
                    sanitizedData[key] = data[key];
                }
            }
            const profileData = sanitizedData as SeekerProfile;

            const isActive = profileData.membershipEndDate && new Date(profileData.membershipEndDate) > new Date();
            setHasActiveMembership(isActive);

            setSeekerProfile(profileData);
            setUnlockedJobs(profileData.unlockedJobs || []);
            setFavoriteJobs(profileData.favoriteJobs || []);
        }
    });

    const membershipsUnsubscribe = onSnapshot(collection(db, 'memberships'), snapshot => {
        setMemberships(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Membership)));
    });

    const applicationsQuery = query(collection(db, 'jobApplications'), where('seekerId', '==', user.uid));
    const unsubscribeApplications = onSnapshot(applicationsQuery, async (snapshot) => {
        const apps = snapshot.docs.map(doc => {
            const data = doc.data();
            const sanitizedData: any = {};
            for (const key in data) {
                if (data[key] instanceof Timestamp) {
                    sanitizedData[key] = data[key].toDate().toISOString();
                } else {
                    sanitizedData[key] = data[key];
                }
            }
            return { id: doc.id, ...sanitizedData } as JobApplication;
        });
        apps.sort((a,b) => (new Date(b.appliedAt).getTime() || 0) - (new Date(a.appliedAt).getTime() || 0));
        setJobApplications(apps);
    });
    
    const serviceRequestsQuery = query(collection(db, 'serviceRequests'), where('seekerId', '==', user.uid));
    const unsubscribeRequests = onSnapshot(serviceRequestsQuery, snapshot => {
        const requests = snapshot.docs.map(doc => {
            const data = doc.data();
            const sanitizedData: any = {};
            for (const key in data) {
                if (data[key] instanceof Timestamp) {
                    sanitizedData[key] = data[key].toDate().toISOString();
                } else {
                    sanitizedData[key] = data[key];
                }
            }
            return { id: doc.id, ...sanitizedData } as ServiceRequest;
        });
        requests.sort((a,b) => (new Date(b.createdAt).getTime() || 0) - (new Date(a.createdAt).getTime() || 0));
        setServiceRequests(requests);
    });

    const settingsRef = doc(db, 'settings', 'globalConfig');
    const unsubscribeSettings = onSnapshot(settingsRef, (doc) => {
        if (doc.exists()) {
            setGlobalMaxApplicants(doc.data().maxApplicantsGlobal);
        } else {
            setGlobalMaxApplicants(null); // No limit set
        }
    });

    return () => {
        unsubscribeProfile();
        membershipsUnsubscribe();
        unsubscribeApplications();
        unsubscribeRequests();
        unsubscribeSettings();
    }
  }, [user.uid]);

  React.useEffect(() => {
      setEditName(user.name);
  }, [user.name]);

  React.useEffect(() => {
      const filtered = jobApplications.filter(app =>
          (app.jobTitle?.toLowerCase().includes(jobAppSearchTerm.toLowerCase()) ||
           app.jobCompany?.toLowerCase().includes(jobAppSearchTerm.toLowerCase()))
      );
      setFilteredJobApps(filtered);
  }, [jobApplications, jobAppSearchTerm]);

  React.useEffect(() => {
      const filtered = serviceRequests.filter(req =>
          req.professionalName.toLowerCase().includes(serviceRequestSearchTerm.toLowerCase())
      );
      setFilteredServiceRequests(filtered);
  }, [serviceRequests, serviceRequestSearchTerm]);

  const handleProfessionalSearch = async () => {
    setLoading(true);
    setSearched(true);
    setProfessionalResults([]);
    try {
      const usersQuery = query(collection(db, 'users'), where('role', '==', UserRole.PROFESSIONAL));
      const usersSnapshot = await getDocs(usersQuery);
      const professionalsData: Professional[] = [];
      for (const userDoc of usersSnapshot.docs) {
        const user = { uid: userDoc.id, ...userDoc.data() } as User;
        const profProfileDoc = await getDoc(doc(db, 'professionals', user.uid));
        if (profProfileDoc.exists() && profProfileDoc.data().status === 'approved') {
          const profileData = profProfileDoc.data();
          const sanitizedProfileData: any = {};
            for (const key in profileData) {
                if (profileData[key] instanceof Timestamp) {
                    sanitizedProfileData[key] = profileData[key].toDate().toISOString();
                } else {
                    sanitizedProfileData[key] = profileData[key];
                }
            }

          professionalsData.push({
            ...user,
            profile: sanitizedProfileData as ProfessionalProfile,
          });
        }
      }
      const filteredProfessionals = professionalsData.filter(p => {
        const nameMatch = professionalSearchName ? p.name.toLowerCase().includes(professionalSearchName.toLowerCase()) : true;
        const specialtyMatch = professionalSearchSpecialty ? p.profile.specialty.toLowerCase().includes(professionalSearchSpecialty.toLowerCase()) : true;
        return nameMatch && specialtyMatch;
      });
      
      const allAttendedRequestsQuery = query(collection(db, 'serviceRequests'), where('attendedDate', '!=', null));
      const allAttendedRequestsSnapshot = await getDocs(allAttendedRequestsQuery);
      
      const successfulServicesCount = allAttendedRequestsSnapshot.docs.reduce((acc, doc) => {
          const professionalId = doc.data().professionalId;
          acc[professionalId] = (acc[professionalId] || 0) + 1;
          return acc;
      }, {} as { [key: string]: number });

      const professionalsWithStats: ProfessionalWithStats[] = filteredProfessionals.map(prof => {
          const reviewCount = prof.ratingCount || 0;
          const averageRating = prof.averageRating || 0;
          const successfulServices = successfulServicesCount[prof.uid] || 0;
          return { ...prof, reviewCount, averageRating, successfulServices };
      });

      setProfessionalResults(professionalsWithStats);

    } catch (error) {
      console.error("Error searching professionals:", error);
      setNotification(t('seeker.errorSearchingProfessionals') || "Error al buscar profesionales.");
    } finally {
      setLoading(false);
    }
  };

  const handleJobSearch = async () => {
    setLoading(true);
    setSearched(true);
    setJobResults([]);
    try {
        const q = query(collection(db, 'jobs'), where('status', '==', 'active'));
        const jobsSnapshot = await getDocs(q);
        const allJobs = jobsSnapshot.docs.map(doc => {
            const data = doc.data();
            const sanitizedData: any = {};
            for (const key in data) {
                if (data[key] instanceof Timestamp) {
                    sanitizedData[key] = data[key].toDate().toISOString();
                } else {
                    sanitizedData[key] = data[key];
                }
            }
            return { id: doc.id, ...sanitizedData } as Job;
        });

        const filteredJobs = allJobs.filter(job => {
            const keywordMatch = jobSearchKeyword ? (() => {
                const searchWords = jobSearchKeyword.toLowerCase().split(' ').filter(word => word.length > 0);
                if (searchWords.length === 0) return true;
        
                const jobText = [
                    job.title,
                    job.company,
                    job.description,
                    ...(job.tasks || [])
                ].join(' ').toLowerCase();
        
                return searchWords.every(word => jobText.includes(word));
            })() : true;
            
            const cityMatch = jobSearchCity 
                ? job.city?.toLowerCase().includes(jobSearchCity.toLowerCase())
                : true;

            return keywordMatch && cityMatch;
        });
        
        const jobsWithRatings: JobWithRecommenderRating[] = await Promise.all(
            filteredJobs.map(async job => {
                const recommenderDoc = await getDoc(doc(db, 'users', job.recommenderId));
                const recommenderProfileDoc = await getDoc(doc(db, 'recommenders', job.recommenderId));
                return {
                    ...job,
                    recommenderAverageRating: recommenderDoc.exists() ? (recommenderDoc.data().averageRating || 0) : 0,
                    recommenderPhotoURL: recommenderProfileDoc.exists() ? (recommenderProfileDoc.data().photoURL) : undefined
                };
            })
        );
        
        jobsWithRatings.sort((a, b) => (new Date(b.createdAt).getTime() || 0) - (new Date(a.createdAt).getTime() || 0));
        setJobResults(jobsWithRatings);

    } catch (error) {
        console.error("Error searching jobs:", error);
        setNotification(t('seeker.errorSearchingJobs') || "Error al buscar empleos.");
    } finally {
        setLoading(false);
    }
  };

  const handleOpenEditModal = () => {
    setEditName(user.name);
    if (seekerProfile) {
        setEditPhoneNumber(seekerProfile.phoneNumber || '');
        setEditAddress(seekerProfile.address || '');
        setEditAreaCode(seekerProfile.areaCode || '');
        setEditDocumentType(seekerProfile.documentType || '');
        setEditDocumentNumber(seekerProfile.documentNumber || '');
        setEditCity(seekerProfile.city || '');
        setEditPhotoURL(seekerProfile.photoURL || '');
        setEditPhotoPreview(seekerProfile.photoURL || null);
    }
    setEditPhotoFile(null);
    setIsEditModalOpen(true);
  };
  
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (auth.currentUser && auth.currentUser.displayName !== editName) {
        await updateProfile(auth.currentUser, { displayName: editName });
      }
      await updateDoc(doc(db, 'users', user.uid), { name: editName });
      
      let photoDownloadURL = editPhotoURL;
      if (editPhotoFile) {
        const storageRef = ref(storage, `seeker_avatars/${user.uid}`);
        await uploadBytes(storageRef, editPhotoFile);
        photoDownloadURL = await getDownloadURL(storageRef);
      }
      
      const profileData: Partial<SeekerProfile> = {
        phoneNumber: editPhoneNumber,
        address: editAddress,
        areaCode: editAreaCode,
        documentType: editDocumentType,
        documentNumber: editDocumentNumber,
        city: editCity,
        photoURL: photoDownloadURL,
      };

      await setDoc(doc(db, 'seekers', user.uid), profileData, { merge: true });
      setNotification(t('seeker.profileUpdatedSuccessfully'));
      setTimeout(() => setNotification(null), 3000);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setNotification('Error al actualizar el perfil.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setEditPhotoFile(file);
        setEditPhotoPreview(URL.createObjectURL(file));
    }
  };
  
  const handleOpenContactModal = (prof: ProfessionalWithStats) => {
    setSelectedProfessional(prof);
    setIsContactModalOpen(true);
  };
  
  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfessional) return;
    setIsSending(true);
    setRequestPhotoUploadProgress(0);

    let photoURL: string | undefined = undefined;

    try {
        if (requestPhotoFile) {
            const newRequestRef = doc(collection(db, 'serviceRequests')); // Create ref to get ID
            const photoStorageRef = ref(storage, `service_requests/${newRequestRef.id}/${requestPhotoFile.name}`);
            
            photoURL = await new Promise<string>((resolve, reject) => {
                const uploadTask = uploadBytesResumable(photoStorageRef, requestPhotoFile);
                uploadTask.on('state_changed',
                    (snapshot: UploadTaskSnapshot) => setRequestPhotoUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
                    (error) => { console.error("Upload error:", error); reject(error); },
                    async () => resolve(await getDownloadURL(uploadTask.snapshot.ref))
                );
            });
        }
        
        // Build the payload dynamically to avoid undefined values.
        const requestPayload: { [key: string]: any } = {
            seekerId: user.uid,
            seekerName: user.name,
            seekerEmail: user.email,
            professionalId: selectedProfessional.uid,
            professionalName: selectedProfessional.name,
            requestDetails: requestDetails,
            status: RequestStatus.LOCKED,
            createdAt: serverTimestamp(),
        };

        if (seekerProfile?.phoneNumber) requestPayload.seekerPhone = seekerProfile.phoneNumber;
        if (requestSubject) requestPayload.requestSubject = requestSubject;
        if (photoURL) requestPayload.requestPhotoURL = photoURL;
        if (serviceDate) requestPayload.serviceDate = serviceDate;
        if (serviceTime) requestPayload.serviceTime = serviceTime;

        const location = requestLocationInput || requestLocation;
        if (location) {
            requestPayload.seekerLocation = location;
        }
        
        await addDoc(collection(db, 'serviceRequests'), requestPayload);

        setNotification(t('seeker.requestSentSuccessfully'));
        setTimeout(() => setNotification(null), 3000);
        setIsContactModalOpen(false);
        setRequestSubject('');
        setRequestDetails('');
        setServiceDate('');
        setServiceTime('');
        setRequestLocationInput('');
        setRequestPhotoFile(null);

    } catch (error) {
        console.error("Error sending request:", error);
    } finally {
        setIsSending(false);
        setRequestPhotoUploadProgress(null);
    }
  };
  
  const handleShareLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setRequestLocation({ latitude, longitude });
                setRequestLocationInput(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
                setNotification(t('seeker.locationObtained'));
                setTimeout(() => setNotification(null), 3000);
            },
            () => {
                alert(t('seeker.couldNotGetLocation'));
            }
        );
    } else {
        alert(t('seeker.geolocationNotSupported'));
    }
  };

  const handleOpenJobDetails = async (job: Job) => {
    setSelectedJob(job);
    setIsJobDetailsModalOpen(true);
    setSelectedJobRecommenderDetails(null); // Reset on open

    try {
        const recommenderUserDoc = await getDoc(doc(db, 'users', job.recommenderId));
        const recommenderProfileDoc = await getDoc(doc(db, 'recommenders', job.recommenderId));

        const email = recommenderUserDoc.exists() ? recommenderUserDoc.data().email : t('seeker.notSpecified');
        const phone = recommenderProfileDoc.exists() ? recommenderProfileDoc.data()?.phone : t('seeker.notSpecified');
        
        setSelectedJobRecommenderDetails({ email, phone: phone || t('seeker.notSpecified') });
    } catch (e) {
        console.error("Error fetching recommender details:", e);
        setSelectedJobRecommenderDetails({ email: t('errorDefault'), phone: t('errorDefault') });
    }
  };

  const handleViewAppliedJob = async (application: JobApplication) => {
    try {
        const jobRef = doc(db, 'jobs', application.jobId);
        const jobSnap = await getDoc(jobRef);
        if (jobSnap.exists()) {
            const jobData = jobSnap.data();
            const sanitizedData: any = {};
            for (const key in jobData) {
                if (jobData[key] instanceof Timestamp) {
                    sanitizedData[key] = jobData[key].toDate().toISOString();
                } else {
                    sanitizedData[key] = jobData[key];
                }
            }
            const fetchedJob = { id: jobSnap.id, ...sanitizedData } as Job;
            handleOpenJobDetails(fetchedJob);
        } else {
            setNotification(t('publicJobView.jobNotFound'));
            setTimeout(() => setNotification(null), 3000);
        }
    } catch (error) {
        console.error("Error fetching job details:", error);
        setNotification(t('publicJobView.errorLoadingJob'));
        setTimeout(() => setNotification(null), 3000);
    }
  };
  
  const handleOpenPaywall = (job: Job) => {
    setIsJobDetailsModalOpen(false);
    setIsPaywallModalOpen(true);
  };

  const startPaymentProcess = (action: PurchaseAction, display: { name: string, price: number }) => {
    setPurchaseAction(action);
    setPurchaseDisplay(display);
    const simulatedSecret = `pi_${Date.now()}_secret_${Math.random().toString(36).substring(2)}`;
    setPaymentClientSecret(simulatedSecret);
    setIsPaymentModalOpen(true);
  };

  const handleJobUnlockPayment = (job: Job) => {
    setIsPaywallModalOpen(false);
    const action: PurchaseAction = { type: 'unlock_job', job };
    const display = { name: `${t('seeker.singlePaymentDescription')} ${job.title}`, price: 1.00 };
    startPaymentProcess(action, display);
  };

  const handleMembershipPayment = (membership: Membership) => {
    setIsPaywallModalOpen(false);
    const action: PurchaseAction = { type: 'buy_membership', membership };
    const display = { name: `${t('seeker.buyMembership')} ${membership.name}`, price: membership.price };
    startPaymentProcess(action, display);
  };
  
  const handlePaymentSuccess = async () => {
    if (!purchaseAction) return;
    try {
      const seekerRef = doc(db, 'seekers', user.uid);
      if (purchaseAction.type === 'unlock_job') {
        const { job } = purchaseAction;
        
        const currentProfile = await getDoc(seekerRef);
        const currentUnlocked = currentProfile.data()?.unlockedJobs || [];
        
        await setDoc(seekerRef, {
            unlockedJobs: [...currentUnlocked, job.id]
        }, { merge: true });
        
        setNotification(t('seeker.jobUnlockedSuccess'));
        setTimeout(() => setNotification(null), 4000);
        
        closePaymentModal();
        handleOpenJobDetails(job);
        
      } else if (purchaseAction.type === 'buy_membership') {
        const { membership } = purchaseAction;
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + membership.durationDays);
        await setDoc(seekerRef, {
          activeMembershipId: membership.id,
          membershipEndDate: Timestamp.fromDate(endDate)
        }, { merge: true });
        setNotification(t('seeker.membershipBenefit'));
        setTimeout(() => setNotification(null), 3000);
        closePaymentModal();
      }
    } catch (error) {
        console.error("Error confirming purchase:", error);
        setNotification(t('seeker.errorConfirmingPurchase'));
        setTimeout(() => setNotification(null), 3000);
        closePaymentModal();
    }
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setPaymentClientSecret(null);
    setPurchaseAction(null);
    setPurchaseDisplay(null);
  };

  const handleOpenApplicationModal = (job: Job) => {
    setSelectedJob(job);
    setIsJobDetailsModalOpen(false);
    setIsApplicationModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob || !cvFile) {
        setNotification(t('seeker.attachResume'));
        return;
    }
    if (!sendToCompany && !sendToRecommender) {
        setNotification(t('seeker.atLeastOneOption'));
        return;
    }

    setIsSending(true);
    setUploadProgress(0);

    const newAppRef = doc(collection(db, 'jobApplications'));
    const storageRef = ref(storage, `cvs/${user.uid}/${newAppRef.id}/${cvFile.name}`);

    try {
        // 1. Upload CV
        const downloadURL = await new Promise<string>((resolve, reject) => {
            const uploadTask = uploadBytesResumable(storageRef, cvFile);
            uploadTask.on('state_changed',
                (snapshot: UploadTaskSnapshot) => setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
                (error) => { console.error("Upload error:", error); reject(error); },
                async () => resolve(await getDownloadURL(uploadTask.snapshot.ref))
            );
        });

        // 2. Run DB Transaction
        let newCount = 0;
        const newStatus: ApplicationStatus = sendToCompany ? 'forwarded_to_company' : 'submitted';
        await runTransaction(db, async (transaction) => {
            const jobRef = doc(db, 'jobs', selectedJob.id);
            const jobDoc = await transaction.get(jobRef);
            if (!jobDoc.exists()) throw new Error("Job does not exist!");

            const currentCount = jobDoc.data().applicantCount || 0;
            if (globalMaxApplicants !== null && currentCount >= globalMaxApplicants) {
                throw new Error("Job has reached its applicant limit.");
            }
            
            newCount = currentCount + 1;
            transaction.update(jobRef, { applicantCount: increment(1) });
            
            transaction.set(newAppRef, {
                jobId: selectedJob.id,
                seekerId: user.uid,
                seekerName: user.name,
                recommenderId: selectedJob.recommenderId,
                cvUrl: downloadURL,
                coverLetter: coverLetter,
                appliedAt: serverTimestamp(),
                jobTitle: selectedJob.title,
                jobCompany: selectedJob.company,
                recommenderName: selectedJob.recommenderName,
                status: newStatus,
            });
        });

        // 3. Send Emails
        if (sendToCompany && selectedJob.contactEmail) {
            const recommenderUserDoc = await getDoc(doc(db, 'users', selectedJob.recommenderId));
            const recommenderProfileDoc = await getDoc(doc(db, 'recommenders', selectedJob.recommenderId));
            const seekerProfileDoc = await getDoc(doc(db, 'seekers', user.uid));
            
            const recommenderEmail = recommenderUserDoc.data()?.email || 'N/A';
            const recommenderPhone = recommenderProfileDoc.data()?.phone || 'N/A';
            const seekerPhone = seekerProfileDoc.data()?.phoneNumber || 'N/A';

            await addDoc(collection(db, "mail"), {
                to: [selectedJob.contactEmail],
                message: {
                    subject: t('emails.seekerToCompany.subject', { applicationId: newAppRef.id }),
                    html: t('emails.seekerToCompany.body', {
                        companyName: selectedJob.company,
                        seekerName: user.name,
                        jobTitle: selectedJob.title,
                        seekerEmail: user.email,
                        seekerPhone: seekerPhone,
                        cvUrl: downloadURL,
                        recommenderName: selectedJob.recommenderName,
                        recommenderEmail: recommenderEmail,
                        recommenderPhone: recommenderPhone,
                    }),
                },
            });
        }

        if (sendToRecommender) {
            const recommenderUserDoc = await getDoc(doc(db, 'users', selectedJob.recommenderId));
            const recommenderEmail = recommenderUserDoc.data()?.email;
            if (recommenderEmail) {
                await addDoc(collection(db, "mail"), {
                    to: [recommenderEmail],
                    message: {
                        subject: t('emails.seekerToRecommender.subject', { jobTitle: selectedJob.title }),
                        html: t('emails.seekerToRecommender.body', {
                            recommenderName: selectedJob.recommenderName,
                            seekerName: user.name,
                            jobTitle: selectedJob.title,
                            coverLetter: coverLetter,
                            cvUrl: downloadURL,
                        }),
                    },
                });
            }
        }
        
        // 4. Send Seeker Confirmation
        await addDoc(collection(db, "mail"), {
            to: [user.email],
            message: {
                subject: `${t('seeker.applicationConfirmation')}: ${selectedJob.title}`,
                html: t('seeker.seekerApplicationEmailBody', {
                    seekerName: user.name,
                    jobTitle: selectedJob.title,
                    companyName: selectedJob.company,
                    confirmationNumber: newAppRef.id,
                }),
            },
        });

        setNotification(t('seeker.applicationSentSuccessfully'));
        setIsApplicationModalOpen(false);
        setCoverLetter('');
        setCvFile(null);

    } catch (error: any) {
        console.error("Error submitting application:", error);
        setNotification(t('seeker.errorSubmittingApplication'));
    } finally {
        setIsSending(false);
        setUploadProgress(null);
    }
  };
    
  // --- APPLICATION & REQUEST MANAGEMENT HANDLERS ---
  const handleOpenEditApp = (app: JobApplication) => {
    setAppToEdit(app);
    setEditCoverLetter(app.coverLetter);
    setIsEditAppModalOpen(true);
  };
    
  const handleUpdateApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appToEdit) return;
    setIsSending(true);
    setEditUploadProgress(0);
    try {
      let downloadURL = appToEdit.cvUrl;
      if (editCvFile) {
        const storageRef = ref(storage, `cvs/${user.uid}/${appToEdit.id}/${editCvFile.name}`);
        downloadURL = await new Promise<string>((resolve, reject) => {
            const uploadTask = uploadBytesResumable(storageRef, editCvFile);
            uploadTask.on('state_changed', 
                (snapshot) => setEditUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
                (error) => reject(error),
                async () => resolve(await getDownloadURL(uploadTask.snapshot.ref))
            );
        });
      }
      await updateDoc(doc(db, 'jobApplications', appToEdit.id), {
        coverLetter: editCoverLetter,
        cvUrl: downloadURL,
      });
      setNotification(t('seeker.applicationUpdated'));
      setIsEditAppModalOpen(false);
    } catch (error) {
      console.error(error);
      setNotification(t('seeker.errorSubmittingApplication'));
    } finally {
      setIsSending(false);
      setEditUploadProgress(null);
      setEditCvFile(null);
    }
  };

  const handleOpenDeleteApp = (app: JobApplication) => {
    setAppToDelete(app);
    setIsDeleteAppModalOpen(true);
  };
    
  const handleConfirmDeleteApp = async () => {
    if (!appToDelete) return;
    setIsSending(true);
    try {
      await deleteDoc(doc(db, 'jobApplications', appToDelete.id));
      await runTransaction(db, async (transaction) => {
        const jobRef = doc(db, 'jobs', appToDelete.jobId);
        transaction.update(jobRef, { applicantCount: increment(-1) });
      });
      setNotification(t('seeker.applicationWithdrawnSuccessfully'));
      setIsDeleteAppModalOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

    const handleOpenShareModal = (item: Professional | RecommenderProfile, name: string, type: 'professional' | 'recommender') => {
        const text = type === 'professional' 
            ? t('seeker.shareProfessionalMsg') + ` ${name}`
            : t('seeker.shareRecommenderMsg') + ` ${name}`;
        
        const url = window.top.location.href; // Simplified for now
        setShareContent({ title: t('seeker.shareRecommendation'), text, url });
        setIsShareModalOpen(true);
    };

    const handleCopyToClipboard = () => {
        if (shareContent) {
            navigator.clipboard.writeText(`${shareContent.text} ${shareContent.url}`);
            setNotification(t('seeker.copied'));
            setTimeout(() => setNotification(null), 2000);
        }
    };

    const handleToggleFavorite = async (jobId: string) => {
        const seekerRef = doc(db, 'seekers', user.uid);
        if (favoriteJobs.includes(jobId)) {
            // Remove from favorites
            await updateDoc(seekerRef, {
                favoriteJobs: arrayRemove(jobId)
            });
        } else {
            // Add to favorites
            await updateDoc(seekerRef, {
                favoriteJobs: arrayUnion(jobId)
            });
        }
    };

    const getRequestStatusInfo = (req: ServiceRequest) => {
        if (req.attendedDate) {
            return { text: t('seeker.requestStatus.completed'), color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' };
        }
        switch (req.status) {
            case RequestStatus.LOCKED:
                return { text: t('seeker.requestStatus.in_process'), color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' };
            case RequestStatus.UNLOCKED:
                return { text: t('seeker.requestStatus.accepted'), color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' };
            default:
                return { text: req.status, color: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300' };
        }
    };

    const handleRateProfessional = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRequest || professionalRating === 0) return;
        setIsSending(true);
        try {
            await runTransaction(db, async (transaction) => {
                const professionalUserRef = doc(db, 'users', selectedRequest.professionalId);
                const requestRef = doc(db, 'serviceRequests', selectedRequest.id);
                
                const profDoc = await transaction.get(professionalUserRef);
                if (!profDoc.exists()) {
                    throw new Error("Professional not found!");
                }
                
                // Update the service request with the rating
                transaction.update(requestRef, { clientRating: professionalRating });
                
                // Update professional's average rating
                const oldRatingCount = profDoc.data().ratingCount || 0;
                const oldAverageRating = profDoc.data().averageRating || 0;
                const newRatingCount = oldRatingCount + 1;
                const newAverageRating = ((oldAverageRating * oldRatingCount) + professionalRating) / newRatingCount;
                
                transaction.update(professionalUserRef, {
                    ratingCount: newRatingCount,
                    averageRating: newAverageRating
                });
            });

            setNotification(t('seeker.ratingSavedSuccessfully'));
            setIsProfRatingModalOpen(false);
            setProfessionalRating(0);
        } catch (error) {
            console.error("Error saving rating:", error);
            setNotification(t('seeker.couldNotSaveRating'));
        } finally {
            setIsSending(false);
        }
    };

    const handleRateRecommender = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedApplication || recommenderRating === 0) return;
        setIsSending(true);
        try {
            await runTransaction(db, async (transaction) => {
                const recommenderUserRef = doc(db, 'users', selectedApplication.recommenderId);
                const applicationRef = doc(db, 'jobApplications', selectedApplication.id);
                
                const recommenderDoc = await transaction.get(recommenderUserRef);
                if (!recommenderDoc.exists()) {
                    throw new Error("Recommender not found!");
                }
                
                // Update the application with the rating
                transaction.update(applicationRef, { recommenderRating: recommenderRating });
                
                // Update recommender's average rating
                const oldRatingCount = recommenderDoc.data().ratingCount || 0;
                const oldAverageRating = recommenderDoc.data().averageRating || 0;
                const newRatingCount = oldRatingCount + 1;
                const newAverageRating = ((oldAverageRating * oldRatingCount) + recommenderRating) / newRatingCount;
                
                transaction.update(recommenderUserRef, {
                    ratingCount: newRatingCount,
                    averageRating: newAverageRating
                });
            });

            setNotification(t('seeker.ratingSavedSuccessfully'));
            setIsRecommenderRatingModalOpen(false);
            setRecommenderRating(0);
        } catch (error) {
            console.error("Error saving recommender rating:", error);
            setNotification(t('seeker.couldNotSaveRating'));
        } finally {
            setIsSending(false);
        }
    };

    const handleOpenDeleteRequestModal = (req: ServiceRequest) => {
        setRequestToDelete(req);
        setIsDeleteRequestModalOpen(true);
    };

    const handleConfirmDeleteOrCancelRequest = async () => {
        if (!requestToDelete) return;
        setIsSending(true);
        try {
            await deleteDoc(doc(db, 'serviceRequests', requestToDelete.id));
            if (requestToDelete.attendedDate) {
                setNotification(t('seeker.deleteRequest.success'));
            } else {
                setNotification(t('seeker.requestCancelledSuccessfully'));
            }
            setIsDeleteRequestModalOpen(false);
        } catch (error) {
            console.error("Error modifying request:", error);
            setNotification(t('seeker.deleteRequest.error'));
        } finally {
            setIsSending(false);
        }
    };

    const handleOpenEditRequest = (req: ServiceRequest) => {
        setRequestToEdit(req);
        setEditRequestDetails(req.requestDetails);
        setEditServiceDate(req.serviceDate || '');
        setEditServiceTime(req.serviceTime || '');
        setIsEditRequestModalOpen(true);
    };

    const handleUpdateRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!requestToEdit) return;
        setIsSending(true);
        try {
            const requestRef = doc(db, 'serviceRequests', requestToEdit.id);
            await updateDoc(requestRef, {
                requestDetails: editRequestDetails,
                serviceDate: editServiceDate,
                serviceTime: editServiceTime,
            });
            setNotification(t('seeker.requestUpdated'));
            setIsEditRequestModalOpen(false);
        } catch (error) {
            console.error("Error updating request:", error);
        } finally {
            setIsSending(false);
        }
    };
    
    // --- JSX FOR THE COMPONENT ---
    const totalServiceRequestPages = Math.ceil(filteredServiceRequests.length / SERVICE_REQUESTS_PER_PAGE);
    const currentServiceRequests = filteredServiceRequests.slice((serviceRequestsPage - 1) * SERVICE_REQUESTS_PER_PAGE, serviceRequestsPage * SERVICE_REQUESTS_PER_PAGE);

    const totalJobAppPages = Math.ceil(filteredJobApps.length / JOB_APPS_PER_PAGE);
    const currentJobApps = filteredJobApps.slice((jobAppsPage - 1) * JOB_APPS_PER_PAGE, jobAppsPage * JOB_APPS_PER_PAGE);


    return (
        <>
            <Toast message={notification} onClose={() => setNotification(null)} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card title={t('seeker.advancedSearch')} icon={<MagnifyingGlassIcon />}>
                        {/* Tabs */}
                        <div className="border-b border-gray-200 dark:border-gray-700">
                            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                <button onClick={() => setActiveTab('professionals')} className={`${activeTab === 'professionals' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>{t('seeker.professionals')}</button>
                                <button onClick={() => setActiveTab('jobs')} className={`${activeTab === 'jobs' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>{t('seeker.jobs')}</button>
                            </nav>
                        </div>
                        {/* Search Forms */}
                        <div className="py-4">
                            {activeTab === 'professionals' ? (
                                <div className="space-y-4">
                                    <input type="text" placeholder={t('seeker.searchByName')} value={professionalSearchName} onChange={e => setProfessionalSearchName(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" />
                                    <input type="text" placeholder={t('seeker.searchBySpecialty')} value={professionalSearchSpecialty} onChange={e => setProfessionalSearchSpecialty(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" />
                                    <Button onClick={handleProfessionalSearch} disabled={loading}>{loading ? t('seeker.searching') : t('seeker.search')}</Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <input type="text" placeholder={t('seeker.searchByKeyword')} value={jobSearchKeyword} onChange={e => setJobSearchKeyword(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" />
                                    <input type="text" placeholder={t('seeker.searchByCity')} value={jobSearchCity} onChange={e => setJobSearchCity(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" />
                                    <Button onClick={handleJobSearch} disabled={loading}>{loading ? t('seeker.searching') : t('seeker.search')}</Button>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Results */}
                    {searched && !loading && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">{activeTab === 'professionals' ? `${professionalResults.length} ${t('seeker.professionalsFound')}` : `${jobResults.length} ${t('seeker.jobsFound')}`}</h3>
                            {activeTab === 'professionals' && professionalResults.map(prof => (
                                <Card key={prof.uid} title="">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        {prof.profile.photoURL && <img src={prof.profile.photoURL} alt={prof.name} className="w-20 h-20 rounded-full object-cover"/>}
                                        <div className="flex-grow">
                                            <h4 className="font-bold text-lg flex items-center">{prof.name} {prof.profile.isVerified && <VerifiedBadge />}</h4>
                                            <p className="text-indigo-500">{prof.profile.specialty}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{prof.profile.bio}</p>
                                            <div className="flex items-center text-sm text-slate-500"><StarRating rating={prof.averageRating} readOnly/> <span className="ml-2">({prof.reviewCount} {t('recommender.opinions')})</span></div>
                                            <p className="text-sm text-slate-500">{prof.successfulServices} {t('seeker.successfulServices')}</p>
                                        </div>
                                        <div className="flex flex-col sm:items-end gap-2">
                                            <Button onClick={() => handleOpenContactModal(prof)}>{t('seeker.viewAndContact')}</Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                            {activeTab === 'jobs' && jobResults.map(job => {
                                const isFavorite = favoriteJobs.includes(job.id);
                                const applicants = job.applicantCount || 0;
                                const maxApplicants = globalMaxApplicants || 0;
                                const progress = maxApplicants > 0 ? (applicants / maxApplicants) * 100 : 0;
                                
                                return (
                                <Card key={job.id} title="">
                                    <div className="relative">
                                        <button 
                                            onClick={() => handleToggleFavorite(job.id)} 
                                            className="absolute top-0 right-0 p-2 text-slate-400 hover:text-red-500 transition-colors"
                                            title={isFavorite ? t('seeker.removeFromFavorites') : t('seeker.addToFavorites')}
                                        >
                                            <HeartIcon className="w-6 h-6" solid={isFavorite} />
                                        </button>
                                        <h4 className="font-bold text-lg pr-10">{job.title}</h4>
                                        <p className="text-sm text-slate-500">{job.city} - {jobTypeLabels[job.jobType || 'full_time']}</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">{job.description}</p>
                                        
                                        {globalMaxApplicants !== null && (
                                            <div className="mt-3">
                                                <div className="flex justify-between text-xs text-slate-500">
                                                    <span>{t('seeker.applicants')}</span>
                                                    <span>{t('seeker.applicantsProgress', { count: applicants, max: maxApplicants })}</span>
                                                </div>
                                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-1">
                                                    <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                            <div>
                                                <p className="text-xs text-slate-500">{t('seeker.recommendedBy')}</p>
                                                <div className="flex items-center space-x-2">
                                                    {job.recommenderPhotoURL && <img src={job.recommenderPhotoURL} alt={job.recommenderName} className="w-8 h-8 rounded-full object-cover" />}
                                                    <p className="font-semibold">{job.recommenderName}</p>
                                                    <StarRating rating={job.recommenderAverageRating} readOnly size="sm"/>
                                                </div>
                                            </div>
                                            <Button onClick={() => handleOpenJobDetails(job)}>{t('seeker.viewDetails')}</Button>
                                        </div>
                                    </div>
                                </Card>
                            )})}
                        </div>
                    )}
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <Card title={t('seeker.myProfile')} icon={<UserCircleIcon />}>
                        <div className="flex items-center space-x-4">
                             {seekerProfile?.photoURL ? (
                                <img src={seekerProfile.photoURL} alt={user.name} className="w-20 h-20 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm" />
                            ) : (
                                <UserCircleIcon className="w-20 h-20 text-slate-300 dark:text-slate-600" />
                            )}
                            <div className="flex-grow">
                                <h4 className="font-bold text-lg">{user.name}</h4>
                                <p className="text-sm text-slate-500 truncate">{user.email}</p>
                                <p className="text-sm text-slate-500">{seekerProfile?.city || t('seeker.notSpecified')}</p>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                             <p className="text-sm"><strong>{t('seeker.phoneNumber')}:</strong> {seekerProfile?.phoneNumber || t('seeker.notSpecified')}</p>
                             <p className="text-sm"><strong>{t('professional.membership')}:</strong> <span className={hasActiveMembership ? 'text-green-500' : 'text-red-500'}>{hasActiveMembership ? t('professional.active') : t('professional.inactive')}</span></p>
                        </div>
                        <Button onClick={handleOpenEditModal} className="w-full mt-4">{t('seeker.editProfile')}</Button>
                    </Card>

                    <Card title={t('seeker.myJobApplications')} icon={<ClipboardDocumentListIcon />}>
                         <input type="text" placeholder={t('seeker.searchInMyApps')} value={jobAppSearchTerm} onChange={e => setJobAppSearchTerm(e.target.value)} className="w-full px-3 py-2 mb-4 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" />
                        {filteredJobApps.length > 0 ? (
                            <>
                             <ul className="space-y-4">
                                {currentJobApps.map(app => (
                                    <li key={app.id} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
                                        <p className="font-bold">{app.jobTitle}</p>
                                        <p className="text-sm text-slate-500">{app.jobCompany}</p>
                                        <p className="text-xs text-slate-400">{t('seeker.appliedOn')} {new Date(app.appliedAt).toLocaleDateString()}</p>
                                        <ApplicationStatusTracker status={app.status}/>
                                        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
                                            <Button size="sm" variant="secondary" onClick={() => handleViewAppliedJob(app)} title={t('seeker.viewJobOffer')}>
                                                <EyeIcon className="w-4 h-4" />
                                            </Button>
                                            <Button size="sm" variant="secondary" onClick={() => handleOpenEditApp(app)}><PencilIcon className="w-4 h-4 mr-1"/>{t('edit')}</Button>
                                            <Button size="sm" variant="danger" onClick={() => handleOpenDeleteApp(app)}><TrashIcon className="w-4 h-4 mr-1"/>{t('seeker.withdraw')}</Button>
                                            {!app.recommenderRating && <Button size="sm" onClick={() => { setSelectedApplication(app); setIsRecommenderRatingModalOpen(true); }}>{t('seeker.rate')}</Button>}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            {totalJobAppPages > 1 && (
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">{t('page')} {jobAppsPage} {t('of')} {totalJobAppPages}</span>
                                    <div className="space-x-2">
                                        <Button onClick={() => setJobAppsPage(p => p - 1)} disabled={jobAppsPage === 1} size="sm">{t('previous')}</Button>
                                        <Button onClick={() => setJobAppsPage(p => p + 1)} disabled={jobAppsPage >= totalJobAppPages} size="sm">{t('next')}</Button>
                                    </div>
                                </div>
                            )}
                            </>
                        ) : <p className="text-slate-500">{t('seeker.noApplicationsYet')}</p>}
                    </Card>

                     <Card title={t('seeker.myServiceRequests')} icon={<ClipboardDocumentListIcon />}>
                         <input type="text" placeholder={t('seeker.searchInMyRequests')} value={serviceRequestSearchTerm} onChange={e => setServiceRequestSearchTerm(e.target.value)} className="w-full px-3 py-2 mb-4 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" />
                        {filteredServiceRequests.length > 0 ? (
                            <>
                             <ul className="space-y-4">
                                {currentServiceRequests.map(req => {
                                    const statusInfo = getRequestStatusInfo(req);
                                    return (
                                        <li key={req.id} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
                                            <div className="flex justify-between items-start">
                                                <p className="font-bold">{req.professionalName}</p>
                                                <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${statusInfo.color}`}>{statusInfo.text}</span>
                                            </div>
                                            <p className="text-xs text-slate-400">{t('seeker.sentOn')} {new Date(req.createdAt).toLocaleDateString()}</p>
                                            <p className="text-sm mt-1 font-semibold">{req.requestSubject}</p>
                                            <p className="text-sm mt-1 italic">"{req.requestDetails}"</p>
                                            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
                                                {!req.clientRating && req.attendedDate && <Button size="sm" onClick={() => { setSelectedRequest(req); setIsProfRatingModalOpen(true); }}>{t('seeker.rate')}</Button>}
                                                {!req.attendedDate && <Button size="sm" variant="secondary" onClick={() => handleOpenEditRequest(req)}><PencilIcon className="w-4 h-4 mr-1"/>{t('edit')}</Button>}
                                                {req.attendedDate && req.clientRating ? (
                                                    <Button size="sm" variant="danger" onClick={() => handleOpenDeleteRequestModal(req)}><TrashIcon className="w-4 h-4 mr-1"/>{t('delete')}</Button>
                                                ) : (
                                                    !req.attendedDate && <Button size="sm" variant="danger" onClick={() => handleOpenDeleteRequestModal(req)}><TrashIcon className="w-4 h-4 mr-1"/>{t('seeker.cancelRequest')}</Button>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                            {totalServiceRequestPages > 1 && (
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">{t('page')} {serviceRequestsPage} {t('of')} {totalServiceRequestPages}</span>
                                    <div className="space-x-2">
                                        <Button onClick={() => setServiceRequestsPage(p => p - 1)} disabled={serviceRequestsPage === 1} size="sm">{t('previous')}</Button>
                                        <Button onClick={() => setServiceRequestsPage(p => p + 1)} disabled={serviceRequestsPage >= totalServiceRequestPages} size="sm">{t('next')}</Button>
                                    </div>
                                </div>
                            )}
                            </>
                        ) : <p className="text-slate-500">{t('seeker.noRequestsYet')}</p>}
                    </Card>
                </div>
            </div>
            {/* --- ALL MODALS --- */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={t('seeker.editMyProfile')}>
                <form onSubmit={handleSaveProfile} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    <div>
                        <label className="block text-sm font-medium">{t('name')}</label>
                        <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-md" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">{t('seeker.profilePhoto')}</label>
                        <div className="mt-2 flex items-center space-x-4">
                             {editPhotoPreview ? (
                                <img src={editPhotoPreview} alt={t('seeker.photoPreview')} className="w-20 h-20 rounded-full object-cover"/>
                            ) : (
                                <UserCircleIcon className="w-20 h-20 text-slate-300 dark:text-slate-600" />
                            )}
                            <input type="file" accept="image/*" onChange={handlePhotoChange} id="photo-upload" className="hidden"/>
                            <label htmlFor="photo-upload" className="cursor-pointer bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-medium py-2 px-4 rounded-md text-sm">{t('seeker.changePhoto')}</label>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">{t('seeker.documentType')}</label>
                            <select value={editDocumentType} onChange={e => setEditDocumentType(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md">
                                <option value="">{t('seeker.selectIdType')}</option>
                                <option value="cc">{t('seeker.cc')}</option>
                                <option value="ce">{t('seeker.ce')}</option>
                                <option value="passport">{t('seeker.passport')}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">{t('seeker.documentNumber')}</label>
                            <input type="text" value={editDocumentNumber} onChange={e => setEditDocumentNumber(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-md" />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">{t('seeker.phoneNumber')}</label>
                        <input type="tel" value={editPhoneNumber} onChange={e => setEditPhoneNumber(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-md" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">{t('seeker.city')}</label>
                        <input type="text" value={editCity} onChange={e => setEditCity(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-md" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">{t('seeker.address')}</label>
                        <input type="text" value={editAddress} onChange={e => setEditAddress(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-md" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">{t('seeker.areaCode')}</label>
                        <input type="text" value={editAreaCode} onChange={e => setEditAreaCode(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-md" />
                    </div>
                    <div className="flex justify-end pt-4 space-x-2">
                        <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>{t('cancel')}</Button>
                        <Button type="submit" disabled={isSaving}>{isSaving ? t('saving') : t('saveChanges')}</Button>
                    </div>
                </form>
            </Modal>
            
            <Modal isOpen={isJobDetailsModalOpen} onClose={() => setIsJobDetailsModalOpen(false)} title={t('seeker.jobDetails')}>
                {selectedJob && (() => {
                    const isUnlocked = hasActiveMembership || unlockedJobs.includes(selectedJob.id);
                    const hasApplied = jobApplications.some(app => app.jobId === selectedJob.id);
                    return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">{selectedJob.title}</h3>
                         <p className="text-lg text-slate-600 dark:text-slate-400">{selectedJob.city}</p>
                         <div className="prose prose-sm dark:prose-invert max-w-none"><p>{selectedJob.description}</p></div>
                         
                         <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                             <h4 className="font-semibold text-slate-800 dark:text-slate-200">{t('seeker.recommendedBy')}</h4>
                            <p><strong>{t('name')}:</strong> {selectedJob.recommenderName}</p>
                            {selectedJobRecommenderDetails ? (
                                <>
                                    <p><strong>{t('email')}:</strong> {selectedJobRecommenderDetails.email}</p>
                                    <p><strong>{t('phone')}:</strong> {selectedJobRecommenderDetails.phone}</p>
                                </>
                            ) : (
                                <p>{t('loading')}...</p>
                            )}
                         </div>
                         
                         {isUnlocked && (
                            <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                                <h4 className="font-semibold text-slate-800 dark:text-slate-200">{t('seeker.companyContactInfo')}</h4>
                                <p><strong>{t('seeker.person')}:</strong> {selectedJob.contactPerson || 'N/A'}</p>
                                <p><strong>{t('seeker.email')}:</strong> {selectedJob.contactEmail || 'N/A'}</p>
                                <p><strong>{t('seeker.phone')}:</strong> {selectedJob.contactPhone || 'N/A'}</p>
                            </div>
                         )}

                         <Button onClick={() => {
                            if (isUnlocked) {
                                handleOpenApplicationModal(selectedJob);
                            } else {
                                handleOpenPaywall(selectedJob);
                            }
                         }} disabled={hasApplied} className="w-full mt-4">
                            {hasApplied ? t('seeker.alreadyApplied') : (isUnlocked ? t('seeker.proceedToApplication') : t('seeker.unlockAndApply'))}
                         </Button>
                    </div>
                )
                })()}
            </Modal>

            <Modal isOpen={isPaywallModalOpen} onClose={() => setIsPaywallModalOpen(false)} title={t('seeker.premiumAccess')}>
                 <div className="space-y-4">
                    <p className="text-slate-600 dark:text-slate-400">{t('seeker.premiumAccessDescription')}</p>
                    <div className="p-4 border rounded-lg space-y-2 cursor-pointer hover:border-indigo-500" onClick={() => handleMembershipPayment(memberships[0])}>
                         <h4 className="font-bold">{t('seeker.recommendedOption')}: {t('seeker.buyMembership')}</h4>
                         <p className="text-sm text-slate-500">{t('seeker.membershipBenefit')}</p>
                    </div>
                     {selectedJob && (
                        <div className="p-4 border rounded-lg space-y-2 cursor-pointer hover:border-indigo-500" onClick={() => handleJobUnlockPayment(selectedJob)}>
                             <h4 className="font-bold">{t('seeker.singlePayment')}</h4>
                             <p className="text-sm text-slate-500">{t('seeker.singlePaymentDescription')} $1.00</p>
                        </div>
                    )}
                 </div>
            </Modal>
            
            <Modal isOpen={isApplicationModalOpen} onClose={() => setIsApplicationModalOpen(false)} title={`${t('seeker.applyTo')} ${selectedJob?.title}`}>
                <form onSubmit={handleSubmitApplication} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">{t('seeker.coverLetterOptional')}</label>
                        <textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)} rows={5} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-md" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">{t('seeker.attachResume')}</label>
                        <input type="file" onChange={handleFileChange} className="mt-1 block w-full text-sm" required />
                    </div>
                    <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <label className="flex items-center">
                            <input type="checkbox" checked={sendToCompany} onChange={e => setSendToCompany(e.target.checked)} className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300" />
                            <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">{t('seeker.sendToCompany')}</span>
                        </label>
                        <label className="flex items-center">
                            <input type="checkbox" checked={sendToRecommender} onChange={e => setSendToRecommender(e.target.checked)} className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300" />
                            <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">{t('seeker.sendCopyToRecommender')}</span>
                        </label>
                    </div>
                     {uploadProgress !== null && (
                        <div>
                             <label className="block text-sm font-medium">{t('seeker.uploadProgress')}</label>
                            <div className="w-full bg-slate-200 rounded-full h-2.5 dark:bg-slate-700">
                                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                            </div>
                        </div>
                    )}
                    <Button type="submit" disabled={isSending || (!sendToCompany && !sendToRecommender)} className="w-full">{isSending ? `${t('seeker.uploading')} ${uploadProgress?.toFixed(0) ?? 0}%` : t('seeker.confirmApplication')}</Button>
                </form>
            </Modal>
            
            <Modal isOpen={isPaymentModalOpen} onClose={closePaymentModal} title={`${t('payment.payNow')}: ${purchaseDisplay?.name || ''}`}>
                {paymentClientSecret ? (
                    <StripeCheckoutForm clientSecret={paymentClientSecret} onSuccess={handlePaymentSuccess} onError={(msg) => setNotification(`${t('seeker.paymentError')} ${msg}`)} />
                ) : <p>{t('seeker.loadingPaymentGateway')}</p>}
            </Modal>

             <Modal isOpen={isEditAppModalOpen} onClose={() => setIsEditAppModalOpen(false)} title={t('seeker.editApplication') + ` ${appToEdit?.jobTitle || ''}`}>
                <form onSubmit={handleUpdateApplication} className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium">{t('seeker.coverLetterOptional')}</label>
                        <textarea value={editCoverLetter} onChange={e => setEditCoverLetter(e.target.value)} rows={5} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">{t('seeker.updateResume')}</label>
                        <p className="text-xs text-slate-500 mb-2">{t('seeker.updateResumeDescription')}</p>
                        <input type="file" onChange={(e) => setEditCvFile(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-sm" />
                    </div>
                     {editUploadProgress !== null && (
                        <div>
                             <label className="block text-sm font-medium">{t('seeker.uploadProgress')}</label>
                            <div className="w-full bg-slate-200 rounded-full h-2.5 dark:bg-slate-700">
                                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${editUploadProgress}%` }}></div>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end space-x-2 pt-2">
                        <Button type="button" variant="secondary" onClick={() => setIsEditAppModalOpen(false)}>{t('cancel')}</Button>
                        <Button type="submit" disabled={isSending}>{isSending ? `${t('seeker.uploading')}...` : t('saveChanges')}</Button>
                    </div>
                </form>
            </Modal>
            <Modal isOpen={isDeleteAppModalOpen} onClose={() => setIsDeleteAppModalOpen(false)} title={t('seeker.withdrawApplication')}>
                <p>{t('seeker.confirmWithdraw')} "<strong>{appToDelete?.jobTitle}</strong>"?</p>
                 <p className="text-sm text-slate-500 mt-2">{t('seeker.actionCannotBeUndone')}</p>
                 <div className="flex justify-end space-x-3 pt-4 mt-2">
                    <Button variant="secondary" onClick={() => setIsDeleteAppModalOpen(false)}>{t('cancel')}</Button>
                    <Button variant="danger" onClick={handleConfirmDeleteApp} disabled={isSending}>{isSending ? t('seeker.withdrawing') : t('seeker.yesWithdraw')}</Button>
                </div>
            </Modal>
            <Modal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} title={t('seeker.contactAndProfileTitle', {name: selectedProfessional?.name || ''})}>
                {selectedProfessional && (
                    <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
                        {/* Profile Details */}
                        <div>
                           <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                                {selectedProfessional.profile.photoURL && <img src={selectedProfessional.profile.photoURL} alt={selectedProfessional.name} className="w-24 h-24 rounded-full object-cover flex-shrink-0"/>}
                                <div className="flex-grow">
                                    <h4 className="font-bold text-xl flex items-center justify-center sm:justify-start">{selectedProfessional.name} {selectedProfessional.profile.isVerified && <VerifiedBadge />}</h4>
                                    <p className="text-indigo-500">{selectedProfessional.profile.specialty}</p>
                                    <div className="flex items-center justify-center sm:justify-start text-sm text-slate-500"><StarRating rating={selectedProfessional.averageRating} readOnly/> <span className="ml-2">({selectedProfessional.reviewCount} {t('recommender.opinions')})</span></div>
                                    <p className="text-sm text-slate-500">{selectedProfessional.successfulServices} {t('seeker.successfulServices')}</p>
                                </div>
                            </div>
                            <div className="mt-4 space-y-3">
                                <div>
                                    <h5 className="font-semibold">{t('seeker.bio')}</h5>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{selectedProfessional.profile.bio || t('seeker.noBio')}</p>
                                </div>
                                 <div>
                                    <h5 className="font-semibold">{t('seeker.services')}</h5>
                                    {selectedProfessional.profile.services?.length > 0 ? (
                                        <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 mt-1">
                                            {selectedProfessional.profile.services.map((s, i) => <li key={i}>{s}</li>)}
                                        </ul>
                                    ): <p className="text-sm text-slate-500">{t('seeker.noServicesListed')}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <form onSubmit={handleSendRequest} className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                             <div>
                                <label className="block text-sm font-medium">{t('seeker.requestSubject')}</