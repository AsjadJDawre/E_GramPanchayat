import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";
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
  Loader2
} from "lucide-react";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

 useEffect(() => {
  const checkUser = async () => {
    try {
      const [authResponse, userResponse] = await Promise.all([
        axios.post(`${apiUrl}/api/verify`, {}, { withCredentials: true }),
        axios.get(`${apiUrl}/api/user`, { withCredentials: true }),
      ]);

      if (authResponse.status === 200) {
        setIsAuthenticated(true);
        setUserData(userResponse.data.data);
        console.log('username', userResponse.data.data.username);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  checkUser();
}, []);


  const handleLogout = async () => {
    try {
      await axios.post(`${apiUrl}/api/logout`, {}, { withCredentials: true });
      toast.success("Logged out successfully!");
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="mt-4 text-lg text-gray-600">Loading your dashboard...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">You are not authorized to view this page.</p>
          <Link 
            to="/" 
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <ShieldCheck className="h-8 w-8 text-indigo-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">eGramSwaraj</h1>
                <p className="text-xs text-gray-500">Ministry of Panchayati Raj, Government of India</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-4">
                <Link     to={`/viewApplication/${encodeURIComponent(userData?.username || "User")}`}
 className="flex items-center text-gray-700 hover:text-indigo-600">
                  <FileText className="h-5 w-5 mr-1" />
                  <span>Applications</span>
                </Link>
                <button className="flex items-center text-gray-700 hover:text-indigo-600">
                  <Globe className="h-5 w-5 mr-1" />
                  <span>Languages</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-sm font-medium text-gray-900">
                    {userData?.username || "User"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {userData?.email || "user@example.com"}
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
      </header>

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {userData?.username?.split(' ')[0] || 'User'}!</h2>
            <p className="text-lg text-gray-800 max-w-3xl mx-auto">
              Simplified Work Based Accounting Application for Panchayati Raj
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link 
                to="/birth_cert" 
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-200"
              >
                <div className="p-6 flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Baby className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Birth Certificate</h4>
                    <p className="text-sm text-gray-500">Apply for or download birth certificate</p>
                  </div>
                </div>
              </Link>

              <Link 
                to="/household" 
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-200"
              >
                <div className="p-6 flex items-start">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <House className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Household Registration</h4>
                    <p className="text-sm text-gray-500">Pradhan Mantri Awas Yojana registration</p>
                  </div>
                </div>
              </Link>

              <Link 
                to="/noc" 
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-200"
              >
                <div className="p-6 flex items-start">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <FileCheck className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">NOC Approval</h4>
                    <p className="text-sm text-gray-500">Simplified NOC approval process</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="p-6">
                <div className="flex items-center text-gray-500 mb-4">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>No recent activity</span>
                </div>
                <Link 
                 to={`/viewApplication/${encodeURIComponent(userData?.username || "User")}`} 
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  View all applications →
                </Link>
              </div>
            </div>
          </div>

          {/* Announcements */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Announcements</h3>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="p-6">
                <div className="flex items-start mb-4">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">System Maintenance</h4>
                    <p className="text-sm text-gray-500">
                      Scheduled maintenance on July 10th from 2:00 AM to 4:00 AM. Services may be temporarily unavailable.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <Globe className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Bhashini Integration</h4>
                    <p className="text-sm text-gray-500">
                      Now supporting multiple Indian languages through Bhashini platform.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm">
                © {new Date().getFullYear()} eGramSwaraj. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm hover:text-yellow-400">Privacy Policy</a>
              <a href="#" className="text-sm hover:text-yellow-400">Terms of Service</a>
              <a href="#" className="text-sm hover:text-yellow-400">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>

      <Toaster richColors position="top-right" />
    </div>
  );
};

export default Dashboard;