import React, { useState, useEffect } from "react";
import {
  FiHome,
  FiUsers,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiUser,
  FiLogOut,
  FiCheckCircle,
  FiUserCheck
} from "react-icons/fi";
import logo from "/login_logo.png";

const Sidebar = ({
  isMobile,
  onClose,
  isCollapsed,
  onCollapse,
  activeView,
  setActiveView,
  onLogoutRequest
}) => {
  const handleItemClick = (view) => {
    setActiveView(view);
    if (isMobile) {
      onClose();
    }
  };

  return (
    <div
      className={`h-screen bg-white/10 backdrop-blur-md text-white flex flex-col border-r border-white/20 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20 shrink-0">
        <div className="flex items-center ml-10 overflow-hidden">
          <img
            src={logo}
            alt="Logo"
            className={`transition-all text-center duration-300 ease-in-out cursor-pointer hover:opacity-80 ${
              isCollapsed ? "w-0" : "w-28"
            }`}
            onClick={() => setActiveView("dashboard")}
          />
        </div>
        {!isMobile && (
          <button
            onClick={onCollapse}
            className="text-gray-400 hover:text-white py-5 transition-colors rounded-lg"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <FiChevronRight size={20} />
            ) : (
              <FiChevronLeft size={20} />
            )}
          </button>
        )}
        {isMobile && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2"
            aria-label="Close sidebar"
          >
            <FiX size={20} />
          </button>
        )}
      </div>

      <nav
        className={`flex-1 px-2 py-4 space-y-2 ${
          isCollapsed ? "overflow-x-hidden" : "overflow-y-auto"
        }`}
      >
        <SidebarItem
          icon={<FiCheckCircle size={20} />}
          text="Pending Approvals"
          collapsed={isCollapsed}
          active={activeView === "pending-approvals"}
          onClick={() => handleItemClick("pending-approvals")}
        />

        <SidebarItem
          icon={<FiUserCheck size={20} />}
          text="Managers"
          collapsed={isCollapsed}
          active={activeView === "managers"}
          onClick={() => handleItemClick("managers")}
        />

        <SidebarItem
          icon={<FiUsers size={20} />}
          text="Employees"
          collapsed={isCollapsed}
          active={activeView === "employees"}
          onClick={() => handleItemClick("employees")}
        />
      </nav>

      <div className="p-4 space-y-2 border-t border-white/20 shrink-0">
        <SidebarItem
          icon={<FiUser size={20} />}
          text="Profile"
          collapsed={isCollapsed}
          active={activeView === "profile"}
          onClick={() => handleItemClick("profile")}
        />
        <SidebarItem
          icon={<FiLogOut size={20} />}
          text="Logout"
          collapsed={isCollapsed}
          onClick={onLogoutRequest}
        />
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, text, collapsed, active, onClick }) => (
  <div className="relative group">
    <button
      onClick={onClick}
      className={`w-full flex items-center p-3 rounded-lg transition-colors ${
        active
          ? "bg-white/20 text-white"
          : "text-gray-300 hover:bg-white/10 hover:text-white"
      }`}
    >
      <span className="shrink-0">{icon}</span>
      {!collapsed && <span className="ml-3 text-sm font-medium">{text}</span>}
    </button>
    {collapsed && (
      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
        {text}
      </div>
    )}
  </div>
);

export default Sidebar;
