import React, { useState } from "react";

const ViewApplication = () => {
  // State to track active tab and applications
  const [activeTab, setActiveTab] = useState("Applied");
  const apiUrl = import.meta.env.VITE_API_URL

  // Mock data for applications
  const applications = {
    Applied: [
      {
        id: "2425MNT1000232214",
        department: "Minority Development Department",
        scheme: "Scholarship for students of minority communities pursuing Higher and Professional courses (DTE)",
        status: "Under Review",
        action: "NA",
        viewForm: "View",
        benefitDetails: null,
      },
    ],
    Approved: [
      {
        id: "2425MNT1000232214",
        department: "Minority Development Department",
        scheme: "Scholarship for students of minority communities pursuing Higher and Professional courses (DTE)",
        status: "Under DDO",
        action: "NA",
        viewForm: "View",
        benefitDetails: "Check Redeem Status",
      },
      {
        id: "2425MNT1000232214",
        department: "Minority Development Department",
        scheme: "Scholarship for students of minority communities pursuing Higher and Professional courses (DTE)",
        status: "Under DDO",
        action: "NA",
        viewForm: "View",
        benefitDetails: "Check Redeem Status",
      },
    ],
    Rejected: [],
  };

  // Handle tab switching
  const handleTabClick = (status) => {
    setActiveTab(status);
  };

  return (
    <div className="application-status-container p-4">
      {/* Tabs */}
      <div className="tabs flex border-b">
        {["Applied", "Approved", "Rejected"].map((status) => (
          <button
            key={status}
            onClick={() => handleTabClick(status)}
            className={`tab px-4 py-2 ${
              activeTab === status ? "bg-orange-500 text-white" : "bg-gray-200"
            }`}
          >
            {status} Applications
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="table-container mt-4">
        {applications[activeTab]?.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Application ID</th>
                <th className="border p-2">Department Name</th>
                <th className="border p-2">Scheme Name</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Action</th>
                <th className="border p-2">View Form</th>
                <th className="border p-2">Download Certificate</th>
              </tr>
            </thead>
            <tbody>
              {applications[activeTab].map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="border p-2">{app.id}</td>
                  <td className="border p-2">{app.department}</td>
                  <td className="border p-2">{app.scheme}</td>
                  <td className="border p-2">{app.status}</td>
                  <td className="border p-2">{app.action}</td>
                  <td className="border p-2">
                    {app.viewForm && (
                      <a href="#" className="text-blue-500 underline">
                        {app.viewForm}
                      </a>
                    )}
                  </td>
                  <td className="border p-2">
                    {app.benefitDetails && (
                      <a href="#" className="text-blue-500 underline">
                        {app.benefitDetails}
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-gray-500 mt-4">
            No applications available for {activeTab} status.
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewApplication;
