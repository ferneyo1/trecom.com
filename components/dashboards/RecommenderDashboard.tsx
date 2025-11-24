import React, { useState, useEffect, useRef } from 'react';
import { User, Job, RecommenderProfile, JobApplication, RecommenderPayoutSettings, Earning, Payment, ApplicationStatus, SeekerProfile } from '../../types';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { db, auth } from '../../firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, setDoc, updateDoc, getDocs, Timestamp, getDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { Modal } from '../shared/Modal';
import Toast from '../shared/Toast';
import StarRating from '../shared/StarRating';
import { useLanguage } from '../../contexts/LanguageContext';

interface RecommenderDashboardProps {
  user: User;
}

interface ShareContent {
    title: string;
    text: string;
    url: string;
}

const BriefcaseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M11.25 6.162A.763.763 0 0010.5 5.25h-3a.75.75 0 00-.75.75v.012a.763.763 0 00.75.75h3c.29 0 .553-.166.688-.412zM12.75 6.162a.763.763 0 01.688-.412h3a.75.75 0 01.75.75v.012a.763.763 0 01-.75.75h-3a.763.763 0 01-.688-.412zM9 9.75a.75.75 0 00-.75.75v10.5a.75.75 0 00.75.75h6a.75.75 0 00.75-.75V10.5a.75.75 0 00-.75-.75H9z" />
        <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h14.25c1.035 0 1.875.84 1.875 1.875v9.375a3 3 0 01-3 3H6a3 3 0 01-3-3V9.375zm3.75-1.875a1.875 1.875 0 00-1.875 1.875v.375h13.5v-.375a1.875 1.875 0 00-1.875-1.875h-9.75z" clipRule="evenodd" />
    </svg>
);
const UserCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
    </svg>
);
const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
      <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.342 1.374a3.026 3.026 0 01.64 2.287V17.5a3 3 0 01-3 3h-5.25a3 3 0 01-3-3V6.732a3.026 3.026 0 01.64-2.287c.512-.788 1.375-1.322 2.342-1.374zM12 5.25a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
    </svg>
);
const XCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
    </svg>
);
const PencilIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
        <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25-1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
    </svg>
);
const UsersIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.41-1.412a6.998 6.998 0 00-12.262 0z" />
    </svg>
);
const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25-.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
    </svg>
);
const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.006z" clipRule="evenodd" />
    </svg>
);
const CurrencyDollarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.093c-1.75.086-3.16.5-4.06 1.093a.75.75 0 00.44 1.363c1.123-.67 2.39-1.052 3.87-1.052v1.352c-2.454.346-4.117 1.54-4.117 3.42 0 1.873 1.636 3.067 4.117 3.42v1.293c-1.407-.024-2.653-.418-3.718-1.025a.75.75 0 00-.88 1.252c1.242.724 2.836 1.157 4.598 1.157v.093a.75.75 0 001.5 0v-.093c1.75-.086 3.16-.5 4.06-1.093a.75.75 0 00-.44-1.363c-1.123.67-2.39 1.052-3.87 1.052v-1.352c2.454-.346 4.117-1.54 4.117-3.42 0-1.873-1.636-3.067-4.117-3.42V8.67c1.407.024 2.653.418 3.718 1.025a.75.75 0 10.88-1.252c-1.242-.724-2.836-1.157-4.598-1.157V6z" clipRule="evenodd" /></svg>
);
const ShareIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M13 13.5a2.5 2.5 0 11.702-4.289l-3.296 1.648a2.504 2.504 0 010 1.126l3.296 1.648A2.5 2.5 0 1113 15.5v-1.615a2.5 2.5 0 01-1.298-2.201l-3.296-1.648a2.5 2.5 0 010-1.126l3.296-1.648A2.5 2.5 0 0113 4.5z" />
    </svg>
);


