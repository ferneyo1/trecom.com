import React, { useState, useEffect, useRef } from 'react';
import { User, ProfessionalProfile, ServiceRequest, RequestStatus, Membership } from '../../types';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { Modal } from '../shared/Modal';
import { db, auth, storage } from '../../firebase';
import { updateProfile } from 'firebase/auth';
import { doc, onSnapshot, query, collection, where, setDoc, updateDoc, Timestamp, deleteDoc, addDoc, runTransaction } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, UploadTaskSnapshot } from 'firebase/storage';
import Toast from '../shared/Toast';
import VerifiedBadge from '../shared/VerifiedBadge';
import StripeCheckoutForm from '../shared/StripeCheckoutForm';
import StarRating from '../shared/StarRating';
import { useLanguage } from '../../contexts/LanguageContext';

// --- PROFESSIONAL DASHBOARD COMPONENT ---

interface ProfessionalDashboardProps {
  user: User;
}
type PurchaseAction = 
    | { type: 'unlock_request', requestId: string }
    | { type: 'buy_membership', membership: Membership };

const BriefcaseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M11.25 6.162A.763.763 0 0010.5 5.25h-3a.75.75 0 00-.75.75v.012a.763.763 0 00.75.75h3c.29 0 .553-.166.688-.412zM12.75 6.162a.763.763 0 01.688-.412h3a.75.75 0 01.75.75v.012a.763.763 0 01-.75.75h-3a.763.763 0 01-.688-.412zM9 9.75a.75.75 0 00-.75.75v10.5a.75.75 0 00.75.75h6a.75.75 0 00.75-.75V10.5a.75.75 0 00-.75-.75H9z" />
        <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h14.25c1.035 0 1.875.84 1.875 1.875v9.375a3 3 0 01-3 3H6a3 3 0 01-3-3V9.375zm3.75-1.875a1.875 1.875 0 00-1.875 1.875v.375h13.5v-.375a1.875 1.875 0 00-1.875-1.875h-9.75z" clipRule="evenodd" />
    </svg>
);
const ChartBarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M3 3v18h18V3H3zm8 16H5v-6h6v6zm8 0h-6v-4h6v4zm0-6h-6V5h6v8z" />
    </svg>
);
const EnvelopeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
      <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
    </svg>
);
const XCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
    </svg>
);
const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M5.25 3A2.25 2.25 0 003 5.25v13.5A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V5.25A2.25 2.25 0 0018.75 3H5.25z" />
        <path fillRule="evenodd" d="M15.75 5.25a.75.75 0 01.75.75V9a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75zm-7.5 0a.75.75 0 01.75.75V9a.75.75 0 01-1.5 0V6A.75.75 0 018.25 5.25zM6 10.5a.75.75 0 01.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 01.75-.75V11.25a.75.75 0 01-.75-.75H6zm3.75 0a.75.75 0 01.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 01.75-.75V11.25a.75.75 0 01-.75-.75H9.75zm3.75 0a.75.75 0 01.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 01.75-.75V11.25a.75.75 0 01-.75-.75H13.5zm-3.75 3.75a.75.75 0 01.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 01.75-.75V15a.75.75 0 01-.75-.75H9.75zm3.75 0a.75.75 0 01.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 01.75-.75V15a.75.75 0 01-.75-.75H13.5z" clipRule="evenodd" />
    </svg>
);
const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
      <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.342 1.374a3.026 3.026 0 01.64 2.287V17.5a3 3 0 01-3 3h-5.25a3 3 0 01-3-3V6.732a3.026 3.026 0 01.64-2.287c.512-.788 1.375-1.322 2.342-1.374zM12 5.25a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
    </svg>
);
const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25-.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
    </svg>
);
const LockClosedIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3A5.25 5.25 0 0012 1.5zm-3.75 5.25v3h7.5v-3a3.75 3.75 0 00-7.5 0z" clipRule="evenodd" />
    </svg>
);
const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
      <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
    </svg>
);
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={className} viewBox="0 0 16 16">
        <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
    </svg>
);


