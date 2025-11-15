import React, { useState, useEffect } from 'react';
import { User, ProfessionalProfile, UserRole, Membership, ServiceRequest, Job } from '../../types';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { db } from '../../firebase';
import { Modal } from '../shared/Modal';
import { collection, onSnapshot, query, where, getDoc, updateDoc, deleteDoc, addDoc, doc, writeBatch, getDocs } from 'firebase/firestore';

interface AdminDashboardProps {
  user: User;
}

interface UserDocument extends User {
    id: string;
    // Added professional profile data for display in the user list
    idDocumentName?: string; 
}

interface ProfessionalDocument extends ProfessionalProfile {
    id: string;
    name?: string;
}

const UsersIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM1.5 15.75a8.25 8.25 0 0113.5 0v3a1.5 1.5 0 01-1.5 1.5h-10.5a1.5 1.5 0 01-1.5-1.5v-3zM16.5 18.75a5.25 5.25 0 0010.5 0v-1.5a1.5 1.5 0 00-1.5-1.5h-7.5a1.5 1.5 0 00-1.5 1.5v1.5z" /></svg>
);
const ClipboardIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M10.5 3A2.5 2.5 0 008 5.5v2.812a3.001 3.001 0 00-1.878 1.134l-2.613 3.36a2.5 2.5 0 000 2.946l2.613 3.36a3.001 3.001 0 001.878 1.134V22.5a2.5 2.5 0 005 0v-2.254a3.001 3.001 0 001.878-1.134l2.613-3.36a2.5 2.5 0 000-2.946l-2.613-3.36A3.001 3.001 0 0016 8.312V5.5A2.5 2.5 0 0013.5 3h-3zm-2.55 9.19a.75.75 0 00-.094 1.054l2.613 3.36a1.5 1.5 0 00.938.567h2.186a1.5 1.5 0 00.938-.567l2.613-3.36a.75.75 0 10-1.148-.894L15.314 15H8.686l-1.33-1.71a.75.75 0 00-1.054.094z" clipRule="evenodd" /></svg>
);
const CreditCardIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V6.75a3 3 0 00-3-3h-15z" /><path fillRule="evenodd" d="M22.5 6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V6.75zm-18 0a1.5 1.5 0 011.5-1.5h15a1.5 1.5 0 011.5 1.5v2.25H4.5V6.75z" clipRule="evenodd" /></svg>
);
const DocumentTextIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" /></svg>
);
const BriefcaseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M11.25 6.162A.763.763 0 0010.5 5.25h-3a.75.75 0 00-.75.75v.012a.763.763 0 00.75.75h3c.29 0 .553-.166.688-.412zM12.75 6.162a.763.763 0 01.688-.412h3a.75.75 0 01.75.75v.012a.763.763 0 01-.75.75h-3a.763.763 0 01-.688-.412zM9 9.75a.75.75 0 00-.75.75v10.5a.75.75 0 00.75.75h6a.75.75 0 00.75-.75V10.5a.75.75 0 00-.75-.75H9z" /><path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h14.25c1.035 0 1.875.84 1.875 1.875v9.375a3 3 0 01-3 3H6a3 3 0 01-3-3V9.375zm3.75-1.875a1.875 1.875 0 00-1.875 1.875v.375h13.5v-.375a1.875 1.875 0 00-1.875-1.875h-9.75z" clipRule="evenodd" /></svg>
);