function RecommenderDashboard({ user }: RecommenderDashboardProps) {
  const { t } = useLanguage();
  // Job publishing state
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobType, setJobType] = useState<'remote' | 'part_time' | 'full_time'>('full_time');
  const [city, setCity] = useState('');
  const [areaCode, setAreaCode] = useState('');
  const [salaryAmount, setSalaryAmount] = useState<number | ''>('');
  const [salaryType, setSalaryType] = useState<'per_hour' | 'per_year'>('per_year');
  const [contactPerson, setContactPerson] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [tasks, setTasks] = useState<string[]>([]);
  const [newTask, setNewTask] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Profile state
  const [profile, setProfile] = useState<RecommenderProfile | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editPhone, setEditPhone] = useState('');
  const [editPhotoURL, setEditPhotoURL] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Camera Modal State
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Published Jobs Management State
  const [searchTitle, setSearchTitle] = useState('');
  const [searchCompany, setSearchCompany] = useState('');
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const JOBS_PER_PAGE = 5;

  const [isEditJobModalOpen, setIsEditJobModalOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState<Job | null>(null);
  const [editJobForm, setEditJobForm] = useState<Partial<Job>>({});

  const [isApplicantsModalOpen, setIsApplicantsModalOpen] = useState(false);
  const [jobForApplicants, setJobForApplicants] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<JobApplication[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  // New state for updating company response
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [appToUpdate, setAppToUpdate] = useState<JobApplication | null>(null);
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('under_review');
  
  // Payout & Earnings State
  const [payoutSettings, setPayoutSettings] = useState<RecommenderPayoutSettings | null>(null);
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  // Share Modal State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareContent, setShareContent] = useState<ShareContent | null>(null);

  const jobTypeLabels: { [key in Job['jobType'] & string]: string } = {
    full_time: t('recommender.fullTime'),
    part_time: t('recommender.partTime'),
    remote: t('recommender.remote')
  };

  const statusLabels: { [key in ApplicationStatus]: string } = {
    submitted: t('seeker.applicationStatus.submitted'),
    recommender_rejected: t('seeker.applicationStatus.recommender_rejected'),
    forwarded_to_company: t('seeker.applicationStatus.forwarded_to_company'),
    under_review: t('seeker.applicationStatus.under_review'),
    interviewing: t('seeker.applicationStatus.interviewing'),
    company_rejected: t('seeker.applicationStatus.company_rejected'),
    hired: t('seeker.applicationStatus.hired'),
  };


  useEffect(() => {
    const jobsQuery = query(collection(db, 'jobs'), where('recommenderId', '==', user.uid));
    const unsubscribeJobs = onSnapshot(jobsQuery, snapshot => {
        const userJobs = snapshot.docs.map(doc => {
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
        setJobs(userJobs);
    });
    
    const profileRef = doc(db, 'recommenders', user.uid);
    const unsubscribeProfile = onSnapshot(profileRef, doc => {
        if (doc.exists()) {
            const data = doc.data();
            const sanitizedData: any = {};
            for (const key in data) {
                if (data[key] instanceof Timestamp) {
                    sanitizedData[key] = data[key].toDate().toISOString();
                } else {
                    sanitizedData[key] = data[key];
                }
            }
            setProfile(sanitizedData as RecommenderProfile);
        }
    });
    
    const payoutSettingsRef = doc(db, 'settings', 'recommenderPayouts');
    const unsubscribePayouts = onSnapshot(payoutSettingsRef, (doc) => {
        if (doc.exists()) {
            setPayoutSettings(doc.data() as RecommenderPayoutSettings);
        }
    });

    const earningsQuery = query(collection(db, 'earnings'), where('recommenderId', '==', user.uid));
    const unsubscribeEarnings = onSnapshot(earningsQuery, (snapshot) => {
        const userEarnings = snapshot.docs.map(doc => {
            const data = doc.data();
            const sanitizedData: any = {};
            for (const key in data) {
                if (data[key] instanceof Timestamp) {
                    sanitizedData[key] = data[key].toDate().toISOString();
                } else {
                    sanitizedData[key] = data[key];
                }
            }
            return { id: doc.id, ...sanitizedData } as Earning;
        });
        setEarnings(userEarnings);
    });
    
    const paymentsQuery = query(collection(db, 'payments'), where('recommenderId', '==', user.uid));
    const unsubscribePayments = onSnapshot(paymentsQuery, (snapshot) => {
        const userPayments = snapshot.docs.map(doc => {
            const data = doc.data();
            const sanitizedData: any = {};
            for (const key in data) {
                if (data[key] instanceof Timestamp) {
                    sanitizedData[key] = data[key].toDate().toISOString();
                } else {
                    sanitizedData[key] = data[key];
                }
            }
            return { id: doc.id, ...sanitizedData } as Payment;
        });
        userPayments.sort((a, b) => (new Date(b.createdAt).getTime() || 0) - (new Date(a.createdAt).getTime() || 0));
        setPayments(userPayments);
    });
    
    return () => {
        unsubscribeJobs();
        unsubscribeProfile();
        unsubscribePayouts();
        unsubscribeEarnings();
        unsubscribePayments();
    };
  }, [user.uid]);

  useEffect(() => {
    const activeJobs = jobs.filter(job => job.status !== 'pending_deletion');
    const filtered = activeJobs
        .filter(job => 
            job.title.toLowerCase().includes(searchTitle.toLowerCase()) &&
            job.company.toLowerCase().includes(searchCompany.toLowerCase())
        )
        .sort((a, b) => (new Date(b.createdAt).getTime() || 0) - (new Date(a.createdAt).getTime() || 0));
    setFilteredJobs(filtered);
    if (currentPage > Math.ceil(filtered.length / JOBS_PER_PAGE)) {
        setCurrentPage(1);
    }
  }, [jobs, searchTitle, searchCompany, currentPage]);

  useEffect(() => {
    if (isCameraModalOpen) {
      const startStream = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Error accessing camera: ", err);
          alert("No se pudo acceder a la cámara. Asegúrese de haber otorgado los permisos.");
          setIsCameraModalOpen(false);
        }
      };
      startStream();
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [isCameraModalOpen]);
  
  const handleAddTask = () => {
    if (newTask.trim() && !tasks.includes(newTask.trim())) {
        setTasks([...tasks, newTask.trim()]);
        setNewTask('');
    }
  };

  const handleRemoveTask = (indexToRemove: number) => {
    setTasks(tasks.filter((_, index) => index !== indexToRemove));
  };


  const handlePublishJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !companyName || !jobDescription || !city) {
        setNotification(t('errorAllFields'));
        setTimeout(() => setNotification(null), 3000);
        return;
    }
    setLoading(true);
    try {
        const jobPayload: any = {
            title: jobTitle,
            company: companyName,
            description: jobDescription,
            jobType: jobType,
            city: city,
            areaCode: areaCode,
            contactPerson: contactPerson,
            contactEmail: contactEmail,
            contactPhone: contactPhone,
            tasks: tasks,
            recommenderId: user.uid,
            recommenderName: user.name,
            createdAt: serverTimestamp(),
            applicantCount: 0,
            status: 'active',
            isVerified: false,
        };

        if (salaryAmount && salaryAmount > 0) {
            jobPayload.salaryAmount = salaryAmount;
            jobPayload.salaryType = salaryType;
        }

        await addDoc(collection(db, 'jobs'), jobPayload);
        
        // Send confirmation email
        if (user.email) {
            await addDoc(collection(db, "mail"), {
                to: [user.email],
                message: {
                    subject: t('emails.recommender.jobPublishedSubject'),
                    html: t('emails.recommender.jobPublishedBody', { name: user.name, jobTitle: jobTitle }),
                },
            });
        }

        setJobTitle('');
        setCompanyName('');
        setJobDescription('');
        setJobType('full_time');
        setCity('');
        setAreaCode('');
        setSalaryAmount('');
        setSalaryType('per_year');
        setTasks([]);
        setNewTask('');
        setContactPerson('');
        setContactEmail('');
        setContactPhone('');
        setNotification(t('recommender.jobPublishedSuccessfully'));
        setTimeout(() => setNotification(null), 3000);
    } catch (error) {
        console.error("Error adding document: ", error);
        setNotification(t('recommender.errorPublishingJob'));
        setTimeout(() => setNotification(null), 3000);
    } finally {
        setLoading(false);
    }
  };

  const handleOpenEditModal = () => {
    setEditName(user.name);
    setEditPhone(profile?.phone || '');
    setEditPhotoURL(profile?.photoURL || '');
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
        
        const profileData: RecommenderProfile = {
            phone: editPhone,
            photoURL: editPhotoURL,
        };
        await setDoc(doc(db, 'recommenders', user.uid), profileData, { merge: true });
        
        setNotification(t('recommender.profileUpdatedSuccessfully'));
        setTimeout(() => setNotification(null), 3000);
        setIsEditModalOpen(false);
    } catch (error) {
        console.error("Error updating profile:", error);
        setNotification(t('recommender.errorUpdatingProfile'));
        setTimeout(() => setNotification(null), 3000);
    } finally {
        setIsSaving(false);
    }
  };
  
  const handleCapturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setEditPhotoURL(dataUrl);
        setIsCameraModalOpen(false);
        setNotification(t('recommender.photoCaptured'));
        setTimeout(() => setNotification(null), 3000);
      }
    }
  };
  
  // Job Management Handlers
  const handleOpenEditJobModal = (job: Job) => {
      setJobToEdit(job);
      setEditJobForm(job);
      setIsEditJobModalOpen(true);
  };

  const handleUpdateJob = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!jobToEdit) return;
      setIsSaving(true);
      try {
          await updateDoc(doc(db, 'jobs', jobToEdit.id), editJobForm);
          setNotification(t('recommender.jobUpdatedSuccessfully'));
          setTimeout(() => setNotification(null), 3000);
          setIsEditJobModalOpen(false);
      } catch (error) {
          console.error("Error updating job:", error);
          setNotification(t('recommender.couldNotUpdateJob'));
          setTimeout(() => setNotification(null), 3000);
      } finally {
          setIsSaving(false);
      }
  };

  const handleOpenApplicantsModal = async (job: Job) => {
      setJobForApplicants(job);
      setIsApplicantsModalOpen(true);
      setLoadingApplicants(true);
      try {
          const q = query(collection(db, 'jobApplications'), where('jobId', '==', job.id));
          const querySnapshot = await getDocs(q);
          const apps = querySnapshot.docs.map(docSnap => {
            const data = docSnap.data();
            const sanitizedData: any = {};
            for (const key in data) {
                if (data[key] instanceof Timestamp) {
                    sanitizedData[key] = data[key].toDate().toISOString();
                } else {
                    sanitizedData[key] = data[key];
                }
            }
            return { id: docSnap.id, ...sanitizedData } as JobApplication
        });
          apps.sort((a, b) => (new Date(b.appliedAt).getTime() || 0) - (new Date(a.appliedAt).getTime() || 0));
          setApplicants(apps);
      } catch (error) {
          console.error("Error fetching applicants:", error);
      } finally {
          setLoadingApplicants(false);
      }
  };

  const handleForwardToCompany = async (app: JobApplication) => {
    if (!jobForApplicants) return;
    setIsSaving(true);
    try {
        const appRef = doc(db, 'jobApplications', app.id);
        await updateDoc(appRef, { status: 'forwarded_to_company' });

        // Fetch additional details for the email
        const seekerUserDoc = await getDoc(doc(db, 'users', app.seekerId));
        const seekerProfileDoc = await getDoc(doc(db, 'seekers', app.seekerId));
        const recommenderUserDoc = await getDoc(doc(db, 'users', user.uid));
        
        const seekerPhone = seekerProfileDoc.exists() ? (seekerProfileDoc.data() as SeekerProfile).phoneNumber : 'N/A';
        const seekerEmail = seekerUserDoc.exists() ? seekerUserDoc.data().email : 'N/A';
        const recommenderEmail = recommenderUserDoc.exists() ? recommenderUserDoc.data().email : 'N/A';

        const mailPayload = {
            to: [jobForApplicants.contactEmail],
            message: {
                subject: t('emails.recommender.forwardedToCompanySubject', { applicationId: app.id }),
                html: t('emails.recommender.forwardedToCompanyBody', {
                    companyName: jobForApplicants.company,
                    seekerName: app.seekerName || 'N/A',
                    jobTitle: app.jobTitle || 'N/A',
                    seekerEmail: seekerEmail,
                    seekerPhone: seekerPhone || 'N/A',
                    coverLetter: app.coverLetter || 'N/A',
                    cvUrl: app.cvUrl,
                    recommenderName: user.name,
                    recommenderEmail: recommenderEmail,
                    recommenderPhone: profile?.phone || 'N/A'
                })
            }
        };

        await addDoc(collection(db, "mail"), mailPayload);
        
        setNotification(t('recommender.applicationForwarded'));
        handleOpenApplicantsModal(jobForApplicants); // Refresh applicants list
    } catch (error) {
        console.error("Error forwarding application:", error);
        setNotification(t('recommender.errorForwarding'));
    } finally {
        setIsSaving(false);
        setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleRejectApplication = async (appId: string) => {
    setIsSaving(true);
    try {
        const appRef = doc(db, 'jobApplications', appId);
        await updateDoc(appRef, { status: 'recommender_rejected' });
        setNotification(t('recommender.applicationRejected'));
        if (jobForApplicants) handleOpenApplicantsModal(jobForApplicants);
    } catch (error) {
        console.error("Error rejecting application:", error);
        setNotification(t('recommender.errorRejecting'));
    } finally {
        setIsSaving(false);
        setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleOpenUpdateStatusModal = (app: JobApplication) => {
    setAppToUpdate(app);
    setNewStatus(app.status);
    setIsUpdateStatusModalOpen(true);
  };
  
  const handleUpdateCompanyResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appToUpdate) return;
    setIsSaving(true);
    try {
        const appRef = doc(db, 'jobApplications', appToUpdate.id);
        await updateDoc(appRef, { status: newStatus });
        setNotification(t('recommender.statusUpdated'));
        if (jobForApplicants) handleOpenApplicantsModal(jobForApplicants);
        setIsUpdateStatusModalOpen(false);
    } catch (error) {
        console.error("Error updating status:", error);
        setNotification(t('recommender.errorUpdatingStatus'));
    } finally {
        setIsSaving(false);
        setTimeout(() => setNotification(null), 3000);
    }
  };
  
  const handleOpenDeleteModal = (job: Job) => {
      setJobToDelete(job);
      setIsDeleteModalOpen(true);
  };
  
  const handleRequestDeletion = async () => {
      if (!jobToDelete) return;
      setIsSaving(true);
      try {
          await updateDoc(doc(db, 'jobs', jobToDelete.id), { status: 'pending_deletion' });
          setNotification(t('recommender.deletionRequestSent'));
          setTimeout(() => setNotification(null), 3000);
          setIsDeleteModalOpen(false);
      } catch (error) {
          console.error("Error requesting deletion:", error);
      } finally {
          setIsSaving(false);
      }
  };

  const handleOpenShareModal = (job: Job) => {
    const url = `${window.top.location.origin}${window.top.location.pathname}?view=job&id=${job.id}`;
    const text = t('recommender.shareJob.text', { jobTitle: job.title, companyName: job.company });

    setShareContent({
        title: t('recommender.shareJob.title'),
        text: text,
        url: url,
    });
    setIsShareModalOpen(true);
  };

  const handleCopyToClipboard = () => {
    if (shareContent) {
        navigator.clipboard.writeText(`${shareContent.text} ${shareContent.url}`);
        setNotification(t('seeker.copied'));
        setTimeout(() => setNotification(null), 2000);
    }
  };

  const indexOfLastJob = currentPage * JOBS_PER_PAGE;
  const indexOfFirstJob = indexOfLastJob - JOBS_PER_PAGE;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  
  // Earnings calculations
  const pendingAmount = earnings.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0);
  const receivedAmount = earnings.filter(e => e.status === 'paid').reduce((sum, e) => sum + e.amount, 0);
  const totalGenerated = earnings.reduce((sum, e) => sum + e.amount, 0);

  return (
    <>
    <Toast message={notification} onClose={() => setNotification(null)} />
    <div className="space-y-6">
       <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('recommender.dashboardTitle')}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <Card title={t('recommender.publishNewJob')} icon={<BriefcaseIcon />}>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                    {t('recommender.publishJobDescription')}
                </p>
                 <form onSubmit={handlePublishJob} className="space-y-4">
                    <div>
                        <label htmlFor="jobTitle" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('recommender.jobTitle')}</label>
                        <input type="text" id="jobTitle" value={jobTitle} onChange={e => setJobTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder={t('recommender.jobTitlePlaceholder')} required />
                    </div>
                     <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('recommender.companyName')}</label>
                        <input type="text" id="companyName" value={companyName} onChange={e => setCompanyName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder={t('recommender.companyNamePlaceholder')} required/>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="jobCity" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('recommender.city')}</label>
                            <input type="text" id="jobCity" value={city} onChange={e => setCity(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder={t('recommender.cityPlaceholder')} required />
                        </div>
                        <div>
                            <label htmlFor="jobAreaCode" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('recommender.areaCodeOptional')}</label>
                            <input type="text" id="jobAreaCode" value={areaCode} onChange={e => setAreaCode(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder={t('recommender.areaCodePlaceholder')} />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="jobDescription" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('recommender.jobDescription')}</label>
                        <textarea id="jobDescription" value={jobDescription} onChange={e => setJobDescription(e.target.value)} rows={4} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder={t('recommender.jobDescriptionPlaceholder')} required/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('recommender.jobType')}</label>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                            <label className="flex items-center">
                                <input type="radio" name="jobType" value="full_time" checked={jobType === 'full_time'} onChange={() => setJobType('full_time')} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-slate-300" />
                                <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">{t('recommender.fullTime')}</span>
                            </label>
                            <label className="flex items-center">
                                <input type="radio" name="jobType" value="part_time" checked={jobType === 'part_time'} onChange={() => setJobType('part_time')} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-slate-300" />
                                <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">{t('recommender.partTime')}</span>
                            </label>
                            <label className="flex items-center">
                                <input type="radio" name="jobType" value="remote" checked={jobType === 'remote'} onChange={() => setJobType('remote')} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-slate-300" />
                                <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">{t('recommender.remote')}</span>
                            </label>
                        </div>
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                        <h4 className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('recommender.salaryOptional')}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                            <div>
                                <label htmlFor="salaryAmount" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('recommender.amount')}</label>
                                <input 
                                    type="number" 
                                    id="salaryAmount" 
                                    value={salaryAmount} 
                                    onChange={e => setSalaryAmount(e.target.value === '' ? '' : Number(e.target.value))} 
                                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                                    placeholder={t('recommender.amountPlaceholder')}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('recommender.paymentType')}</label>
                                <div className="mt-2 flex space-x-4">
                                    <label className="flex items-center">
                                        <input type="radio" name="salaryType" value="per_year" checked={salaryType === 'per_year'} onChange={() => setSalaryType('per_year')} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-slate-300" />
                                        <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">{t('recommender.perYear')}</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="salaryType" value="per_hour" checked={salaryType === 'per_hour'} onChange={() => setSalaryType('per_hour')} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-slate-300" />
                                        <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">{t('recommender.perHour')}</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                        <h4 className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('recommender.contactInfoOptional')}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                            <div>
                                <label htmlFor="contactPerson" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('recommender.contactPerson')}</label>
                                <input type="text" id="contactPerson" value={contactPerson} onChange={e => setContactPerson(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder={t('recommender.contactPersonPlaceholder')} />
                            </div>
                            <div>
                                <label htmlFor="contactPhone" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('recommender.contactPhone')}</label>
                                <input type="tel" id="contactPhone" value={contactPhone} onChange={e => setContactPhone(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder={t('recommender.contactPhonePlaceholder')} />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="contactEmail" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('recommender.contactEmail')}</label>
                            <input type="email" id="contactEmail" value={contactEmail} onChange={e => setContactEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder={t('recommender.contactEmailPlaceholder')} />
                        </div>
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('recommender.functionsToPerform')}</label>
                        {tasks.length > 0 && (
                            <ul className="mt-2 space-y-2">
                                {tasks.map((task, index) => (
                                    <li key={index} className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-2 rounded-md text-sm">
                                        <span className="text-slate-700 dark:text-slate-300">{task}</span>
                                        <button type="button" onClick={() => handleRemoveTask(index)} className="text-slate-400 hover:text-red-500 transition-colors" aria-label={`Eliminar función ${task}`}><XCircleIcon className="w-5 h-5" /></button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="mt-3 flex space-x-2">
                            <input type="text" value={newTask} onChange={e => setNewTask(e.target.value)} placeholder={t('recommender.addNewFunctionPlaceholder')} className="flex-grow block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                            <Button type="button" variant="secondary" onClick={handleAddTask}>{t('recommender.add')}</Button>
                        </div>
                    </div>

                    <Button type="submit" disabled={loading}>{loading ? t('recommender.publishing') : t('recommender.publishJob')}</Button>
                </form>
            </Card>

            <Card title={t('recommender.myPublishedJobs')} icon={<BriefcaseIcon />}>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-md">
                        <input type="text" placeholder={t('recommender.searchByTitle')} value={searchTitle} onChange={e => setSearchTitle(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" />
                        <input type="text" placeholder={t('recommender.searchByCompany')} value={searchCompany} onChange={e => setSearchCompany(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" />
                    </div>
                    {filteredJobs.length > 0 ? (
                        <>
                            <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                                {currentJobs.map(job => (
                                    <li key={job.id} className="py-3 space-y-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold">{job.title} en {job.company}</p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{job.applicantCount || 0} {job.applicantCount === 1 ? t('recommender.applicant') : t('recommender.applicants')}</p>
                                            </div>
                                            {job.jobType && <span className="text-xs font-semibold uppercase px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full dark:bg-indigo-900 dark:text-indigo-300 whitespace-nowrap">{jobTypeLabels[job.jobType]}</span>}
                                        </div>
                                        {job.salaryAmount && (
                                            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                                                ${job.salaryAmount.toLocaleString()} {job.salaryType === 'per_hour' ? t('recommender.perHour') : t('recommender.perYear')}
                                            </p>
                                        )}
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Button size="sm" variant="secondary" onClick={() => handleOpenEditJobModal(job)}><PencilIcon className="w-4 h-4 mr-1"/> {t('edit')}</Button>
                                            <Button size="sm" variant="secondary" onClick={() => handleOpenApplicantsModal(job)}><UsersIcon className="w-4 h-4 mr-1"/> {t('recommender.applicants')}</Button>
                                            <Button size="sm" variant="secondary" onClick={() => handleOpenShareModal(job)}><ShareIcon className="w-4 h-4 mr-1"/> {t('seeker.share')}</Button>
                                            <Button size="sm" variant="danger" onClick={() => handleOpenDeleteModal(job)}><TrashIcon className="w-4 h-4 mr-1"/> {t('delete')}</Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex justify-between items-center mt-4">
                                <span className="text-sm text-slate-600 dark:text-slate-400">{t('page')} {currentPage} {t('of')} {totalPages > 0 ? totalPages : 1}</span>
                                <div className="space-x-2">
                                    <Button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} size="sm">{t('previous')}</Button>
                                    <Button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages || totalPages === 0} size="sm">{t('next')}</Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-slate-500 dark:text-slate-400">{t('recommender.noJobsFoundWithFilters')}</p>
                    )}
                </div>
            </Card>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <Card title={t('recommender.recommenderProfile')} icon={<UserCircleIcon />}>
            <div className="flex flex-col items-center text-center space-y-4">
                 {profile?.photoURL ? (
                    <img src={profile.photoURL} alt={user.name} className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-md" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        <UserCircleIcon className="w-16 h-16 text-slate-400" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-lg font-bold">{user.name}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{profile?.phone || t('recommender.noPhone')}</p>
                  </div>
                  <div className="flex items-center">
                    <StarRating rating={user.averageRating || 0} readOnly />
                    <span className="text-xs text-slate-500 ml-2">({user.ratingCount || 0} {user.ratingCount === 1 ? t('recommender.opinion') : t('recommender.opinions')})</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700 w-full">
                    <strong>{t('recommender.publishedJobs')}:</strong> {jobs.length}
                  </p>
                  <Button className="mt-4 w-full" variant="secondary" onClick={handleOpenEditModal}>{t('recommender.editProfile')}</Button>
            </div>
          </Card>
          <Card title={t('recommender.earnings.title')} icon={<CurrencyDollarIcon />}>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('recommender.earnings.pending')}</p>
                        <p className="text-2xl font-bold text-yellow-500">${pendingAmount.toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('recommender.earnings.received')}</p>
                        <p className="text-2xl font-bold text-green-500">${receivedAmount.toFixed(2)}</p>
                    </div>
                </div>
                <div className="text-center pt-2 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('recommender.earnings.totalGenerated')}</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">${totalGenerated.toFixed(2)}</p>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <h4 className="font-semibold">{t('recommender.earnings.paymentHistory')}</h4>
                    {payments.length > 0 ? (
                        <ul className="mt-2 space-y-3 max-h-60 overflow-y-auto">
                            {payments.map(payment => (
                                <li key={payment.id} className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-md">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-green-600 dark:text-green-400">${payment.amount.toFixed(2)}</p>
                                            <p className="text-xs text-slate-500">{new Date(payment.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        {payment.proofURL && (
                                            <a href={payment.proofURL} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                                                {t('recommender.earnings.viewProof')}
                                            </a>
                                        )}
                                    </div>
                                    {payment.notes && <p className="text-xs italic text-slate-600 dark:text-slate-400 mt-1">"{payment.notes}"</p>}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{t('recommender.earnings.noPaymentsYet')}</p>
                    )}
                </div>
            </div>
          </Card>
        </div>
      </div>
       <div className="mt-6">
            <Card title={t('recommender.officialRecommendersProgram')} icon={<StarIcon />}>
                <div className="space-y-4 text-slate-600 dark:text-slate-400">
                    <p>
                        {t('recommender.recommenderProgramDescription')}
                    </p>
                    <div>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-200">{t('recommender.programBenefits')}</h4>
                        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                            <li><strong>${payoutSettings?.perVerifiedJob ?? 1} USD</strong> {t('recommender.benefitPerJob')}</li>
                            <li><strong>${payoutSettings?.perApplication ?? 1} USD</strong> {t('recommender.benefitPerApplication')}</li>
                            <li><strong>${payoutSettings?.perConfirmedHire ?? 5} USD</strong> {t('recommender.benefitPerHire')}</li>
                        </ul>
                    </div>
                     <div>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-200">{t('recommender.ourCommitment')}</h4>
                        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                            <li>{t('recommender.commitment1')}</li>
                            <li>{t('recommender.commitment2')}</li>
                            <li>{t('recommender.commitment3')}</li>
                        </ul>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                        <strong>{t('recommender.importantNotice').split(':')[0]}:</strong> {t('recommender.importantNotice').split(':')[1]}
                    </p>
                    <p className="pt-3 border-t border-slate-200 dark:border-slate-700">
                        {t('recommender.communityStrength')}
                    </p>
                    <p className="text-center font-bold text-lg text-slate-800 dark:text-slate-200">
                        {t('recommender.recommendWithConfidence')}
                    </p>
                </div>
            </Card>
        </div>
    </div>
    
    <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={t('recommender.editMyProfile')}>
        <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
                <label htmlFor="editName" className="block text-sm font-medium">{t('name')}</label>
                <input type="text" id="editName" value={editName} onChange={e => setEditName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" required />
            </div>
            <div>
                <label htmlFor="editEmail" className="block text-sm font-medium">{t('email')}</label>
                <input type="email" id="editEmail" value={user.email} readOnly className="mt-1 block w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md cursor-not-allowed" />
                <p className="mt-1 text-xs text-slate-500">{t('recommender.emailCannotBeChanged')}</p>
            </div>
            <div>
                <label htmlFor="editPhone" className="block text-sm font-medium">{t('recommender.phone')}</label>
                <input type="tel" id="editPhone" value={editPhone} onChange={e => setEditPhone(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" />
            </div>
            <div>
                <label htmlFor="photoURL" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('recommender.profilePhoto')}</label>
                {editPhotoURL && (
                    <div className="mt-2">
                        <img src={editPhotoURL} alt="Vista previa" className="w-24 h-24 rounded-full object-cover" />
                    </div>
                )}
                <div className="flex items-center space-x-2 mt-2">
                    <input type="url" id="photoURL" value={editPhotoURL} onChange={e => setEditPhotoURL(e.target.value)} className="flex-grow block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder={t('recommender.photoUrlPlaceholder')} />
                    <Button type="button" variant="secondary" onClick={() => setIsCameraModalOpen(true)} className="flex-shrink-0">
                        <CameraIcon className="w-5 h-5" />
                    </Button>
                </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>{t('cancel')}</Button>
                <Button type="submit" disabled={isSaving}>{isSaving ? t('saving') : t('saveChanges')}</Button>
            </div>
        </form>
    </Modal>
    
    <Modal isOpen={isCameraModalOpen} onClose={() => setIsCameraModalOpen(false)} title={t('recommender.capturePhoto')}>
        <div className="space-y-4">
            <video ref={videoRef} autoPlay playsInline className="w-full h-auto rounded-md bg-slate-900"></video>
            <canvas ref={canvasRef} className="hidden"></canvas>
            <Button onClick={handleCapturePhoto} className="w-full">{t('recommender.capturePhoto')}</Button>
        </div>
      </Modal>

      <Modal isOpen={isEditJobModalOpen} onClose={() => setIsEditJobModalOpen(false)} title={t('recommender.editJob')}>
        <form onSubmit={handleUpdateJob} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div>
                <label className="block text-sm font-medium">{t('recommender.jobTitle')}</label>
                <input type="text" value={editJobForm.title || ''} onChange={e => setEditJobForm({...editJobForm, title: e.target.value})} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" required />
            </div>
             <div>
                <label className="block text-sm font-medium">{t('recommender.companyName')}</label>
                <input type="text" value={editJobForm.company || ''} onChange={e => setEditJobForm({...editJobForm, company: e.target.value})} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" required/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium">{t('recommender.city')}</label>
                    <input type="text" value={editJobForm.city || ''} onChange={e => setEditJobForm({...editJobForm, city: e.target.value})} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" required />
                </div>
                <div>
                    <label className="block text-sm font-medium">{t('recommender.areaCodeOptional')}</label>
                    <input type="text" value={editJobForm.areaCode || ''} onChange={e => setEditJobForm({...editJobForm, areaCode: e.target.value})} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" />
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium">{t('recommender.jobDescription')}</label>
                <textarea value={editJobForm.description || ''} onChange={e => setEditJobForm({...editJobForm, description: e.target.value})} rows={4} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" required/>
            </div>
             <div>
                <label className="block text-sm font-medium">{t('recommender.jobType')}</label>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                    <label className="flex items-center">
                        <input type="radio" name="editJobType" value="full_time" checked={editJobForm.jobType === 'full_time' || !editJobForm.jobType} onChange={() => setEditJobForm({...editJobForm, jobType: 'full_time'})} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-slate-300" />
                        <span className="ml-2 text-sm">{t('recommender.fullTime')}</span>
                    </label>
                    <label className="flex items-center">
                        <input type="radio" name="editJobType" value="part_time" checked={editJobForm.jobType === 'part_time'} onChange={() => setEditJobForm({...editJobForm, jobType: 'part_time'})} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-slate-300" />
                        <span className="ml-2 text-sm">{t('recommender.partTime')}</span>
                    </label>
                    <label className="flex items-center">
                        <input type="radio" name="editJobType" value="remote" checked={editJobForm.jobType === 'remote'} onChange={() => setEditJobForm({...editJobForm, jobType: 'remote'})} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-slate-300" />
                        <span className="ml-2 text-sm">{t('recommender.remote')}</span>
                    </label>
                </div>
            </div>
             <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <h4 className="block text-sm font-medium">{t('recommender.salaryOptional')}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <div>
                        <label className="block text-sm font-medium">{t('recommender.amount')}</label>
                        <input 
                            type="number" 
                            value={editJobForm.salaryAmount || ''} 
                            onChange={e => setEditJobForm({...editJobForm, salaryAmount: e.target.value === '' ? undefined : Number(e.target.value)})} 
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">{t('recommender.paymentType')}</label>
                        <div className="mt-2 flex space-x-4">
                            <label className="flex items-center">
                                <input type="radio" name="editSalaryType" value="per_year" checked={editJobForm.salaryType === 'per_year' || !editJobForm.salaryType} onChange={() => setEditJobForm({...editJobForm, salaryType: 'per_year'})} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-slate-300" />
                                <span className="ml-2 text-sm">{t('recommender.perYear')}</span>
                            </label>
                            <label className="flex items-center">
                                <input type="radio" name="editSalaryType" value="per_hour" checked={editJobForm.salaryType === 'per_hour'} onChange={() => setEditJobForm({...editJobForm, salaryType: 'per_hour'})} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-slate-300" />
                                <span className="ml-2 text-sm">{t('recommender.perHour')}</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={() => setIsEditJobModalOpen(false)}>{t('cancel')}</Button>
                <Button type="submit" disabled={isSaving}>{isSaving ? t('saving') : t('saveChanges')}</Button>
            </div>
        </form>
    </Modal>

    <Modal isOpen={isApplicantsModalOpen} onClose={() => setIsApplicantsModalOpen(false)} title={`${t('recommender.applicantsFor')} ${jobForApplicants?.title}`}>
        {loadingApplicants ? <p>{t('recommender.loadingApplicants')}</p> : (
            applicants.length > 0 ? (
                <ul className="space-y-3 max-h-[60vh] overflow-y-auto">
                    {applicants.map(app => (
                        <li key={app.id} className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-md">
                            <div className="flex justify-between items-start">
                                <p className="font-semibold">{app.seekerName || t('name')}</p>
                                <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${app.status === 'hired' ? 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-300'}`}>
                                    {statusLabels[app.status] || app.status}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500">{t('seeker.appliedOn')} {new Date(app.appliedAt).toLocaleDateString()}</p>
                            <p className="text-sm mt-2 whitespace-pre-wrap">{app.coverLetter || t('recommender.coverLetterNone')}</p>
                             {app.cvUrl && (
                                <p className="text-sm mt-1">
                                    <strong>{t('recommender.cv')}:</strong> 
                                    <a href={app.cvUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-indigo-600 dark:text-indigo-400 hover:underline">
                                        {t('recommender.viewCV')}
                                    </a>
                                </p>
                            )}
                             <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-2">
                                {app.status === 'submitted' && (
                                    <>
                                        <Button size="sm" onClick={() => handleForwardToCompany(app)} disabled={isSaving}>{isSaving ? t('recommender.forwarding') : t('recommender.approveAndForward')}</Button>
                                        <Button size="sm" variant="danger" onClick={() => handleRejectApplication(app.id)} disabled={isSaving}>{t('recommender.rejectApplication')}</Button>
                                    </>
                                )}
                                {['forwarded_to_company', 'under_review', 'interviewing', 'company_rejected'].includes(app.status) && (
                                    <Button size="sm" variant="secondary" onClick={() => handleOpenUpdateStatusModal(app)}>{t('recommender.updateStatus')}</Button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : <p className="text-slate-500">{t('recommender.noApplicantsYet')}</p>
        )}
    </Modal>
    
    <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title={t('recommender.requestJobDeletion')}>
        <p>{t('recommender.confirmJobDeletion')} "<strong>{jobToDelete?.title}</strong>"?</p>
        <p className="text-sm text-slate-500 mt-2">{t('recommender.jobDeletionNotice')}</p>
        <div className="flex justify-end space-x-3 pt-4 mt-2">
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>{t('cancel')}</Button>
            <Button variant="danger" onClick={handleRequestDeletion} disabled={isSaving}>{isSaving ? t('recommender.sending') : t('recommender.yesRequestDeletion')}</Button>
        </div>
    </Modal>

    <Modal isOpen={isUpdateStatusModalOpen} onClose={() => setIsUpdateStatusModalOpen(false)} title={t('recommender.updateStatus')}>
        <form onSubmit={handleUpdateCompanyResponse}>
            <p className="mb-4">{t('recommender.companyResponse')} <strong>{appToUpdate?.seekerName}</strong>:</p>
            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md">
                <option value="under_review">{statusLabels.under_review}</option>
                <option value="interviewing">{statusLabels.interviewing}</option>
                <option value="company_rejected">{statusLabels.company_rejected}</option>
            </select>
             <div className="flex justify-end space-x-3 pt-4 mt-2">
                <Button variant="secondary" type="button" onClick={() => setIsUpdateStatusModalOpen(false)}>{t('cancel')}</Button>
                <Button type="submit" disabled={isSaving}>{isSaving ? t('saving') : t('saveChanges')}</Button>
            </div>
        </form>
    </Modal>

    <Modal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} title={shareContent?.title || ''}>
        <div className="space-y-4">
            <p className="text-sm text-slate-500">{t('recommender.shareJob.description')}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <a href={`https://wa.me/?text=${encodeURIComponent(shareContent?.text + ' ' + shareContent?.url)}`} target="_blank" rel="noopener noreferrer" className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                    <p className="font-semibold">WhatsApp</p>
                </a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareContent?.url || '')}`} target="_blank" rel="noopener noreferrer" className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                    <p className="font-semibold">Facebook</p>
                </a>
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareContent?.url || '')}&text=${encodeURIComponent(shareContent?.text || '')}`} target="_blank" rel="noopener noreferrer" className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                    <p className="font-semibold">Twitter</p>
                </a>
                <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareContent?.url || '')}&title=${encodeURIComponent(shareContent?.title || '')}&summary=${encodeURIComponent(shareContent?.text || '')}`} target="_blank" rel="noopener noreferrer" className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                    <p className="font-semibold">LinkedIn</p>
                </a>
            </div>
            <div className="flex items-center space-x-2">
                <input type="text" readOnly value={shareContent?.url} className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md" />
                <Button onClick={handleCopyToClipboard} variant="secondary">{t('seeker.copyToClipboard')}</Button>
            </div>
        </div>
    </Modal>
    </>
  );
}

export default RecommenderDashboard;