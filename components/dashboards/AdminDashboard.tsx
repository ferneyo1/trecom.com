import React, { useState, useEffect, useRef } from 'react';
import { User, ProfessionalProfile, UserRole, Membership, ServiceRequest, Job, RecommenderPayoutSettings, Earning, Payment, JobApplication, ApplicationStatus } from '../../types';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { db, storage } from '../../firebase';
import { Modal } from '../shared/Modal';
import { collection, onSnapshot, query, where, getDoc, updateDoc, deleteDoc, addDoc, doc, writeBatch, getDocs, setDoc, serverTimestamp, Timestamp, runTransaction, increment } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useLanguage } from '../../contexts/LanguageContext';

interface AdminDashboardProps {
  user: User;
  currentView: 'verifications' | 'hiring' | 'users' | 'config';
}

interface UserDocument extends User {
    id: string;
    isDisabled?: boolean;
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
    const [allApplications, setAllApplications] = useState<JobApplication[]>([]);
    const [pendingPayouts, setPendingPayouts] = useState<{[key: string]: RecommenderPayoutInfo}>({});

    // Modals and Forms State
    const [userToModify, setUserToModify] = useState<UserDocument | null>(null);
    const [isDeactivateUserModalOpen, setIsDeactivateUserModalOpen] = useState(false);
    const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
    
    // New Modals State
    const [isProfileDetailModalOpen, setIsProfileDetailModalOpen] = useState(false);
    const [profileForDetails, setProfileForDetails] = useState<ProfessionalDocument | null>(null);
    const [isJobDetailModalOpen, setIsJobDetailModalOpen] = useState(false);
    const [jobForDetails, setJobForDetails] = useState<Job | null>(null);

    // Application Management State
    const [appSearchTerm, setAppSearchTerm] = useState('');
    const [filteredApps, setFilteredApps] = useState<JobApplication[]>([]);
    const [appCurrentPage, setAppCurrentPage] = useState(1);
    const APPS_PER_PAGE = 10;
    const [isUpdateAppModalOpen, setIsUpdateAppModalOpen] = useState(false);
    const [appToUpdate, setAppToUpdate] = useState<JobApplication | null>(null);
    const [newAppStatus, setNewAppStatus] = useState<ApplicationStatus>('submitted');
    const [isSaving, setIsSaving] = useState(false);


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

