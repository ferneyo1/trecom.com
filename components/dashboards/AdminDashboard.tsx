import React, { useState, useEffect, useRef } from 'react';
import { User, ProfessionalProfile, UserRole, Membership, ServiceRequest, Job, RecommenderPayoutSettings, Earning, Payment, JobApplication } from '../../types';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { db, storage } from '../../firebase';
import { Modal } from '../shared/Modal';
import { collection, onSnapshot, query, where, getDoc, updateDoc, deleteDoc, addDoc, doc, writeBatch, getDocs, setDoc, serverTimestamp, Timestamp, runTransaction } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useLanguage } from '../../contexts/LanguageContext';

interface AdminDashboardProps {
  user: User;
  currentView: 'verifications' | 'hiring' | 'users' | 'config';
}

interface UserDocument extends User {
    id: string;
}

interface ProfessionalDocument extends ProfessionalProfile {
    id: string;
    name?: string;
    email?: string;
}

interface RecommenderPayoutInfo {
    totalPending: number;
    earnings: Earning[];
    recommenderName: string;
}

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" />
    </svg>
);
const XMarkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
    </svg>
);
const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
      <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.18l.88-1.48a1.651 1.651 0 011.332-.906H4.25a1.651 1.651 0 011.332.906l.88 1.48a1.651 1.651 0 010 1.18l-.88 1.48a1.651 1.651 0 01-1.332.906H2.876a1.651 1.651 0 01-1.332-.906L.664 10.59zM10 15.25a5.25 5.25 0 005.25-5.25.75.75 0 00-1.5 0 3.75 3.75 0 01-3.75 3.75.75.75 0 000 1.5z" clipRule="evenodd" />
    </svg>
);

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
);

const XCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
    </svg>
);

const SpinnerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


