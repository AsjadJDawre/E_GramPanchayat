import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'sonner';
import axios from 'axios';
import '../styles/Sidebar.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Birth Certificates");
  const [apple, setApple] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [documentList, setDocumentList] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState("");
  const [message, setMessage] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({ 
  key: null, 
  direction: 'ascending' 
});

const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);


//remove this before production
const generateDummyData = () => {
  const categories = ["Birth Certificates", "Household", "NOC"];
  const statuses = ["Pending", "Approved", "Rejected"];
  const departments = [
    "Health Department", 
    "Municipal Corporation", 
    "Panchayat Office",
    "Revenue Department"
  ];
  const schemes = [
    "Birth Registration Scheme",
    "Household Survey Program",
    "NOC for Construction",
    "Public Welfare Initiative"
  ];

  return categories.map(category => {
    const data = Array.from({ length: 50 }, (_, i) => {
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const randomDept = departments[Math.floor(Math.random() * departments.length)];
      const randomScheme = schemes[Math.floor(Math.random() * schemes.length)];
      
      return {
        _id: `${category.substring(0, 3).toUpperCase()}${1000 + i}`,
        department: randomDept,
        scheme: randomScheme,
        status: randomStatus,
        action: "Take-Action",
        // Add any other required fields
        supportingDocuments: [
          {
            fileName: `${category} Document ${i + 1}.pdf`,
            filePath: `/documents/${category.toLowerCase()}/doc${i + 1}.pdf`
          }
        ]
      };
    });

    return {
      category,
      data
    };
  });
};

// Add this sorting function
const requestSort = (key) => {
  let direction = 'ascending';
  if (sortConfig.key === key && sortConfig.direction === 'ascending') {
    direction = 'descending';
  }
  setSortConfig({ key, direction });
};

