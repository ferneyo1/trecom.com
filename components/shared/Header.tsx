import React, { useState, useEffect, useRef } from 'react';
import { User, UserRole } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

type AdminView = 'verifications' | 'hiring' | 'users' | 'config';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onNavigateToSettings: () => void;
  onNavigateToHelp: () => void;
  onAdminNavigate?: (view: AdminView) => void;
}

const UserCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
    </svg>
);
const Cog6ToothIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 5.85c-.09.55-.554.955-1.116.955H6.116c-.965 0-1.793.748-1.857 1.711-.065.964.706 1.796 1.671 1.857l1.793.065c.562 0 1.026.405 1.116.955l.178 2.091c.151.904.933 1.567 1.85 1.567h1.844c.917 0 1.699-.663 1.85-1.567l.178-2.091c.09-.55.554-.955 1.116.955h1.793c.965 0 1.793-.748 1.857-1.711.065-.964-.706-1.796-1.671-1.857l-1.793-.065c-.562 0-1.026-.405-1.116-.955L13.199 3.817c-.151-.904-.933-1.567-1.85-1.567h-1.844zM12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zM12 19.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM3.75 12a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0zM12 3.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM6.375 19.5a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0zM12 20.25a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM19.5 12a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM17.625 19.5a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0zM20.25 12a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
    </svg>
);
const QuestionMarkCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 01-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 01-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 01-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584zM12 18a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" /></svg>
);
const ArrowRightOnRectangleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z" clipRule="evenodd" /></svg>
);


const Header: React.FC<HeaderProps> = ({ user, onLogout, onNavigateToSettings, onNavigateToHelp, onAdminNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAdminClick = (view: AdminView) => {
    if (onAdminNavigate) {
      onAdminNavigate(view);
    }
    setIsMenuOpen(false);
  };
  
  const adminMenuItems = [
    { view: 'verifications', label: t('admin.nav.verifications') },
    { view: 'hiring', label: t('admin.nav.hiring') },
    { view: 'users', label: t('admin.nav.users') },
    { view: 'config', label: t('admin.nav.config') },
  ];

  return (
    <header className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">teRecomiendo</span>
          </div>
          <div className="relative" ref={menuRef}>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center space-x-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800" aria-haspopup="true" aria-expanded={isMenuOpen}>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:block">{user.name}</span>
              <UserCircleIcon className="h-9 w-9 text-slate-500 dark:text-slate-400" />
            </button>
            {isMenuOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-slate-700 ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in-down" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
                <div className="py-1" role="none">
                  <div className="px-4 py-2 text-sm text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-600">
                    <p className="font-semibold">{user.name}</p>
                    <p className="truncate">{user.email}</p>
                  </div>
                  {user.role === UserRole.ADMIN && (
                    <>
                    {adminMenuItems.map(item => (
                         <button key={item.view} onClick={() => handleAdminClick(item.view as AdminView)} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600" role="menuitem">
                           {item.label}
                         </button>
                    ))}
                    <div className="border-t border-slate-200 dark:border-slate-600 my-1"></div>
                    </>
                  )}
                  <button onClick={() => { onNavigateToSettings(); setIsMenuOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600" role="menuitem">
                    <Cog6ToothIcon className="h-5 w-5 mr-3" />
                    {t('settings')}
                  </button>
                  <button onClick={() => { onNavigateToHelp(); setIsMenuOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600" role="menuitem">
                    <QuestionMarkCircleIcon className="h-5 w-5 mr-3" />
                    {/* FIX: Use 'help_nav' key to avoid conflict with the 'help' object used for the help page. */}
                    {t('help_nav')}
                  </button>
                  <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-600" role="menuitem">
                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                    {t('logout')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;