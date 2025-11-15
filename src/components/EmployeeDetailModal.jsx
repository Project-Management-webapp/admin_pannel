import React from 'react';
import { IoMdClose } from 'react-icons/io';
import { FiMail, FiUser, FiBriefcase, FiCalendar, FiPhone, FiMapPin, FiDollarSign, FiUserPlus, FiClock, FiAward } from 'react-icons/fi';

const EmployeeDetailModal = ({ isOpen, onClose, employee }) => {
  const handleModalContentClick = (e) => e.stopPropagation();

  if (!isOpen || !employee) return null;

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
          {employee.profileImage ? (
            <img
              src={employee.profileImage}
              alt={employee.fullName || 'Employee'}
              className="mb-4 h-20 w-20 rounded-full object-cover border-2 border-blue-500"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/20 text-blue-500"
            style={{ display: employee.profileImage ? 'none' : 'flex' }}
          >
            <FiUser size={40} />
          </div>

          <h2 className="mb-2 text-2xl font-bold">{employee.fullName || employee.email || 'N/A'}</h2>
          <p className="mb-1 text-gray-400">Employee</p>
          {employee.approvalStatus && (
            <span className={`mb-4 px-3 py-1 text-xs font-semibold rounded-full ${
              employee.approvalStatus === 'approved' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
            }`}>
              {employee.approvalStatus.charAt(0).toUpperCase() + employee.approvalStatus.slice(1)}
            </span>
          )}

          <div className="w-full mt-6 space-y-3">
            {/* Basic Information */}
            <div className="border-b border-white/10 pb-2 mb-3">
              <h3 className="text-sm font-semibold text-gray-300">Basic Information</h3>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
              <FiMail className="text-blue-500 mt-1 shrink-0" size={20} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 mb-1">Email</p>
                <p className="text-sm break-all">{employee.email || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
              <FiBriefcase className="text-blue-500 mt-1 shrink-0" size={20} />
              <div>
                <p className="text-xs text-gray-400 mb-1">Employee ID</p>
                <p className="text-sm">{employee.employeeId || 'N/A'}</p>
              </div>
            </div>

            {employee.phone && (
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <FiPhone className="text-blue-500 mt-1 shrink-0" size={20} />
                <div>
                  <p className="text-xs text-gray-400 mb-1">Phone</p>
                  <p className="text-sm">{employee.phone}</p>
                </div>
              </div>
            )}

            {/* Creator Information */}
            {employee.creator && (
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <FiUserPlus className="text-blue-500 mt-1 shrink-0" size={20} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 mb-1">Created By</p>
                  <p className="text-sm">{employee.creator.fullName || employee.creator.email || 'N/A'}</p>
                  {employee.creator.email && employee.creator.fullName && (
                    <p className="text-xs text-gray-500 break-all">{employee.creator.email}</p>
                  )}
                </div>
              </div>
            )}

            {/* Work Details */}
            <div className="border-b border-white/10 pb-2 mb-3 mt-4">
              <h3 className="text-sm font-semibold text-gray-300">Work Details</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-start gap-2 p-3 bg-white/5 rounded-lg">
                <FiMapPin className="text-blue-500 mt-1 shrink-0" size={16} />
                <div>
                  <p className="text-xs text-gray-400 mb-1">Work Location</p>
                  <p className="text-sm capitalize">{employee.workLocation || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 bg-white/5 rounded-lg">
                <FiBriefcase className="text-blue-500 mt-1 shrink-0" size={16} />
                <div>
                  <p className="text-xs text-gray-400 mb-1">Contract Type</p>
                  <p className="text-sm capitalize">{employee.contractType?.replace('_', ' ') || 'N/A'}</p>
                </div>
              </div>
            </div>

            {employee.rate && (
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <FiAward className="text-blue-500 mt-1 shrink-0" size={20} />
                <div>
                  <p className="text-xs text-gray-400 mb-1">Rate</p>
                  <p className="text-sm">${employee.rate} {employee.currency || 'USD'}</p>
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
                  <p className="text-sm font-semibold text-green-400">${employee.totalEarnings || '0.00'}</p>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 bg-white/5 rounded-lg">
                <FiDollarSign className="text-yellow-500 mt-1 shrink-0" size={16} />
                <div>
                  <p className="text-xs text-gray-400 mb-1">Pending Earnings</p>
                  <p className="text-sm font-semibold text-yellow-400">${employee.pendingEarnings || '0.00'}</p>
                </div>
              </div>
            </div>

            {employee.projectEarnings && employee.projectEarnings.length > 0 && (
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <FiBriefcase className="text-blue-500 mt-1 shrink-0" size={20} />
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-2">Project Earnings</p>
                  <div className="space-y-2">
                    {employee.projectEarnings.map((proj, idx) => (
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
              <FiCalendar className="text-blue-500 mt-1 shrink-0" size={20} />
              <div>
                <p className="text-xs text-gray-400 mb-1">Joined Date</p>
                <p className="text-sm">
                  {employee.createdAt ? new Date(employee.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', month: 'long', day: 'numeric' 
                  }) : 'N/A'}
                </p>
              </div>
            </div>

            {employee.lastLogin && (
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <FiClock className="text-blue-500 mt-1 shrink-0" size={20} />
                <div>
                  <p className="text-xs text-gray-400 mb-1">Last Login</p>
                  <p className="text-sm">
                    {new Date(employee.lastLogin).toLocaleString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
              <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${
                employee.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
              }`}></div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Account Status</p>
                <p className="text-sm capitalize">{employee.status || 'N/A'}</p>
                {employee.isActive !== undefined && (
                  <p className="text-xs text-gray-500">Active: {employee.isActive ? 'Yes' : 'No'}</p>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-6 rounded-md bg-gray-600 px-4 py-2 font-semibold hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailModal;
