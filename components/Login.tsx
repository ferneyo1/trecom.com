import React, { useState } from 'react';
import { UserRole } from '../types';
import { Button } from './shared/Button';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

// Fix: Specify that the icon element passed to RoleCard can accept a className prop.
// This resolves a TypeScript error when using React.cloneElement to add a class.
const RoleCard: React.FC<{
  role: UserRole;
  icon: React.ReactElement<{ className?: string }>;
  description: string;
  selectedRole: UserRole | null;
  onSelect: (role: UserRole) => void;
}> = ({ role, icon, description, selectedRole, onSelect }) => {
  const isSelected = selectedRole === role;
  return (
    <div
      onClick={() => onSelect(role)}
      className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 transform ${
        isSelected
          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/50 shadow-lg scale-105'
          : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-400 hover:shadow-md'
      }`}
    >
      <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full mb-4">
        {React.cloneElement(icon, { className: "w-6 h-6 text-indigo-600 dark:text-indigo-400" })}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{role}</h3>
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
const UserGroupIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM1.5 15.75a8.25 8.25 0 0113.5 0v3a1.5 1.5 0 01-1.5 1.5h-10.5a1.5 1.5 0 01-1.5-1.5v-3zM16.5 18.75a5.25 5.25 0 0010.5 0v-1.5a1.5 1.5 0 00-1.5-1.5h-7.5a1.5 1.5 0 00-1.5 1.5v1.5z" />
  </svg>
);


function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp && (!selectedRole || !name)) {
      setError('Por favor, complete todos los campos y seleccione un rol.');
      return;
    }
     if (!email || !password) {
        setError('Por favor, ingrese email y contraseña.');
        return;
    }
    setError('');
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
              bio: '',
            });
          }
        }
      } else {
        // Sign In
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
        switch(err.code) {
            case 'auth/email-already-in-use':
                setError('Este correo electrónico ya está en uso.');
                break;
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
                setError('Correo electrónico o contraseña incorrectos.');
                break;
            case 'auth/weak-password':
                 setError('La contraseña debe tener al menos 6 caracteres.');
                 break;
            default:
                setError('Ocurrió un error. Por favor, inténtelo de nuevo.');
                break;
        }
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-4xl p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            {isSignUp ? 'Crea tu Cuenta en PerfilPro' : 'Bienvenido de Vuelta'}
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Conectando talento con oportunidades.
          </p>
        </div>

        <form onSubmit={handleAuthAction} className="max-w-xl mx-auto space-y-6">
            {isSignUp && (
                <>
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-center text-slate-800 dark:text-slate-200">
                        1. Seleccione su tipo de usuario
                        </h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <RoleCard role={UserRole.RECOMMENDER} icon={<StarIcon />} description="Recomiende empleos y ayude a conectar talento." selectedRole={selectedRole} onSelect={setSelectedRole}/>
                            <RoleCard role={UserRole.SEEKER} icon={<MagnifyingGlassIcon />} description="Encuentre profesionales y empleos." selectedRole={selectedRole} onSelect={setSelectedRole}/>
                            <RoleCard role={UserRole.PROFESSIONAL} icon={<BriefcaseIcon />} description="Muestre su perfil y conecte con clientes." selectedRole={selectedRole} onSelect={setSelectedRole}/>
                            <RoleCard role={UserRole.ADMIN} icon={<UserGroupIcon />} description="Gestione la plataforma." selectedRole={selectedRole} onSelect={setSelectedRole}/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nombre</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required={isSignUp} />
                    </div>
                </>
            )}

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Correo Electrónico</label>
                <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Contraseña</label>
                <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
            </div>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <div className="flex flex-col items-center space-y-4">
                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Cargando...' : (isSignUp ? 'Crear Cuenta' : 'Ingresar')}
                </Button>
                 <button type="button" onClick={() => { setIsSignUp(!isSignUp); setError(''); }} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                    {isSignUp ? '¿Ya tienes una cuenta? Acceder' : '¿No tienes una cuenta? Regístrate'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}

export default Login;