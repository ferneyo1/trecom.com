import React, { useState } from 'react';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { useLanguage } from '../../contexts/LanguageContext';
import { auth, db } from '../../firebase';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { addDoc, collection, doc, runTransaction, setDoc } from 'firebase/firestore';
import Toast from '../shared/Toast';
import { User, UserRole } from '../../types';
import { Modal } from '../shared/Modal';

interface SettingsDashboardProps {
  onBackToDashboard: () => void;
  user: User;
  onLogout: () => void;
}

const SettingsDashboard: React.FC<SettingsDashboardProps> = ({ onBackToDashboard, user, onLogout }) => {
  const { language, setLanguage, t } = useLanguage();
  const [notification, setNotification] = useState<string | null>(null);

  // Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState({ password: false });
  const [error, setError] = useState({ password: '' });

  // Role Change State
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [newRole, setNewRole] = useState<UserRole>(user.role);
  const [roleChangeLoading, setRoleChangeLoading] = useState(false);

  const languages = [
    { code: 'en', name: t('settings.english'), flag: '🇨🇦' },
    { code: 'es', name: t('settings.spanish'), flag: '🇪🇸' },
    { code: 'fr', name: t('settings.french'), flag: '🇫🇷' },
  ];

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError({ ...error, password: '' });
    if (newPassword !== confirmNewPassword) {
      setError({ ...error, password: t('settings.passwordMismatch') });
      return;
    }
    setLoading({ ...loading, password: true });
    
    const currentUser = auth.currentUser;
    if (currentUser && currentUser.email) {
      try {
        const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
        await reauthenticateWithCredential(currentUser, credential);
        await updatePassword(currentUser, newPassword);
        
        await addDoc(collection(db, "mail"), {
            to: [currentUser.email],
            message: {
              subject: t('emails.passwordChangedSubject'),
              html: t('emails.passwordChangedBody', { name: currentUser.displayName || 'Usuario' }),
            },
        });

        setNotification(t('settings.passwordChangedSuccess'));
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } catch (err) {
        setError({ ...error, password: t('settings.reauthenticationNeeded') });
      } finally {
        setLoading({ ...loading, password: false });
      }
    }
  };

  const handleRoleChange = async () => {
    if (newRole === user.role) return;
    setRoleChangeLoading(true);

    const roleCollectionMap: { [key in UserRole]?: string } = {
        [UserRole.SEEKER]: 'seekers',
        [UserRole.RECOMMENDER]: 'recommenders',
        [UserRole.PROFESSIONAL]: 'professionals',
    };

    const oldCollectionName = roleCollectionMap[user.role];
    const newCollectionName = roleCollectionMap[newRole];

    try {
        await runTransaction(db, async (transaction) => {
            const userRef = doc(db, 'users', user.uid);
            
            if (oldCollectionName) {
                const oldRoleDocRef = doc(db, oldCollectionName, user.uid);
                transaction.delete(oldRoleDocRef);
            }

            transaction.update(userRef, { role: newRole });

            if (newCollectionName) {
                const newRoleDocRef = doc(db, newCollectionName, user.uid);
                let newProfileData = {};
                switch(newRole) {
                    case UserRole.SEEKER: newProfileData = { phoneNumber: '', address: '', areaCode: '', activeMembershipId: null, membershipEndDate: null, unlockedJobs: [], favoriteJobs: [] }; break;
                    case UserRole.PROFESSIONAL: newProfileData = { specialty: '', bio: '', services: [], status: 'pending', phone: '', photoURL: '' }; break;
                    case UserRole.RECOMMENDER: newProfileData = { phone: '', photoURL: '' }; break;
                }
                transaction.set(newRoleDocRef, newProfileData);
            }
        });

        setNotification(t('settings.roleChangedSuccess'));
        setIsRoleModalOpen(false);
        setTimeout(() => {
            onLogout();
        }, 3000);
    } catch (e) {
        console.error("Error changing role: ", e);
        setNotification(t('settings.roleChangedError'));
    } finally {
        setRoleChangeLoading(false);
    }
  };

  return (
    <>
      <Toast message={notification} onClose={() => setNotification(null)} />
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="mb-4">
          <Button onClick={onBackToDashboard} variant="secondary">
            &larr; {t('settings.backToDashboard')}
          </Button>
        </div>
        <Card title={t('settings.languageSettings')}>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{t('settings.selectLanguage')}</p>
          <div className="space-y-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code as 'en' | 'es' | 'fr')}
                className={`w-full text-left p-4 rounded-lg border-2 transition-colors duration-200 flex items-center space-x-4 ${
                  language === lang.code
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/50'
                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-400'
                }`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{lang.name}</span>
              </button>
            ))}
          </div>
        </Card>
        
        <Card title={t('settings.security')}>
            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
              <h3 className="font-semibold text-lg">{t('settings.changePassword')}</h3>
              <p className="text-sm text-slate-500">{t('settings.changePasswordDescription')}</p>
              <div>
                <label className="block text-sm font-medium">{t('settings.currentPassword')}</label>
                <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" required />
              </div>
              <div>
                <label className="block text-sm font-medium">{t('settings.newPassword')}</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" required />
              </div>
              <div>
                <label className="block text-sm font-medium">{t('settings.confirmNewPassword')}</label>
                <input type="password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" required />
              </div>
              {error.password && <p className="text-sm text-red-500">{error.password}</p>}
              <Button type="submit" disabled={loading.password}>{loading.password ? t('saving') : t('settings.updatePassword')}</Button>
            </form>
        </Card>

        <Card title={t('settings.changeRoleTitle')}>
            <p className="text-slate-600 dark:text-slate-400 mb-4">{t('settings.changeRoleDescription')}</p>
            <div className="max-w-md space-y-4">
                <div>
                    <label className="block text-sm font-medium">{t('settings.currentRole')}</label>
                    <input type="text" value={t(user.role)} readOnly className="mt-1 block w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border rounded-md cursor-not-allowed"/>
                </div>
                <div>
                    <label className="block text-sm font-medium">{t('settings.newRole')}</label>
                    <select value={newRole} onChange={e => setNewRole(e.target.value as UserRole)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md">
                        <option value={UserRole.SEEKER}>{t(UserRole.SEEKER)}</option>
                        <option value={UserRole.RECOMMENDER}>{t(UserRole.RECOMMENDER)}</option>
                        <option value={UserRole.PROFESSIONAL}>{t(UserRole.PROFESSIONAL)}</option>
                    </select>
                </div>
                <Button onClick={() => setIsRoleModalOpen(true)} disabled={newRole === user.role || user.role === UserRole.ADMIN}>
                    {t('settings.updateRole')}
                </Button>
            </div>
        </Card>
      </div>

       <Modal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} title={t('settings.confirmRoleChangeTitle')}>
            <p>{t('settings.confirmRoleChangeMessage', { oldRole: t(user.role), newRole: t(newRole) })}</p>
            <p className="mt-2 text-sm font-semibold text-red-600 dark:text-red-400">{t('settings.confirmRoleChangeWarning')}</p>
            <div className="flex justify-end space-x-3 pt-4 mt-2">
                <Button variant="secondary" onClick={() => setIsRoleModalOpen(false)}>{t('cancel')}</Button>
                <Button variant="danger" onClick={handleRoleChange} disabled={roleChangeLoading}>
                    {roleChangeLoading ? t('saving') : t('settings.confirmRoleChangeButton')}
                </Button>
            </div>
      </Modal>
    </>
  );
};

export default SettingsDashboard;