import React, { useState } from 'react';
import { UserRole } from '../types';
import { Button } from './shared/Button';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, addDoc, collection } from 'firebase/firestore';
import { useLanguage } from '../contexts/LanguageContext';

// Fix: Specify that the icon element passed to RoleCard can accept a className prop.
// This resolves a TypeScript error when using React.cloneElement to add a class.
const RoleCard: React.FC<{
  role: UserRole;
  icon: React.ReactElement<{ className?: string }>;
  description: string;
  selectedRole: UserRole | null;
  onSelect: (role: UserRole) => void;
}> = ({ role, icon, description, selectedRole, onSelect }) => {
  const { t } = useLanguage();
  const isSelected = selectedRole === role;
  return (
    <div
      onClick={() => onSelect(role)}
      className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 transform h-full ${
        isSelected
          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/50 shadow-lg scale-105'
          : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-400 hover:shadow-md'
      }`}
    >
      <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full mb-4">
        {React.cloneElement(icon, { className: "w-6 h-6 text-indigo-600 dark:text-indigo-400" })}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t(role)}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
    </div>
  );
};

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.006z" clipRule="evenodd" />
    </svg>
);
const MagnifyingGlassIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
    </svg>
);
const BriefcaseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M11.25 6.162A.763.763 0 0010.5 5.25h-3a.75.75 0 00-.75.75v.012a.763.763 0 00.75.75h3c.29 0 .553-.166.688-.412zM12.75 6.162a.763.763 0 01.688-.412h3a.75.75 0 01.75.75v.012a.763.763 0 01-.75.75h-3a.763.763 0 01-.688-.412zM9 9.75a.75.75 0 00-.75.75v10.5a.75.75 0 00.75.75h6a.75.75 0 00.75-.75V10.5a.75.75 0 00-.75-.75H9z" />
        <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h14.25c1.035 0 1.875.84 1.875 1.875v9.375a3 3 0 01-3 3H6a3 3 0 01-3-3V9.375zm3.75-1.875a1.875 1.875 0 00-1.875 1.875v.375h13.5v-.375a1.875 1.875 0 00-1.875-1.875h-9.75z" clipRule="evenodd" />
    </svg>
);
const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
        <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.18l.88-1.48a1.651 1.651 0 011.332-.906H4.25a1.651 1.651 0 011.332.906l.88 1.48a1.651 1.651 0 010 1.18l-.88 1.48a1.651 1.651 0 01-1.332.906H2.876a1.651 1.651 0 01-1.332-.906L.664 10.59zM10 15.25a5.25 5.25 0 005.25-5.25.75.75 0 00-1.5 0 3.75 3.75 0 01-3.75 3.75.75.75 0 000 1.5z" clipRule="evenodd" />
    </svg>
);
const EyeSlashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M3.28 3.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.18l-.88-1.48a1.651 1.651 0 00-1.333-.906H14.25a1.651 1.651 0 00-1.333.906l-.88 1.48a1.651 1.651 0 000 1.18l-2.228-2.228a3.75 3.75 0 00-4.332-4.332L3.28 3.22z" />
        <path d="M10 12.5a2.5 2.5 0 01-2.5-2.5 1.651 1.651 0 010-1.18l.88-1.48A1.651 1.651 0 019.75 6.5h.5a1.651 1.651 0 011.333.906l.88 1.48a1.651 1.651 0 010 1.18a2.5 2.5 0 01-2.5 2.5z" />
    </svg>
);

function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const [loginAttempts, setLoginAttempts] = useState<Record<string, number>>({});
  const [infoMessage, setInfoMessage] = useState('');
  const [showPasswordResetLink, setShowPasswordResetLink] = useState(false);

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp && (!selectedRole || !name)) {
      setError(t('errorAllFields'));
      return;
    }
     if (!email || !password) {
        setError(t('errorEnterEmailPass'));
        return;
    }
    setError('');
    setInfoMessage('');
    setShowPasswordResetLink(false);
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign Up
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        if (user) {
          await updateProfile(user, { displayName: name });
          
          const userData: any = {
            name: name,
            email: user.email,
            role: selectedRole,
          };

          if (selectedRole === UserRole.RECOMMENDER) {
            userData.averageRating = 0;
            userData.ratingCount = 0;
          }

          await setDoc(doc(db, 'users', user.uid), userData);

          // Create a role-specific document for all roles to ensure consistency
          if (selectedRole === UserRole.SEEKER) {
            await setDoc(doc(db, 'seekers', user.uid), {
              phoneNumber: '',
              address: '',
              areaCode: '',
              activeMembershipId: null,
              membershipEndDate: null,
            });
          } else if (selectedRole === UserRole.PROFESSIONAL) {
            await setDoc(doc(db, 'professionals', user.uid), {
              specialty: '',
              bio: '',
              services: [],
              status: 'pending',
              phone: '',
              photoURL: '',
            });
          } else if (selectedRole === UserRole.RECOMMENDER) {
             await setDoc(doc(db, 'recommenders', user.uid), {
              phone: '',
              photoURL: '',
            });
          }

          // Send welcome email based on role
          let welcomeEmailBodyKey = 'emails.welcomeBodySeeker'; // Default
          if (selectedRole === UserRole.RECOMMENDER) {
            welcomeEmailBodyKey = 'emails.welcomeBodyRecommender';
          } else if (selectedRole === UserRole.PROFESSIONAL) {
            welcomeEmailBodyKey = 'emails.welcomeBodyProfessional';
          }
          
          await addDoc(collection(db, "mail"), {
            to: [user.email],
            message: {
              subject: t('emails.welcomeSubject'),
              html: t(welcomeEmailBodyKey),
            },
          });
        }
      } else {
        // Sign In
        await signInWithEmailAndPassword(auth, email, password);
        setLoginAttempts(prev => ({ ...prev, [email]: 0 })); // Reset on success
      }
    } catch (err: any) {
        switch(err.code) {
            case 'auth/email-already-in-use':
                setError(t('errorEmailInUse'));
                break;
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
                setError(t('errorInvalidCredential'));
                setShowPasswordResetLink(true);
                const newAttempts = (loginAttempts[email] || 0) + 1;
                setLoginAttempts(prev => ({...prev, [email]: newAttempts}));
                if (newAttempts >= 3) {
                    await addDoc(collection(db, "mail"), {
                        to: [email],
                        message: {
                            subject: t('emails.failedLoginsWarningSubject'),
                            html: t('emails.failedLoginsWarningBody'),
                        }
                    });
                    setLoginAttempts(prev => ({...prev, [email]: 0})); // Reset after sending
                }
                break;
            case 'auth/weak-password':
                 setError(t('errorWeakPassword'));
                 break;
            default:
                setError(t('errorDefault'));
                break;
        }
    } finally {
        setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
        setError(t('errorEnterEmailPass'));
        return;
    }
    setLoading(true);
    setError('');
    setInfoMessage('');
    try {
        await sendPasswordResetEmail(auth, email);
        setInfoMessage(t('resetLinkSent'));
    } catch (err: any) {
        setError(t('errorDefault'));
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-4xl p-8 space-y-8">
        
        <div className="flex justify-center space-x-2 mb-8">
            <button 
              onClick={() => setLanguage('es')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${language === 'es' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
            >
              ES
            </button>
            <button 
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${language === 'en' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLanguage('fr')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${language === 'fr' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
            >
              FR
            </button>
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            {isSignUp ? t('createYourAccountIn') : t('welcomeBack')}
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            {t('connectingTalent')}
          </p>
        </div>

        <form onSubmit={handleAuthAction} className="max-w-xl mx-auto space-y-6">
            {isSignUp && (
                <>
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-center text-slate-800 dark:text-slate-200">
                          {t('selectUserType')}
                        </h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <RoleCard role={UserRole.RECOMMENDER} icon={<StarIcon />} description={t('recommenderDescription')} selectedRole={selectedRole} onSelect={setSelectedRole}/>
                            <RoleCard role={UserRole.SEEKER} icon={<MagnifyingGlassIcon />} description={t('seekerDescription')} selectedRole={selectedRole} onSelect={setSelectedRole}/>
                            <RoleCard role={UserRole.PROFESSIONAL} icon={<BriefcaseIcon />} description={t('professionalDescription')} selectedRole={selectedRole} onSelect={setSelectedRole}/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('name')}</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-4 py-3 text-base bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required={isSignUp} />
                    </div>
                </>
            )}

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('email')}</label>
                <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full px-4 py-3 text-base bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('password')}</label>
                 <div className="relative mt-1">
                    <input 
                        type={showPassword ? 'text' : 'password'} 
                        id="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        className="block w-full px-4 py-3 text-base bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                        required 
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                        aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                    >
                        {showPassword 
                            ? <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                            : <EyeIcon className="h-5 w-5 text-gray-500" />
                        }
                    </button>
                </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full" size="lg">
                {loading ? t('loading') : (isSignUp ? t('createAccount') : t('login'))}
            </Button>

            <div className="min-h-[2.5rem] flex flex-col items-center justify-center">
                {error && (
                    <div className="text-center">
                        <p className="text-sm text-red-500">{error}</p>
                        {showPasswordResetLink && !isSignUp && (
                            <button
                                type="button"
                                onClick={handlePasswordReset}
                                className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                                disabled={loading}
                            >
                                {t('forgotPassword')}
                            </button>
                        )}
                    </div>
                )}
                {infoMessage && <p className="text-sm text-green-600 text-center">{infoMessage}</p>}
            </div>

            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                {isSignUp ? t('alreadyHaveAccount') : t('dontHaveAccount')}
                <button 
                    type="button" 
                    onClick={() => { 
                        setIsSignUp(!isSignUp); 
                        setError(''); 
                        setInfoMessage(''); 
                        setShowPasswordResetLink(false); 
                    }} 
                    className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 ml-1"
                >
                    {isSignUp ? t('signIn') : t('signUp')}
                </button>
            </p>
        </form>
      </div>
    </div>
  );
}

export default Login;