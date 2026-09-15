import { useState } from 'react';
import { Sidebar, type PageKey } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { MyApprovalsPage } from '@/pages/MyApprovalsPage';
import { ApplicationDetailPage } from '@/pages/ApplicationDetailPage';
import { ApprovalNavigatorPage } from '@/pages/ApprovalNavigatorPage';
import { DocumentsPage } from '@/pages/DocumentsPage';
import { AIInsightsPage } from '@/pages/AIInsightsPage';
import { CompliancePage } from '@/pages/CompliancePage';
import { GovernmentServicesPage } from '@/pages/GovernmentServicesPage';
import { AIAssistantPage } from '@/pages/AIAssistantPage';
import { NotificationsPage } from '@/pages/NotificationsPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { notifications as initialNotifications } from '@/data/mockData';

type AppState = 'landing' | 'login' | 'app';

function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [currentPage, setCurrentPage] = useState<PageKey>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [notificationCount, setNotificationCount] = useState(
    initialNotifications.filter((n) => !n.read).length
  );

  const handleLogin = () => {
    setAppState('app');
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setAppState('landing');
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page: PageKey) => {
    setCurrentPage(page);
    setSelectedApplicationId(null);
  };

  const handleViewApplication = (id: string) => {
    setSelectedApplicationId(id);
    setCurrentPage('approvals');
  };

  if (appState === 'landing') {
    return (
      <LandingPage
        onGetStarted={() => setAppState('login')}
        onExplore={() => setAppState('login')}
      />
    );
  }

  if (appState === 'login') {
    return (
      <LoginPage
        onLogin={handleLogin}
        onBack={() => setAppState('landing')}
      />
    );
  }

  const renderPage = () => {
    if (currentPage === 'approvals' && selectedApplicationId) {
      return (
        <ApplicationDetailPage
          applicationId={selectedApplicationId}
          onBack={() => setSelectedApplicationId(null)}
          onViewDocuments={() => {
            setSelectedApplicationId(null);
            setCurrentPage('documents');
          }}
        />
      );
    }

    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} onViewApplication={handleViewApplication} />;
      case 'approvals':
        return <MyApprovalsPage onViewApplication={handleViewApplication} />;
      case 'navigator':
        return <ApprovalNavigatorPage />;
      case 'documents':
        return <DocumentsPage />;
      case 'compliance':
        return <CompliancePage />;
      case 'ai-insights':
        return <AIInsightsPage />;
      case 'services':
        return <GovernmentServicesPage onNavigateToApprovals={() => handleNavigate('approvals')} />;
      case 'ai-assistant':
        return <AIAssistantPage />;
      case 'notifications':
        return <NotificationsPage onNavigate={handleNavigate} onReadChange={setNotificationCount} />;
      case 'profile':
        return <ProfilePage onNavigate={handleNavigate} />;
      default:
        return <DashboardPage onNavigate={handleNavigate} onViewApplication={handleViewApplication} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        notificationCount={notificationCount}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          onMenuClick={() => setSidebarOpen(true)}
          onNavigate={handleNavigate}
          notificationCount={notificationCount}
          onLogout={handleLogout}
        />
        <main className={`flex-1 overflow-x-hidden ${currentPage === 'ai-assistant' ? 'p-0' : 'p-4 sm:p-6 lg:p-8'}`}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
