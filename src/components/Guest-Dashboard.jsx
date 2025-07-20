import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Home, 
  FileText, 
  User, 
  LogOut, 
  Globe, 
  ShieldCheck, 
  Baby, 
  House, 
  FileCheck, 
  Clock,
  AlertCircle,
  Loader2,
  Eye
} from "lucide-react";
import ViewOnlyWrapper from "./ViewOnlyWrapper";

const DashboardViewOnly = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    username: "Demo User",
    email: "demo@egrampanchayat.in",
    village: "Sample Gram Panchayat",
    district: "Demo District"
  });

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Simulate logout
  const handleLogout = (e) => {
    e.preventDefault();
    // Show toast notification
    const event = new CustomEvent('showToast', {
      detail: {
        type: 'info',
        message: 'This is a view-only demo. No actual logout occurs.'
      }
    });
    window.dispatchEvent(event);
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-screen bg-gray-50"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 text-blue-600" />
        </motion.div>
        <motion.p 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-lg text-gray-600"
        >
          Loading demo dashboard...
        </motion.p>
      </motion.div>
    );
  }

  return (
    <ViewOnlyWrapper>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header with subtle animation */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white shadow-sm"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <motion.div whileHover={{ scale: 1.1 }}>
                  <ShieldCheck className="h-8 w-8 text-indigo-600" />
                </motion.div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">eGramSwaraj</h1>
                  <p className="text-xs text-gray-500">Ministry of Panchayati Raj, Government of India</p>
                </div>
              </div>
              
<div className="hidden md:flex items-center space-x-4">
  <Link 
    to="/guest-application" 
    className="flex items-center text-gray-700 hover:text-indigo-600"
  >
    <FileText className="h-5 w-5 mr-1" />
    <span>Applications</span>
  </Link>
  <button 
    className="flex items-center text-gray-700 hover:text-indigo-600"
    onClick={(e) => {
      e.preventDefault();
      // Show demo toast
      const event = new CustomEvent('showToast', {
        detail: {
          type: 'info',
          message: 'Language selection is disabled in demo mode'
        }
      });
      window.dispatchEvent(event);
    }}
  >
    <Globe className="h-5 w-5 mr-1" />
    <span>Languages</span>
  </button>
                
                <div className="flex items-center space-x-2">
                  <div className="hidden md:flex flex-col text-right">
                    <span className="text-sm font-medium text-gray-900">
                      {userData.username}
                    </span>
                    <span className="text-xs text-gray-500">
                      {userData.email}
                    </span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center px-3 py-1 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    <LogOut className="h-5 w-5 mr-1" />
                    <span className="hidden md:inline">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Welcome Banner with gradient animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-yellow-400 to-yellow-500"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <motion.h2 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-3xl font-bold text-gray-900 mb-2"
              >
                Welcome back, {userData.username.split(' ')[0]}!
              </motion.h2>
              <p className="text-lg text-gray-800 max-w-3xl mx-auto">
                Simplified Work Based Accounting Application for Panchayati Raj
              </p>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 inline-flex items-center px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium"
              >
                <Eye className="w-4 h-4 mr-1" />
                View-Only Demo Mode
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Quick Actions with staggered animations */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: <Baby className="h-6 w-6 text-blue-600" />,
                    title: "Birth Certificate",
                    description: "Apply for or download birth certificate",
                    bg: "bg-blue-100",
                    link: "#"
                  },
                  {
                    icon: <House className="h-6 w-6 text-green-600" />,
                    title: "Household Registration",
                    description: "Pradhan Mantri Awas Yojana registration",
                    bg: "bg-green-100",
                    link: "#"
                  },
                  {
                    icon: <FileCheck className="h-6 w-6 text-purple-600" />,
                    title: "NOC Approval",
                    description: "Simplified NOC approval process",
                    bg: "bg-purple-100",
                    link: "#"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ y: -5 }}
                  >
                    <Link 
                      to={item.link}
                      onClick={(e) => e.preventDefault()}
                      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-200 block"
                    >
                      <div className="p-6 flex items-start">
                        <div className={`${item.bg} p-3 rounded-full mr-4`}>
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recent Activity Section */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <div className="p-6">
                  <div className="flex items-center text-gray-500 mb-4">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>Your recent activity will appear here</span>
                  </div>
                  <div className="space-y-4">
                    {[
                      { id: 1, text: "Birth Certificate application submitted", time: "2 days ago", status: "Pending" },
                      { id: 2, text: "Household Registration approved", time: "1 week ago", status: "Completed" }
                    ].map((item) => (
                      <motion.div 
                        key={item.id}
                        whileHover={{ x: 5 }}
                        className="flex justify-between items-center border-b border-gray-100 pb-3"
                      >
                        <div>
                          <p className="text-sm font-medium">{item.text}</p>
                          <p className="text-xs text-gray-500">{item.time}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.status === "Pending" 
                            ? "bg-yellow-100 text-yellow-800" 
                            : "bg-green-100 text-green-800"
                        }`}>
                          {item.status}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                  <button 
                    onClick={(e) => e.preventDefault()}
                    className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                  >
                    View all applications
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Announcements with pulse animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">Announcements</h3>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <div className="p-6">
                  {[
                    {
                      icon: <AlertCircle className="h-5 w-5 text-yellow-600" />,
                      title: "System Maintenance",
                      content: "Scheduled maintenance on July 10th from 2:00 AM to 4:00 AM. Services may be temporarily unavailable."
                    },
                    {
                      icon: <Globe className="h-5 w-5 text-blue-600" />,
                      title: "Bhashini Integration",
                      content: "Now supporting multiple Indian languages through Bhashini platform."
                    }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.01 }}
                      className={`flex items-start ${index === 0 ? 'mb-4' : ''}`}
                    >
                      <motion.div 
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className={`${index === 0 ? 'bg-yellow-100' : 'bg-blue-100'} p-2 rounded-full mr-3`}
                      >
                        {item.icon}
                      </motion.div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-500">{item.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-gray-800 text-white py-6"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-sm">
                  © {new Date().getFullYear()} eGramSwaraj. All rights reserved.
                </p>
              </div>
              <div className="flex space-x-6">
                <button 
                  onClick={(e) => e.preventDefault()}
                  className="text-sm hover:text-yellow-400"
                >
                  Privacy Policy
                </button>
                <button 
                  onClick={(e) => e.preventDefault()}
                  className="text-sm hover:text-yellow-400"
                >
                  Terms of Service
                </button>
                <button 
                  onClick={(e) => e.preventDefault()}
                  className="text-sm hover:text-yellow-400"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </motion.footer>
      </div>
    </ViewOnlyWrapper>
  );
};

export default DashboardViewOnly;