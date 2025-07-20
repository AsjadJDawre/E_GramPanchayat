import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FiFileText, 
  FiDownload, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle, 
  FiSearch,
  FiAlertCircle,
  FiEye,
  FiPrinter,
  FiShare2
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./SidebarComponent";
import axios from "axios";
import { toast, Toaster } from "sonner";

const ViewApplication = () => {
  const [activeTab, setActiveTab] = useState("Applied");
  const [searchTerm, setSearchTerm] = useState("");
  const [applications, setApplications] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [documentList, setDocumentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appDetailsLoading, setAppDetailsLoading] = useState(false);
  const { username } = useParams();
  const navigate = useNavigate();
  
  const apiUrl = import.meta.env.VITE_API_URL;

  // Calculate counts for each status
  const getStatusCounts = () => {
    const counts = {
      Applied: 0,
      Approved: 0,
      Rejected: 0
    };

    applications.forEach(app => {
      if (app.status === "Verified" || app.status === "Pending") {
        counts.Applied++;
      } else if (app.status === "Approved") {
        counts.Approved++;
      } else if (app.status === "Rejected") {
        counts.Rejected++;
      }
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${apiUrl}/api/user/getapplication`,
          {},
          { withCredentials: true }
        );
        // console.log("Applications:", response.data.data);
        setApplications(response.data.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast.error("Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  // const fetchApplicationDetails = async (appId) => {
  //   try {
  //     setAppDetailsLoading(true);
  //     const response = await axios.get(
  //       `${apiUrl}/api/user/application/${appId}`,
  //       { withCredentials: true }
  //     );
  //     console.log("Application details:", response.data.data);
  //     return response.data.data;
  //   } catch (error) {
  //     console.error("Error fetching application details:", error);
  //     toast.error("Failed to load application details");
  //     return null;
  //   } finally {
  //     setAppDetailsLoading(false);
  //   }
  // };

  const fetchDocuments = async (appId) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/user/documents/${appId}`,
        { withCredentials: true }
      );
      return response.data.documents || [];
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Failed to load documents");
      return [];
    }
  };

  const handleTabClick = (status) => {
    setActiveTab(status);
    setSearchTerm("");
  };

  const handleViewApplication = async (app) => {
    setSelectedApp(app);
    setCurrentAction("view");
    
    // Fetch additional details and documents
    // const [details, documents] = await Promise.all([
    //   fetchApplicationDetails(app._id),
    //   fetchDocuments(app._id)
    // ]);
    
    setSelectedApp(prev => ({
      ...prev,
      // ...details,
      // documents
    }));
    
    setModalOpen(true);
  };

  const handleDownload = async (app) => {
    setSelectedApp(app);
    setCurrentAction("download");
    
    try {
      const res = await axios.post(
        `${apiUrl}/api/generatepdf`,
        { row: app },
        {
          withCredentials: true,
          responseType: "blob",
        }
      );

      if (res.status === 200) {
        const pdfBlob = new Blob([res.data], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setPdfUrl(pdfUrl);
        setModalOpen(true);
        toast.success("PDF Generated Successfully");
      } else {
        toast.error("Failed to Generate PDF");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Error generating PDF");
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
    setSelectedApp(null);
    setCurrentAction(null);
  };

  const filteredApplications = applications.filter((app) => {
    // Apply search filter
    const matchesSearch = 
      app._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.scheme.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply status filter
    if (activeTab === "Applied") return matchesSearch && (app.status === "Verified" || app.status === "Pending");
    if (activeTab === "Approved") return matchesSearch && app.status === "Approved";
    if (activeTab === "Rejected") return matchesSearch && app.status === "Rejected";
    
    return matchesSearch;
  });

  const getStatusIcon = (status) => {
    if (status === "Approved") return <FiCheckCircle className="text-green-600 mr-1" />;
    if (status === "Rejected") return <FiXCircle className="text-red-600 mr-1" />;
    return <FiClock className="text-yellow-600 mr-1" />;
  };

  const getStatusColor = (status) => {
    if (status === "Approved") return "bg-green-50 text-green-800";
    if (status === "Rejected") return "bg-red-50 text-red-800";
    return "bg-yellow-50 text-yellow-800";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <Toaster richColors position="top-right" />

      <div className="application-dashboard bg-gray-50 min-h-screen p-6 flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">My Applications</h1>
          
          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by Application ID, Department or Scheme..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex overflow-x-auto border-b border-gray-200 mb-6">
            {["Applied", "Approved", "Rejected"].map((status) => (
              <button
                key={status}
                onClick={() => handleTabClick(status)}
                className={`flex items-center px-6 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === status
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {status === "Applied" && <FiClock className="mr-2" />}
                {status === "Approved" && <FiCheckCircle className="mr-2" />}
                {status === "Rejected" && <FiXCircle className="mr-2" />}
                {status} ({statusCounts[status]})
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your applications...</p>
            </div>
          )}

          {/* Application Cards */}
          {!loading && filteredApplications.length > 0 ? (
            <div className="grid gap-6">
              {filteredApplications.map((app) => (
                <motion.div
                  key={app._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{app.scheme}</h3>
                        </div>
                        <div className="text-sm text-gray-600 mb-4">
                          <div className="flex items-center mb-1">
                            <span className="font-medium mr-2">Application ID:</span>
                            <span className="font-mono">{app._id}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium mr-2">Department:</span>
                            <span>{app.department}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                            {getStatusIcon(app.status)}
                            {app.status}
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Applied: {formatDate(app.createdAt)}
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Last Updated: {formatDate(app.updatedAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row md:flex-col gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                          onClick={() => handleViewApplication(app)}
                        >
                          <FiFileText className="mr-2" />
                          View Application
                        </motion.button>
                        {app.status === "Approved" && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleDownload(app)}
                          >
                            <FiDownload className="mr-2" />
                            Download Certificate
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            !loading && (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <FiAlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No {activeTab} Applications
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {activeTab === "Applied"
                    ? "You haven't submitted any applications yet."
                    : activeTab === "Approved"
                    ? "You don't have any approved applications."
                    : "You don't have any rejected applications."}
                </p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Application Detail Modal */}
      <AnimatePresence>
        {modalOpen && selectedApp && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[90vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {currentAction === "view" ? "Application Details" : "Download Certificate"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>

              {appDetailsLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto">
                  {currentAction === "view" ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-medium text-gray-700">Application ID</h3>
                          <p className="text-gray-900">{selectedApp._id}</p>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-700">Scheme</h3>
                          <p className="text-gray-900">{selectedApp.scheme}</p>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-700">Department</h3>
                          <p className="text-gray-900">{selectedApp.department}</p>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-700">Status</h3>
                          <p className={`inline-flex items-center ${getStatusColor(selectedApp.status)} px-2 py-1 rounded-full`}>
                            {getStatusIcon(selectedApp.status)}
                            {selectedApp.status}
                          </p>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-700">Submitted On</h3>
                          <p className="text-gray-900">{formatDate(selectedApp.createdAt)}</p>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-700">Last Updated</h3>
                          <p className="text-gray-900">{formatDate(selectedApp.updatedAt)}</p>
                        </div>
                      </div>

                      {selectedApp.documents && selectedApp.documents.length > 0 && (
                        <div>
                          <h3 className="font-medium text-gray-700 mb-2">Supporting Documents</h3>
                          <ul className="space-y-2">
                            {selectedApp.documents.map((doc, index) => (
                              <li key={index} className="flex items-center">
                                <FiFileText className="text-gray-500 mr-2" />
                                <a
                                  href={`${apiUrl}/uploads/${doc.filePath}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  {doc.fileName}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {selectedApp.status === "Rejected" && selectedApp.reason && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4">
                          <h3 className="font-medium text-red-800">Reason for Rejection</h3>
                          <p className="text-red-700">{selectedApp.reason}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="bg-gray-100 w-full h-64 flex items-center justify-center mb-6">
                        {pdfUrl ? (
                          <iframe
                            src={pdfUrl}
                            title="Generated PDF"
                            className="w-full h-full"
                          ></iframe>
                        ) : (
                          <div className="text-center p-6">
                            <FiFileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">Certificate Preview</h3>
                            <p className="text-gray-600 mt-2">
                              Loading certificate preview...
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 text-center">
                        <p>Certificate for: {selectedApp.scheme}</p>
                        <p>Application ID: {selectedApp._id}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 flex justify-end space-x-3">
                {currentAction === "view" ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => window.print()}
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <FiPrinter className="mr-2" />
                      Print Application
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toast.info("Share functionality coming soon")}
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <FiShare2 className="mr-2" />
                      Share
                    </motion.button>
                  </>
                ) : (
                  <>
                    {pdfUrl && (
                      <motion.a
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        href={pdfUrl}
                        download={`certificate-${selectedApp._id}.pdf`}
                        className="flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <FiDownload className="mr-2" />
                        Download PDF
                      </motion.a>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => window.print()}
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <FiPrinter className="mr-2" />
                      Print
                    </motion.button>
                  </>
                )}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ViewApplication;