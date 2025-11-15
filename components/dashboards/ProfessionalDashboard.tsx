import React, { useState, useEffect, useRef } from 'react';
import { User, ProfessionalProfile, ServiceRequest, RequestStatus, Membership } from '../../types';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { Modal } from '../shared/Modal';
import { db, auth } from '../../firebase';
import { updateProfile } from 'firebase/auth';
import { doc, onSnapshot, query, collection, where, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import Toast from '../shared/Toast';
import VerifiedBadge from '../shared/VerifiedBadge';
import StripeCheckoutForm from '../shared/StripeCheckoutForm';
import StarRating from '../shared/StarRating';

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


function ProfessionalDashboard({ user }: ProfessionalDashboardProps) {
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
  const [editPhotoURL, setEditPhotoURL] = useState('');
  const [editIdDocument, setEditIdDocument] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Notification and Load State
  const [notification, setNotification] = useState<string | null>(null);
  const isInitialLoad = useRef(true);

  // Attend Service Modal State
  const [isAttendModalOpen, setIsAttendModalOpen] = useState(false);
  const [selectedRequestToAttend, setSelectedRequestToAttend] = useState<ServiceRequest | null>(null);
  const [attendedDate, setAttendedDate] = useState('');
  const [clientRating, setClientRating] = useState(0);
  
  // Availability State
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [editAvailability, setEditAvailability] = useState('');
  const [isSavingAvailability, setIsSavingAvailability] = useState(false);
  
  // Camera Modal State
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- REFACTORED PAYMENT STATE ---
  const [stripe, setStripe] = useState<any>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);
  const [paymentClientSecret, setPaymentClientSecret] = useState<string | null>(null);
  const [purchaseAction, setPurchaseAction] = useState<PurchaseAction | null>(null);
  const [purchaseDisplay, setPurchaseDisplay] = useState<{ name: string; price: number } | null>(null);

  useEffect(() => {
    const stripePromise = window.Stripe('pk_test_51Pefp3RqgG8j12HGL2TCAw3Y9f5V4qG6v0E9d2W5A4N0e1c0x3W1N6d4Y9a0T1b2o3a4b5c6d7e8f9');
    setStripe(stripePromise);
  }, []);

  useEffect(() => {
    const profileRef = doc(db, 'professionals', user.uid);
    const requestsQuery = query(collection(db, 'serviceRequests'), where('professionalId', '==', user.uid));
    const membershipsRef = collection(db, 'memberships');

    const unsubscribeProfile = onSnapshot(profileRef, doc => {
      const profileData = doc.exists() ? (doc.data() as ProfessionalProfile) : null;
      setProfile(profileData);
      setEditAvailability(profileData?.availability || '');
      setLoading(false);
    });
    
    const unsubscribeRequests = onSnapshot(requestsQuery, snapshot => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added" && !isInitialLoad.current) {
          setNotification("¡Has recibido una nueva solicitud de servicio!");
          setTimeout(() => setNotification(null), 5000);
        }
      });

      const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServiceRequest));
      requests.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
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
  }, [user.uid]);
  
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
        const display = { name: `Membresía ${membership.name}`, price: membership.price };
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
                await updateDoc(professionalRef, {
                    activeMembershipId: membership.id,
                    membershipEndDate: Timestamp.fromDate(endDate)
                });
            }
            setNotification("¡Pago completado con éxito!");
            setTimeout(() => setNotification(null), 5000);
        } catch (error) {
            console.error("Error confirming purchase:", error);
            setNotification("Error al confirmar la compra.");
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

  const handleOpenEditModal = () => {
    setEditSpecialty(profile?.specialty || '');
    setEditBio(profile?.bio || '');
    setEditServices(profile?.services || []);
    setEditPhone(profile?.phone || '');
    setEditName(user.name);
    setEditPhotoURL(profile?.photoURL || '');
    setEditIdDocument(null);
    setNewService('');
    setIsEditing(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // 1. Update auth profile (name)
      if (auth.currentUser && auth.currentUser.displayName !== editName) {
        await updateProfile(auth.currentUser, { displayName: editName });
      }

      // 2. Update 'users' collection (name)
      await updateDoc(doc(db, 'users', user.uid), { name: editName });

      // 3. Update 'professionals' collection (profile data)
      const updatedProfileData: Partial<ProfessionalProfile> = {
        specialty: editSpecialty,
        bio: editBio,
        services: editServices,
        phone: editPhone,
        photoURL: editPhotoURL,
        status: 'pending',
      };
      if (editIdDocument) {
        updatedProfileData.idDocumentName = editIdDocument.name;
      }
      
      const docRef = doc(db, 'professionals', user.uid);
      await setDoc(docRef, updatedProfileData, { merge: true });
      setIsEditing(false);
      setNotification("Perfil guardado y enviado a revisión.");
      setTimeout(() => setNotification(null), 5000);
    } catch (error) {
      console.error("Error updating profile: ", error);
      alert("No se pudo guardar el perfil.");
    } finally {
        setIsSaving(false);
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
      setClientRating(0);
      setIsAttendModalOpen(true);
  }
  
  const handleSaveAttendance = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedRequestToAttend || !attendedDate || clientRating === 0) {
          alert("Por favor, complete la fecha y la calificación.");
          return;
      }
      setIsSaving(true);
      try {
          const requestRef = doc(db, 'serviceRequests', selectedRequestToAttend.id);
          const date = new Date(attendedDate);
          date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

          await updateDoc(requestRef, {
              attendedDate: Timestamp.fromDate(date),
              clientRating: clientRating,
          });
          
          setNotification("Servicio finalizado y calificado con éxito.");
          setTimeout(() => setNotification(null), 5000);
          setIsAttendModalOpen(false);
          
      } catch (error) {
          console.error("Error saving attendance:", error);
          alert("No se pudo guardar la información.");
      } finally {
          setIsSaving(false);
      }
  }
  
  const handleSaveAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAvailability(true);
    try {
        const docRef = doc(db, 'professionals', user.uid);
        await updateDoc(docRef, { availability: editAvailability });
        setNotification("Disponibilidad guardada con éxito.");
        setTimeout(() => setNotification(null), 5000);
        setIsAvailabilityModalOpen(false);
    } catch (error) {
        console.error("Error saving availability:", error);
        alert("No se pudo guardar la disponibilidad.");
    } finally {
        setIsSavingAvailability(false);
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
        setNotification("Foto capturada. No olvide guardar los cambios.");
        setTimeout(() => setNotification(null), 5000);
      }
    }
  };

  const getStatusBanner = () => {
    if (!profile || !profile.status) return null;
    const baseClasses = "p-3 rounded-md mb-4 text-sm font-medium";
    let statusText = '', colorClasses = '';
    switch (profile.status) {
        case 'pending':
            statusText = 'Su perfil está pendiente de revisión por un administrador.';
            colorClasses = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
            break;
        case 'approved':
            statusText = '¡Felicidades! Su perfil ha sido aprobado y ahora es visible para los buscadores.';
            colorClasses = 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            break;
        case 'rejected':
            statusText = 'Su perfil ha sido rechazado. Por favor, revise su contenido y vuelva a enviarlo.';
            colorClasses = 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
            break;
        default: return null;
    }
    return <div className={`${baseClasses} ${colorClasses}`}>{statusText}</div>;
  }

  if (loading) return <div className="flex justify-center items-center p-8"><p>Cargando perfil...</p></div>;

  const hasActiveMembership = profile?.membershipEndDate && profile.membershipEndDate.toDate() > new Date();
  const activeRequests = serviceRequests.filter(req => !req.attendedDate);
  const attendedRequests = serviceRequests.filter(req => req.attendedDate);

  return (
    <>
      <Toast message={notification} onClose={() => setNotification(null)} />
      <div className="space-y-6">
        {getStatusBanner()}
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Panel de Profesional</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card title="Mi Perfil Público" icon={<BriefcaseIcon />}>
              <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                  {profile?.photoURL ? (
                      <img src={profile.photoURL} alt={user.name} className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-md flex-shrink-0" />
                  ) : (
                      <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                          <BriefcaseIcon className="w-12 h-12 text-slate-400" />
                      </div>
                  )}
                  <div className="flex-grow">
                      <h4 className="text-xl font-bold flex items-center">
                          {user.name}
                          {profile?.isVerified && <VerifiedBadge />}
                      </h4>
                      <p className="text-indigo-600 dark:text-indigo-400 font-semibold">{profile?.specialty || 'Añada su especialidad'}</p>
                      <div className="prose prose-sm dark:prose-invert mt-2" dangerouslySetInnerHTML={{ __html: profile?.bio || '<i>Añada una biografía para atraer clientes.</i>' }} />
                  </div>
                  <div className="flex-shrink-0">
                    <Button variant="secondary" onClick={handleOpenEditModal}>Editar Perfil</Button>
                  </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <h5 className="font-semibold text-slate-900 dark:text-white">Información de Contacto</h5>
                  <div className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Teléfono:</strong> {profile?.phone || 'No especificado'}</p>
                  </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <h5 className="font-semibold">Servicios</h5>
                  {profile?.services && profile.services.length > 0 ? (
                    <ul className="mt-2 space-y-2">
                        {profile.services.map((service, index) => (
                            <li key={index} className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-2 rounded-md">
                                <span className="text-slate-700 dark:text-slate-300">{service}</span>
                            </li>
                        ))}
                    </ul>
                  ) : (<p className="text-slate-500 dark:text-slate-400 mt-2">Añada los servicios que ofrece.</p>)}
              </div>
            </Card>
            <Card title="Mi Disponibilidad" icon={<CalendarIcon />}>
                <div className="flex justify-between items-center">
                    <p className="text-slate-600 dark:text-slate-400">
                        {profile?.availability ? `Horario: ${profile.availability}` : 'No has especificado tu disponibilidad.'}
                    </p>
                    <Button variant="secondary" onClick={() => setIsAvailabilityModalOpen(true)}>Editar</Button>
                </div>
            </Card>
            <Card title="Solicitudes de Servicio" icon={<EnvelopeIcon />}>
               {activeRequests.length > 0 ? (
                   <div className="space-y-4">
                       {activeRequests.map(req => {
                           const isUnlocked = req.status === RequestStatus.UNLOCKED || hasActiveMembership;
                           return (
                               <div key={req.id} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700">
                                   <p className="text-sm text-slate-500 dark:text-slate-400">Recibido: {req.createdAt?.toDate().toLocaleDateString()}</p>
                                   <p className="mt-2 text-slate-700 dark:text-slate-300 whitespace-pre-wrap"><strong>Necesidad:</strong> {req.requestDetails || 'No especificada'}</p>
                                   <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                                       {isUnlocked ? (
                                           <div className="space-y-1">
                                               <h4 className="font-semibold text-slate-800 dark:text-slate-200">Datos del Cliente:</h4>
                                               <p><strong>Nombre:</strong> {req.seekerName}</p>
                                               <p><strong>Email:</strong> {req.seekerEmail}</p>
                                               <p><strong>Teléfono:</strong> {req.seekerPhone || 'No especificado'}</p>
                                               <p><strong>Fecha Solicitada:</strong> {req.serviceDate ? req.serviceDate.toDate().toLocaleDateString() : 'No especificada'}</p>
                                               <p><strong>Hora Solicitada:</strong> {req.serviceTime || 'No especificada'}</p>
                                                <div className="mt-3 flex items-center space-x-2">
                                                    <Button size="sm">Abrir Chat</Button>
                                                    <Button size="sm" variant="secondary" onClick={() => handleOpenAttendModal(req)}>Finalizar Servicio</Button>
                                                </div>
                                           </div>
                                       ) : (
                                           <div>
                                                <h4 className="font-semibold text-slate-800 dark:text-slate-200">Datos Bloqueados</h4>
                                               <p className="text-sm text-slate-500">Desbloquee para ver los detalles del cliente.</p>
                                               <Button className="mt-2" onClick={() => handleUnlockRequestPayment(req)}>Desbloquear Contacto</Button>
                                           </div>
                                       )}
                                   </div>
                               </div>
                           )
                       })}
                   </div>
               ) : (
                   <p className="text-slate-500 dark:text-slate-400">Aún no has recibido ninguna solicitud de servicio activa.</p>
               )}
            </Card>
            <Card title="Historial de Servicios Atendidos" icon={<BriefcaseIcon />}>
                {attendedRequests.length > 0 ? (
                    <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                    {attendedRequests.map(req => (
                        <li key={req.id} className="py-3">
                        <div className="flex justify-between items-center flex-wrap gap-2">
                            <p className="font-semibold">{req.seekerName}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                            Finalizado: {req.attendedDate?.toDate().toLocaleDateString()}
                            </p>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{req.requestDetails}</p>
                        <div className="flex items-center mt-2 text-sm">
                            <span className="font-medium text-slate-700 dark:text-slate-300 mr-2">Calificación Otorgada:</span>
                            <StarRating rating={req.clientRating || 0} readOnly size="sm" />
                        </div>
                        </li>
                    ))}
                    </ul>
                ) : (
                    <p className="text-slate-500 dark:text-slate-400">Aún no has finalizado ningún servicio.</p>
                )}
            </Card>
          </div>
          <div className="md:col-span-1">
            <Card title="Estadísticas" icon={<ChartBarIcon />}>
              <div className="space-y-4">
                  <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Solicitudes Recibidas</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{serviceRequests.length}</p>
                  </div>
                   <hr className="border-slate-200 dark:border-slate-700" />
                  <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Membresía</p>
                      <p className={`text-xl font-bold ${hasActiveMembership ? 'text-green-500' : 'text-red-500'}`}>{hasActiveMembership ? 'Activa' : 'Inactiva'}</p>
                  </div>
                  <Button className="w-full mt-2" onClick={() => setIsMembershipModalOpen(true)}>Mejorar Visibilidad</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Editar Perfil Profesional">
        <form onSubmit={handleSaveProfile} className="space-y-4">
             <div>
                <label htmlFor="editName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nombre</label>
                <input type="text" id="editName" value={editName} onChange={e => setEditName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
            </div>
            <div>
                <label htmlFor="specialty" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Especialidad</label>
                <input type="text" id="specialty" value={editSpecialty} onChange={e => setEditSpecialty(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Ej: Desarrollador Full-Stack" />
            </div>
            <div>
                <label htmlFor="bio" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Biografía Corta</label>
                <textarea id="bio" value={editBio} onChange={e => setEditBio(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Una breve descripción sobre usted y su trabajo." />
            </div>
             <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Teléfono</label>
                <input type="tel" id="phone" value={editPhone} onChange={e => setEditPhone(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Ej: +1 234 567 890" />
            </div>
             <div>
                <label htmlFor="photoURL" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Foto de Perfil</label>
                {editPhotoURL && (
                    <div className="mt-2">
                        <img src={editPhotoURL} alt="Vista previa" className="w-24 h-24 rounded-full object-cover" />
                    </div>
                )}
                <div className="flex items-center space-x-2 mt-2">
                    <input type="url" id="photoURL" value={editPhotoURL} onChange={e => setEditPhotoURL(e.target.value)} className="flex-grow block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="https://ejemplo.com/foto.jpg" />
                    <Button type="button" variant="secondary" onClick={() => setIsCameraModalOpen(true)} className="flex-shrink-0">
                        <CameraIcon className="w-5 h-5" />
                    </Button>
                </div>
            </div>
            
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Gestionar Servicios</label>
                {editServices.length > 0 ? (
                    <ul className="mt-2 space-y-2">
                        {editServices.map((service, index) => (
                            <li key={index} className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-2 rounded-md text-sm">
                                <span className="text-slate-700 dark:text-slate-300">{service}</span>
                                <button type="button" onClick={() => handleRemoveServiceInModal(service)} className="text-slate-400 hover:text-red-500 transition-colors" aria-label={`Eliminar servicio ${service}`}><XCircleIcon className="w-5 h-5" /></button>
                            </li>
                        ))}
                    </ul>
                ) : <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">No hay servicios añadidos.</p>}
                <div className="mt-3 flex space-x-2">
                    <input type="text" value={newService} onChange={e => setNewService(e.target.value)} placeholder="Añadir nuevo servicio" className="flex-grow block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                    <Button type="button" variant="secondary" onClick={handleAddServiceInModal}>Añadir</Button>
                </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <label htmlFor="idDocument" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Documento de Identidad (para verificación)</label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Subir un nuevo documento lo enviará a revisión.</p>
                <input type="file" id="idDocument" onChange={e => setEditIdDocument(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>Cancelar</Button>
                <Button type="submit" disabled={isSaving}>{isSaving ? 'Guardando...' : 'Guardar Cambios'}</Button>
            </div>
        </form>
      </Modal>

      <Modal isOpen={isMembershipModalOpen} onClose={() => setIsMembershipModalOpen(false)} title="Adquirir Membresía">
        <div className="space-y-4">
            <p className="text-slate-600 dark:text-slate-400">Elija un plan para desbloquear todas las solicitudes y mejorar su visibilidad.</p>
            {memberships.map(mem => (
                <div key={mem.id} className="p-4 border rounded-lg flex justify-between items-center">
                    <div>
                        <h4 className="font-semibold">{mem.name}</h4>
                        <p className="text-sm text-slate-500">{mem.durationDays} días de acceso ilimitado</p>
                    </div>
                    <Button onClick={() => handleMembershipPayment(mem)}>Comprar por ${mem.price}</Button>
                </div>
            ))}
        </div>
      </Modal>

      <Modal isOpen={isPaymentModalOpen} onClose={closePaymentModal} title={`Realizar Pago: ${purchaseDisplay?.name || ''}`}>
            {paymentClientSecret && stripe ? (
                <StripeCheckoutForm stripe={stripe} clientSecret={paymentClientSecret} onSuccess={handlePaymentSuccess} onError={(msg) => setNotification(`Error de pago: ${msg}`)} />
            ) : <p>Cargando pasarela de pago...</p>}
      </Modal>

      <Modal isOpen={isAttendModalOpen} onClose={() => setIsAttendModalOpen(false)} title="Finalizar Servicio">
          <form onSubmit={handleSaveAttendance} className="space-y-4">
            <div>
              <label htmlFor="attendedDate" className="block text-sm font-medium">Fecha de Finalización</label>
              <input type="date" id="attendedDate" value={attendedDate} onChange={e => setAttendedDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Calificar al Cliente</label>
              <div className="mt-2 flex justify-center">
                  <StarRating rating={clientRating} setRating={setClientRating} />
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={() => setIsAttendModalOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={isSaving}>{isSaving ? 'Guardar' : 'Confirmar'}</Button>
            </div>
          </form>
      </Modal>

      <Modal isOpen={isAvailabilityModalOpen} onClose={() => setIsAvailabilityModalOpen(false)} title="Editar Disponibilidad">
        <form onSubmit={handleSaveAvailability} className="space-y-4">
          <div>
            <label htmlFor="availabilityText" className="block text-sm font-medium">Describa su horario</label>
            <input 
              type="text" 
              id="availabilityText" 
              value={editAvailability} 
              onChange={e => setEditAvailability(e.target.value)} 
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" 
              placeholder="Ej: Lunes a Viernes, 9am - 5pm" 
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsAvailabilityModalOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={isSavingAvailability}>{isSavingAvailability ? 'Guardando...' : 'Guardar'}</Button>
          </div>
        </form>
      </Modal>
      
      <Modal isOpen={isCameraModalOpen} onClose={() => setIsCameraModalOpen(false)} title="Capturar Foto de Perfil">
        <div className="space-y-4">
            <video ref={videoRef} autoPlay playsInline className="w-full h-auto rounded-md bg-slate-900"></video>
            <canvas ref={canvasRef} className="hidden"></canvas>
            <Button onClick={handleCapturePhoto} className="w-full">Capturar Foto</Button>
        </div>
      </Modal>
    </>
  );
}

export default ProfessionalDashboard;