// Add this sorting utility function
const sortedData = (data) => {
  if (!sortConfig.key) return data;

  return [...data].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });
};

  // Authentication check
  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await axios.post(`${apiUrl}/api/verify`, {}, { withCredentials: true });
        if (user.status === 200) {
          setIsAuthenticated(true);
        } else {
          navigate("/");
        }
      } catch (error) {
        navigate("/");
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    checkUser();
  }, []);

  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      if (!isAuthenticated) return;
       if (import.meta.env.VITE_USE_DUMMY_DATA === 'true') {
      const dummyData = generateDummyData();
      setApple(dummyData);
      return;
    }

      try {
        const response = await axios.get(`${apiUrl}/api/getapplication`, {}, { withCredentials: true });
        if (response.data && Array.isArray(response.data.data)) {
          setApple(response.data.data);
        } else {
          console.error("Expected 'data' to be an array but received:", response.data);
          setApple([]);
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
        setApple([]);
      }
    };
    fetchApplications();
  }, [isAuthenticated]);

  const [tabCounts, setTabCounts] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  
  useEffect(() => {
    const filtered = Array.isArray(apple)
      ? apple.filter((category) => category.category.toLowerCase() === activeTab.toLowerCase())
      : [];
    setFilteredData(filtered);

    if (Array.isArray(apple)) {
      const counts = apple.reduce((acc, category) => {
        acc[category.category] = category.data.length;
        return acc;
      }, {});
      setTabCounts(counts);
    }
  }, [apple, activeTab]);

  const handleLogout = async () => {
    try {
      await axios.post(`${apiUrl}/api/logout`, {}, { withCredentials: true });
      toast.success("Admin logged out successfully!");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed, please try again.");
    }
  };

  const openModal = async (appId) => {
    setSelectedAppId(appId);
    try {
      const response = await axios.get(`${apiUrl}/api/getDocuments/${appId}/${activeTab}`, {}, { withCredentials: true });
      setDocumentList(response.data.supportingDocuments || []);
      setModalOpen(true);
    } catch (error) {
      console.error("Error fetching documents:", error);
      setDocumentList([]);
      toast.error("Failed to load documents");
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedAppId(null);
    setDocumentList([]);
    setVerificationStatus("");
    setMessage("");
  };

  const handleVerify = async () => {
    if (!verificationStatus) {
      toast.error("Please select verification status");
      return;
    }

    setIsUpdatingStatus(true);
    try {
      const reqData = {
        appId: selectedAppId,
        status: verificationStatus,
        message: message,
        collection: activeTab
      };
      const response = await axios.post(`${apiUrl}/api/updatestatus`, reqData, { withCredentials: true });
      if (response.status === 200) {
        setIsUpdatingStatus(false);
        // localStorage.setItem("ProcesssedApplication", JSON.stringify(response.data));
        toast.success("Application Status updated successfully!");
        closeModal();
        // Refresh applications
        const refreshResponse = await axios.get(`${apiUrl}/api/getapplication`, {}, { withCredentials: true });
        if (refreshResponse.data && Array.isArray(refreshResponse.data.data)) {
          setApple(refreshResponse.data.data);
        }
      } else {
        toast.error("Application Status update failed!");
      }
    } catch (error) {
      console.error("Error verifying application:", error);
      toast.error("Failed to update status");
    }

    finally {
    setIsUpdatingStatus(false); // Hide loader
  }
    
  };

  const handleTabClick = (status) => {
    setActiveTab(status);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const StatusUpdateLoader = () => (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
      <div className="flex flex-col items-center">
        {/* Animated spinner */}
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        
        {/* Progress text */}
        <h3 className="text-lg font-medium text-gray-900 mb-2">Updating Status</h3>
        <p className="text-gray-600 text-center">
          Please wait while we process your request...
        </p>
        
        {/* Progress bar (optional) */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
          <div className="bg-blue-600 h-2.5 rounded-full animate-pulse" style={{width: '80%'}}></div>
        </div>
      </div>
    </div>
  </div>
);

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">You are not authorized to view this page.</p>
          <Link to="/" className="text-blue-500 hover:underline">Return to login</Link>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-gray-900 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img 
              src="/resources/home/images/logo.png" 
              alt="Logo" 
              className="h-8 w-8"
            />
            <span className="font-semibold">Admin Dashboard</span>
          </div>
          <div className="flex items-center space-x-6">
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-1 text-red-400 hover:text-red-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Dashboard Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Application Management</h1>
              <p className="text-gray-600">Review and manage all submitted applications</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center bg-blue-50 rounded-lg p-3">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Applications</p>
                  <p className="font-semibold text-gray-800">
                    {Object.values(tabCounts).reduce((a, b) => a + b, 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Application Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="flex overflow-x-auto">
            {["Birth Certificates", "Household", "NOC"].map((status) => (
              <button
                key={status}
                onClick={() => handleTabClick(status)}
                className={`px-6 py-4 font-medium text-sm focus:outline-none transition-colors whitespace-nowrap ${
                  activeTab === status 
                    ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50" 
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {status} 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  activeTab === status ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                }`}>
                  {tabCounts[status] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>

     {/* Applications Table */}
<div className="bg-white rounded-lg shadow-md overflow-hidden">
  {filteredData.length > 0 ? (
    filteredData.map((category) => (
      <div key={category.category}>
        {category.data.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="relative">
              {/* Header Table */}
              <div className="overflow-hidden" style={{ width: 'calc(100% - 17px)' }}>
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="sticky top-0 pl-6 pr-2 py-3 text-left text-xs  font-medium text-gray-500 uppercase tracking-wider bg-gray-50 z-10 w-[240px]">
                        Applicant ID
                      </th>
                      <th className="sticky top-0 pl-4 pr-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 z-10 w-[240px]">
                        Department
                      </th>
                      <th className="sticky top-0 pl-4 pr-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 z-10 w-[260px]">
                        Scheme
                      </th>
                      <th 
                        className="sticky top-0 pl-4 pr-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer bg-gray-50 z-10 w-[120px]"
                        onClick={() => requestSort('status')}
                      >
                        Status
                        {sortConfig.key === 'status' && (
                          <span className="ml-1">
                            {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th className="sticky top-0 pl-4 pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 z-10 w-[100px]">
                        Action
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>
              
              {/* Scrollable Body Table */}
              <div className="max-h-96 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedData(category.data).map((app) => {
                      // Set default values based on category
                      const department = app.department || 
                        (category.category === "Birth Certificates" ? "Ministry of Health and Family Welfare" :
                         category.category === "Household" ? "Ministry of Rural Development" :
                         "Department of Urban Development");
                      
                      const scheme = app.scheme || 
                        (category.category === "Birth Certificates" ? "National Birth Registration Program" :
                         category.category === "Household" ? "Pradhan Mantri Awas Yojana - Household Registration" :
                         "Simplified NOC Approval Initiative");

                      return (
                        <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                          <td className="pl-2 pr-2 py-4 text-sm font-medium text-gray-900 w-[200px] truncate" title={app._id}>
                            {app._id}
                          </td>
                          <td className="pl-2 pr-2 py-4 text-sm text-gray-500 w-[220px]">
                            {department}
                          </td>
                          <td className="pl-2 pr-2 py-4 text-sm text-gray-500 w-[280px]">
                            {scheme}
                          </td>
                          <td className="pl-2 pr-2 py-4 w-[120px]">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              app.status === "Approved" ? "bg-green-100 text-green-800" :
                              app.status === "Rejected" ? "bg-red-100 text-red-800" :
                              "bg-yellow-100 text-yellow-800"
                            }`}>
                              {app.status || "Pending"}
                            </span>
                          </td>
                          <td className="pl-2 pr-6 py-4 text-sm text-gray-500 w-[100px]">
                            <button
                              onClick={() => openModal(app._id)}
                              className="text-blue-600 hover:text-blue-900 font-medium"
                            >
                              Review
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          // ... rest of your code
          <div className="p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No applications</h3>
            <p className="mt-1 text-sm text-gray-500">There are currently no {category.category.toLowerCase()} applications.</p>
          </div>
        )}
      </div>
    ))
  ) : (
    <div className="p-8 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
      <p className="mt-1 text-sm text-gray-500">There are currently no applications in the system.</p>
    </div>
  )}
</div>
      </main>

      {/* Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Application Review: {selectedAppId}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="px-6 py-4">
              <h4 className="font-medium text-gray-700 mb-2">Supporting Documents</h4>
              {documentList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {documentList.map((doc, index) => (
                    <div key={index} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                        <a
                          href={doc.filePath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate"
                        >
                          {doc.fileName}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500 mb-6">
                  No documents available for this application
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Verification Status *</label>
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={verificationStatus}
                    onChange={(e) => setVerificationStatus(e.target.value)}
                    required
                  >
                    <option value="">Select status</option>
                    <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2">Message (Optional)</label>
              <textarea
                className="border p-2 w-full"
                rows="3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleVerify}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
            {isUpdatingStatus && <StatusUpdateLoader />}


</div>
</div>
      )  }  
     </div>
      <Toaster richColors position="top-right" /> 
      </>      
  )
}