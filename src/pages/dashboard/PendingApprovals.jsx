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
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [managerToReject, setManagerToReject] = useState(null);
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

  const handleRejectClick = (managerId) => {
    setManagerToReject(managerId);
    setIsRejectModalOpen(true);
    setIsModalOpen(false);
  };

  const handleRejectConfirm = async () => {
    if (!managerToReject) return;

    // Close modal first to make toaster visible
    setIsRejectModalOpen(false);

    try {
      setToast({
        show: true,
        message: 'Rejecting manager...',
        type: 'info',
        loading: true,
      });

      const response = await rejectManager(managerToReject, rejectionReason);
      
      if (response.success) {
        setToast({
          show: true,
          message: response.message || 'Manager rejected successfully',
          type: 'success',
          loading: false,
        });

        setPendingManagers((prev) => prev.filter((m) => m.id !== managerToReject));
        setRejectionReason('');
        setManagerToReject(null);
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

  const handleRejectCancel = () => {
    setIsRejectModalOpen(false);
    setRejectionReason('');
    setManagerToReject(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Pending Approvals</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 animate-pulse"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-white/5 shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-white/5 rounded w-3/4"></div>
                  <div className="h-4 bg-white/5 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-white/5 rounded w-full"></div>
                <div className="h-4 bg-white/5 rounded w-2/3"></div>
                <div className="h-6 bg-white/5 rounded w-1/3 mt-3"></div>
              </div>
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
        onReject={handleRejectClick}
        isPending={true}
      />

      {/* Rejection Reason Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-lg bg-gray-800 p-6 text-white shadow-xl border border-white/20">
            <h3 className="text-xl font-bold mb-4">Reject Manager</h3>
            <p className="text-gray-300 text-sm mb-4">
              Please provide a reason for rejecting this manager application.
            </p>
            
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows="4"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#ac51fc] focus:ring-1 focus:ring-[#ac51fc] resize-none"
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleRejectCancel}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={!rejectionReason.trim()}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

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
