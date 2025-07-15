import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LogOut, MapPin, Grid, BarChart3, User, DollarSign } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import FarmProfile from './FarmProfile';
import LotsManagement from './LotsManagement';
import Traceability from './Traceability';
import FinancialDashboard from './FinancialDashboard';
import { User as UserType } from '../types';

interface DashboardProps {
  user: UserType;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'profile' | 'lots' | 'traceability' | 'financial'>('profile');

  const tabs = [
    { id: 'profile', label: t('navigation.farm_profile'), icon: MapPin },
    { id: 'lots', label: t('navigation.lots_management'), icon: Grid },
    { id: 'traceability', label: t('navigation.traceability'), icon: BarChart3 },
    { id: 'financial', label: t('navigation.financial_dashboard'), icon: DollarSign }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <FarmProfile userId={user.id} />;
      case 'lots':
        return <LotsManagement userId={user.id} />;
      case 'traceability':
        return <Traceability userId={user.id} />;
      case 'financial':
        return <FinancialDashboard userId={user.id} />;
      default:
        return <FarmProfile userId={user.id} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-lg font-semibold text-gray-900">{t('auth.platform_title')}</h1>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <LanguageSelector />
              <span className="text-sm text-gray-700">{t('auth.welcome', { name: user.name })}</span>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('auth.logout')}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;