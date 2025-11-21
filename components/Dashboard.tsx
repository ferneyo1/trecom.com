import React, { useState } from 'react';
import { User, UserRole } from '../types';
import Header from './shared/Header';
import RecommenderDashboard from './dashboards/RecommenderDashboard';
// FIX: Changed to a named import as SeekerDashboard was not providing a default export.
import { SeekerDashboard } from './dashboards/SeekerDashboard';
import ProfessionalDashboard from './dashboards/ProfessionalDashboard';
import { AdminDashboard } from './dashboards/AdminDashboard';
import SettingsDashboard from './dashboards/SettingsDashboard';
import HelpDashboard from './dashboards/HelpDashboard';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

type AdminView = 'verifications' | 'hiring' | 'users' | 'config';

function Dashboard({ user, onLogout }: DashboardProps) {
  const [currentView, setCurrentView] = useState<'dashboard' | 'settings' | 'help'>('dashboard');
  const [adminView, setAdminView] = useState<AdminView>('verifications');
  const { t } = useLanguage();

  const handleAdminNavigate = (view: AdminView) => {
    setCurrentView('dashboard'); // Ensure we are on the main dashboard view
    setAdminView(view);
  };

  const renderDashboard = () => {
    if (currentView === 'settings') {
      return <SettingsDashboard onBackToDashboard={() => setCurrentView('dashboard')} />;
    }
    if (currentView === 'help') {
        return <HelpDashboard user={user} onBackToDashboard={() => setCurrentView('dashboard')} />;
    }

    switch (user.role) {
      case UserRole.RECOMMENDER:
        return <RecommenderDashboard user={user} />;
      case UserRole.SEEKER:
        return <SeekerDashboard user={user} />;
      case UserRole.PROFESSIONAL:
        return <ProfessionalDashboard user={user} />;
      case UserRole.ADMIN:
        return <AdminDashboard user={user} currentView={adminView} />;
      default:
        return <p>{t('unrecognizedRole')}</p>;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 dark:bg-slate-900">
      <Header 
        user={user} 
        onLogout={onLogout} 
        onNavigateToSettings={() => setCurrentView('settings')}
        onNavigateToHelp={() => setCurrentView('help')}
        onAdminNavigate={handleAdminNavigate}
      />
      <main className="flex-grow overflow-auto p-4 sm:p-6 lg:p-8">
        {renderDashboard()}
      </main>
    </div>
  );
}

export default Dashboard;