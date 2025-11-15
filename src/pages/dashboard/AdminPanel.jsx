import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import Sidebar from '../../components/Sidebar';
import PendingApprovals from './PendingApprovals';
import Managers from './Managers';
import Employees from './Employees';
import Profile from './Profile';
import LogoutModal from '../../components/LogoutModal';
import Toaster from '../../components/Toaster';
import { useAuth } from '../../context/AuthContext';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeView, setActiveView] = useState(() => {
    // Load saved view on initial render
    return localStorage.getItem('adminActiveView') || 'pending-approvals';
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'info',
  });

  // Check if user is admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  // Persist active view
  useEffect(() => {
    localStorage.setItem('adminActiveView', activeView);
  }, [activeView]);

  const handleLogoutRequest = () => {
    setIsLogoutModalOpen(true);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'pending-approvals':
        return <PendingApprovals />;
      case 'managers':
        return <Managers />;
      case 'employees':
        return <Employees />;
      case 'profile':
        return <Profile />;
      default:
        return <Profile />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">
        <Sidebar
          isMobile={false}
          isCollapsed={isSidebarCollapsed}
          onCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          activeView={activeView}
          setActiveView={setActiveView}
          onLogoutRequest={handleLogoutRequest}
        />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 lg:hidden transform transition-transform duration-300 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar
          isMobile={true}
          onClose={() => setIsMobileSidebarOpen(false)}
          isCollapsed={false}
          activeView={activeView}
          setActiveView={setActiveView}
          onLogoutRequest={handleLogoutRequest}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white/10 backdrop-blur-md border-b border-white/20 p-4 flex items-center justify-between">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <FiMenu size={24} />
          </button>
          <h2 className="text-white font-semibold text-lg">Admin Panel</h2>
          <div className="w-6" /> {/* Spacer for centering */}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>
      </div>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onShowToast={setToast}
      />

      {/* Toast Notifications */}
      {toast.show && (
        <Toaster
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
};

export default AdminPanel;
