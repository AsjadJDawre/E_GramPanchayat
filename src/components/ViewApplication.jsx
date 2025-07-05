import React, { useState } from "react";
import { FiFileText, FiDownload, FiClock, FiCheckCircle, FiXCircle, FiSearch } from "react-icons/fi";
import Sidebar from "./SidebarComponent";

const ViewApplication = () => {
  const [activeTab, setActiveTab] = useState("Applied");
  const [searchTerm, setSearchTerm] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;

  // Mock data for applications
  const applications = {
    Applied: [
      {
        id: "2425MNT1000232214",
        department: "Minority Development Department",
        scheme: "Scholarship for students of minority communities pursuing Higher and Professional courses (DTE)",
        status: "Under Review",
        appliedDate: "15 Mar 2024",
        lastUpdated: "20 Mar 2024",
        viewForm: "View",
        benefitDetails: null,
      },
    ],
    Approved: [
      {
        id: "2425MNT1000232215",
        department: "Minority Development Department",
        scheme: "Scholarship for students of minority communities pursuing Higher and Professional courses (DTE)",
        status: "Approved - Pending Disbursement",
        appliedDate: "10 Feb 2024",
        lastUpdated: "28 Feb 2024",
        viewForm: "View",
        benefitDetails: "Download Certificate",
      },
      {
        id: "2425MNT1000232216",
        department: "Social Welfare Department",
        scheme: "Senior Citizen Pension Scheme",
        status: "Approved - Benefits Disbursed",
        appliedDate: "05 Jan 2024",
        lastUpdated: "15 Jan 2024",
        viewForm: "View",
        benefitDetails: "Download Receipt",
      },
    ],
    Rejected: [
      {
        id: "2425MNT1000232217",
        department: "Education Department",
        scheme: "Merit Scholarship for College Students",
        status: "Rejected - Incomplete Documentation",
        appliedDate: "20 Feb 2024",
        lastUpdated: "05 Mar 2024",
        viewForm: "View",
        benefitDetails: "View Reason",
      },
    ],
  };

  const handleTabClick = (status) => {
    setActiveTab(status);
    setSearchTerm("");
  };

  const filteredApplications = applications[activeTab]?.filter(app => 
    app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.scheme.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status) => {
    if (status.includes("Approved")) return <FiCheckCircle className="text-green-600 mr-1" />;
    if (status.includes("Rejected")) return <FiXCircle className="text-red-600 mr-1" />;
    return <FiClock className="text-yellow-600 mr-1" />;
  };

  const getStatusColor = (status) => {
    if (status.includes("Approved")) return "bg-green-50 text-green-800";
    if (status.includes("Rejected")) return "bg-red-50 text-red-800";
    return "bg-yellow-50 text-yellow-800";
  };

  return (
    <div className="flex h-screen bg-gray-50">
  <Sidebar />

    <div className="application-dashboard bg-gray-50 min-h-screen p-6">
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
              {status} ({applications[status]?.length || 0})
            </button>
          ))}
        </div>

        {/* Application Cards */}
        {filteredApplications?.length > 0 ? (
          <div className="grid gap-6">
            {filteredApplications.map((app) => (
              <div key={app.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{app.scheme}</h3>
                      </div>
                      <div className="text-sm text-gray-600 mb-4">
                        <div className="flex items-center mb-1">
                          <span className="font-medium mr-2">Application ID:</span>
                          <span className="font-mono">{app.id}</span>
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
                          Applied: {app.appliedDate}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Last Updated: {app.lastUpdated}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row md:flex-col gap-2">
                      {app.viewForm && (
                        <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                          <FiFileText className="mr-2" />
                          View Application
                        </button>
                      )}
                      {app.benefitDetails && (
                        <button className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                          <FiDownload className="mr-2" />
                          {app.benefitDetails}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No {activeTab} Applications</h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === "Applied"
                ? "You haven't submitted any applications yet."
                : activeTab === "Approved"
                ? "You don't have any approved applications."
                : "You don't have any rejected applications."}
            </p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default ViewApplication;