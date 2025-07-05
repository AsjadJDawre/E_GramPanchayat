import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FiFileText, 
  FiDownload, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle, 
  FiSearch,
  FiAlertCircle
} from "react-icons/fi";
import Sidebar from "./SidebarComponent";
import axios from "axios";
import { toast, Toaster } from "sonner";

const ViewApplication = () => {
  const [activeTab, setActiveTab] = useState("Applied");
  const [searchTerm, setSearchTerm] = useState("");
  const [applications, setApplications] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(true);
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

  const handleTabClick = (status) => {
    setActiveTab(status);
    setSearchTerm("");
  };

  const handleDownload = async (row) => {
    setSelectedRow(row);
    try {
      const res = await axios.post(
        `${apiUrl}/api/generatepdf`,
        { row },
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
                <div key={app._id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
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
                        <button 
                          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                          onClick={() => {
                            // Implement view form functionality if needed
                            toast.info("View form functionality would be implemented here");
                          }}
                        >
                          <FiFileText className="mr-2" />
                          View Application
                        </button>
                        {app.status === "Approved" && (
                          <button 
                            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleDownload(app)}
                          >
                            <FiDownload className="mr-2" />
                            Download Certificate
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
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

      {/* PDF Modal */}
      {modalOpen && pdfUrl && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Generated Certificate</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                src={pdfUrl}
                title="Generated PDF"
                className="w-full h-full border border-gray-300"
                style={{ minHeight: '500px' }}
              ></iframe>
            </div>
            <div className="mt-4 flex justify-end">
              <a
                href={pdfUrl}
                download={`certificate-${selectedRow?._id || 'document'}.pdf`}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <FiDownload className="inline mr-2" />
                Download PDF
              </a>
              <button
                onClick={closeModal}
                className="ml-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewApplication;