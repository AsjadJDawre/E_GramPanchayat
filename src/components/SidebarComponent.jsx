import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FiHome, 
  FiUser, 
  FiImage, 
  FiHelpCircle, 
  FiLogOut,
  FiSettings,
  FiBell,
  FiFileText,
  FiChevronDown,
  FiChevronRight
} from "react-icons/fi";
import { RiGovernmentLine } from "react-icons/ri";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleSubmenu = (menu) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  };

  const handleLogout = () => {
    // Add your logout logic here
    navigate("/login");
  };

  return (
    <div className={`flex flex-col bg-white border-r border-gray-200 h-full transition-all duration-300 ${isOpen ? "w-64" : "w-20"}`}>
      
      {/* Sidebar Header */}
      <div className="flex items-center  bg-white justify-between p-4 border-b border-gray-200">
        {isOpen ? (
          <div className="flex items-center">
            <RiGovernmentLine className="text-blue-600 text-2xl mr-2" />
            <h1 className="text-xl font-semibold text-gray-800">GovPortal</h1>
          </div>
        ) : (
          <RiGovernmentLine className="text-blue-600 text-2xl mx-auto" />
        )}
        <button 
          onClick={toggleSidebar}
          className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
        >
          {isOpen ? (
            <FiChevronRight className="text-lg" />
          ) : (
            <FiChevronRight className="text-lg rotate-180" />
          )}
        </button>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b   border-gray-200 flex items-center">
        <div className="bg-blue-100 text-blue-600 rounded-full w-10 h-10 flex items-center justify-center">
          <FiUser className="text-lg" />
        </div>
        {isOpen && (
          <div className="ml-3 overflow-hidden">
            <p className="font-medium text-gray-800 truncate">John Doe</p>
            <p className="text-xs text-gray-500 truncate">Citizen</p>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto bg-white ">
        <ul className="space-y-1 p-2">
          <li>
            <Link
              to="/dashboard"
              className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <FiHome className="text-lg" />
              {isOpen && <span className="ml-3">Dashboard</span>}
            </Link>
          </li>

          <li>
            <Link
              to="/viewApplication"
              className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <FiFileText className="text-lg" />
              {isOpen && <span className="ml-3">My Applications</span>}
            </Link>
          </li>

          <li>
            <button
              onClick={() => toggleSubmenu('profile')}
              className="flex items-center justify-between w-full p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <div className="flex items-center">
                <FiUser className="text-lg" />
                {isOpen && <span className="ml-3">Profile</span>}
              </div>
              {isOpen && (
                <FiChevronDown className={`transition-transform ${activeSubmenu === 'profile' ? 'rotate-180' : ''}`} />
              )}
            </button>
            {isOpen && activeSubmenu === 'profile' && (
              <ul className="ml-2 mt-1 space-y-1 pl-7">
                <li>
                  <Link
                    to="/profile/edit"
                    className="block p-2 rounded-lg text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    Edit Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profile/settings"
                    className="block p-2 rounded-lg text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    Account Settings
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <Link
              to="/notifications"
              className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <FiBell className="text-lg" />
              {isOpen && <span className="ml-3">Notifications</span>}
              {isOpen && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  3
                </span>
              )}
            </Link>
          </li>

          <li>
            <Link
              to="/gallery"
              className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <FiImage className="text-lg" />
              {isOpen && <span className="ml-3">Gallery</span>}
            </Link>
          </li>

          <li>
            <Link
              to="/help"
              className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <FiHelpCircle className="text-lg" />
              {isOpen && <span className="ml-3">Help & Support</span>}
            </Link>
          </li>
        </ul>
      </nav>

      {/* Footer/Settings Area */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <FiLogOut className="text-lg" />
          {isOpen && <span className="ml-3">Logout</span>}
        </button>

        {isOpen && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>GovPortal v2.1</span>
              <span>© 2023 Government</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;