        // Fetch ALL applications for management
        const appsQuery = query(collection(db, 'jobApplications'));
        const unsubscribeApps = onSnapshot(appsQuery, (snapshot) => {
            const appsData = snapshot.docs.map(appDoc => ({ id: appDoc.id, ...sanitizeData(appDoc.data()) } as JobApplication));
            appsData.sort((a,b) => (new Date(b.appliedAt).getTime() || 0) - (new Date(a.appliedAt).getTime() || 0));
            setAllApplications(appsData);
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

    useEffect(() => {
      const filtered = allApplications.filter(app => 
        app.seekerName?.toLowerCase().includes(appSearchTerm.toLowerCase()) ||
        app.jobTitle?.toLowerCase().includes(appSearchTerm.toLowerCase()) ||
        app.jobCompany?.toLowerCase().includes(appSearchTerm.toLowerCase())
      );
      setFilteredApps(filtered);
    }, [allApplications, appSearchTerm]);

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

    const handleToggleUserDisabled = async () => {
        if (!userToModify) return;
        const userRef = doc(db, 'users', userToModify.id);
        await updateDoc(userRef, { isDisabled: !userToModify.isDisabled });
        setIsDeactivateUserModalOpen(false);
    };
    
    const handleDeleteUser = async () => {
        if (!userToModify) return;
    
        const roleCollectionMap: { [key in UserRole]?: string } = {
            [UserRole.SEEKER]: 'seekers',
            [UserRole.RECOMMENDER]: 'recommenders',
            [UserRole.PROFESSIONAL]: 'professionals',
        };
    
        try {
            const batch = writeBatch(db);
            // Delete main user doc
            batch.delete(doc(db, 'users', userToModify.id));
    
            // Delete role-specific doc if it exists
            const collectionName = roleCollectionMap[userToModify.role];
            if (collectionName) {
                batch.delete(doc(db, collectionName, userToModify.id));
            }
    
            await batch.commit();
        } catch (error) {
            console.error("Error deleting user:", error);
        } finally {
            setIsDeleteUserModalOpen(false);
        }
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

    const handleOpenUpdateAppModal = (app: JobApplication) => {
      setAppToUpdate(app);
      setNewAppStatus(app.status);
      setIsUpdateAppModalOpen(true);
    };

    const handleUpdateAppStatus = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!appToUpdate) return;
      setIsSaving(true);
      
      try {
        if (newAppStatus === 'hired') {
            await runTransaction(db, async (transaction) => {
                const appRef = doc(db, 'jobApplications', appToUpdate.id);
                transaction.update(appRef, { status: 'hired' });
    
                if (payoutSettings.perConfirmedHire && payoutSettings.perConfirmedHire > 0) {
                    const earningRef = doc(collection(db, 'earnings'));
                    transaction.set(earningRef, {
                        recommenderId: appToUpdate.recommenderId,
                        amount: payoutSettings.perConfirmedHire,
                        type: 'confirmedHire',
                        status: 'pending',
                        createdAt: serverTimestamp(),
                        jobId: appToUpdate.jobId,
                        jobTitle: appToUpdate.jobTitle,
                        applicationId: appToUpdate.id,
                    });
                }
            });
    
            const recommenderDoc = await getDoc(doc(db, 'users', appToUpdate.recommenderId));
            if (recommenderDoc.exists() && recommenderDoc.data().email) {
                await addDoc(collection(db, "mail"), {
                    to: [recommenderDoc.data().email],
                    message: {
                        subject: t('emails.recommender.hireConfirmedSubject'),
                        html: t('emails.recommender.hireConfirmedBody', {
                            name: appToUpdate.recommenderName || 'Recommender',
                            seekerName: appToUpdate.seekerName || 'Candidate',
                            jobTitle: appToUpdate.jobTitle || 'a job',
                            amount: payoutSettings.perConfirmedHire
                        }),
                    },
                });
            }
        } else {
            const appRef = doc(db, 'jobApplications', appToUpdate.id);
            await updateDoc(appRef, { status: newAppStatus });
        }
        setIsUpdateAppModalOpen(false);
      } catch (error) {
          console.error("Error updating application status:", error);
      } finally {
          setIsSaving(false);
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
    
    const renderHiring = () => {
      const totalPages = Math.ceil(filteredApps.length / APPS_PER_PAGE);
      const currentApps = filteredApps.slice((appCurrentPage - 1) * APPS_PER_PAGE, appCurrentPage * APPS_PER_PAGE);
      const statusLabels: { [key in ApplicationStatus]: string } = {
        submitted: t('seeker.applicationStatus.submitted'),
        recommender_rejected: t('seeker.applicationStatus.recommender_rejected'),
        forwarded_to_company: t('seeker.applicationStatus.forwarded_to_company'),
        under_review: t('seeker.applicationStatus.under_review'),
        interviewing: t('seeker.applicationStatus.interviewing'),
        company_rejected: t('seeker.applicationStatus.company_rejected'),
        hired: t('seeker.applicationStatus.hired'),
      };

      return (
         <div className="space-y-6">
            <Card title={t('admin.management.manageApplications')}>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder={t('admin.management.searchPlaceholder')}
                  value={appSearchTerm}
                  onChange={e => setAppSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800">
                    <tr>
                      <th className="p-2">{t('admin.management.tableHeaderCandidate')}</th>
                      <th className="p-2">{t('admin.management.tableHeaderJob')}</th>
                      <th className="p-2">{t('admin.management.tableHeaderRecommender')}</th>
                      <th className="p-2">{t('admin.management.tableHeaderStatus')}</th>
                      <th className="p-2">{t('admin.management.tableHeaderActions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentApps.map(app => (
                      <tr key={app.id} className="border-b dark:border-slate-700">
                        <td className="p-2 font-medium">{app.seekerName}</td>
                        <td className="p-2">{app.jobTitle} at {app.jobCompany}</td>
                        <td className="p-2">{app.recommenderName}</td>
                        <td className="p-2">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                            {statusLabels[app.status] || app.status}
                          </span>
                        </td>
                        <td className="p-2">
                          <Button size="sm" variant="secondary" onClick={() => handleOpenUpdateAppModal(app)}>
                            {t('recommender.updateStatus')}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-slate-600 dark:text-slate-400">{t('page')} {appCurrentPage} {t('of')} {totalPages}</span>
                  <div className="space-x-2">
                    <Button onClick={() => setAppCurrentPage(p => p - 1)} disabled={appCurrentPage === 1} size="sm">{t('previous')}</Button>
                    <Button onClick={() => setAppCurrentPage(p => p + 1)} disabled={appCurrentPage === totalPages} size="sm">{t('next')}</Button>
                  </div>
                </div>
              )}
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
    };

    const renderUserManagement = () => (
         <Card title={t('admin.userManagement')}>
             <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800">
                    <tr>
                        <th className="p-2">{t('admin.tableHeaderName')}</th>
                        <th className="p-2">{t('admin.tableHeaderEmail')}</th>
                        <th className="p-2">{t('admin.tableHeaderRole')}</th>
                        <th className="p-2">{t('admin.status')}</th>
                        <th className="p-2">{t('admin.tableHeaderActions')}</th>
                    </tr>
                </thead>
                <tbody>
                    {allUsers.map(u => (
                        <tr key={u.uid} className="border-b dark:border-slate-700">
                            <td className="p-2">{u.name}</td>
                            <td>{u.email}</td>
                            <td>{t(u.role)}</td>
                            <td>
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${u.isDisabled ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                                {u.isDisabled ? t('admin.userStatuses.disabled') : t('admin.userStatuses.active')}
                              </span>
                            </td>
                            <td className="p-2 space-x-2">
                                <Button 
                                  size="sm" 
                                  variant={u.isDisabled ? "secondary" : "danger"}
                                  onClick={() => {setUserToModify(u); setIsDeactivateUserModalOpen(true);}}
                                  disabled={u.uid === user.uid}
                                >
                                    {u.isDisabled ? t('admin.actions.activate') : t('admin.actions.deactivate')}
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="danger" 
                                  onClick={() => {setUserToModify(u); setIsDeleteUserModalOpen(true);}}
                                  disabled={u.uid === user.uid}
                                >
                                    {t('delete')}
                                </Button>
                            </td>
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
                
                <Modal isOpen={isDeactivateUserModalOpen} onClose={() => setIsDeactivateUserModalOpen(false)} title={t(userToModify?.isDisabled ? 'admin.actions.confirmActivate' : 'admin.actions.confirmDeactivate')}>
                    <p>{t(userToModify?.isDisabled ? 'admin.actions.activateMessage' : 'admin.actions.deactivateMessage', { name: userToModify?.name })}</p>
                    <div className="flex justify-end space-x-2 mt-4">
                        <Button variant="secondary" onClick={() => setIsDeactivateUserModalOpen(false)}>{t('cancel')}</Button>
                        <Button variant={userToModify?.isDisabled ? 'secondary' : 'danger'} onClick={handleToggleUserDisabled}>
                            {t(userToModify?.isDisabled ? 'admin.actions.activate' : 'admin.actions.deactivate')}
                        </Button>
                    </div>
                </Modal>
                <Modal isOpen={isDeleteUserModalOpen} onClose={() => setIsDeleteUserModalOpen(false)} title={t('admin.confirmDeletion')}>
                    <p>{t('admin.confirmDeleteUser')} <strong>{userToModify?.name}</strong>?</p>
                    <p className="text-sm text-red-600 mt-2">{t('admin.deleteUserWarning')}</p>
                    <div className="flex justify-end space-x-2 mt-4">
                        <Button variant="secondary" onClick={() => setIsDeleteUserModalOpen(false)}>{t('cancel')}</Button>
                        <Button variant="danger" onClick={handleDeleteUser}>{t('admin.yesDeleteUser')}</Button>
                    </div>
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

            <Modal isOpen={isUpdateAppModalOpen} onClose={() => setIsUpdateAppModalOpen(false)} title={t('admin.management.updateStatusTitle')}>
              {appToUpdate && (
                <form onSubmit={handleUpdateAppStatus} className="space-y-4">
                    <div>
                      <h4 className="font-semibold">{t('admin.management.candidateInfo')}</h4>
                      <p><strong>{t('name')}:</strong> {appToUpdate.seekerName}</p>
                      {appToUpdate.cvUrl && <a href={appToUpdate.cvUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm">{t('admin.management.viewCV')}</a>}
                    </div>
                    <div>
                      <h4 className="font-semibold">{t('admin.management.recommenderInfo')}</h4>
                      <p>{appToUpdate.recommenderName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium">{t('admin.management.tableHeaderStatus')}</label>
                      <select value={newAppStatus} onChange={e => setNewAppStatus(e.target.value as ApplicationStatus)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md">
                        <option value="under_review">{t('seeker.applicationStatus.under_review')}</option>
                        <option value="interviewing">{t('seeker.applicationStatus.interviewing')}</option>
                        <option value="company_rejected">{t('seeker.applicationStatus.company_rejected')}</option>
                        <option value="hired">{t('seeker.applicationStatus.hired')}</option>
                      </select>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="secondary" onClick={() => setIsUpdateAppModalOpen(false)}>{t('cancel')}</Button>
                        <Button type="submit" disabled={isSaving}>{isSaving ? t('saving') : t('saveChanges')}</Button>
                    </div>
                </form>
              )}
            </Modal>
        </>
    );
}