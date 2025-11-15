import React, { useState, useEffect } from "react";
import { FiUser, FiMail, FiUsers, FiUserCheck, FiClock } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { getProfile } from "../../api/auth";

import { getAllEmployee } from "../../api/employee";
import { getAllManagers, getPendingApprovals } from "../../api/manager";

const Profile = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalManagers: 0,
    pendingApprovals: 0,
  });

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  // ---------------- FETCH ALL DATA ----------------
  const fetchAllData = async () => {
    try {
      setLoading(true);

      // 1. Get Profile
      const profileRes = await getProfile();
      if (profileRes?.success) {
        setProfile(profileRes.data);

        if (profileRes.data.fullName)
          localStorage.setItem("fullName", profileRes.data.fullName);

        if (profileRes.data.email)
          localStorage.setItem("email", profileRes.data.email);
      }

      // 2. Get All Employees
      const empRes = await getAllEmployee();
      const totalEmployees = empRes?.data?.employees?.length || 0;

      // 3. Get All Managers
      const mgrRes = await getAllManagers();
      const totalManagers = mgrRes?.data?.managers?.length || 0;

      // 4. Get Pending Approvals
      const pendingRes = await getPendingApprovals();
      const pendingApprovals = pendingRes?.data?.count || 0;

      // Save to stats
      setStats({
        totalEmployees,
        totalManagers,
        pendingApprovals,
      });
    } catch (error) {
      setToast({
        show: true,
        message: error.message || "Failed to fetch dashboard data",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {/* Welcome Section Skeleton */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 shadow-xl animate-pulse">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Profile Image Skeleton */}
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-white/5"></div>
              <div className="absolute bottom-1 right-1 h-5 w-5 bg-white/5 rounded-full border-4 border-slate-900"></div>
            </div>

            {/* Welcome Text Skeleton */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="h-4 bg-white/5 rounded w-32 mx-auto md:mx-0"></div>
              <div className="h-8 bg-white/5 rounded w-64 mx-auto md:mx-0"></div>
              <div className="space-y-2">
                <div className="h-5 bg-white/5 rounded w-48 mx-auto md:mx-0"></div>
                <div className="h-5 bg-white/5 rounded w-56 mx-auto md:mx-0"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section Skeleton */}
        <div>
          <div className="h-7 bg-white/5 rounded w-48 mb-4 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-xl animate-pulse"
              >
                <div className="h-12 w-12 rounded-full bg-white/5 mb-4"></div>
                <div className="h-4 bg-white/5 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-white/5 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-white/5 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 text-center text-red-400">
        Failed to load profile.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      
      {/* Welcome Section */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-center gap-6">

          {/* Profile Image */}
          <div className="relative">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt={profile.fullName || "Admin"}
                className="h-24 w-24 rounded-full object-cover border-4 border-[#ac51fc] shadow-lg"
              />
            ) : (
              <div className="h-24 w-24 rounded-full flex items-center justify-center bg-linear-to-br from-[#ac51fc] to-purple-600 text-white shadow-lg">
                <FiUser size={48} />
              </div>
            )}

            <div className="absolute bottom-1 right-1 h-5 w-5 bg-green-500 rounded-full border-4 border-slate-900"></div>
          </div>

          {/* Welcome Text */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-gray-400 text-sm mb-1">{getGreeting()}!</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome, Admin
            </h1>

            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-300">
                <FiUser className="text-[#ac51fc]" />
                <span className="font-semibold">
                  {profile.fullName || "Admin User"}
                </span>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400">
                <FiMail className="text-[#ac51fc]" />
                <span>{profile.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* ------------ STATISTICS SECTION ------------ */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">System Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Total Employees */}
          <div className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-xl hover:scale-105 hover:border-blue-500/50 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg mb-4">
              <FiUsers size={24} />
            </div>
            <h3 className="text-gray-400 text-sm mb-2">Total Employees</h3>
            <p className="text-3xl font-bold text-white">{stats.totalEmployees}</p>
            <p className="text-xs text-gray-500">Active employees in system</p>
          </div>

          {/* Total Managers */}
          <div className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-xl hover:scale-105 hover:border-purple-500/50 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg mb-4">
              <FiUserCheck size={24} />
            </div>
            <h3 className="text-gray-400 text-sm mb-2">Total Managers</h3>
            <p className="text-3xl font-bold text-white">{stats.totalManagers}</p>
            <p className="text-xs text-gray-500">Active managers in system</p>
          </div>

          {/* Pending Approvals */}
          <div className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-xl hover:scale-105 hover:border-orange-500/50 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-600 text-white shadow-lg mb-4">
              <FiClock size={24} />
            </div>
            <h3 className="text-gray-400 text-sm mb-2">Pending Approvals</h3>
            <p className="text-3xl font-bold text-white">
              {stats.pendingApprovals}
            </p>
            <p className="text-xs text-gray-500">Awaiting your approval action</p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Profile;
