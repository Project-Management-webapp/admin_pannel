import React, { useState, useEffect } from 'react';
import { FiUserCheck, FiMail } from 'react-icons/fi';
import { getPendingApprovals, approveManager, rejectManager } from '../../api/manager';
import ManagerDetailModal from '../../components/ManagerDetailModal';
import Toaster from '../../components/Toaster';

const PendingApprovals = () => {
  const [pendingManagers, setPendingManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedManager, setSelectedManager] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'info',
    loading: false,
  });

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const fetchPendingApprovals = async () => {
    try {
      setLoading(true);
      const response = await getPendingApprovals();
      if (response.success) {
        // Handle nested data structure: response.data.managers
        const managersData = response.data?.managers || response.data;
        const managers = Array.isArray(managersData) ? managersData : [];
        setPendingManagers(managers);
      } else {
        setPendingManagers([]);
      }
    } catch (error) {
      setPendingManagers([]);
      setToast({
        show: true,
        message: error.message || 'Failed to fetch pending approvals',
        type: 'error',
        loading: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (manager) => {
    setSelectedManager(manager);
    setIsModalOpen(true);
  };

  const handleApprove = async (managerId) => {
    try {
      setToast({
        show: true,
        message: 'Approving manager...',
        type: 'info',
        loading: true,
      });

      const response = await approveManager(managerId);
      
      if (response.success) {
        setToast({
          show: true,
          message: response.message || 'Manager approved successfully',
          type: 'success',
          loading: false,
        });

        setPendingManagers((prev) => prev.filter((m) => m.id !== managerId));
        setIsModalOpen(false);
        setSelectedManager(null);
      }
    } catch (error) {
      setToast({
        show: true,
        message: error.message || 'Failed to approve manager',
        type: 'error',
        loading: false,
      });
    }
  };

  const handleReject = async (managerId) => {
    try {
      setToast({
        show: true,
        message: 'Rejecting manager...',
        type: 'info',
        loading: true,
      });

      const response = await rejectManager(managerId);
      
      if (response.success) {
        setToast({
          show: true,
          message: response.message || 'Manager rejected successfully',
          type: 'success',
          loading: false,
        });

        setPendingManagers((prev) => prev.filter((m) => m.id !== managerId));
        setIsModalOpen(false);
        setSelectedManager(null);
      }
    } catch (error) {
      setToast({
        show: true,
        message: error.message || 'Failed to reject manager',
        type: 'error',
        loading: false,
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Pending Approvals</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 animate-pulse"
            >
              <div className="h-32 bg-white/5 rounded"></div>
            </div>
          ))}
        </div>
      ) : pendingManagers.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-12 border border-white/20 text-center">
          <FiUserCheck size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-xl text-gray-400">No pending approvals</p>
          <p className="text-sm text-gray-500 mt-2">All manager registrations have been processed</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingManagers.map((manager) => (
            <div
              key={manager.id}
              onClick={() => handleCardClick(manager)}
              className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 hover:border-[#ac51fc] hover:shadow-lg hover:shadow-[#ac51fc]/30 transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ac51fc]/20 text-[#ac51fc] shrink-0">
                  <FiUserCheck size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white truncate">
                    {manager.fullName || 'N/A'}
                  </h3>
                  <p className="text-sm text-gray-400 truncate">Manager</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FiMail size={16} className="text-gray-400 shrink-0" />
                  <p className="text-sm text-gray-300 truncate">{manager.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">ID:</span>
                  <p className="text-sm text-gray-300">{manager.managerId || manager.employeeId || 'N/A'}</p>
                </div>
                <div className="mt-3">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-500/20 text-yellow-500">
                    Pending Approval
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ManagerDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedManager(null);
        }}
        manager={selectedManager}
        onApprove={handleApprove}
        onReject={handleReject}
        isPending={true}
      />

      {toast.show && (
        <Toaster
          message={toast.message}
          type={toast.type}
          loading={toast.loading}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
};

export default PendingApprovals;
