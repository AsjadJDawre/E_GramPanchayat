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
import { toast, Toaster } from "sonner";
import ViewOnlyWrapper from "./ViewOnlyWrapper";
import Sidebar from "./SidebarComponent";

const ViewApplicationViewOnly = () => {
  const [activeTab, setActiveTab] = useState("Applied");
  const [searchTerm, setSearchTerm] = useState("");
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const { username } = useParams();
  const navigate = useNavigate();

  // Demo data
  const demoApplications = [
    {
      _id: "DEMO-APP-001",
      scheme: "Birth Certificate",
      department: "Health Department",
      status: "Approved",
      createdAt: "2023-06-15T10:30:00Z",
      updatedAt: "2023-06-20T14:45:00Z",
      documents: ["birth_proof.pdf", "parent_id.pdf"]
    },
    {
      _id: "DEMO-APP-002",
      scheme: "Household Registration",
      department: "Rural Development",
      status: "Pending",
      createdAt: "2023-07-01T09:15:00Z",
      updatedAt: "2023-07-01T09:15:00Z",
      documents: ["residence_proof.pdf"]
    },
    {
      _id: "DEMO-APP-003",
      scheme: "NOC for Construction",
      department: "Town Planning",
      status: "Rejected",
      createdAt: "2023-06-10T11:20:00Z",
      updatedAt: "2023-06-12T16:30:00Z",
      reason: "Incomplete documentation",
      documents: ["land_deed.pdf", "construction_plan.pdf"]
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setApplications(demoApplications);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const getStatusCounts = () => {
    return {
      Applied: demoApplications.filter(app => app.status === "Pending").length,
      Approved: demoApplications.filter(app => app.status === "Approved").length,
      Rejected: demoApplications.filter(app => app.status === "Rejected").length
    };
  };

  const statusCounts = getStatusCounts();

  const handleTabClick = (status) => {
    setActiveTab(status);
    setSearchTerm("");
  };

  const handleViewApplication = (app) => {
    setSelectedApp(app);
    setCurrentAction("view");
    setModalOpen(true);
  };

  const handleDownload = (app) => {
    setSelectedApp(app);
    setCurrentAction("download");
    setModalOpen(true);
    toast.success("Certificate download simulated in demo mode");
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedApp(null);
    setCurrentAction(null);
  };

  const filteredApplications = demoApplications.filter((app) => {
    const matchesSearch = 
      app._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.scheme.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "Applied") return matchesSearch && app.status === "Pending";
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
    <ViewOnlyWrapper>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <Toaster richColors position="top-right" />

        <div className="application-dashboard bg-gray-50 min-h-screen p-6 flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-semibold text-gray-800"
              >
                My Applications
              </motion.h1>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                <FiEye className="mr-1" />
                View-Only Mode
              </motion.div>
            </div>
            
            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm p-4 mb-6"
            >
              <div className="relative">
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
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex overflow-x-auto border-b border-gray-200 mb-6"
            >
              {["Applied", "Approved", "Rejected"].map((status) => (
                <motion.button
                  key={status}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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
                </motion.button>
              ))}
            </motion.div>

            {/* Loading State */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-lg shadow-sm p-12 text-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"
                ></motion.div>
                <p className="mt-4 text-gray-600">Loading demo applications...</p>
              </motion.div>
            )}

            {/* Application Cards */}
            {!loading && filteredApplications.length > 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="grid gap-6"
              >
                <AnimatePresence>
                  {filteredApplications.map((app) => (
                    <motion.div
                      key={app._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
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
                              {app.status === "Rejected" && app.reason && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Reason: {app.reason}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row md:flex-col gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                              onClick={() => handleViewApplication(app)}
                            >
                              <FiFileText className="mr-2" />
                              View Application
                            </motion.button>
                            {app.status === "Approved" && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
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
                </AnimatePresence>
              </motion.div>
            ) : (
              !loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-lg shadow-sm p-12 text-center"
                >
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
                </motion.div>
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
                    <span className="ml-2 text-sm font-normal text-blue-600">(Demo)</span>
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    &times;
                  </button>
                </div>

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
                                <button
                                  onClick={() => toast.info("Document viewing is simulated in demo mode")}
                                  className="text-blue-600 hover:underline"
                                >
                                  {doc}
                                </button>
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
                        <div className="text-center p-6">
                          <FiFileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900">Certificate Preview</h3>
                          <p className="text-gray-600 mt-2">
                            This would display the generated certificate in the real application
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 text-center">
                        <p>Certificate for: {selectedApp.scheme}</p>
                        <p>Application ID: {selectedApp._id}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  {currentAction === "view" ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toast.info("Print functionality is simulated in demo mode")}
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <FiPrinter className="mr-2" />
                        Print Application
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toast.info("Share functionality is simulated in demo mode")}
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <FiShare2 className="mr-2" />
                        Share
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toast.success("Certificate download simulated in demo mode")}
                        className="flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <FiDownload className="mr-2" />
                        Download PDF
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toast.info("Print functionality is simulated in demo mode")}
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
    </ViewOnlyWrapper>
  );
};

export default ViewApplicationViewOnly;