function AdminDashboard({ user }: AdminDashboardProps) {
    const [users, setUsers] = useState<UserDocument[]>([]);
    const [pendingProfiles, setPendingProfiles] = useState<ProfessionalDocument[]>([]);
    const [memberships, setMemberships] = useState<Membership[]>([]);
    const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Edit User Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserDocument | null>(null);
    const [editName, setEditName] = useState('');
    const [editRole, setEditRole] = useState<UserRole>(UserRole.SEEKER);
    const [isSaving, setIsSaving] = useState(false);
    
    // Membership Modal State
    const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);
    const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);
    const [membershipName, setMembershipName] = useState('');
    const [membershipPrice, setMembershipPrice] = useState(0);
    const [membershipDuration, setMembershipDuration] = useState(0);

    // Job Management State
    const [maxApplicants, setMaxApplicants] = useState<Record<string, number>>({});

    // Search and Pagination State for Users
    const [searchName, setSearchName] = useState('');
    const [searchEmail, setSearchEmail] = useState('');
    const [searchRole, setSearchRole] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<UserDocument[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(5);

    // Delete confirmation modal state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<UserDocument | null>(null);

    useEffect(() => {
        const usersUnsubscribe = onSnapshot(collection(db, 'users'), async snapshot => {
             const userList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserDocument));
             // Enrich professional users with their ID document status
             const enrichedUserList = await Promise.all(userList.map(async u => {
                 if (u.role === UserRole.PROFESSIONAL) {
                     const profDoc = await getDoc(doc(db, 'professionals', u.id));
                     if (profDoc.exists()) {
                         return { ...u, idDocumentName: profDoc.data().idDocumentName };
                     }
                 }
                 return u;
             }));
             setUsers(enrichedUserList);
        });
        
        const profilesQuery = query(collection(db, 'professionals'), where('status', '==', 'pending'));
        const profilesUnsubscribe = onSnapshot(profilesQuery, async snapshot => {
            const pendingDocs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProfessionalDocument));
            const profilesWithName = await Promise.all(pendingDocs.map(async (prof) => {
                const userDoc = await getDoc(doc(db, 'users', prof.id));
                return { ...prof, name: userDoc.data()?.name || 'N/A' };
            }));
            setPendingProfiles(profilesWithName);
        });
        
        const membershipsUnsubscribe = onSnapshot(collection(db, 'memberships'), snapshot => {
            setMemberships(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Membership)));
        });

        const requestsQuery = query(collection(db, 'serviceRequests'));
        const requestsUnsubscribe = onSnapshot(requestsQuery, snapshot => {
            const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServiceRequest));
            requests.sort((a, b) => {
                const timeA = a.createdAt?.toDate()?.getTime() || 0;
                const timeB = b.createdAt?.toDate()?.getTime() || 0;
                return timeB - timeA;
            });
            setServiceRequests(requests);
        });

        const jobsUnsubscribe = onSnapshot(collection(db, 'jobs'), snapshot => {
            setJobs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job)));
        });
        
        setLoading(false);
        
        return () => {
            usersUnsubscribe();
            profilesUnsubscribe();
            membershipsUnsubscribe();
            requestsUnsubscribe();
            jobsUnsubscribe();
        }
    }, []);

    // Effect for filtering and pagination
    useEffect(() => {
        const result = users.filter(user => 
            user.name.toLowerCase().includes(searchName.toLowerCase()) &&
            user.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
            (searchRole ? user.role === searchRole : true)
        );
        setFilteredUsers(result);
        setCurrentPage(1); // Reset to first page whenever filters change
    }, [users, searchName, searchEmail, searchRole]);
    
    const handleApproval = async (profileId: string, newStatus: 'approved' | 'rejected') => {
        await updateDoc(doc(db, 'professionals', profileId), { status: newStatus });
    }

    const handleToggleVerification = async (professionalId: string) => {
        const profRef = doc(db, 'professionals', professionalId);
        const profDoc = await getDoc(profRef);
        if (!profDoc.exists()) {
             alert("Perfil de profesional no encontrado.");
             return;
        }
        const currentStatus = profDoc.data().isVerified || false;
        const newStatus = !currentStatus;

        if (window.confirm(`¿Está seguro de que desea ${newStatus ? 'verificar a' : 'quitar la verificación de'} este profesional?`)) {
            try {
                await updateDoc(profRef, { isVerified: newStatus });
                alert(`Profesional ${newStatus ? 'verificado' : 'desverificado'} con éxito.`);
            } catch (error) {
                console.error("Error toggling verification:", error);
                alert("No se pudo actualizar el estado de verificación.");
            }
        }
    };

    // User CRUD
    const handleOpenEditUserModal = (userToEdit: UserDocument) => {
        setSelectedUser(userToEdit);
        setEditName(userToEdit.name);
        setEditRole(userToEdit.role);
        setIsEditModalOpen(true);
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;
        setIsSaving(true);
        await updateDoc(doc(db, 'users', selectedUser.id), { name: editName, role: editRole });
        setIsSaving(false);
        setIsEditModalOpen(false);
    };

    const handleOpenDeleteConfirmModal = (user: UserDocument) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!userToDelete) return;
        setIsSaving(true);
        try {
            const batch = writeBatch(db);
            const userRef = doc(db, 'users', userToDelete.id);
            batch.delete(userRef);

            if (userToDelete.role === UserRole.SEEKER) {
                batch.delete(doc(db, 'seekers', userToDelete.id));
                const requestsSnapshot = await getDocs(query(collection(db, 'serviceRequests'), where('seekerId', '==', userToDelete.id)));
                requestsSnapshot.forEach(doc => batch.delete(doc.ref));
                const appsSnapshot = await getDocs(query(collection(db, 'jobApplications'), where('seekerId', '==', userToDelete.id)));
                appsSnapshot.forEach(doc => batch.delete(doc.ref));
            } else if (userToDelete.role === UserRole.PROFESSIONAL) {
                batch.delete(doc(db, 'professionals', userToDelete.id));
                const requestsSnapshot = await getDocs(query(collection(db, 'serviceRequests'), where('professionalId', '==', userToDelete.id)));
                requestsSnapshot.forEach(doc => batch.delete(doc.ref));
            } else if (userToDelete.role === UserRole.RECOMMENDER) {
                batch.delete(doc(db, 'recommenders', userToDelete.id));
                const jobsSnapshot = await getDocs(query(collection(db, 'jobs'), where('recommenderId', '==', userToDelete.id)));
                jobsSnapshot.forEach(doc => batch.delete(doc.ref));
            }
            
            await batch.commit();
            alert("Usuario y todos sus datos asociados han sido eliminados.");
        } catch (error) {
            console.error("Error deleting user and associated data:", error);
            alert("Ocurrió un error al eliminar el usuario.");
        } finally {
            setIsSaving(false);
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
        }
    };
    
    // Membership CRUD
    const handleOpenMembershipModal = (membership: Membership | null = null) => {
        setSelectedMembership(membership);
        setMembershipName(membership?.name || '');
        setMembershipPrice(membership?.price || 0);
        setMembershipDuration(membership?.durationDays || 0);
        setIsMembershipModalOpen(true);
    }
    
    const handleSaveMembership = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = { name: membershipName, price: membershipPrice, durationDays: membershipDuration };
        if (selectedMembership) {
            await updateDoc(doc(db, 'memberships', selectedMembership.id), data);
        } else {
            await addDoc(collection(db, 'memberships'), data);
        }
        setIsMembershipModalOpen(false);
    }
    
    const handleDeleteMembership = async (id: string) => {
        if (window.confirm('¿Está seguro de que desea eliminar este plan de membresía?')) {
            await deleteDoc(doc(db, 'memberships', id));
        }
    }

    const handleUpdateMaxApplicants = async (jobId: string) => {
        const limit = maxApplicants[jobId];
        if (limit == null || limit < 0) {
            alert("Por favor, ingrese un número válido.");
            return;
        }
        try {
            await updateDoc(doc(db, 'jobs', jobId), { maxApplicants: Number(limit) });
            alert("Límite de postulantes actualizado.");
        } catch (error) {
            console.error("Error updating max applicants:", error);
            alert("No se pudo actualizar el límite.");
        }
    };

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);


    return (
        <>
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Panel de Administrador</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    <Card title="Perfiles Pendientes de Revisión" icon={<ClipboardIcon />}>
                        {loading ? <p>Cargando...</p> : (pendingProfiles.length > 0 ? (
                            <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                                {pendingProfiles.map(prof => (
                                    <li key={prof.id} className="py-3 space-y-2">
                                        <p className="font-semibold">{prof.name} - <span className="font-normal italic">{prof.specialty}</span></p>
                                        <div className="flex space-x-2">
                                            <Button size="sm" onClick={() => handleApproval(prof.id, 'approved')}>Aprobar</Button>
                                            <Button size="sm" variant="danger" onClick={() => handleApproval(prof.id, 'rejected')}>Rechazar</Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (<p className="text-slate-500">No hay perfiles pendientes.</p>))}
                    </Card>

                    <Card title="Gestionar Membresías" icon={<CreditCardIcon />}>
                         <div className="space-y-3">
                            {memberships.length > 0 ? (
                                <ul className="space-y-2">
                                    {memberships.map(mem => (
                                        <li key={mem.id} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-md flex justify-between items-center">
                                            <p className="font-semibold">{mem.name} - ${mem.price} / {mem.durationDays} días</p>
                                            <div className="space-x-1">
                                                <Button size="sm" variant="secondary" onClick={() => handleOpenMembershipModal(mem)}>Editar</Button>
                                                <Button size="sm" variant="danger" onClick={() => handleDeleteMembership(mem.id)}>X</Button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (<p className="text-slate-500">No hay planes de membresía.</p>)}
                            <Button className="w-full" onClick={() => handleOpenMembershipModal()}>Añadir Membresía</Button>
                        </div>
                    </Card>

                     <Card title="Monitor de Solicitudes" icon={<DocumentTextIcon />}>
                        {serviceRequests.length > 0 ? (
                            <ul className="divide-y divide-slate-200 dark:divide-slate-700 max-h-64 overflow-y-auto">
                                {serviceRequests.map(req => (
                                    <li key={req.id} className="py-2">
                                        <p className="text-sm">De: <strong>{req.seekerName}</strong></p>
                                        <p className="text-sm">Para: <strong>{req.professionalName}</strong></p>
                                        <p className="text-xs text-slate-500">Estado: {req.status}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (<p className="text-slate-500">No hay solicitudes de servicio.</p>)}
                    </Card>

                    <div className="lg:col-span-2 xl:col-span-3">
                        <Card title="Gestionar Empleos" icon={<BriefcaseIcon />}>
                             {jobs.length > 0 ? (
                                <ul className="divide-y divide-slate-200 dark:divide-slate-700 max-h-80 overflow-y-auto">
                                    {jobs.map(job => (
                                        <li key={job.id} className="py-3 space-y-2">
                                            <div>
                                                <p className="font-semibold">{job.title} - <span className="font-normal">{job.company}</span></p>
                                                <p className="text-xs text-slate-500">Postulantes: {job.applicantCount || 0} / {job.maxApplicants != null ? job.maxApplicants : '∞'}</p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    placeholder="Límite"
                                                    className="w-24 px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-sm"
                                                    value={maxApplicants[job.id] ?? job.maxApplicants ?? ''}
                                                    onChange={(e) => setMaxApplicants(prev => ({...prev, [job.id]: Number(e.target.value)}))}
                                                />
                                                <Button size="sm" onClick={() => handleUpdateMaxApplicants(job.id)}>Guardar Límite</Button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (<p className="text-slate-500">No hay empleos publicados.</p>)}
                        </Card>
                    </div>

                    <div className="lg:col-span-2 xl:col-span-3">
                      <Card title="Gestión de Usuarios" icon={<UsersIcon />}>
                          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-md mb-4">
                              <h4 className="font-semibold mb-2 text-slate-800 dark:text-slate-200">Búsqueda Avanzada</h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <input 
                                    type="text" 
                                    placeholder="Buscar por nombre..." 
                                    value={searchName} 
                                    onChange={e => setSearchName(e.target.value)} 
                                    className="block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-sm"
                                  />
                                  <input 
                                    type="text" 
                                    placeholder="Buscar por email..." 
                                    value={searchEmail} 
                                    onChange={e => setSearchEmail(e.target.value)} 
                                    className="block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-sm"
                                  />
                                  <select 
                                    value={searchRole} 
                                    onChange={e => setSearchRole(e.target.value)}
                                    className="block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-sm"
                                  >
                                      <option value="">Todos los Roles</option>
                                      {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
                                  </select>
                              </div>
                          </div>
                          <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                  <thead className="bg-slate-50 dark:bg-slate-700">
                                      <tr>
                                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Nombre</th>
                                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Email</th>
                                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Rol</th>
                                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Verificación</th>
                                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Acciones</th>
                                      </tr>
                                  </thead>
                                  <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                      {currentUsers.map(u => (
                                          <tr key={u.id}>
                                              <td className="px-4 py-2 text-sm">{u.name}</td>
                                              <td className="px-4 py-2 text-sm">{u.email}</td>
                                              <td className="px-4 py-2 text-sm">{u.role}</td>
                                              <td className="px-4 py-2 text-sm">
                                                  {u.role === UserRole.PROFESSIONAL ? (u.idDocumentName ? `Enviado (${u.idDocumentName})` : 'No enviado') : 'N/A'}
                                              </td>
                                              <td className="px-4 py-2 text-sm space-x-2 whitespace-nowrap">
                                                  <Button size="sm" variant="secondary" onClick={() => handleOpenEditUserModal(u)}>Editar</Button>
                                                  {u.role === UserRole.PROFESSIONAL && (
                                                      <Button size="sm" onClick={() => handleToggleVerification(u.id)}>
                                                          Verificar
                                                      </Button>
                                                  )}
                                                  <Button size="sm" variant="danger" onClick={() => handleOpenDeleteConfirmModal(u)}>Eliminar</Button>
                                              </td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          </div>
                           <div className="flex justify-between items-center mt-4 px-2">
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                    Mostrando {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} de {filteredUsers.length}
                                </span>
                                <div className="space-x-2">
                                    <Button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} size="sm">Anterior</Button>
                                    <span className="text-sm">Página {currentPage} de {totalPages > 0 ? totalPages : 1}</span>
                                    <Button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages || totalPages === 0} size="sm">Siguiente</Button>
                                </div>
                            </div>
                      </Card>
                    </div>
                </div>
            </div>

            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Usuario">
                <form onSubmit={handleUpdateUser} className="space-y-4">
                    <div>
                        <label htmlFor="editName" className="block text-sm font-medium">Nombre</label>
                        <input type="text" id="editName" value={editName} onChange={e => setEditName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" required />
                    </div>
                     <div>
                        <label htmlFor="editRole" className="block text-sm font-medium">Rol</label>
                        <select id="editRole" value={editRole} onChange={e => setEditRole(e.target.value as UserRole)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md">
                            {Object.values(UserRole).map(roleValue => (<option key={roleValue} value={roleValue}>{roleValue}</option>))}
                        </select>
                    </div>
                     <div className="flex justify-end space-x-3 pt-2">
                        <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)} disabled={isSaving}>Cancelar</Button>
                        <Button type="submit" disabled={isSaving}>{isSaving ? 'Guardando...' : 'Guardar'}</Button>
                    </div>
                </form>
            </Modal>
            
            <Modal isOpen={isMembershipModalOpen} onClose={() => setIsMembershipModalOpen(false)} title={selectedMembership ? "Editar Membresía" : "Añadir Membresía"}>
                <form onSubmit={handleSaveMembership} className="space-y-4">
                    <div>
                        <label htmlFor="memName" className="block text-sm font-medium">Nombre del Plan</label>
                        <input type="text" id="memName" value={membershipName} onChange={e => setMembershipName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" required />
                    </div>
                     <div>
                        <label htmlFor="memPrice" className="block text-sm font-medium">Precio ($)</label>
                        <input type="number" id="memPrice" value={membershipPrice} onChange={e => setMembershipPrice(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" required />
                    </div>
                    <div>
                        <label htmlFor="memDuration" className="block text-sm font-medium">Duración (días)</label>
                        <input type="number" id="memDuration" value={membershipDuration} onChange={e => setMembershipDuration(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" required />
                    </div>
                     <div className="flex justify-end space-x-3 pt-2">
                        <Button type="button" variant="secondary" onClick={() => setIsMembershipModalOpen(false)}>Cancelar</Button>
                        <Button type="submit">{selectedMembership ? 'Guardar Cambios' : 'Crear Plan'}</Button>
                    </div>
                </form>
            </Modal>
             <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirmar Eliminación">
                <div className="space-y-4">
                    <p className="text-slate-600 dark:text-slate-400">
                        ¿Está seguro de que desea eliminar a <strong>{userToDelete?.name}</strong>? Esta acción es irreversible y eliminará todos los datos asociados (perfiles, solicitudes, publicaciones, etc.).
                    </p>
                    <div className="flex justify-end space-x-3 pt-2">
                        <Button type="button" variant="secondary" onClick={() => setIsDeleteModalOpen(false)} disabled={isSaving}>Cancelar</Button>
                        <Button type="button" variant="danger" onClick={handleConfirmDelete} disabled={isSaving}>
                            {isSaving ? 'Eliminando...' : 'Sí, eliminar usuario'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default AdminDashboard;