export function AdminDashboard({ user, currentView }: AdminDashboardProps) {
    const { t } = useLanguage();
    
    // State for all managed data
    const [pendingProfiles, setPendingProfiles] = useState<ProfessionalDocument[]>([]);
    const [unverifiedJobs, setUnverifiedJobs] = useState<Job[]>([]);
    const [deletionRequests, setDeletionRequests] = useState<Job[]>([]);
    const [allUsers, setAllUsers] = useState<UserDocument[]>([]);
    const [memberships, setMemberships] = useState<Membership[]>([]);
    const [payoutSettings, setPayoutSettings] = useState<Partial<RecommenderPayoutSettings>>({});
    const [globalMaxApplicants, setGlobalMaxApplicants] = useState<number | ''>('');
    const [pendingApplications, setPendingApplications] = useState<JobApplication[]>([]);
    const [pendingPayouts, setPendingPayouts] = useState<{[key: string]: RecommenderPayoutInfo}>({});

    // Modals and Forms State
    const [userToEdit, setUserToEdit] = useState<UserDocument | null>(null);
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [editUserForm, setEditUserForm] = useState<Partial<UserDocument>>({});
    
    // New Modals State
    const [isProfileDetailModalOpen, setIsProfileDetailModalOpen] = useState(false);
    const [profileForDetails, setProfileForDetails] = useState<ProfessionalDocument | null>(null);
    const [isJobDetailModalOpen, setIsJobDetailModalOpen] = useState(false);
    const [jobForDetails, setJobForDetails] = useState<Job | null>(null);

    // Test Email State
    const [testEmail, setTestEmail] = useState('');
    const [testEmailSubject, setTestEmailSubject] = useState('');
    const [testEmailBody, setTestEmailBody] = useState('');
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [emailStatus, setEmailStatus] = useState<{ status: 'pending' | 'success' | 'error', message: string } | null>(null);
    const emailDocIdRef = useRef<string | null>(null);

    const sanitizeData = (data: any) => {
        const sanitized: any = {};
        for (const key in data) {
            if (data[key] instanceof Timestamp) {
                sanitized[key] = data[key].toDate().toISOString();
            } else {
                sanitized[key] = data[key];
            }
        }
        return sanitized;
    };

    useEffect(() => {
        // Fetch Pending Profiles
        const profilesQuery = query(collection(db, 'professionals'), where('status', '==', 'pending'));
        const unsubscribeProfiles = onSnapshot(profilesQuery, async (snapshot) => {
            const profilesData: ProfessionalDocument[] = await Promise.all(snapshot.docs.map(async (profDoc) => {
                const userDoc = await getDoc(doc(db, 'users', profDoc.id));
                const userData = userDoc.data();
                return { 
                    id: profDoc.id, 
                    ...sanitizeData(profDoc.data()),
                    name: userData?.name || 'N/A',
                    email: userData?.email || 'N/A'
                } as ProfessionalDocument;
            }));
            setPendingProfiles(profilesData);
        });

        // Fetch Unverified Jobs
        const jobsQuery = query(collection(db, 'jobs'), where('isVerified', '==', false), where('status', '==', 'active'));
        const unsubscribeJobs = onSnapshot(jobsQuery, (snapshot) => {
            const jobsData = snapshot.docs.map(jobDoc => ({ id: jobDoc.id, ...sanitizeData(jobDoc.data()) } as Job));
            setUnverifiedJobs(jobsData);
        });

        // Fetch Deletion Requests
        const deletionQuery = query(collection(db, 'jobs'), where('status', '==', 'pending_deletion'));
        const unsubscribeDeletions = onSnapshot(deletionQuery, (snapshot) => {
            const jobsData = snapshot.docs.map(jobDoc => ({ id: jobDoc.id, ...sanitizeData(jobDoc.data()) } as Job));
            setDeletionRequests(jobsData);
        });
        
         // Fetch all users
        const usersQuery = query(collection(db, 'users'));
        const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
            const usersData = snapshot.docs.map(userDoc => ({ id: userDoc.id, ...sanitizeData(userDoc.data()) } as UserDocument));
            setAllUsers(usersData);
        });

        // Fetch Memberships
        const membershipsQuery = collection(db, 'memberships');
        const unsubscribeMemberships = onSnapshot(membershipsQuery, (snapshot) => {
            const membershipData = snapshot.docs.map(memDoc => ({ id: memDoc.id, ...sanitizeData(memDoc.data()) } as Membership));
            setMemberships(membershipData);
        });

        // Fetch Payout Settings
        const payoutSettingsRef = doc(db, 'settings', 'recommenderPayouts');
        const unsubscribePayouts = onSnapshot(payoutSettingsRef, (docSnap) => {
            if (docSnap.exists()) {
                setPayoutSettings(sanitizeData(docSnap.data()) as RecommenderPayoutSettings);
            }
        });

        // Fetch Global Settings
        const globalSettingsRef = doc(db, 'settings', 'globalConfig');
        const unsubscribeGlobal = onSnapshot(globalSettingsRef, (docSnap) => {
            if (docSnap.exists()) {
                setGlobalMaxApplicants(docSnap.data().maxApplicantsGlobal || '');
            }
        });

        // Fetch applications pending hire
        const appsQuery = query(collection(db, 'jobApplications'), where('status', '==', 'applied'));
        const unsubscribeApps = onSnapshot(appsQuery, (snapshot) => {
            const appsData = snapshot.docs.map(appDoc => ({ id: appDoc.id, ...sanitizeData(appDoc.data()) } as JobApplication));
            setPendingApplications(appsData);
        });

        // Fetch pending earnings
        const earningsQuery = query(collection(db, 'earnings'), where('status', '==', 'pending'));
        const unsubscribeEarnings = onSnapshot(earningsQuery, async (snapshot) => {
            const earningsData = snapshot.docs.map(earningDoc => ({ id: earningDoc.id, ...sanitizeData(earningDoc.data()) } as Earning));
            const groupedPayouts: {[key: string]: RecommenderPayoutInfo} = {};

            for (const earning of earningsData) {
                if (!groupedPayouts[earning.recommenderId]) {
                    const userDoc = await getDoc(doc(db, 'users', earning.recommenderId));
                    groupedPayouts[earning.recommenderId] = {
                        totalPending: 0,
                        earnings: [],
                        recommenderName: userDoc.exists() ? userDoc.data().name : 'Unknown',
                    };
                }
                groupedPayouts[earning.recommenderId].totalPending += earning.amount;
                groupedPayouts[earning.recommenderId].earnings.push(earning);
            }
            setPendingPayouts(groupedPayouts);
        });

        return () => {
            unsubscribeProfiles();
            unsubscribeJobs();
            unsubscribeDeletions();
            unsubscribeUsers();
            unsubscribeMemberships();
            unsubscribePayouts();
            unsubscribeGlobal();
            unsubscribeApps();
            unsubscribeEarnings();
        };
    }, []);

    // Real-time listener for test email status
    useEffect(() => {
        let unsubscribe: (() => void) | undefined;
        if (emailDocIdRef.current && isSendingEmail) {
            const mailDocRef = doc(db, "mail", emailDocIdRef.current);
            unsubscribe = onSnapshot(mailDocRef, (docSnap) => {
                const data = docSnap.data();
                if (data?.delivery?.state === 'SUCCESS') {
                    setEmailStatus({ status: 'success', message: t('admin.statusSuccess') });
                    setIsSendingEmail(false);
                } else if (data?.delivery?.state === 'ERROR') {
                    // FIX: Use `t` function with replacements object instead of chained .replace() calls.
                    setEmailStatus({ status: 'error', message: t('admin.statusError', { error: data.delivery.error || 'Unknown error' }) });
                    setIsSendingEmail(false);
                }
            });
        }
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [isSendingEmail, t]);

    const handleApproveProfile = async (profile: ProfessionalDocument) => {
        const profileRef = doc(db, 'professionals', profile.id);
        await updateDoc(profileRef, { status: 'approved', isVerified: true });
        if (profile.email) {
            await addDoc(collection(db, "mail"), {
                to: [profile.email],
                message: {
                    subject: t('emails.professional.profileApprovedSubject'),
                    // FIX: Use `t` function with replacements object instead of chained .replace() calls.
                    html: t('emails.professional.profileApprovedBody', { name: profile.name || 'Professional' }),
                },
            });
        }
        setIsProfileDetailModalOpen(false);
    };
    
    const handleRejectProfile = async (profileId: string) => {
        const profileRef = doc(db, 'professionals', profileId);
        await updateDoc(profileRef, { status: 'rejected' });
    };

    const handleVerifyJob = async (job: Job) => {
        const jobRef = doc(db, 'jobs', job.id);
        await updateDoc(jobRef, { isVerified: true });

        if (payoutSettings.perVerifiedJob && payoutSettings.perVerifiedJob > 0) {
            await addDoc(collection(db, 'earnings'), {
                recommenderId: job.recommenderId,
                amount: payoutSettings.perVerifiedJob,
                type: 'verifiedJob',
                status: 'pending',
                createdAt: serverTimestamp(),
                jobId: job.id,
                jobTitle: job.title
            });
             const recommenderDoc = await getDoc(doc(db, 'users', job.recommenderId));
            if (recommenderDoc.exists() && recommenderDoc.data().email) {
                await addDoc(collection(db, "mail"), {
                    to: [recommenderDoc.data().email],
                    message: {
                        subject: t('emails.recommender.jobVerifiedSubject'),
                        // FIX: Use `t` function with replacements object instead of chained .replace() calls.
                        html: t('emails.recommender.jobVerifiedBody', { name: job.recommenderName, jobTitle: job.title, amount: payoutSettings.perVerifiedJob }),
                    },
                });
            }
        }
        setIsJobDetailModalOpen(false);
    };

    const handleSaveGlobalSettings = async () => {
        const settingsRef = doc(db, 'settings', 'globalConfig');
        await setDoc(settingsRef, { maxApplicantsGlobal: globalMaxApplicants === '' ? null : Number(globalMaxApplicants) }, { merge: true });
    };

    const handleOpenEditUser = (userDoc: UserDocument) => {
        setUserToEdit(userDoc);
        setEditUserForm({ ...userDoc });
        setIsEditUserModalOpen(true);
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userToEdit) return;
        const userRef = doc(db, 'users', userToEdit.id);
        await updateDoc(userRef, {
            name: editUserForm.name,
            role: editUserForm.role,
            isVerified: editUserForm.isVerified
        });
        setIsEditUserModalOpen(false);
    };

    const handleSendTestEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!testEmail || !testEmailSubject || !testEmailBody) return;
        setIsSendingEmail(true);
        setEmailStatus({ status: 'pending', message: t('admin.statusPending') });
        try {
            const newMailRef = await addDoc(collection(db, "mail"), {
                to: [testEmail],
                message: {
                    subject: testEmailSubject,
                    html: testEmailBody,
                },
            });
            emailDocIdRef.current = newMailRef.id;
        } catch (error) {
            console.error("Error sending email:", error);
            setEmailStatus({ status: 'error', message: String(error) });
            setIsSendingEmail(false);
        }
    };

    const handleMarkAsHired = async (application: JobApplication) => {
        if (!payoutSettings.perConfirmedHire || payoutSettings.perConfirmedHire <= 0) {
            console.warn("Payout for confirmed hire is not set or is zero.");
            return;
        }

        try {
            await runTransaction(db, async (transaction) => {
                const appRef = doc(db, 'jobApplications', application.id);
                
                // 1. Update application status
                transaction.update(appRef, { status: 'hired' });
    
                // 2. Create new earning
                const earningRef = doc(collection(db, 'earnings'));
                transaction.set(earningRef, {
                    recommenderId: application.recommenderId,
                    amount: payoutSettings.perConfirmedHire,
                    type: 'confirmedHire',
                    status: 'pending',
                    createdAt: serverTimestamp(),
                    jobId: application.jobId,
                    jobTitle: application.jobTitle,
                    applicationId: application.id,
                });
            });
    
            // 3. Send email notification
            const recommenderDoc = await getDoc(doc(db, 'users', application.recommenderId));
            if (recommenderDoc.exists() && recommenderDoc.data().email) {
                await addDoc(collection(db, "mail"), {
                    to: [recommenderDoc.data().email],
                    message: {
                        subject: t('emails.recommender.hireConfirmedSubject'),
                        // FIX: Use `t` function with replacements object instead of chained .replace() calls.
                        html: t('emails.recommender.hireConfirmedBody', {
                            name: application.recommenderName || 'Recomendador',
                            seekerName: application.seekerName || 'Candidato',
                            jobTitle: application.jobTitle || 'un empleo',
                            amount: payoutSettings.perConfirmedHire
                        }),
                    },
                });
            }
        } catch (error) {
            console.error("Error marking as hired:", error);
        }
    };
    
    const renderVerifications = () => (
        <div className="space-y-6">
            <Card title={t('admin.pendingProfiles')}>
                {pendingProfiles.length > 0 ? (
                    <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                        {pendingProfiles.map(p => (
                            <li key={p.id} className="flex flex-wrap items-center justify-between gap-4 py-3">
                                <div>
                                    <p className="font-medium">{p.name}</p>
                                    <p className="text-sm text-slate-500">{p.specialty}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button size="sm" variant="secondary" onClick={() => { setProfileForDetails(p); setIsProfileDetailModalOpen(true); }}>
                                        <EyeIcon className="w-4 h-4 mr-1"/> {t('admin.viewDetails')}
                                    </Button>
                                    <button onClick={() => handleApproveProfile(p)} className="p-2 rounded-full text-green-600 bg-green-100 hover:bg-green-200 dark:bg-green-900/50 dark:hover:bg-green-800" title={t('admin.approve')}>
                                        <CheckIcon className="w-5 h-5"/>
                                    </button>
                                    <button onClick={() => handleRejectProfile(p.id)} className="p-2 rounded-full text-red-600 bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-800" title={t('admin.reject')}>
                                        <XMarkIcon className="w-5 h-5"/>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : <p className="text-slate-500">{t('admin.noPendingProfiles')}</p>}
            </Card>
             <Card title={t('admin.management.manageJobs')}>
                {unverifiedJobs.length > 0 ? (
                     <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                        {unverifiedJobs.map(job => (
                            <li key={job.id} className="flex flex-wrap items-center justify-between gap-4 py-3">
                                <div>
                                    <p className="font-medium">{job.title}</p>
                                    <p className="text-sm text-slate-500">{job.company}</p>
                                </div>
                                <Button size="sm" variant="secondary" onClick={() => { setJobForDetails(job); setIsJobDetailModalOpen(true); }}>
                                    <EyeIcon className="w-4 h-4 mr-1"/> {t('admin.viewDetails')}
                                </Button>
                            </li>
                        ))}
                     </ul>
                ) : <p className="text-slate-500">{t('admin.management.noUnverifiedJobs')}</p>}
            </Card>
        </div>
    );
    
    const renderHiring = () => (
         <div className="space-y-6">
            <Card title={t('admin.management.manageApplications')}>
                 {pendingApplications.length > 0 ? pendingApplications.map(app => (
                    <div key={app.id} className="flex justify-between items-center py-2 border-b dark:border-slate-700">
                        <div>
                            <p className="font-medium">{app.seekerName || 'N/A'}</p>
                            <p className="text-sm text-slate-500">para {app.jobTitle || 'N/A'}</p>
                        </div>
                        <Button size="sm" variant="secondary" onClick={() => handleMarkAsHired(app)}>{t('admin.management.markAsHired')}</Button>
                    </div>
                 )) : <p className="text-slate-500">{t('admin.management.noPendingHires')}</p>}
            </Card>
            <Card title={t('admin.management.recommenderPayouts')}>
                {Object.keys(pendingPayouts).length > 0 ? Object.keys(pendingPayouts).map(recommenderId => {
                    const info = pendingPayouts[recommenderId];
                    return (
                        <div key={recommenderId} className="flex justify-between items-center py-2 border-b">
                            <div>{info.recommenderName} - <span className="font-bold">${info.totalPending.toFixed(2)}</span> {t('admin.management.pendingAmount')}</div>
                            <Button size="sm">{t('admin.management.registerPayment')}</Button>
                        </div>
                    );
                }) : <p>{t('admin.management.noPendingPayouts')}</p>}
            </Card>
        </div>
    );

    const renderUserManagement = () => (
         <Card title={t('admin.userManagement')}>
             <table className="w-full text-left">
                <thead>
                    <tr>
                        <th>{t('admin.tableHeaderName')}</th>
                        <th>{t('admin.tableHeaderEmail')}</th>
                        <th>{t('admin.tableHeaderRole')}</th>
                        <th>{t('admin.tableHeaderVerification')}</th>
                        <th>{t('admin.tableHeaderActions')}</th>
                    </tr>
                </thead>
                <tbody>
                    {allUsers.map(u => (
                        <tr key={u.uid} className="border-b">
                            <td className="py-2">{u.name}</td>
                            <td>{u.email}</td>
                            <td>{t(u.role)}</td>
                            <td>{u.isVerified ? <span className="text-green-500">{t('admin.verified')}</span> : <span className="text-slate-500">{t('admin.notVerified')}</span>}</td>
                            <td><Button size="sm" variant="secondary" onClick={() => handleOpenEditUser(u)}>{t('edit')}</Button></td>
                        </tr>
                    ))}
                </tbody>
             </table>
        </Card>
    );

    const renderConfig = () => (
        <div className="space-y-6">
            <Card title={t('admin.globalJobSettings')}>
                <label>{t('admin.maxApplicantsLimit')}</label>
                <input type="number" value={globalMaxApplicants} onChange={e => setGlobalMaxApplicants(e.target.value === '' ? '' : Number(e.target.value))} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-md" />
                <Button onClick={handleSaveGlobalSettings} className="mt-2">{t('admin.save')}</Button>
            </Card>
            <Card title={t('admin.configureRecommenderPayouts')}>
                <div className="space-y-2">
                    <div>
                        <label>{t('admin.payoutPerVerifiedJob')}</label>
                        <input type="number" value={payoutSettings.perVerifiedJob || ''} onChange={e => setPayoutSettings({...payoutSettings, perVerifiedJob: Number(e.target.value)})} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-md" />
                    </div>
                     <div>
                        <label>{t('admin.payoutPerApplication')}</label>
                        <input type="number" value={payoutSettings.perApplication || ''} onChange={e => setPayoutSettings({...payoutSettings, perApplication: Number(e.target.value)})} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-md" />
                    </div>
                     <div>
                        <label>{t('admin.payoutPerConfirmedHire')}</label>
                        <input type="number" value={payoutSettings.perConfirmedHire || ''} onChange={e => setPayoutSettings({...payoutSettings, perConfirmedHire: Number(e.target.value)})} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-md" />
                    </div>
                    <Button onClick={() => setDoc(doc(db, 'settings', 'recommenderPayouts'), payoutSettings)} className="mt-2">{t('admin.saveConfiguration')}</Button>
                </div>
            </Card>
             <Card title={t('admin.systemTools')}>
                <form onSubmit={handleSendTestEmail} className="space-y-4">
                    <p className="text-sm text-slate-500">{t('admin.testEmailDescription')}</p>
                    <div>
                        <label className="block text-sm font-medium">{t('admin.recipientEmail')}</label>
                        <input type="email" value={testEmail} onChange={e => setTestEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-md" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">{t('admin.subject')}</label>
                        <input type="text" value={testEmailSubject} onChange={e => setTestEmailSubject(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">{t('admin.messageBody')}</label>
                        <textarea value={testEmailBody} onChange={e => setTestEmailBody(e.target.value)} required rows={3} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-md" />
                    </div>
                    <Button type="submit" disabled={isSendingEmail}>{isSendingEmail ? t('admin.sendingTest') : t('admin.sendTest')}</Button>
                     {emailStatus && (
                        <div className={`mt-4 flex items-start p-4 rounded-md ${
                            emailStatus.status === 'success' ? 'bg-green-100 dark:bg-green-900/50' :
                            emailStatus.status === 'error' ? 'bg-red-100 dark:bg-red-900/50' :
                            'bg-yellow-100 dark:bg-yellow-900/50'
                        }`}>
                            <div className="flex-shrink-0">
                                {emailStatus.status === 'pending' && <SpinnerIcon className="w-5 h-5 text-yellow-500" />}
                                {emailStatus.status === 'success' && <CheckCircleIcon className="w-5 h-5 text-green-500" />}
                                {emailStatus.status === 'error' && <XCircleIcon className="w-5 h-5 text-red-500" />}
                            </div>
                            <div className="ml-3">
                                <p className={`text-sm font-medium ${
                                    emailStatus.status === 'success' ? 'text-green-800 dark:text-green-300' :
                                    emailStatus.status === 'error' ? 'text-red-800 dark:text-red-300' :
                                    'text-yellow-800 dark:text-yellow-300'
                                }`}>
                                    {emailStatus.message}
                                </p>
                            </div>
                        </div>
                    )}
                </form>
            </Card>
        </div>
    );

    const viewTitles: { [key in typeof currentView]: string } = {
        verifications: t('admin.nav.verifications'),
        hiring: t('admin.nav.hiring'),
        users: t('admin.nav.users'),
        config: t('admin.nav.config'),
    };
    
    const renderContent = () => {
        switch (currentView) {
            case 'verifications':
                return renderVerifications();
            case 'hiring':
                return renderHiring();
            case 'users':
                return renderUserManagement();
            case 'config':
                return renderConfig();
            default:
                return renderVerifications();
        }
    };
    
    return (
        <>
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                    {viewTitles[currentView]}
                </h2>
                
                {renderContent()}
                
                <Modal isOpen={isEditUserModalOpen} onClose={() => setIsEditUserModalOpen(false)} title={t('admin.editUserTitle')}>
                    <form onSubmit={handleUpdateUser} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">{t('admin.tableHeaderName')}</label>
                            <input type="text" value={editUserForm.name || ''} onChange={e => setEditUserForm({...editUserForm, name: e.target.value})} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-md" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">{t('admin.role')}</label>
                            <select value={editUserForm.role} onChange={e => setEditUserForm({...editUserForm, role: e.target.value as UserRole})} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-md">
                                {Object.values(UserRole).map(role => <option key={role} value={role}>{t(role)}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="flex items-center">
                                <input type="checkbox" checked={editUserForm.isVerified || false} onChange={e => setEditUserForm({...editUserForm, isVerified: e.target.checked})} className="h-4 w-4 rounded border-slate-300 text-indigo-600" />
                                <span className="ml-2 text-sm">{t('admin.verified')}</span>
                            </label>
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit">{t('saveChanges')}</Button>
                        </div>
                    </form>
                </Modal>
            </div>

            <Modal isOpen={isProfileDetailModalOpen} onClose={() => setIsProfileDetailModalOpen(false)} title={t('admin.profileDetailsTitle')}>
                {profileForDetails && (
                    <div className="space-y-4 text-sm">
                        <p><strong>{t('name')}:</strong> {profileForDetails.name}</p>
                        <p><strong>{t('email')}:</strong> {profileForDetails.email}</p>
                        <p><strong>{t('professional.specialty')}:</strong> {profileForDetails.specialty}</p>
                        <p><strong>{t('professional.phone')}:</strong> {profileForDetails.phone || t('na')}</p>
                        <div className="space-y-1">
                            <p><strong>{t('professional.shortBio')}:</strong></p>
                            <p className="p-2 bg-slate-50 dark:bg-slate-700 rounded-md whitespace-pre-wrap">{profileForDetails.bio || t('na')}</p>
                        </div>
                        <div className="space-y-1">
                            <p><strong>{t('professional.services')}:</strong></p>
                            <ul className="list-disc list-inside pl-4">
                                {profileForDetails.services?.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>
                        <div className="pt-3 border-t">
                            <p><strong>{t('admin.idDocument')}:</strong></p>
                            {profileForDetails.idDocumentURL ? (
                                <a href={profileForDetails.idDocumentURL} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                                    {t('admin.viewIdDocument')} ({profileForDetails.idDocumentName})
                                </a>
                            ) : (
                                <p className="text-slate-500">{t('admin.noDocumentUploaded')}</p>
                            )}
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                            <Button variant="secondary" onClick={() => setIsProfileDetailModalOpen(false)}>{t('close')}</Button>
                            <Button onClick={() => handleApproveProfile(profileForDetails)}>{t('admin.approve')}</Button>
                        </div>
                    </div>
                )}
            </Modal>
            
            <Modal isOpen={isJobDetailModalOpen} onClose={() => setIsJobDetailModalOpen(false)} title={t('admin.jobDetailsTitle')}>
                {jobForDetails && (
                    <div className="space-y-3 text-sm">
                        <h4 className="text-lg font-bold">{jobForDetails.title}</h4>
                        <p className="text-slate-500">{jobForDetails.company}</p>
                        <div className="space-y-1">
                            <p><strong>{t('recommender.jobDescription')}:</strong></p>
                            <p className="p-2 bg-slate-50 dark:bg-slate-700 rounded-md whitespace-pre-wrap">{jobForDetails.description}</p>
                        </div>
                        <p><strong>{t('recommender.city')}:</strong> {jobForDetails.city}</p>
                        <p><strong>{t('recommender.jobType')}:</strong> {jobForDetails.jobType}</p>
                        {jobForDetails.salaryAmount && <p><strong>{t('recommender.salaryOptional')}:</strong> ${jobForDetails.salaryAmount.toLocaleString()} {jobForDetails.salaryType === 'per_hour' ? t('recommender.perHour') : t('recommender.perYear')}</p>}
                        <p><strong>{t('recommender.recommender')}:</strong> {jobForDetails.recommenderName}</p>
                        <div className="flex justify-end space-x-2 pt-4">
                            <Button variant="secondary" onClick={() => setIsJobDetailModalOpen(false)}>{t('close')}</Button>
                            <Button onClick={() => handleVerifyJob(jobForDetails)}>{t('admin.management.verifyJob')}</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
}