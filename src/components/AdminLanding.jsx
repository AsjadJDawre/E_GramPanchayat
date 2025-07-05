import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'sonner';
import axios from 'axios';


const AdminLandingPage = () => {
  const [stats, setStats] = useState({
    birthCertificates: 0,
    household: 0,
    noc: 0,
    Pending: 0,
    Approved: 0,
    Rejected: 0
  });
  const [loading, setLoading] = useState(true);
  const [timeData, setTimeData] = useState([]);
const [isAuthenticated, setIsAuthenticated] = useState(null); // null = not yet checked
  
  const navigate = useNavigate()

  const apiUrl = import.meta.env.VITE_API_URL;

useEffect(() => {
  const checkUser = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/verify`, {}, { withCredentials: true });
      if (response.status === 200) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        navigate("/");
      }
    } catch (error) {
      console.log("Verification failed", error);
      setIsAuthenticated(false);
      navigate("/");
    }
  };

  checkUser();
}, []);

  // Mock data - replace with your API call
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock response
        const mockStats = {
          birthCertificates: 142,
          household: 87,
          noc: 53,
          Pending: 93,
          Approved: 156,
          Rejected: 33
        };
        
        const mockTimeData = [
          { name: 'Jan', applications: 45 },
          { name: 'Feb', applications: 78 },
          { name: 'Mar', applications: 56 },
          { name: 'Apr', applications: 89 },
          { name: 'May', applications: 112 },
          { name: 'Jun', applications: 94 },
        ];
        
        setStats(mockStats);
        setTimeData(mockTimeData);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load dashboard data');
        setLoading(false);
      }
    };
      fetchData();
}, [isAuthenticated]);
    
//    useEffect(() => {
//   if (!isAuthenticated) return;

//   const fetchData = async () => {
//     try {
//       const [typeStats, statusStats, monthlyStats] = await Promise.all([
//         axios.get(`${apiUrl}/api/dashboard/stats`, { withCredentials: true }),
//         axios.get(`${apiUrl}/api/dashboard/status-counts`, { withCredentials: true }),
//         axios.get(`${apiUrl}/api/dashboard/monthly-trends`, { withCredentials: true }),
//       ]);

//       setStats({
//         ...typeStats.data,
//         ...statusStats.data
//       });
//       setTimeData(monthlyStats.data);
//     } catch (error) {
//       toast.error('Failed to load dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   };



// fetchData();
//   }, [isAuthenticated]);

  // Chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
  const STATUS_COLORS = ['#FF8042', '#00C49F', '#FF4444'];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };


const logoutUser= async () => {

  try {
    const response = await axios.post(`${apiUrl}/api/logout`, {}, { withCredentials: true });
  if(response==200){
    toast.success("Admin logged out successfully!");
    setTimeout(() => navigate("/"), 2000);

  }
  } catch (error) {
toast.error("Logout failed, please try again.");
console.error("Logout error:", error.response?.status || error.message);
    
  }
 
}

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated === null) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Checking authentication...</p>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-gray-900 text-white shadow-lg">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img 
              src="/resources/home/images/logo.png" 
              alt="Government Logo" 
              className="h-10"
            />
            <div className="hidden md:block">
              <h1 className="text-xl font-bold">eGramSwaraj</h1>
              <p className="text-xs text-gray-300">Ministry of Panchayati Raj</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/admin/dashboard" className="text-blue-300 hover:text-blue-100 transition-colors">
              Applications
            </Link>
            <button className="text-red-300 hover:text-red-100 transition-colors" 
            onClick={logoutUser}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-6 mb-8 text-white"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome Back, Administrator</h1>
              <p className="opacity-90">Here's what's happening with applications today</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm opacity-80">Today's Date</p>
                <p className="font-semibold">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Total Applications</p>
                <h3 className="text-3xl font-bold text-gray-800">
                  {stats.birthCertificates + stats.household + stats.noc}
                </h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link 
                to="/admin/dashboard" 
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                View all applications
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Pending Review</p>
                <h3 className="text-3xl font-bold text-gray-800">{stats.Pending}</h3>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link 
                to="/admin/dashboard?status=pending" 
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                Review pending
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Processed Today</p>
                <h3 className="text-3xl font-bold text-gray-800">24</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link 
                to="/admin/dashboard?status=processed" 
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                View processed
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Application Types Pie Chart */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Application Types</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Birth Certificates', value: stats.birthCertificates },
                      { name: 'Household', value: stats.household },
                      { name: 'NOC', value: stats.noc }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    animationBegin={200}
                    animationDuration={1000}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {[0, 1, 2].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} applications`, 'Count']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Application Status Pie Chart */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Application Status</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Pending', value: stats.Pending },
                      { name: 'Approved', value: stats.Approved },
                      { name: 'Rejected', value: stats.Rejected }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    animationBegin={200}
                    animationDuration={1000}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {[0, 1, 2].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} applications`, 'Count']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Monthly Applications Bar Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Monthly Applications</h3>
            <select className="border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>2023</option>
              <option>2024</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={Array.isArray(timeData) ? timeData : []}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} applications`, 'Count']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Legend />
                <Bar 
                  dataKey="applications" 
                  name="Applications" 
                  fill="#4f46e5" 
                  animationBegin={400}
                  animationDuration={1500}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link 
              to="/admin/dashboard?category=birth-certificates" 
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
            >
              <div className="bg-blue-100 p-3 rounded-full inline-block mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-800">Birth Certificates</h4>
              <p className="text-sm text-gray-500 mt-1">{stats.birthCertificates} pending</p>
            </Link>
            
            <Link 
              to="/admin/dashboard?category=household" 
              className="p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center"
            >
              <div className="bg-green-100 p-3 rounded-full inline-block mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-800">Household</h4>
              <p className="text-sm text-gray-500 mt-1">{stats.household} pending</p>
            </Link>
            
            <Link 
              to="/admin/dashboard?category=noc" 
              className="p-4 border border-gray-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-colors text-center"
            >
              <div className="bg-yellow-100 p-3 rounded-full inline-block mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-800">NOC</h4>
              <p className="text-sm text-gray-500 mt-1">{stats.noc} pending</p>
            </Link>
            
            <Link 
              to="/admin/dashboard?status=pending" 
              className="p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-center"
            >
              <div className="bg-purple-100 p-3 rounded-full inline-block mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-800">All Pending</h4>
              <p className="text-sm text-gray-500 mt-1">{stats.Pending} to review</p>
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <img src="/resources/home/images/g20-logo.png" alt="Logo" className="h-8" />
              <div>
                <h3 className="font-bold">eGramSwaraj</h3>
                <p className="text-xs text-gray-400">Ministry of Panchayati Raj</p>
              </div>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Help</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-800 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} Government of India. All rights reserved.
          </div>
        </div>
      </footer>

      <Toaster richColors position="top-right" />
    </div>
  );
};

export default AdminLandingPage;