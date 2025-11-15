import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiUsers, FiUserCheck, FiClock } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { getSystemStats } from '../../api/stats';

const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalManagers: 0,
    pendingApprovals: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await getSystemStats();
      setStats({
        totalEmployees: response.data?.totalEmployees || 0,
        totalManagers: response.data?.totalManagers || 0,
        pendingApprovals: response.data?.pendingApprovals || 0,
      });
    } catch (error) {
      setToast({
        show: true,
        message: error.message || 'Failed to fetch statistics',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Profile Image */}
          <div className="relative">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.fullName || 'Admin'}
                className="h-24 w-24 rounded-full object-cover border-4 border-[#ac51fc] shadow-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className="h-24 w-24 rounded-full flex items-center justify-center bg-linear-to-br from-[#ac51fc] to-purple-600 text-white shadow-lg"
              style={{ display: user?.profileImage ? 'none' : 'flex' }}
            >
              <FiUser size={48} />
            </div>
            {/* Online Status Indicator */}
            <div className="absolute bottom-1 right-1 h-5 w-5 bg-green-500 rounded-full border-4 border-slate-900"></div>
          </div>

          {/* Welcome Text */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-gray-400 text-sm mb-1">{getGreeting()}!</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome to Admin Dashboard
            </h1>
            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-300">
                <FiUser className="text-[#ac51fc]" />
                <span className="font-semibold">{user?.fullName || 'Admin User'}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400">
                <FiMail className="text-[#ac51fc]" />
                <span>{user?.email || 'admin@example.com'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Statistics */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">System Overview</h2>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 animate-pulse"
              >
                <div className="h-12 w-12 bg-gray-700 rounded-full mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Employees Card */}
            <div className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-blue-500/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-blue-600 text-white shadow-lg">
                  <FiUsers size={24} />
                </div>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-2">Total Employees</h3>
              <p className="text-3xl font-bold text-white mb-1">{stats.totalEmployees}</p>
              <p className="text-xs text-gray-500">Active employees in system</p>
            </div>

            {/* Total Managers Card */}
            <div className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-[#ac51fc]/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-[#ac51fc] to-purple-600 text-white shadow-lg">
                  <FiUserCheck size={24} />
                </div>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-2">Total Managers</h3>
              <p className="text-3xl font-bold text-white mb-1">{stats.totalManagers}</p>
              <p className="text-xs text-gray-500">Active managers in system</p>
            </div>

            {/* Pending Approvals Card */}
            <div className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-orange-500/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-orange-500 to-orange-600 text-white shadow-lg">
                  <FiClock size={24} />
                </div>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-2">Pending Approvals</h3>
              <p className="text-3xl font-bold text-white mb-1">{stats.pendingApprovals}</p>
              <p className="text-xs text-gray-500">Awaiting your review</p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Info Section */}
      {/* <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ac51fc]/20 text-[#ac51fc]">
              <FiUser size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Full Name</p>
              <p className="text-white font-medium">{user?.fullName || 'Not Available'}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-500">
              <FiMail size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Email Address</p>
              <p className="text-white font-medium break-all">{user?.email || 'Not Available'}</p>
            </div>
          </div>
        </div>
      </div> */}

    </div>
  );
};

export default Profile;
