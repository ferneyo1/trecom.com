import React, { useState } from 'react';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { useLanguage } from '../../contexts/LanguageContext';
import { auth, db } from '../../firebase';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import Toast from '../shared/Toast';

interface SettingsDashboardProps {
  onBackToDashboard: () => void;
}

const SettingsDashboard: React.FC<SettingsDashboardProps> = ({ onBackToDashboard }) => {
  const { language, setLanguage, t } = useLanguage();
  const [notification, setNotification] = useState<string | null>(null);

  // Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState({ password: false });
  const [error, setError] = useState({ password: '' });

  const languages = [
    { code: 'en', name: t('english'), flag: '🇨🇦' },
    { code: 'es', name: t('spanish'), flag: '🇪🇸' },
    { code: 'fr', name: t('french'), flag: '🇫🇷' },
  ];

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError({ ...error, password: '' });
    if (newPassword !== confirmNewPassword) {
      setError({ ...error, password: t('passwordMismatch') });
      return;
    }
    setLoading({ ...loading, password: true });
    
    const user = auth.currentUser;
    if (user && user.email) {
      try {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        
        // Send confirmation email
        await addDoc(collection(db, "mail"), {
            to: [user.email],
            message: {
              subject: t('emails.passwordChangedSubject'),
              // FIX: Use `t` function with replacements object instead of chained .replace() calls.
              html: t('emails.passwordChangedBody', { name: user.displayName || 'Usuario' }),
            },
        });

        setNotification(t('passwordChangedSuccess'));
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } catch (err) {
        setError({ ...error, password: t('errorInvalidCredential') });
      } finally {
        setLoading({ ...loading, password: false });
      }
    }
  };

  return (
    <>
      <Toast message={notification} onClose={() => setNotification(null)} />
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="mb-4">
          <Button onClick={onBackToDashboard} variant="secondary">
            &larr; {t('backToDashboard')}
          </Button>
        </div>
        <Card title={t('languageSettings')}>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{t('selectLanguage')}</p>
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
        
        <Card title={t('security')}>
            {/* Change Password Form */}
            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
              <h3 className="font-semibold text-lg">{t('changePassword')}</h3>
              <p className="text-sm text-slate-500">{t('changePasswordDescription')}</p>
              <div>
                <label className="block text-sm font-medium">{t('currentPassword')}</label>
                <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" required />
              </div>
              <div>
                <label className="block text-sm font-medium">{t('newPassword')}</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" required />
              </div>
              <div>
                <label className="block text-sm font-medium">{t('confirmNewPassword')}</label>
                <input type="password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" required />
              </div>
              {error.password && <p className="text-sm text-red-500">{error.password}</p>}
              <Button type="submit" disabled={loading.password}>{loading.password ? t('saving') : t('updatePassword')}</Button>
            </form>
        </Card>
      </div>
    </>
  );
};

export default SettingsDashboard;