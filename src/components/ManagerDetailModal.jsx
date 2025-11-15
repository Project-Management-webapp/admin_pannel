import React from 'react';
import { IoMdClose } from 'react-icons/io';
import { FiMail, FiUser, FiBriefcase, FiCalendar, FiPhone, FiMapPin, FiDollarSign, FiClock, FiAward } from 'react-icons/fi';

const ManagerDetailModal = ({ isOpen, onClose, manager, onApprove, onReject, isPending = false }) => {
  const handleModalContentClick = (e) => e.stopPropagation();

  if (!isOpen || !manager) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-lg bg-gray-800 p-6 text-white shadow-xl border border-white/20 max-h-[90vh] overflow-y-auto"
        onClick={handleModalContentClick}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          aria-label="Close modal"
        >
          <IoMdClose size={24} />
        </button>

        <div className="flex flex-col items-center">
          {manager.profileImage ? (
            <img
              src={manager.profileImage}
              alt={manager.fullName || 'Manager'}
              className="mb-4 h-20 w-20 rounded-full object-cover border-2 border-[#ac51fc]"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#ac51fc]/20 text-[#ac51fc]"
            style={{ display: manager.profileImage ? 'none' : 'flex' }}
          >
            <FiUser size={40} />
          </div>

          <h2 className="mb-2 text-2xl font-bold">{manager.fullName || manager.email || 'N/A'}</h2>
          <p className="mb-1 text-gray-400">Manager</p>
          {isPending && (
            <span className="mb-4 px-3 py-1 text-xs font-semibold rounded-full bg-yellow-500/20 text-yellow-500">
              Pending Approval
            </span>
          )}
          {!isPending && manager.approvalStatus && (
            <span className={`mb-4 px-3 py-1 text-xs font-semibold rounded-full ${
              manager.approvalStatus === 'approved' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
            }`}>
              {manager.approvalStatus.charAt(0).toUpperCase() + manager.approvalStatus.slice(1)}
            </span>
          )}

          <div className="w-full mt-6 space-y-3">
            {/* Basic Information */}
            <div className="border-b border-white/10 pb-2 mb-3">
              <h3 className="text-sm font-semibold text-gray-300">Basic Information</h3>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
              <FiMail className="text-[#ac51fc] mt-1 shrink-0" size={20} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 mb-1">Email</p>
                <p className="text-sm break-all">{manager.email || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
              <FiBriefcase className="text-[#ac51fc] mt-1 shrink-0" size={20} />
              <div>
                <p className="text-xs text-gray-400 mb-1">{manager.role === 'manager' ? 'Manager ID' : 'Employee ID'}</p>
                <p className="text-sm">{manager.managerId || manager.employeeId || 'N/A'}</p>
              </div>
            </div>

            {manager.phone && (
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <FiPhone className="text-[#ac51fc] mt-1 shrink-0" size={20} />
                <div>
                  <p className="text-xs text-gray-400 mb-1">Phone</p>
                  <p className="text-sm">{manager.phone}</p>
                </div>
              </div>
            )}

            {/* Work Details */}
            <div className="border-b border-white/10 pb-2 mb-3 mt-4">
              <h3 className="text-sm font-semibold text-gray-300">Work Details</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-start gap-2 p-3 bg-white/5 rounded-lg">
                <FiMapPin className="text-[#ac51fc] mt-1 shrink-0" size={16} />
                <div>
                  <p className="text-xs text-gray-400 mb-1">Work Location</p>
                  <p className="text-sm capitalize">{manager.workLocation || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 bg-white/5 rounded-lg">
                <FiBriefcase className="text-[#ac51fc] mt-1 shrink-0" size={16} />
                <div>
                  <p className="text-xs text-gray-400 mb-1">Contract Type</p>
                  <p className="text-sm capitalize">{manager.contractType?.replace('_', ' ') || 'N/A'}</p>
                </div>
              </div>
            </div>

            {manager.rate && (
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <FiAward className="text-[#ac51fc] mt-1 shrink-0" size={20} />
                <div>
                  <p className="text-xs text-gray-400 mb-1">Rate</p>
                  <p className="text-sm">${manager.rate} {manager.currency || 'USD'}</p>
                </div>
              </div>
            )}

            {/* Financial Information */}
            <div className="border-b border-white/10 pb-2 mb-3 mt-4">
              <h3 className="text-sm font-semibold text-gray-300">Financial Information</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-start gap-2 p-3 bg-white/5 rounded-lg">
                <FiDollarSign className="text-green-500 mt-1 shrink-0" size={16} />
                <div>
                  <p className="text-xs text-gray-400 mb-1">Total Earnings</p>
                  <p className="text-sm font-semibold text-green-400">${manager.totalEarnings || '0.00'}</p>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 bg-white/5 rounded-lg">
                <FiDollarSign className="text-yellow-500 mt-1 shrink-0" size={16} />
                <div>
                  <p className="text-xs text-gray-400 mb-1">Pending Earnings</p>
                  <p className="text-sm font-semibold text-yellow-400">${manager.pendingEarnings || '0.00'}</p>
                </div>
              </div>
            </div>

            {manager.projectEarnings && manager.projectEarnings.length > 0 && (
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <FiBriefcase className="text-[#ac51fc] mt-1 shrink-0" size={20} />
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-2">Project Earnings</p>
                  <div className="space-y-2">
                    {manager.projectEarnings.map((proj, idx) => (
                      <div key={idx} className="text-xs bg-white/5 p-2 rounded">
                        <p className="text-white font-medium">{proj.projectName}</p>
                        <p className="text-gray-400">Amount: ${proj.amount}</p>
                        {proj.confirmedAt && (
                          <p className="text-gray-500">Confirmed: {new Date(proj.confirmedAt).toLocaleDateString()}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Dates & Status */}
            <div className="border-b border-white/10 pb-2 mb-3 mt-4">
              <h3 className="text-sm font-semibold text-gray-300">Status & Dates</h3>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
              <FiCalendar className="text-[#ac51fc] mt-1 shrink-0" size={20} />
              <div>
                <p className="text-xs text-gray-400 mb-1">Registered Date</p>
                <p className="text-sm">
                  {manager.createdAt ? new Date(manager.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', month: 'long', day: 'numeric' 
                  }) : 'N/A'}
                </p>
              </div>
            </div>

            {manager.lastLogin && (
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <FiClock className="text-[#ac51fc] mt-1 shrink-0" size={20} />
                <div>
                  <p className="text-xs text-gray-400 mb-1">Last Login</p>
                  <p className="text-sm">
                    {new Date(manager.lastLogin).toLocaleString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
              <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${
                manager.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
              }`}></div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Account Status</p>
                <p className="text-sm capitalize">{manager.status || 'N/A'}</p>
                {manager.isActive !== undefined && (
                  <p className="text-xs text-gray-500">Active: {manager.isActive ? 'Yes' : 'No'}</p>
                )}
              </div>
            </div>
          </div>

          {isPending && (
            <div className="flex w-full gap-4 mt-6">
              <button
                onClick={() => onReject(manager.id)}
                className="flex-1 rounded-md bg-red-600 px-4 py-2 font-semibold hover:bg-red-700 transition-colors"
              >
                Reject
              </button>
              <button
                onClick={() => onApprove(manager.id)}
                className="flex-1 rounded-md bg-green-600 px-4 py-2 font-semibold hover:bg-green-700 transition-colors"
              >
                Approve
              </button>
            </div>
          )}

          {!isPending && (
            <button
              onClick={onClose}
              className="w-full mt-6 rounded-md bg-gray-600 px-4 py-2 font-semibold hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDetailModal;
