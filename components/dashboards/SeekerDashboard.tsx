
import React, { useState, useEffect } from 'react';
import { User, UserRole, ProfessionalProfile, RequestStatus, SeekerProfile, Job, Membership, JobApplication, ServiceRequest } from '../../types';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { db, auth } from '../../firebase';
import { Modal } from '../shared/Modal';
import { collection, query, where, getDocs, doc, getDoc, addDoc, onSnapshot, updateDoc, setDoc, serverTimestamp, Timestamp, increment, writeBatch, runTransaction } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import VerifiedBadge from '../shared/VerifiedBadge';
import Toast from '../shared/Toast';
import StripeCheckoutForm from '../shared/StripeCheckoutForm';
import StarRating from '../shared/StarRating';

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
}

type PurchaseAction = 
    | { type: 'unlock_job', job: Job }
    | { type: 'buy_membership', membership: Membership };

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



function SeekerDashboard({ user }: SeekerDashboardProps) {
  // Search State
  const [activeTab, setActiveTab] = useState<'professionals' | 'jobs'>('professionals');
  const [professionalSearchName, setProfessionalSearchName] = useState('');
  const [professionalSearchSpecialty, setProfessionalSearchSpecialty] = useState('');
  const [jobSearchTitle, setJobSearchTitle] = useState('');
  const [jobSearchCompany, setJobSearchCompany] = useState('');
  const [professionalResults, setProfessionalResults] = useState<ProfessionalWithStats[]>([]);
  const [jobResults, setJobResults] = useState<JobWithRecommenderRating[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Profile State
  const [seekerProfile, setSeekerProfile] = useState<SeekerProfile | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editPhoneNumber, setEditPhoneNumber] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editAreaCode, setEditAreaCode] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [hasActiveMembership, setHasActiveMembership] = useState(false);
  const [memberships, setMemberships] = useState<Membership[]>([]);

  // Modals State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [requestDetails, setRequestDetails] = useState('');
  const [serviceDate, setServiceDate] = useState('');
  const [serviceTime, setServiceTime] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isJobDetailsModalOpen, setIsJobDetailsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isProfileDetailsModalOpen, setIsProfileDetailsModalOpen] = useState(false);
  const [selectedProfForDetails, setSelectedProfForDetails] = useState<ProfessionalWithStats | null>(null);
  
  // History and Rating State
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [isRecommenderRatingModalOpen, setIsRecommenderRatingModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [recommenderRating, setRecommenderRating] = useState(0);
  const [isProfRatingModalOpen, setIsProfRatingModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [professionalRating, setProfessionalRating] = useState(0);

  // Pagination State
  const [jobAppsPage, setJobAppsPage] = useState(1);
  const [serviceRequestsPage, setServiceRequestsPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Job Application Flow State
  const [isPaywallModalOpen, setIsPaywallModalOpen] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);

  // --- REFACTORED PAYMENT STATE ---
  const [stripe, setStripe] = useState<any>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentClientSecret, setPaymentClientSecret] = useState<string | null>(null);
  const [purchaseAction, setPurchaseAction] = useState<PurchaseAction | null>(null);
  const [purchaseDisplay, setPurchaseDisplay] = useState<{ name: string; price: number } | null>(null);

  useEffect(() => {
    const stripePromise = window.Stripe('pk_test_51Pefp3RqgG8j12HGL2TCAw3Y9f5V4qG6v0E9d2W5A4N0e1c0x3W1N6d4Y9a0T1b2o3a4b5c6d7e8f9');
    setStripe(stripePromise);

    const seekerDocRef = doc(db, 'seekers', user.uid);
    const unsubscribeProfile = onSnapshot(seekerDocRef, (docSnap) => {
        if (docSnap.exists()) {
            const profileData = docSnap.data() as SeekerProfile;
            setSeekerProfile(profileData);
            setEditPhoneNumber(profileData.phoneNumber || '');
            setEditAddress(profileData.address || '');
            setEditAreaCode(profileData.areaCode || '');
            const isActive = profileData.membershipEndDate && profileData.membershipEndDate.toDate() > new Date();
            setHasActiveMembership(isActive);
        }
    });

    const membershipsUnsubscribe = onSnapshot(collection(db, 'memberships'), snapshot => {
        setMemberships(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Membership)));
    });

    const applicationsQuery = query(collection(db, 'jobApplications'), where('seekerId', '==', user.uid));
    const unsubscribeApplications = onSnapshot(applicationsQuery, async (snapshot) => {
        const apps = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as JobApplication));
        setJobApplications(apps);
    });
    
    const serviceRequestsQuery = query(collection(db, 'serviceRequests'), where('seekerId', '==', user.uid));
    const unsubscribeRequests = onSnapshot(serviceRequestsQuery, snapshot => {
        const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServiceRequest));
        requests.sort((a,b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
        setServiceRequests(requests);
    });


    return () => {
        unsubscribeProfile();
        membershipsUnsubscribe();
        unsubscribeApplications();
        unsubscribeRequests();
    }
  }, [user.uid]);

  useEffect(() => {
      setEditName(user.name);
  }, [user.name]);

  const handleProfessionalSearch = async () => {
    const usersQuery = query(collection(db, 'users'), where('role', '==', UserRole.PROFESSIONAL));
    const usersSnapshot = await getDocs(usersQuery);
    const professionalsPromises = usersSnapshot.docs.map(async (userDoc) => {
        const professionalUser = { uid: userDoc.id, ...userDoc.data() } as User;
        const profileDocRef = doc(db, 'professionals', userDoc.id);
        const profileDoc = await getDoc(profileDocRef);
        if (profileDoc.exists() && profileDoc.data()?.status === 'approved') {
             return { ...professionalUser, profile: profileDoc.data() as ProfessionalProfile };
        }
        return null;
    });
    const allProfessionals = (await Promise.all(professionalsPromises)).filter(p => p !== null) as Professional[];

    const filteredProfessionals = allProfessionals.filter(prof => 
        prof.name.toLowerCase().includes(professionalSearchName.toLowerCase()) &&
        prof.profile.specialty.toLowerCase().includes(professionalSearchSpecialty.toLowerCase())
    );

    const professionalsWithStatsPromises = filteredProfessionals.map(async (prof) => {
        const requestsQuery = query(collection(db, 'serviceRequests'), where('professionalId', '==', prof.uid));
        const requestsSnapshot = await getDocs(requestsQuery);

        let totalRating = 0;
        let reviewCount = 0;
        let successfulServices = 0;

        requestsSnapshot.forEach(doc => {
            const requestData = doc.data();
            if (requestData.attendedDate) {
                successfulServices++;
            }
            if (requestData.professionalRating) {
                totalRating += requestData.professionalRating;
                reviewCount++;
            }
        });

        const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;

        return {
            ...prof,
            averageRating,
            reviewCount,
            successfulServices,
        };
    });

    const resultsWithStats = await Promise.all(professionalsWithStatsPromises);
    setProfessionalResults(resultsWithStats);
  };

  const handleJobSearch = async () => {
    const jobsSnapshot = await getDocs(collection(db, 'jobs'));
    const allJobs = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));

    const filteredJobs = allJobs.filter(job => 
        job.title.toLowerCase().includes(jobSearchTitle.toLowerCase()) &&
        job.company.toLowerCase().includes(jobSearchCompany.toLowerCase())
    );

    if (filteredJobs.length === 0) {
        setJobResults([]);
        return;
    }

    const recommenderIds = [...new Set(filteredJobs.map(job => job.recommenderId))];
    const recommendersQuery = query(collection(db, 'users'), where('__name__', 'in', recommenderIds));
    const recommendersSnapshot = await getDocs(recommendersQuery);
    const recommendersMap = new Map<string, User>();
    recommendersSnapshot.forEach(doc => {
        recommendersMap.set(doc.id, doc.data() as User);
    });

    const jobsWithRecommenderData = filteredJobs.map(job => {
        const recommender = recommendersMap.get(job.recommenderId);
        return {
            ...job,
            recommenderAverageRating: recommender?.averageRating || 0,
        };
    });

    setJobResults(jobsWithRecommenderData);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
        if (activeTab === 'professionals') {
            await handleProfessionalSearch();
        } else {
            await handleJobSearch();
        }
    } catch (error) {
        console.error("Error during search:", error);
        alert("Ocurrió un error al realizar la búsqueda.");
    } finally {
        setLoading(false);
    }
  };

  const handleOpenRequestModal = (professional: Professional) => {
    setSelectedProfessional(professional);
    setRequestDetails('');
    setServiceDate('');
    setServiceTime('');
    setIsProfileDetailsModalOpen(false); // Close details modal
    setIsRequestModalOpen(true);
  };

  const handleOpenJobDetailsModal = (job: Job) => {
    setSelectedJob(job);
    setIsJobDetailsModalOpen(true);
  };
  
  const handleOpenProfileDetailsModal = (professional: ProfessionalWithStats) => {
    setSelectedProfForDetails(professional);
    setIsProfileDetailsModalOpen(true);
  }

  const handleSendRequest = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!serviceDate || !serviceTime || !selectedProfessional) {
          alert("Por favor, complete la fecha y hora del servicio.");
          return;
      }
      setIsSending(true);
      try {
          await addDoc(collection(db, 'serviceRequests'), {
              seekerId: user.uid,
              seekerName: user.name,
              seekerEmail: user.email,
              seekerPhone: seekerProfile?.phoneNumber || '',
              professionalId: selectedProfessional.uid,
              professionalName: selectedProfessional.name,
              requestDetails: requestDetails,
              status: RequestStatus.LOCKED,
              createdAt: serverTimestamp(),
              serviceDate: Timestamp.fromDate(new Date(serviceDate)),
              serviceTime: serviceTime,
          });
          setIsRequestModalOpen(false);
          setNotification("¡Solicitud enviada con éxito!");
          setTimeout(() => setNotification(null), 3000);
      } catch (error) {
          console.error("Error sending request:", error);
      } finally {
          setIsSending(false);
      }
  };
  
  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };
  
  const handleShareLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setEditAddress(`Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`);
                setNotification('Ubicación obtenida con éxito.');
                setTimeout(() => setNotification(null), 3000);
            },
            (error) => {
                alert("No se pudo obtener la ubicación.");
                console.error("Geolocation error:", error);
            }
        );
    } else {
        alert("La geolocalización no es compatible con este navegador.");
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
        if (auth.currentUser && auth.currentUser.displayName !== editName) {
            await updateProfile(auth.currentUser, { displayName: editName });
        }
        await updateDoc(doc(db, 'users', user.uid), { name: editName });
        await setDoc(doc(db, 'seekers', user.uid), { 
            phoneNumber: editPhoneNumber,
            address: editAddress,
            areaCode: editAreaCode,
        }, { merge: true });
        setNotification('Perfil actualizado con éxito.');
        setTimeout(() => setNotification(null), 3000);
        setIsEditModalOpen(false);
    } catch (error) {
        console.error("Error updating profile:", error);
    } finally {
        setIsSaving(false);
    }
  };
  
  // Job Application Flow Functions
  const handleApplyClick = (job: Job) => {
      setSelectedJob(job);
      setIsJobDetailsModalOpen(false); // Close details
      if(hasActiveMembership) {
          setIsApplicationModalOpen(true); // Open application form directly
      } else {
          setIsPaywallModalOpen(true); // Open payment options
      }
  }

  const startPaymentProcess = (action: PurchaseAction, display: { name: string; price: number }) => {
        setPurchaseAction(action);
        setPurchaseDisplay(display);
        
        const simulatedSecret = `pi_${Date.now()}_secret_${Math.random().toString(36).substring(2)}`;
        setPaymentClientSecret(simulatedSecret);
        setIsPaymentModalOpen(true);
    };

    const handleUnlockJobPayment = (job: Job) => {
        setIsPaywallModalOpen(false);
        const action: PurchaseAction = { type: 'unlock_job', job };
        const display = { name: `Postulación a: ${job.title}`, price: 2.00 }; // Example price
        startPaymentProcess(action, display);
    };

    const handleMembershipPayment = (membership: Membership) => {
        setIsPaywallModalOpen(false);
        const action: PurchaseAction = { type: 'buy_membership', membership };
        const display = { name: `Membresía ${membership.name}`, price: membership.price };
        startPaymentProcess(action, display);
    };

    const handlePaymentSuccess = async () => {
        if (!purchaseAction) return;
        
        try {
            if (purchaseAction.type === 'unlock_job') {
                setIsApplicationModalOpen(true);
            } else if (purchaseAction.type === 'buy_membership') {
                const { membership } = purchaseAction;
                const endDate = new Date();
                endDate.setDate(endDate.getDate() + membership.durationDays);
                const seekerRef = doc(db, 'seekers', user.uid);
                await updateDoc(seekerRef, {
                    activeMembershipId: membership.id,
                    membershipEndDate: Timestamp.fromDate(endDate)
                });
                setHasActiveMembership(true);
                setIsApplicationModalOpen(true);
            }
            setNotification("¡Pago completado! Ahora puede postularse.");
            setTimeout(() => setNotification(null), 5000);
        } catch (error) {
            console.error("Error confirming purchase:", error);
        } finally {
            closePaymentModal();
        }
    };
    
    const closePaymentModal = () => {
        setIsPaymentModalOpen(false);
        setPaymentClientSecret(null);
        setPurchaseAction(null);
        setPurchaseDisplay(null);
    };

    const handleSendApplication = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedJob || !cvFile) {
            alert("Por favor, adjunte su hoja de vida.");
            return;
        }
        setIsSending(true);
        try {
            const cvUrl = `resumes/${user.uid}/${cvFile.name}`;
            const batch = writeBatch(db);
            
            const appRef = doc(collection(db, 'jobApplications'));
            batch.set(appRef, {
                jobId: selectedJob.id,
                seekerId: user.uid,
                recommenderId: selectedJob.recommenderId,
                cvUrl: cvUrl,
                coverLetter: coverLetter,
                appliedAt: serverTimestamp(),
                jobTitle: selectedJob.title,
                jobCompany: selectedJob.company,
                recommenderName: selectedJob.recommenderName,
            });

            const jobRef = doc(db, 'jobs', selectedJob.id);
            batch.update(jobRef, { applicantCount: increment(1) });

            await batch.commit();

            setNotification("¡Postulación enviada con éxito!");
            setTimeout(() => setNotification(null), 3000);
            setIsApplicationModalOpen(false);
            setCoverLetter('');
            setCvFile(null);
        } catch(error) {
            console.error("Error sending application:", error);
        } finally {
            setIsSending(false);
        }
    }
    
    const handleOpenRecommenderRatingModal = (application: JobApplication) => {
        setSelectedApplication(application);
        setRecommenderRating(0);
        setIsRecommenderRatingModalOpen(true);
    };
    
    const handleSaveRecommenderRating = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedApplication || recommenderRating === 0) {
            alert("Por favor, seleccione una calificación.");
            return;
        }
        setIsSaving(true);
        try {
            const app = selectedApplication;
            await runTransaction(db, async (transaction) => {
                const recommenderRef = doc(db, 'users', app.recommenderId);
                const appRef = doc(db, 'jobApplications', app.id);

                const recommenderDoc = await transaction.get(recommenderRef);
                if (!recommenderDoc.exists()) {
                    throw new Error("Recommender not found!");
                }

                const recommenderData = recommenderDoc.data();
                const currentAvg = recommenderData.averageRating || 0;
                const currentCount = recommenderData.ratingCount || 0;
                
                const newCount = currentCount + 1;
                const newAvg = ((currentAvg * currentCount) + recommenderRating) / newCount;

                transaction.update(recommenderRef, {
                    averageRating: newAvg,
                    ratingCount: newCount
                });
                transaction.update(appRef, { recommenderRating: recommenderRating });
            });
            
            setNotification("¡Calificación guardada con éxito!");
            setTimeout(() => setNotification(null), 3000);
            setIsRecommenderRatingModalOpen(false);
        } catch(error) {
            console.error("Error saving rating:", error);
            alert("No se pudo guardar la calificación.");
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleOpenProfRatingModal = (request: ServiceRequest) => {
        setSelectedRequest(request);
        setProfessionalRating(0);
        setIsProfRatingModalOpen(true);
    };

    const handleSaveProfRating = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRequest || professionalRating === 0) {
            alert("Por favor, seleccione una calificación.");
            return;
        }
        setIsSaving(true);
        try {
            await updateDoc(doc(db, 'serviceRequests', selectedRequest.id), {
                professionalRating: professionalRating
            });
            setNotification("¡Calificación guardada con éxito!");
            setTimeout(() => setNotification(null), 3000);
            setIsProfRatingModalOpen(false);
        } catch (error) {
            console.error("Error saving professional rating:", error);
        } finally {
            setIsSaving(false);
        }
    };

    // Pagination Logic for Job Applications
    const jobAppsTotalPages = Math.ceil(jobApplications.length / ITEMS_PER_PAGE);
    const jobAppsPaginated = jobApplications.slice((jobAppsPage - 1) * ITEMS_PER_PAGE, jobAppsPage * ITEMS_PER_PAGE);

    // Pagination Logic for Service Requests
    const serviceRequestsTotalPages = Math.ceil(serviceRequests.length / ITEMS_PER_PAGE);
    const serviceRequestsPaginated = serviceRequests.slice((serviceRequestsPage - 1) * ITEMS_PER_PAGE, serviceRequestsPage * ITEMS_PER_PAGE);


  return (
    <>
      <Toast message={notification} onClose={() => setNotification(null)} />
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Panel de Buscador</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card title="Búsqueda Avanzada" icon={<MagnifyingGlassIcon />}>
              <div className="border-b border-slate-200 dark:border-slate-700 mb-4">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button onClick={() => setActiveTab('professionals')} className={`${activeTab === 'professionals' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:border-slate-600'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}>
                        Profesionales
                    </button>
                    <button onClick={() => setActiveTab('jobs')} className={`${activeTab === 'jobs' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:border-slate-600'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}>
                        Empleos
                    </button>
                </nav>
              </div>

              <form onSubmit={handleSearch}>
                {activeTab === 'professionals' ? (
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input type="text" value={professionalSearchName} onChange={e => setProfessionalSearchName(e.target.value)} placeholder="Buscar por nombre..." className="flex-grow block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        <input type="text" value={professionalSearchSpecialty} onChange={e => setProfessionalSearchSpecialty(e.target.value)} placeholder="Buscar por especialidad..." className="flex-grow block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        <Button type="submit" disabled={loading} className="w-full sm:w-auto">{loading ? 'Buscando...' : 'Buscar'}</Button>
                    </div>
                ) : (
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input type="text" value={jobSearchTitle} onChange={e => setJobSearchTitle(e.target.value)} placeholder="Buscar por título de empleo..." className="flex-grow block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        <input type="text" value={jobSearchCompany} onChange={e => setJobSearchCompany(e.target.value)} placeholder="Buscar por empresa..." className="flex-grow block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        <Button type="submit" disabled={loading} className="w-full sm:w-auto">{loading ? 'Buscando...' : 'Buscar'}</Button>
                    </div>
                )}
              </form>
              
              {searched && (
                  <div className="mt-4">
                      {activeTab === 'professionals' && (
                        <>
                          <h3 className="font-semibold">{professionalResults.length} profesional(es) encontrado(s)</h3>
                          {professionalResults.length > 0 ? (
                              <ul className="divide-y divide-slate-200 dark:divide-slate-700 mt-2">
                                  {professionalResults.map(prof => (
                                      <li key={prof.uid} className="py-3 flex justify-between items-center">
                                          <div>
                                              <p className="font-semibold flex items-center">{prof.name}{prof.profile.isVerified && <VerifiedBadge />}</p>
                                              <p className="text-sm text-indigo-500">{prof.profile.specialty}</p>
                                               <div className="flex items-center mt-1">
                                                  <StarRating rating={prof.averageRating} readOnly size="sm" />
                                                  <span className="text-xs text-slate-500 ml-2">({prof.reviewCount} {prof.reviewCount === 1 ? 'opinión' : 'opiniones'})</span>
                                              </div>
                                          </div>
                                          <Button variant="secondary" onClick={() => handleOpenProfileDetailsModal(prof)}>Ver Perfil</Button>
                                      </li>
                                  ))}
                              </ul>
                          ) : <p className="text-slate-500 dark:text-slate-400 mt-2">No se encontraron profesionales.</p>}
                        </>
                      )}
                      {activeTab === 'jobs' && (
                         <>
                          <h3 className="font-semibold">{jobResults.length} empleo(s) encontrado(s)</h3>
                          {jobResults.length > 0 ? (
                              <ul className="divide-y divide-slate-200 dark:divide-slate-700 mt-2">
                                  {jobResults.map(job => {
                                    const isFull = job.maxApplicants != null && (job.applicantCount || 0) >= job.maxApplicants;
                                    return (
                                      <li key={job.id} className="py-3 flex justify-between items-center">
                                          <div>
                                              <p className="font-semibold">{job.title}</p>
                                              <p className="text-sm text-slate-500">Recomendado por: {job.recommenderName}</p>
                                              <div className="flex items-center mt-1">
                                                <StarRating rating={job.recommenderAverageRating || 0} readOnly size="sm" />
                                              </div>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            {isFull && <span className="text-xs font-semibold text-red-500 bg-red-100 dark:bg-red-900/50 px-2 py-1 rounded-full">Completo</span>}
                                            <Button variant="secondary" onClick={() => handleOpenJobDetailsModal(job)} disabled={isFull}>
                                                Ver Detalles
                                            </Button>
                                          </div>
                                      </li>
                                  )})}
                              </ul>
                          ) : <p className="text-slate-500 dark:text-slate-400 mt-2">No se encontraron empleos.</p>}
                        </>
                      )}
                  </div>
              )}
            </Card>
            <Card title="Mis Postulaciones de Empleo" icon={<ClipboardDocumentListIcon />}>
                {jobApplications.length > 0 ? (
                    <>
                        <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                            {jobAppsPaginated.map(app => (
                                <li key={app.id} className="py-3 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{app.jobTitle} en {app.jobCompany}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Postulado el: {app.appliedAt?.toDate().toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        {app.recommenderRating ? (
                                            <div className="flex items-center">
                                               <StarRating rating={app.recommenderRating} readOnly />
                                            </div>
                                        ) : (
                                            <Button size="sm" variant="secondary" onClick={() => handleOpenRecommenderRatingModal(app)}>
                                                Calificar Recomendador
                                            </Button>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Página {jobAppsPage} de {jobAppsTotalPages > 0 ? jobAppsTotalPages : 1}</span>
                            <div className="space-x-2">
                                <Button onClick={() => setJobAppsPage(p => p - 1)} disabled={jobAppsPage === 1} size="sm">Anterior</Button>
                                <Button onClick={() => setJobAppsPage(p => p + 1)} disabled={jobAppsPage === jobAppsTotalPages || jobAppsTotalPages === 0} size="sm">Siguiente</Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <p className="text-slate-500 dark:text-slate-400">Aún no te has postulado a ningún empleo.</p>
                )}
            </Card>
             <Card title="Mis Solicitudes de Servicio" icon={<ClipboardDocumentListIcon />}>
                {serviceRequests.length > 0 ? (
                    <>
                        <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                            {serviceRequestsPaginated.map(req => (
                                <li key={req.id} className="py-3 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">Solicitud a: {req.professionalName}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Enviada el: {req.createdAt?.toDate().toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        {req.professionalRating ? (
                                            <StarRating rating={req.professionalRating} readOnly />
                                        ) : req.attendedDate ? (
                                            <Button size="sm" variant="secondary" onClick={() => handleOpenProfRatingModal(req)}>
                                                Calificar Profesional
                                            </Button>
                                        ) : (
                                            <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">Pendiente</span>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                         <div className="flex justify-between items-center mt-4">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Página {serviceRequestsPage} de {serviceRequestsTotalPages > 0 ? serviceRequestsTotalPages : 1}</span>
                            <div className="space-x-2">
                                <Button onClick={() => setServiceRequestsPage(p => p - 1)} disabled={serviceRequestsPage === 1} size="sm">Anterior</Button>
                                <Button onClick={() => setServiceRequestsPage(p => p + 1)} disabled={serviceRequestsPage === serviceRequestsTotalPages || serviceRequestsTotalPages === 0} size="sm">Siguiente</Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <p className="text-slate-500 dark:text-slate-400">Aún no has enviado ninguna solicitud de servicio.</p>
                )}
            </Card>
          </div>
          <div className="lg:col-span-1">
            <Card title="Mi Perfil" icon={<UserCircleIcon />}>
              <div className="space-y-1 text-slate-600 dark:text-slate-400">
                  <p><strong>Nombre:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Teléfono:</strong> {seekerProfile?.phoneNumber || 'No especificado'}</p>
                  <p><strong>Dirección:</strong> {seekerProfile?.address || 'No especificado'}</p>
                  <p><strong>Cód. Área:</strong> {seekerProfile?.areaCode || 'No especificado'}</p>
              </div>
              <Button className="mt-4 w-full" variant="secondary" onClick={handleOpenEditModal}>Editar Perfil</Button>
            </Card>
          </div>
        </div>
      </div>

       <Modal isOpen={isProfileDetailsModalOpen} onClose={() => setIsProfileDetailsModalOpen(false)} title="Perfil del Profesional">
        {selectedProfForDetails && (
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              {selectedProfForDetails.profile.photoURL ? (
                <img src={selectedProfForDetails.profile.photoURL} alt={selectedProfForDetails.name} className="w-20 h-20 rounded-full object-cover" />
              ) : (
                <UserCircleIcon className="w-20 h-20 text-slate-300" />
              )}
              <div>
                <h3 className="text-xl font-bold flex items-center">{selectedProfForDetails.name} {selectedProfForDetails.profile.isVerified && <VerifiedBadge />}</h3>
                <p className="text-indigo-500 font-semibold">{selectedProfForDetails.profile.specialty}</p>
                <div className="flex items-center mt-2">
                  <StarRating rating={selectedProfForDetails.averageRating} readOnly />
                  <span className="text-sm text-slate-500 ml-2">({selectedProfForDetails.reviewCount} {selectedProfForDetails.reviewCount === 1 ? 'opinión' : 'opiniones'})</span>
                </div>
                <p className="text-sm text-slate-500">{selectedProfForDetails.successfulServices} servicios exitosos</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold">Biografía</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{selectedProfForDetails.profile.bio || 'Sin biografía.'}</p>
            </div>
            <div>
              <h4 className="font-semibold">Servicios</h4>
              {selectedProfForDetails.profile.services?.length > 0 ? (
                <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {selectedProfForDetails.profile.services.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              ) : <p className="text-sm text-slate-500 mt-1">No hay servicios listados.</p>}
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={() => handleOpenRequestModal(selectedProfForDetails)}>Contactar</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} title={`Contactar a ${selectedProfessional?.name}`}>
        <form onSubmit={handleSendRequest} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="serviceDate" className="block text-sm font-medium">Día del servicio</label>
                    <input type="date" id="serviceDate" value={serviceDate} onChange={e => setServiceDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" required />
                </div>
                <div>
                    <label htmlFor="serviceTime" className="block text-sm font-medium">Hora del servicio</label>
                    <input type="time" id="serviceTime" value={serviceTime} onChange={e => setServiceTime(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" required />
                </div>
            </div>
            <div>
                <label htmlFor="requestDetails" className="block text-sm font-medium">Describa su necesidad (opcional)</label>
                <textarea id="requestDetails" value={requestDetails} onChange={e => setRequestDetails(e.target.value)} rows={4} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" />
            </div>
             <div className="flex justify-end space-x-3 pt-2">
                <Button type="button" variant="secondary" onClick={() => setIsRequestModalOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={isSending}>{isSending ? 'Enviando...' : 'Confirmar Solicitud'}</Button>
            </div>
        </form>
      </Modal>

      <Modal isOpen={isJobDetailsModalOpen} onClose={() => setIsJobDetailsModalOpen(false)} title={selectedJob?.title || 'Detalles del Empleo'}>
        {selectedJob && (
          <div className="space-y-4">
            <div className="prose prose-sm dark:prose-invert max-w-none">
                <h4 className="font-semibold">Descripción</h4>
                <p>{selectedJob.description}</p>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-600 dark:text-slate-400">Recomendado por: {selectedJob.recommenderName}</p>
            </div>
            <div className="flex justify-end pt-2">
                <Button onClick={() => handleApplyClick(selectedJob)}>Desbloquear y Postularse</Button>
            </div>
          </div>
        )}
      </Modal>
      
      <Modal isOpen={isPaywallModalOpen} onClose={() => setIsPaywallModalOpen(false)} title="Acceso Premium">
        <div className="space-y-4">
            <p className="text-slate-600 dark:text-slate-400">Para ver los detalles completos de la empresa y postularte, elige una opción:</p>
            <div className="p-4 border rounded-lg space-y-2">
                <h4 className="font-semibold">Pago Único por Postulación</h4>
                <p className="text-sm text-slate-500">Desbloquea esta oferta de empleo por un pago único de $2.00.</p>
                <Button className="w-full" onClick={() => selectedJob && handleUnlockJobPayment(selectedJob)}>Pagar $2.00</Button>
            </div>
            {memberships.length > 0 && (
                <div className="p-4 border rounded-lg space-y-2">
                    <h4 className="font-semibold">Comprar Membresía</h4>
                    <p className="text-sm text-slate-500">Accede a todas las postulaciones de forma ilimitada con una membresía.</p>
                    {memberships.map(mem => (
                         <Button key={mem.id} className="w-full" onClick={() => handleMembershipPayment(mem)}>
                            Comprar {mem.name} por ${mem.price}
                        </Button>
                    ))}
                </div>
            )}
        </div>
      </Modal>

      <Modal isOpen={isApplicationModalOpen} onClose={() => setIsApplicationModalOpen(false)} title={`Postularse a ${selectedJob?.title}`}>
        {selectedJob && (
            <form onSubmit={handleSendApplication} className="space-y-4">
                <div>
                    <h3 className="font-semibold text-lg">{selectedJob.title}</h3>
                    <p className="text-indigo-500">{selectedJob.company}</p>
                    <p className="text-sm text-slate-500 mt-2">{selectedJob.description}</p>
                </div>
                <hr className="dark:border-slate-600"/>
                <div>
                    <label htmlFor="coverLetter" className="block text-sm font-medium">Carta de Presentación (Opcional)</label>
                    <textarea id="coverLetter" value={coverLetter} onChange={e => setCoverLetter(e.target.value)} rows={4} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" />
                </div>
                <div>
                    <label htmlFor="cvFile" className="block text-sm font-medium">Adjuntar Hoja de Vida (CV)</label>
                    <input type="file" id="cvFile" onChange={e => setCvFile(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" required />
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                    <Button type="button" variant="secondary" onClick={() => setIsApplicationModalOpen(false)}>Cancelar</Button>
                    <Button type="submit" disabled={isSending}>{isSending ? 'Enviando...' : 'Confirmar Postulación'}</Button>
                </div>
            </form>
        )}
      </Modal>

      <Modal isOpen={isRecommenderRatingModalOpen} onClose={() => setIsRecommenderRatingModalOpen(false)} title={`Calificar a ${selectedApplication?.recommenderName}`}>
        <form onSubmit={handleSaveRecommenderRating} className="space-y-4">
            <p className="text-slate-600 dark:text-slate-400">Su opinión ayuda a otros a tomar mejores decisiones.</p>
            <div className="flex justify-center">
                 <StarRating rating={recommenderRating} setRating={setRecommenderRating} />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={() => setIsRecommenderRatingModalOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={isSaving}>{isSaving ? 'Guardando...' : 'Enviar Calificación'}</Button>
            </div>
        </form>
      </Modal>

      <Modal isOpen={isProfRatingModalOpen} onClose={() => setIsProfRatingModalOpen(false)} title={`Calificar a ${selectedRequest?.professionalName}`}>
          <form onSubmit={handleSaveProfRating} className="space-y-4">
              <p className="text-slate-600 dark:text-slate-400">Su opinión es importante para construir una comunidad de confianza.</p>
              <div className="flex justify-center">
                  <StarRating rating={professionalRating} setRating={setProfessionalRating} />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="secondary" onClick={() => setIsProfRatingModalOpen(false)}>Cancelar</Button>
                  <Button type="submit" disabled={isSaving}>{isSaving ? 'Enviar Calificación' : 'Guardar Calificación'}</Button>
              </div>
          </form>
      </Modal>
      
      <Modal isOpen={isPaymentModalOpen} onClose={closePaymentModal} title={`Realizar Pago: ${purchaseDisplay?.name || ''}`}>
            {paymentClientSecret && stripe ? (
                <StripeCheckoutForm stripe={stripe} clientSecret={paymentClientSecret} onSuccess={handlePaymentSuccess} onError={(msg) => setNotification(`Error de pago: ${msg}`)} />
            ) : <p>Cargando pasarela de pago...</p>}
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar mi Perfil">
        <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
                <label htmlFor="editName" className="block text-sm font-medium">Nombre</label>
                <input type="text" id="editName" value={editName} onChange={e => setEditName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" required />
            </div>
             <div>
                <label htmlFor="editPhoneNumber" className="block text-sm font-medium">Número de Teléfono</label>
                <input type="tel" id="editPhoneNumber" value={editPhoneNumber} onChange={e => setEditPhoneNumber(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" />
            </div>
            <div>
                <label htmlFor="editAddress" className="block text-sm font-medium">Dirección</label>
                <input type="text" id="editAddress" value={editAddress} onChange={e => setEditAddress(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" />
                 <Button type="button" variant="secondary" size="sm" className="mt-2" onClick={handleShareLocation}>Compartir Ubicación Actual</Button>
            </div>
             <div>
                <label htmlFor="editAreaCode" className="block text-sm font-medium">Código de Área</label>
                <input type="text" id="editAreaCode" value={editAreaCode} onChange={e => setEditAreaCode(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" />
            </div>
             <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={isSaving}>{isSaving ? 'Guardando...' : 'Guardar Cambios'}</Button>
            </div>
        </form>
      </Modal>
    </>
  );
}

export default SeekerDashboard;