function ProfessionalDashboard({ user }: ProfessionalDashboardProps) {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<ProfessionalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  
  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [editSpecialty, setEditSpecialty] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editServices, setEditServices] = useState<string[]>([]);
  const [newService, setNewService] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editName, setEditName] = useState(user.name);
  const [editPhotoFile, setEditPhotoFile] = useState<File | null>(null);
  const [editPhotoPreview, setEditPhotoPreview] = useState<string | null>(null);
  const [editIdDocument, setEditIdDocument] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [photoUploadProgress, setPhotoUploadProgress] = useState<number | null>(null);
  const [idUploadProgress, setIdUploadProgress] = useState<number | null>(null);

  // Notification and Load State
  const [notification, setNotification] = useState<string | null>(null);
  const isInitialLoad = useRef(true);

  // Attend Service Modal State
  const [isAttendModalOpen, setIsAttendModalOpen] = useState(false);
  const [selectedRequestToAttend, setSelectedRequestToAttend] = useState<ServiceRequest | null>(null);
  const [attendedDate, setAttendedDate] = useState('');
  const [seekerRating, setSeekerRating] = useState(0);
  
  // Availability State
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [editAvailability, setEditAvailability] = useState('');
  const [isSavingAvailability, setIsSavingAvailability] = useState(false);
  
  // Camera Modal State
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- REFACTORED PAYMENT STATE ---
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);
  const [paymentClientSecret, setPaymentClientSecret] = useState<string | null>(null);
  const [purchaseAction, setPurchaseAction] = useState<PurchaseAction | null>(null);
  const [purchaseDisplay, setPurchaseDisplay] = useState<{ name: string; price: number } | null>(null);
  
  // --- NEW UNLOCK FLOW STATE ---
  const [isUnlockOptionsModalOpen, setIsUnlockOptionsModalOpen] = useState(false);
  const [selectedRequestForUnlock, setSelectedRequestForUnlock] = useState<ServiceRequest | null>(null);
  
  // --- NEW DELETE ATTENDED REQUEST STATE ---
  const [isDeleteAttendedModalOpen, setIsDeleteAttendedModalOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<ServiceRequest | null>(null);


  useEffect(() => {
    const profileRef = doc(db, 'professionals', user.uid);
    const requestsQuery = query(collection(db, 'serviceRequests'), where('professionalId', '==', user.uid));
    const membershipsRef = collection(db, 'memberships');

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
            const profileData = sanitizedData as ProfessionalProfile;
            setProfile(profileData);
            setEditAvailability(profileData?.availability || '');
        } else {
            setProfile(null);
        }
        setLoading(false);
    });
    
    const unsubscribeRequests = onSnapshot(requestsQuery, snapshot => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "added" && !isInitialLoad.current) {
          const newRequest = change.doc.data() as ServiceRequest;
          setNotification(t('professional.newServiceRequest'));
          setTimeout(() => setNotification(null), 5000);
          // Send email for new service request
          if(user.email) {
            await addDoc(collection(db, "mail"), {
              to: [user.email],
              message: {
                subject: t('emails.professional.newServiceRequestSubject'),
                html: t('emails.professional.newServiceRequestBody', { name: user.name, seekerName: newRequest.seekerName }),
              },
            });
          }
        }
      });

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
      requests.sort((a, b) => (new Date(b.createdAt).getTime() || 0) - (new Date(a.createdAt).getTime() || 0));
      setServiceRequests(requests);

      if (isInitialLoad.current) isInitialLoad.current = false;
    });

    const unsubscribeMemberships = onSnapshot(membershipsRef, snapshot => {
        setMemberships(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Membership)));
    });

    return () => {
      unsubscribeProfile();
      unsubscribeRequests();
      unsubscribeMemberships();
    };
  }, [user.uid, t, user.name, user.email]);
  
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

    const startPaymentProcess = (action: PurchaseAction, display: { name: string, price: number }) => {
        setPurchaseAction(action);
        setPurchaseDisplay(display);
        
        const simulatedSecret = `pi_${Date.now()}_secret_${Math.random().toString(36).substring(2)}`;
        setPaymentClientSecret(simulatedSecret);
        setIsPaymentModalOpen(true);
    };

    const handleUnlockRequestPayment = (request: ServiceRequest) => {
        const action: PurchaseAction = { type: 'unlock_request', requestId: request.id };
        const display = { name: `Desbloqueo de Solicitud #${request.id.substring(0, 5)}`, price: 5.00 };
        startPaymentProcess(action, display);
    };

    const handleMembershipPayment = (membership: Membership) => {
        setIsMembershipModalOpen(false);
        const action: PurchaseAction = { type: 'buy_membership', membership: membership };
        const display = { name: `${t('professional.membership')} ${membership.name}`, price: membership.price };
        startPaymentProcess(action, display);
    };

    const handlePaymentSuccess = async () => {
        if (!purchaseAction) return;
        
        try {
            if (purchaseAction.type === 'unlock_request') {
                const requestRef = doc(db, 'serviceRequests', purchaseAction.requestId);
                await updateDoc(requestRef, { status: RequestStatus.UNLOCKED });
            } else if (purchaseAction.type === 'buy_membership') {
                const { membership } = purchaseAction;
                const endDate = new Date();
                endDate.setDate(endDate.getDate() + membership.durationDays);
                const professionalRef = doc(db, 'professionals', user.uid);
                await setDoc(professionalRef, {
                    activeMembershipId: membership.id,
                    membershipEndDate: Timestamp.fromDate(endDate)
                }, { merge: true });
            }
            setNotification(t('seeker.paymentCompleted'));
            setTimeout(() => setNotification(null), 5000);
        } catch (error) {
            console.error("Error confirming purchase:", error);
            setNotification(t('seeker.errorConfirmingPurchase'));
            setTimeout(() => setNotification(null), 5000);
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
    
    const handleOpenUnlockOptionsModal = (request: ServiceRequest) => {
        setSelectedRequestForUnlock(request);
        setIsUnlockOptionsModalOpen(true);
    };

  const handleOpenEditModal = () => {
    setEditSpecialty(profile?.specialty || '');
    setEditBio(profile?.bio || '');
    setEditServices(profile?.services || []);
    setEditPhone(profile?.phone || '');
    setEditName(user.name);
    setEditPhotoFile(null);
    setEditPhotoPreview(profile?.photoURL || null);
    setEditIdDocument(null);
    setNewService('');
    setIsEditing(true);
  };

  const uploadFile = (file: File, path: string, progressSetter: (p: number) => void): Promise<string> => {
    return new Promise((resolve, reject) => {
        const storageRef = ref(storage, path);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot: UploadTaskSnapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                progressSetter(progress);
            },
            (error) => {
                console.error("Upload error:", error);
                reject(error);
                progressSetter(0);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(downloadURL);
            }
        );
    });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setPhotoUploadProgress(null);
    setIdUploadProgress(null);
    
    try {
      if (auth.currentUser && auth.currentUser.displayName !== editName) {
        await updateProfile(auth.currentUser, { displayName: editName });
      }
      await updateDoc(doc(db, 'users', user.uid), { name: editName });

      let photoDownloadURL = profile?.photoURL || '';
      if (editPhotoFile) {
        photoDownloadURL = await uploadFile(editPhotoFile, `professional_avatars/${user.uid}`, setPhotoUploadProgress);
      }

      let idDownloadURL = profile?.idDocumentURL;
      let idDocumentName = profile?.idDocumentName;
      if (editIdDocument) {
        idDownloadURL = await uploadFile(editIdDocument, `id_documents/${user.uid}/${editIdDocument.name}`, setIdUploadProgress);
        idDocumentName = editIdDocument.name;
      }
      
      const updatedProfileData: Partial<ProfessionalProfile> = {
        specialty: editSpecialty,
        bio: editBio,
        services: editServices,
        phone: editPhone,
        photoURL: photoDownloadURL,
        idDocumentURL: idDownloadURL,
        idDocumentName: idDocumentName,
        status: 'pending',
      };
      
      const docRef = doc(db, 'professionals', user.uid);
      await setDoc(docRef, updatedProfileData, { merge: true });

      if (user.email) {
          await addDoc(collection(db, "mail"), {
              to: [user.email],
              message: {
                  subject: t('emails.professional.profileSubmittedSubject'),
                  html: t('emails.professional.profileSubmittedBody', { name: editName }),
              },
          });
      }

      setIsEditing(false);
      setNotification(t('professional.profileSavedForReview'));
    } catch (error) {
      console.error("Error updating profile: ", error);
      setNotification(t('professional.couldNotSaveProfile'));
    } finally {
        setIsSaving(false);
        setPhotoUploadProgress(null);
        setIdUploadProgress(null);
        setTimeout(() => setNotification(null), 5000);
    }
  };
  
  const handleAddServiceInModal = () => {
    if (newService.trim() && !editServices.includes(newService.trim())) {
      setEditServices([...editServices, newService.trim()]);
      setNewService('');
    }
  };

  const handleRemoveServiceInModal = (serviceToRemove: string) => {
    setEditServices(editServices.filter(s => s !== serviceToRemove));
  };
  
  const handleOpenAttendModal = (request: ServiceRequest) => {
      setSelectedRequestToAttend(request);
      setAttendedDate('');
      setSeekerRating(0);
      setIsAttendModalOpen(true);
  }
  
  const handleSaveAttendance = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedRequestToAttend || !attendedDate || seekerRating === 0) {
          alert(t('professional.completeDateAndRatingError'));
          return;
      }
      setIsSaving(true);
      try {
          await runTransaction(db, async (transaction) => {
              const requestRef = doc(db, 'serviceRequests', selectedRequestToAttend.id);
              const seekerUserRef = doc(db, 'users', selectedRequestToAttend.seekerId);

              const seekerDoc = await transaction.get(seekerUserRef);
              if (!seekerDoc.exists()) {
                  throw new Error("Seeker user not found!");
              }

              const date = new Date(attendedDate);
              date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

              // Update service request
              transaction.update(requestRef, {
                  attendedDate: Timestamp.fromDate(date),
                  professionalRating: seekerRating,
              });
              
              // Update seeker's average rating
              const oldRatingCount = seekerDoc.data().ratingCount || 0;
              const oldAverageRating = seekerDoc.data().averageRating || 0;
              const newRatingCount = oldRatingCount + 1;
              const newAverageRating = ((oldAverageRating * oldRatingCount) + seekerRating) / newRatingCount;
              
              transaction.update(seekerUserRef, {
                  ratingCount: newRatingCount,
                  averageRating: newAverageRating
              });
          });

          setNotification(t('professional.attendanceSaved'));
          setTimeout(() => setNotification(null), 5000);
          setIsAttendModalOpen(false);
          
      } catch (error) {
          console.error("Error saving attendance:", error);
          alert(t('professional.couldNotSaveAttendance'));
      } finally {
          setIsSaving(false);
      }
  }

  const handleSendRatingReminder = async (request: ServiceRequest) => {
    if (!request.seekerEmail) {
        setNotification('Client email is not available.');
        setTimeout(() => setNotification(null), 3000);
        return;
    }

    setIsSaving(true);
    try {
        await addDoc(collection(db, "mail"), {
            to: [request.seekerEmail],
            message: {
                subject: t('emails.professional.ratingReminderSubject'),
                html: t('emails.professional.ratingReminderBody', { 
                    seekerName: request.seekerName, 
                    professionalName: user.name 
                }),
            },
        });
        setNotification(t('professional.reminderSent'));
        setTimeout(() => setNotification(null), 3000);
    } catch (error) {
        console.error("Error sending reminder:", error);
        setNotification(t('professional.errorSendingReminder'));
        setTimeout(() => setNotification(null), 3000);
    } finally {
        setIsSaving(false);
    }
  };
  
  const handleSaveAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAvailability(true);
    try {
        const docRef = doc(db, 'professionals', user.uid);
        await updateDoc(docRef, { availability: editAvailability });
        setNotification(t('professional.availabilitySaved'));
        setTimeout(() => setNotification(null), 5000);
        setIsAvailabilityModalOpen(false);
    } catch (error) {
        console.error("Error saving availability:", error);
        alert(t('professional.couldNotSaveAvailability'));
    } finally {
        setIsSavingAvailability(false);
    }
  };
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setEditPhotoFile(file);
        setEditPhotoPreview(URL.createObjectURL(file));
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
        canvas.toBlob((blob) => {
            if (blob) {
                const photoFile = new File([blob], "camera-photo.jpg", { type: "image/jpeg" });
                setEditPhotoFile(photoFile);
                setEditPhotoPreview(URL.createObjectURL(photoFile));
                setIsCameraModalOpen(false);
                setNotification(t('recommender.photoCaptured'));
                setTimeout(() => setNotification(null), 3000);
            }
        }, 'image/jpeg', 0.95);
      }
    }
  };
  
  const handleOpenDeleteAttendedModal = (request: ServiceRequest) => {
    setRequestToDelete(request);
    setIsDeleteAttendedModalOpen(true);
  };
  
  const handleConfirmDeleteAttendedRequest = async () => {
    if (!requestToDelete) return;
    setIsSaving(true);
    try {
        await deleteDoc(doc(db, 'serviceRequests', requestToDelete.id));
        setNotification(t('professional.recordDeleted'));
        setTimeout(() => setNotification(null), 3000);
        setIsDeleteAttendedModalOpen(false);
    } catch (error) {
        console.error("Error deleting attended request:", error);
        setNotification(t('professional.couldNotDeleteRecord'));
        setTimeout(() => setNotification(null), 3000);
    } finally {
        setIsSaving(false);
        setRequestToDelete(null);
    }
  };

  const handleWhatsAppChat = (request: ServiceRequest) => {
    if (request.seekerPhone) {
        const sanitizedPhone = request.seekerPhone.replace(/\D/g, '');
        if (sanitizedPhone) {
            const whatsappUrl = `https://wa.me/${sanitizedPhone}`;
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        } else {
            alert(t('professional.invalidPhoneNumber'));
        }
    }
  };

  const getStatusBanner = () => {
    if (!profile || !profile.status) return null;
    const baseClasses = "p-3 rounded-md mb-4 text-sm font-medium";
    let statusText = '', colorClasses = '';
    switch (profile.status) {
        case 'pending':
            statusText = t('professional.profilePending');
            colorClasses = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
            break;
        case 'approved':
            statusText = t('professional.profileApproved');
            colorClasses = 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            break;
        case 'rejected':
            statusText = t('professional.profileRejected');
            colorClasses = 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
            break;
        default: return null;
    }
    return <div className={`${baseClasses} ${colorClasses}`}>{statusText}</div>;
  }

  if (loading) return <div className="flex justify-center items-center p-8"><p>{t('professional.loadingProfile')}</p></div>;

  const hasActiveMembership = profile?.membershipEndDate && new Date(profile.membershipEndDate) > new Date();
  const activeRequests = serviceRequests.filter(req => !req.attendedDate);
  const attendedRequests = serviceRequests.filter(req => req.attendedDate);
  
  const completedServicesCount = attendedRequests.length;
  const ratings = attendedRequests.map(r => r.professionalRating).filter((r): r is number => typeof r === 'number' && r > 0);
  const averageRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

  let saveButtonText = t('saveChanges');
  if (isSaving) {
      if (photoUploadProgress !== null || idUploadProgress !== null) {
          saveButtonText = t('seeker.uploading') + '...';
      } else {
          saveButtonText = t('saving');
      }
  }

  return (
    <>
      <Toast message={notification} onClose={() => setNotification(null)} />
      <div className="space-y-6">
        {getStatusBanner()}
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('professional.dashboardTitle')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card title={t('professional.myPublicProfile')} icon={<BriefcaseIcon />}>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {profile?.photoURL ? (
                    <img src={profile.photoURL} alt={user.name} className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-lg"/>
                ) : (
                    <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-bold flex items-center justify-center sm:justify-start">
                    {user.name}
                    {profile?.isVerified && <VerifiedBadge />}
                  </h3>
                  <p className="text-indigo-500 mt-1">{profile?.specialty || t('professional.addYourSpecialty')}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{profile?.bio || t('professional.addYourBio')}</p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold">{t('professional.contactInfo')}</h4>
                  <p><strong>{t('professional.email')}:</strong> {user.email}</p>
                  <p><strong>{t('professional.phone')}:</strong> {profile?.phone || t('professional.notSpecified')}</p>
                </div>
                <div>
                  <h4 className="font-semibold">{t('professional.services')}</h4>
                  {profile?.services && profile.services.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {profile.services.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  ) : <p className="text-slate-500">{t('professional.addServicesYouOffer')}</p>}
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={handleOpenEditModal}>{t('edit')}</Button>
              </div>
            </Card>
            
            <Card title={t('professional.serviceRequests')} icon={<EnvelopeIcon />}>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">{t('professional.received')}</h3>
                {activeRequests.length > 0 ? (
                    activeRequests.map(req => (
                        <div key={req.id} className="p-4 border rounded-lg dark:border-slate-700">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold">{req.seekerName}</p>
                                    <p className="text-xs text-slate-500">{new Date(req.createdAt).toLocaleString()}</p>
                                </div>
                                <Button size="sm" variant="secondary" onClick={() => handleOpenAttendModal(req)}>{t('professional.finishService')}</Button>
                            </div>
                            <p className="mt-2 text-sm italic">"{req.requestDetails}"</p>
                            
                            {(req.status === RequestStatus.LOCKED && !hasActiveMembership) ? (
                                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/50 rounded-lg text-center">
                                    <LockClosedIcon className="w-8 h-8 mx-auto text-yellow-500" />
                                    <p className="mt-2 font-semibold">{t('professional.clientDataLocked')}</p>
                                    <p className="text-sm text-yellow-700 dark:text-yellow-300">{t('professional.unlockToView')}</p>
                                    <Button size="sm" className="mt-3" onClick={() => handleOpenUnlockOptionsModal(req)}>{t('professional.viewClientData')}</Button>
                                </div>
                            ) : (
                                 <div className="mt-4 pt-4 border-t dark:border-slate-700 space-y-2">
                                    <h4 className="font-semibold text-sm">{t('professional.clientData')}</h4>
                                    <p className="text-sm"><strong>{t('professional.name')}:</strong> {req.seekerName}</p>
                                    <p className="text-sm"><strong>{t('professional.email')}:</strong> {req.seekerEmail}</p>
                                    <p className="text-sm"><strong>{t('professional.phone')}:</strong> {req.seekerPhone || t('professional.notSpecified')}</p>
                                    <p className="text-sm"><strong>{t('professional.requestedDate')}:</strong> {req.serviceDate ? new Date(req.serviceDate).toLocaleDateString() : t('professional.notSpecified')}</p>
                                    <p className="text-sm"><strong>{t('professional.requestedTime')}:</strong> {req.serviceTime || t('professional.notSpecified')}</p>
                                    <div className="flex items-center space-x-2">
                                        <p className="text-sm"><strong>{t('professional.location')}:</strong></p>
                                        <Button size="sm" variant="secondary" onClick={() => handleWhatsAppChat(req)}><WhatsAppIcon className="w-4 h-4 mr-2"/>{t('professional.openChat')}</Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : <p className="text-slate-500">{t('professional.noActiveRequests')}</p>}

                <div className="pt-4 border-t dark:border-slate-700">
                    <h3 className="font-semibold text-lg">{t('professional.attendedServicesHistory')}</h3>
                    {attendedRequests.length > 0 ? (
                        attendedRequests.map(req => (
                            <div key={req.id} className="p-3 my-2 border rounded-lg dark:border-slate-700">
                                <p className="font-bold">{req.seekerName}</p>
                                <p className="text-xs text-slate-500">{t('professional.finished')}: {req.attendedDate ? new Date(req.attendedDate).toLocaleDateString() : 'N/A'}</p>
                                <div className="flex items-center space-x-2">
                                    <p className="text-sm">{t('professional.ratingGiven')}:</p>
                                     {req.clientRating ? 
                                        <StarRating rating={req.clientRating} readOnly size="sm"/> :
                                        <span className="text-xs text-slate-500">{t('professional.notYetRated')}</span>
                                    }
                                </div>
                                <div className="mt-2 flex items-center gap-2">
                                     <Button size="sm" variant="danger" onClick={() => handleOpenDeleteAttendedModal(req)}><TrashIcon className="w-4 h-4"/> </Button>
                                     {!req.clientRating && 
                                        <Button size="sm" variant="secondary" onClick={() => handleSendRatingReminder(req)} disabled={isSaving}>
                                            {t('professional.remindToRate')}
                                        </Button>
                                     }
                                </div>
                            </div>
                        ))
                    ) : <p className="text-slate-500">{t('professional.noFinishedServices')}</p>}
                </div>
              </div>
            </Card>
          </div>

          <div className="md:col-span-1 space-y-6">
            <Card title={t('professional.statistics')} icon={<ChartBarIcon />}>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{t('professional.requestsReceived')}:</span>
                  <span className="font-bold text-lg">{serviceRequests.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">{t('professional.completedServices')}:</span>
                  <span className="font-bold text-lg">{completedServicesCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">{t('professional.averageRating')}:</span>
                  <div className="flex items-center">
                    <StarRating rating={averageRating} readOnly />
                    <span className="ml-2 font-bold text-lg">{averageRating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card title={t('professional.myAvailability')} icon={<CalendarIcon />}>
                <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{profile?.availability || t('professional.noAvailability')}</p>
                <Button className="w-full mt-4" variant="secondary" onClick={() => setIsAvailabilityModalOpen(true)}>{t('edit')}</Button>
            </Card>
            
            <Card title={t('professional.membership')}>
                <p className="text-sm font-medium">{t('professional.status')}: <span className={hasActiveMembership ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>{hasActiveMembership ? t('professional.active') : t('professional.inactive')}</span></p>
                {hasActiveMembership && profile?.membershipEndDate && <p className="text-xs text-slate-500">Vence el: {new Date(profile.membershipEndDate).toLocaleDateString()}</p>}
                <Button className="w-full mt-4" onClick={() => setIsMembershipModalOpen(true)}>{t('professional.improveVisibility')}</Button>
            </Card>
          </div>
        </div>
      </div>
      
      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title={t('professional.editProfessionalProfile')}>
        <form onSubmit={handleSaveProfile} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
          {/* Form fields */}
            <div>
                <label className="block text-sm font-medium">{t('name')}</label>
                <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-md" required />
            </div>
            <div>
                <label className="block text-sm font-medium">{t('professional.specialty')}</label>
                <input type="text" value={editSpecialty} onChange={e => setEditSpecialty(e.target.value)} placeholder={t('professional.specialtyPlaceholder')} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-md" required />
            </div>
            <div>
                <label className="block text-sm font-medium">{t('professional.shortBio')}</label>
                <textarea value={editBio} onChange={e => setEditBio(e.target.value)} rows={4} placeholder={t('professional.bioPlaceholder')} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-md" required />
            </div>
             <div>
                <label className="block text-sm font-medium">{t('professional.phone')}</label>
                <input type="tel" value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder={t('professional.phonePlaceholder')} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-md" />
            </div>
            <div>
                <label className="block text-sm font-medium">{t('seeker.profilePhoto')}</label>
                <div className="mt-2 flex items-center space-x-4">
                    {editPhotoPreview ? (
                        <img src={editPhotoPreview} alt="Vista previa" className="w-24 h-24 rounded-full object-cover" />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>
                    )}
                    <div className="flex-grow">
                        <input type="file" accept="image/*" onChange={handlePhotoChange} id="photo-upload" className="hidden" />
                        <label htmlFor="photo-upload" className="cursor-pointer bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-medium py-2 px-4 rounded-md text-sm">{t('seeker.uploadPhoto')}</label>
                        <Button type="button" variant="secondary" onClick={() => setIsCameraModalOpen(true)} className="ml-2">
                            <CameraIcon className="w-5 h-5" />
                        </Button>
                        {photoUploadProgress !== null && (
                            <div className="w-full bg-slate-200 rounded-full h-2.5 dark:bg-slate-700 mt-2">
                                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${photoUploadProgress}%` }}></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium">{t('professional.idForVerification')}</label>
                <input type="file" onChange={e => setEditIdDocument(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-sm"/>
                <p className="text-xs text-slate-500 mt-1">{t('professional.idUploadNotice')}</p>
                {idUploadProgress !== null && (
                    <div className="w-full bg-slate-200 rounded-full h-2.5 dark:bg-slate-700 mt-2">
                        <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${idUploadProgress}%` }}></div>
                    </div>
                )}
            </div>
            <div>
                <label className="block text-sm font-medium">{t('professional.manageServices')}</label>
                <ul className="space-y-2 mt-2">
                    {editServices.map(s => (
                        <li key={s} className="flex justify-between items-center bg-slate-100 dark:bg-slate-900/50 p-2 rounded">
                            {s} <button type="button" onClick={() => handleRemoveServiceInModal(s)} className="text-red-500"><XCircleIcon className="w-5 h-5"/></button>
                        </li>
                    ))}
                </ul>
                <div className="flex space-x-2 mt-2">
                    <input type="text" value={newService} onChange={e => setNewService(e.target.value)} placeholder={t('professional.addNewServicePlaceholder')} className="flex-grow block w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-md" />
                    <Button type="button" variant="secondary" onClick={handleAddServiceInModal}>{t('recommender.add')}</Button>
                </div>
            </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>{t('cancel')}</Button>
            <Button type="submit" disabled={isSaving}>{saveButtonText}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isAttendModalOpen} onClose={() => setIsAttendModalOpen(false)} title={t('professional.finishServiceTitle')}>
        <form onSubmit={handleSaveAttendance} className="space-y-4">
            <div>
                <label className="block text-sm font-medium">{t('professional.completionDate')}</label>
                <input type="date" value={attendedDate} onChange={e => setAttendedDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-md" required />
            </div>
            <div>
                <label className="block text-sm font-medium">{t('professional.rateClient')}</label>
                <div className="mt-1">
                    <StarRating rating={seekerRating} setRating={setSeekerRating} />
                </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={() => setIsAttendModalOpen(false)}>{t('cancel')}</Button>
                <Button type="submit" disabled={isSaving}>{isSaving ? t('saving') : t('confirm')}</Button>
            </div>
        </form>
      </Modal>
      
      <Modal isOpen={isAvailabilityModalOpen} onClose={() => setIsAvailabilityModalOpen(false)} title={t('professional.editAvailability')}>
          <form onSubmit={handleSaveAvailability} className="space-y-4">
              <div>
                  <label className="block text-sm font-medium">{t('professional.describeYourSchedule')}</label>
                  <textarea value={editAvailability} onChange={e => setEditAvailability(e.target.value)} rows={5} placeholder={t('professional.schedulePlaceholder')} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-md" required />
              </div>
               <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="secondary" onClick={() => setIsAvailabilityModalOpen(false)}>{t('cancel')}</Button>
                  <Button type="submit" disabled={isSavingAvailability}>{isSavingAvailability ? t('saving') : t('saveChanges')}</Button>
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
      
       <Modal isOpen={isUnlockOptionsModalOpen} onClose={() => setIsUnlockOptionsModalOpen(false)} title={t('professional.unlockContact')}>
         <div className="space-y-4">
            <p className="text-slate-600 dark:text-slate-400">{t('professional.unlockContactDescription')}</p>
            <div className="p-4 border rounded-lg space-y-2 cursor-pointer hover:border-indigo-500" onClick={() => { setIsUnlockOptionsModalOpen(false); setIsMembershipModalOpen(true); }}>
                 <h4 className="font-bold">{t('professional.recommendedOption')}: {t('professional.acquireMembership')}</h4>
                 <p className="text-sm text-slate-500">{t('professional.membershipBenefit')}</p>
            </div>
            {selectedRequestForUnlock && (
                <div className="p-4 border rounded-lg space-y-2 cursor-pointer hover:border-indigo-500" onClick={() => { setIsUnlockOptionsModalOpen(false); handleUnlockRequestPayment(selectedRequestForUnlock); }}>
                     <h4 className="font-bold">{t('professional.singleUnlockPayment')}</h4>
                     <p className="text-sm text-slate-500">{t('professional.singleUnlockDescription')} $5.00</p>
                </div>
            )}
         </div>
       </Modal>
       
       <Modal isOpen={isMembershipModalOpen} onClose={() => setIsMembershipModalOpen(false)} title={t('professional.acquireMembershipTitle')}>
         <div className="space-y-4">
            <p className="text-slate-600 dark:text-slate-400">{t('professional.acquireMembershipDescription')}</p>
            {memberships.map(mem => (
                <div key={mem.id} className="p-4 border rounded-lg flex justify-between items-center cursor-pointer hover:border-indigo-500" onClick={() => handleMembershipPayment(mem)}>
                    <div>
                        <h4 className="font-bold">{mem.name}</h4>
                        <p className="text-sm text-slate-500">{mem.durationDays} {t('professional.daysOfAccess')}</p>
                    </div>
                    <Button>{t('professional.buyFor')} ${mem.price}</Button>
                </div>
            ))}
         </div>
       </Modal>
       
       <Modal isOpen={isPaymentModalOpen} onClose={closePaymentModal} title={`${t('payment.payNow')}: ${purchaseDisplay?.name || ''}`}>
            {paymentClientSecret ? (
                <StripeCheckoutForm clientSecret={paymentClientSecret} onSuccess={handlePaymentSuccess} onError={(msg) => setNotification(`${t('seeker.paymentError')} ${msg}`)} />
            ) : <p>{t('seeker.loadingPaymentGateway')}</p>}
       </Modal>
       
       <Modal isOpen={isDeleteAttendedModalOpen} onClose={() => setIsDeleteAttendedModalOpen(false)} title={t('professional.confirmDeletion')}>
         <p>{t('professional.confirmDeleteHistory')}</p>
         <div className="flex justify-end space-x-3 pt-4 mt-2">
            <Button variant="secondary" onClick={() => setIsDeleteAttendedModalOpen(false)}>{t('cancel')}</Button>
            <Button variant="danger" onClick={handleConfirmDeleteAttendedRequest} disabled={isSaving}>{isSaving ? t('deleting') : t('professional.yesDelete')}</Button>
        </div>
       </Modal>

    </>
  );
}

export default ProfessionalDashboard;