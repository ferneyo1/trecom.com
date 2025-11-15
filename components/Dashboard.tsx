
import React from 'react';
import { User, UserRole } from '../types';
import Header from './shared/Header';
import RecommenderDashboard from './dashboards/RecommenderDashboard';
import SeekerDashboard from './dashboards/SeekerDashboard';
import ProfessionalDashboard from './dashboards/ProfessionalDashboard';
import AdminDashboard from './dashboards/AdminDashboard';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

function Dashboard({ user, onLogout }: DashboardProps) {
  const renderDashboard = () => {
    switch (user.role) {
      case UserRole.RECOMMENDER:
        return <RecommenderDashboard user={user} />;
      case UserRole.SEEKER:
        return <SeekerDashboard user={user} />;
      case UserRole.PROFESSIONAL:
        return <ProfessionalDashboard user={user} />;
      case UserRole.ADMIN:
        return <AdminDashboard user={user} />;
      default:
        return <p>Rol de usuario no reconocido.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <Header user={user} onLogout={onLogout} />
      <main className="p-4 sm:p-6 lg:p-8">
        {renderDashboard()}
      </main>
    </div>
  );
}

export default Dashboard;