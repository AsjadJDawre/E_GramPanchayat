import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";
import "boxicons/css/boxicons.min.css";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Test = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [applications, setApplication] = useState([]);
  const [activeTab, setActiveTab] = useState("Applied");
  const [pdfUrl, setPdfUrl] = useState(null); // State to store PDF URL
  const [selectedScheme, setSelectedScheme] = useState(null); // State for Scheme Name
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        console.log("Fetching applications...");
        const response = await axios.post(
          `${apiUrl}/api/user/getapplication`,
          {},
          { withCredentials: true }
        );
        setApplication(response.data.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };
    fetchApplications();
  }, []);

  const closeModal = () => {
    setModalOpen(false);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/logout`,
        {},
        { withCredentials: true }
      );
      console.log("this is the Logout response", response);
      toast.success("User logged out successfully!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed, please try again.");
    }
  };

  const handleTabClick = (status) => {
    setActiveTab(status);
  };

  const handleSchemeSelect = (schemeName) => {
    setSelectedScheme(schemeName); // Update state with selected Scheme Name
  };

  const handleDownload = async () => {
    if (!selectedScheme) {
      toast.error("Please select a scheme to generate the PDF.");
      return;
    }

    try {
      const res = await axios.post(
        `${apiUrl}/api/generatepdf`,
        { schemeName: selectedScheme }, // Send Scheme Name in the request
        {
          withCredentials: true,
          responseType: "blob", // Fetch as Blob
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

  const filteredApplications = applications.filter((app) => {
    if (activeTab === "Applied") return app.status === "Verified" || app.status === "Pending";
    if (activeTab === "Approved") return app.status === "Approved";
    if (activeTab === "Rejected") return app.status === "Rejected";
    return [];
  });

  return (
    <>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="logo-details">
          <i className="bx bx-user"></i>
          <div className="logo_name">EXAMPLE</div>
          <i className="bx bx-menu" id="btn" onClick={toggleSidebar}></i>
        </div>
        <ul className="nav-list" style={{ marginLeft: "-28px" }}>
          <li>
            <button className="links_name" onClick={handleLogout}>
              <i className="bx bx-log-out pl-[55px]"></i>
              <span className="text-white links_name pl-[22px]">
                {isOpen ? "LogOut" : ""}
              </span>
            </button>
            <span className="tooltip">LogOut</span>
          </li>
          <li>
            <Link to="/edit-profile">
              <i className="bx bx-edit"></i>
              <span className="links_name">Edit Profile</span>
            </Link>
            <span className="tooltip">Edit Profile</span>
          </li>
        </ul>
      </div>

      <div className="application-status-container p-4 ml-28">
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

        <div className="table-container mt-4">
          {filteredApplications.length > 0 ? (
            <table className="w-full border-collapse border-black">
              <thead>
                <tr className="bg-black-100">
                  <th className="border p-2">Application ID</th>
                  <th className="border p-2">Department Name</th>
                  <th className="border p-2">Scheme Name</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => (
                  <tr key={app.id}>
                    <td className="border p-2">{app.id}</td>
                    <td className="border p-2">{app.departmentName}</td>
                    <td className="border p-2">{app.schemeName}</td>
                    <td className="border p-2">
                      <button
                        className="bg-blue-500 text-white px-2 py-1"
                        onClick={() => handleSchemeSelect(app.schemeName)}
                      >
                        Select Scheme
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No applications available.</p>
          )}
        </div>

        <button
          onClick={handleDownload}
          className="bg-green-500 text-white px-4 py-2 mt-4"
        >
          Generate PDF
        </button>
      </div>
    </>
  );
};

export default Test;
