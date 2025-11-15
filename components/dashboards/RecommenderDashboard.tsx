import React, { useState, useEffect, useRef } from 'react';
import { User, Job, RecommenderProfile } from '../../types';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { db, auth } from '../../firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, setDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { Modal } from '../shared/Modal';
import Toast from '../shared/Toast';
import StarRating from '../shared/StarRating';

interface RecommenderDashboardProps {
  user: User;
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


function RecommenderDashboard({ user }: RecommenderDashboardProps) {
  // Job publishing state
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Profile state
  const [profile, setProfile] = useState<RecommenderProfile | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editPhone, setEditPhone] = useState('');
  const [editPhotoURL, setEditPhotoURL] = useState('');
  const [editBio, setEditBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Camera Modal State
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Listen for real-time updates on jobs posted by the current user
    const jobsQuery = query(collection(db, 'jobs'), where('recommenderId', '==', user.uid));
    const unsubscribeJobs = onSnapshot(jobsQuery, snapshot => {
            const userJobs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Job));
            setJobs(userJobs);
        });
    
    // Listen for real-time updates on the recommender's profile
    const profileRef = doc(db, 'recommenders', user.uid);
    const unsubscribeProfile = onSnapshot(profileRef, doc => {
        if (doc.exists()) {
            setProfile(doc.data() as RecommenderProfile);
        }
    });
    
    return () => {
        unsubscribeJobs();
        unsubscribeProfile();
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

  const handlePublishJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !companyName || !jobDescription) {
        setNotification("Por favor, complete todos los campos.");
        setTimeout(() => setNotification(null), 3000);
        return;
    }
    setLoading(true);
    try {
        await addDoc(collection(db, 'jobs'), {
            title: jobTitle,
            company: companyName,
            description: jobDescription,
            recommenderId: user.uid,
            recommenderName: user.name,
            createdAt: serverTimestamp(),
            applicantCount: 0,
        });
        setJobTitle('');
        setCompanyName('');
        setJobDescription('');
        setNotification("¡Empleo publicado con éxito!");
        setTimeout(() => setNotification(null), 3000);
    } catch (error) {
        console.error("Error adding document: ", error);
        setNotification("Ocurrió un error al publicar el empleo.");
        setTimeout(() => setNotification(null), 3000);
    } finally {
        setLoading(false);
    }
  };

  const handleOpenEditModal = () => {
    setEditName(user.name);
    setEditPhone(profile?.phone || '');
    setEditPhotoURL(profile?.photoURL || '');
    setEditBio(profile?.bio || '');
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
            bio: editBio,
        };
        await setDoc(doc(db, 'recommenders', user.uid), profileData, { merge: true });
        
        setNotification('Perfil actualizado con éxito.');
        setTimeout(() => setNotification(null), 3000);
        setIsEditModalOpen(false);
    } catch (error) {
        console.error("Error updating profile:", error);
        setNotification('Error al actualizar el perfil.');
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
        setNotification("Foto capturada. No olvide guardar los cambios.");
        setTimeout(() => setNotification(null), 3000);
      }
    }
  };


  return (
    <>
    <Toast message={notification} onClose={() => setNotification(null)} />
    <div className="space-y-6">
       <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Panel de Recomendador</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <Card title="Publicar Nuevo Empleo" icon={<BriefcaseIcon />}>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                    ¿Conoces una oportunidad laboral increíble? Compártela con la comunidad de profesionales.
                </p>
                 <form onSubmit={handlePublishJob} className="space-y-4">
                    <div>
                        <label htmlFor="jobTitle" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Título del Empleo</label>
                        <input type="text" id="jobTitle" value={jobTitle} onChange={e => setJobTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Ej: Desarrollador Frontend" required />
                    </div>
                     <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nombre de la Empresa</label>
                        <input type="text" id="companyName" value={companyName} onChange={e => setCompanyName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Ej: Tech Solutions Inc." required/>
                    </div>
                     <div>
                        <label htmlFor="jobDescription" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Descripción del Empleo</label>
                        <textarea id="jobDescription" value={jobDescription} onChange={e => setJobDescription(e.target.value)} rows={4} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Describe las responsabilidades, requisitos, etc." required/>
                    </div>
                    <Button type="submit" disabled={loading}>{loading ? 'Publicando...' : 'Publicar Empleo'}</Button>
                </form>
            </Card>

            <Card title="Mis Empleos Publicados" icon={<BriefcaseIcon />}>
                 {jobs.length > 0 ? (
                    <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                        {jobs.map(job => (
                            <li key={job.id} className="py-3">
                                <p className="font-semibold">{job.title} en {job.company}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{job.description}</p>
                            </li>
                        ))}
                    </ul>
                 ) : (
                    <p className="text-slate-500 dark:text-slate-400">Aún no has publicado ningún empleo.</p>
                 )}
            </Card>
        </div>
        <div className="lg:col-span-1">
          <Card title="Perfil de Recomendador" icon={<UserCircleIcon />}>
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
                    <p className="text-sm text-slate-500 dark:text-slate-400">{profile?.phone || 'Sin teléfono'}</p>
                  </div>
                  <div className="flex items-center">
                    <StarRating rating={user.averageRating || 0} readOnly />
                    <span className="text-xs text-slate-500 ml-2">({user.ratingCount || 0} {user.ratingCount === 1 ? 'opinión' : 'opiniones'})</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700 w-full">
                    <strong>Empleos publicados:</strong> {jobs.length}
                  </p>
                  <Button className="mt-4 w-full" variant="secondary" onClick={handleOpenEditModal}>Editar Perfil</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
    
    <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar mi Perfil">
        <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
                <label htmlFor="editName" className="block text-sm font-medium">Nombre</label>
                <input type="text" id="editName" value={editName} onChange={e => setEditName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" required />
            </div>
            <div>
                <label htmlFor="editPhone" className="block text-sm font-medium">Teléfono</label>
                <input type="tel" id="editPhone" value={editPhone} onChange={e => setEditPhone(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" />
            </div>
            <div>
                <label htmlFor="editBio" className="block text-sm font-medium">Biografía</label>
                <textarea id="editBio" value={editBio} onChange={e => setEditBio(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" />
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
            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={isSaving}>{isSaving ? 'Guardando...' : 'Guardar Cambios'}</Button>
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

export default RecommenderDashboard;