import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css"; // Place your CSS code in Sidebar.css
import "boxicons/css/boxicons.min.css";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SidebarComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [applications, setApplication] = useState([]);
  const [activeTab, setActiveTab] = useState("Applied");
  const [pdfUrl, setPdfUrl] = useState(null); // State to store PDF URL
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        console.log("Fetching applications...");
        const response = await axios.post(`${apiUrl}/api/user/getapplication`,{},{withCredentials:true});
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
      const response = await axios.post(`${apiUrl}/api/logout`,{},{withCredentials:true})
      console.log("this is the Logout response",response)
      toast.success("User logged out successfully!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed, please try again.");
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (activeTab === "Applied") return app.status === "Verified" || app.status === "Pending";
    if (activeTab === "Approved") return app.status === "Approved";
    if (activeTab === "Rejected") return app.status === "Rejected";
    return [];
  });

  const handleTabClick = (status) => {
    setActiveTab(status);
  };

  const handleDownload = async () => {
    try {
      const res = await axios.post(`${apiUrl}/api/generatepdf`, {},{withCredentials:true}, { responseType: "blob" }); // Fetch as Blob
      if (res.status === 200) {
        const pdfBlob = new Blob([res.data], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob); // Create a temporary URL
        setPdfUrl(pdfUrl); // Set the URL to the state
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

  return (
    <>
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="logo-details">
        <i className="bx bx-user"></i>
        <div className="logo_name">EXAMPLE</div>
        <i className="bx bx-menu" id="btn" onClick={toggleSidebar}></i>
      </div>
      <ul className="nav-list" style={{ marginLeft: '-28px' }}>
        <li>
          <div className="profile-details">
            {/* <img
              src="/default_profile.jpg" // Replace with Firebase logic if necessary
              alt="profileImg"
            /> */}
            <div className="name_job">
              {/* <span className="name">Username</span> Replace with Firebase user name
              <span className="job">User Role</span> Optional */}
            </div>
          </div>
        </li>
        <li>
          <Link to="/dashboard">
            <i className="bx bx-home"></i>
            <span className="links_name">Home</span>
          </Link>
          <span className="tooltip">Home</span>
        </li>
        <li>
          <button className ="links_name"
        onClick={handleLogout}>
            <i className="bx bx-log-out pl-[55px]"></i>
            <span className="text-white links_name pl-[22px]">{isOpen ? "LogOut":""}</span>
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
        <li>
          <Link to="/gallery">
            <i className="bx bx-images"></i>
            <span className="links_name">Gallery</span>
          </Link>
          <span className="tooltip">Gallery</span>
        </li>
        <li>
          <Link to="/help">
            <i className="bx bx-question-mark"></i>
            <span className="links_name">Help&Support</span>
          </Link>
          <span className="tooltip">Help&Support</span>
        </li>
      </ul>
      
    </div>
    
    <div style={{ fontFamily: 'Arial, sans-serif', margin: '0', padding: '0', width: '100%', color: '#000' }}>
      
      {/* Header */}
      <div style={{ backgroundColor: '#000', padding: '10px', color: '#FFA500', textAlign: 'center', display: 'flex', justifyContent: 'space-between' }}>
        <div className='ml-20' style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
          GOVERNMENT OF INDIA | MINISTRY OF PANCHAYATI RAJ
        </div>
        <div>
          <span style={{ color: '#FFFFFF', marginRight: '20px' }}>Languages</span>
          <span style={{ color: '#FFFFFF', marginRight: '20px' }}>Screen Reader Access</span>
          <Link to={'/dashboard'} style={{ color: '#FFFFFF', marginRight: '20px' }}>Home</Link>
          <span style={{ color: '#FFFFFF' }}>Login</span>
        </div>
      </div>
      
      {/* Main Content */}
<div 
  style={{
    background: 'linear-gradient(135deg, #fee185, #f9be00)', 
    padding: '20px', 
    position: 'relative', 
    textAlign: 'center'
  }}
>

<div style={{ fontFamily: 'Arial, sans-serif', margin: '0', padding: '0', width: '100%', color: '#000' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#F7C000', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Emblem and Heading */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="resources/home/images/logo.png"
            alt="Government Emblem"
            style={{ height: '50px', marginRight: '15px' }}
          />
          <div>
            <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#4B0082', marginBottom: '5px' }}>
              eGramSwaraj
            </div>
            <div style={{ fontSize: '1em', color: '#4B0082' }}>
              Simplified Work Based Accounting Application for Panchayati Raj
            </div>
          </div>
        </div>

        {/* G20 Logo */}
        <div>
          <img
            src="../../public/resources/home/images/g20-logo.png"
            alt="G20 Logo"
            style={{ height: '50px' }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div style={{ backgroundColor: '#FFF3D1', padding: '20px' }}>
        <div style={{ width: '80%', margin: '0 auto', fontSize: '1em', lineHeight: '1.5' }}>
          To strengthen e-Governance in Panchayati Raj Institutions (PRIs) across the country, Ministry of Panchayati Raj (MoPR) has launched eGramSwaraj, a user-friendly web-based portal. eGramSwaraj aims to bring in better transparency in the decentralised planning, progress reporting and work-based accounting.
        </div>
      </div>
    </div>
    </div>
    </div>


    <div className="application-status-container p-4 ml-28">
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
        {filteredApplications.length > 0 ? (
          <table className="w-full border-collapse border-black">
            <thead>
              <tr className="bg-black-100">
                <th className="border p-2">Application ID</th>
                <th className="border p-2">Department Name</th>
                <th className="border p-2">Scheme Name</th>
                <th className="border p-2">Status</th>
                {/* <th className="border p-2">Action</th>
                <th className="border p-2">View Form</th> */}
                <th className="border p-2">Download Certificate</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50">
                  <td className="border p-2">{app._id}</td>
                  <td className="border p-2">{app.department}</td>
                  <td className="border p-2">{app.scheme}</td>
                  <td className="border p-2">{app.status}</td>
                  <td className="hover:text-blue-500 cursor-pointer   border p-2"   onClick={handleDownload}>{app.status ==='Approved' ? 'Download Certificate' : 'NA'}</td>
                  {/* <td className="border p-2">
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
                  </td> */}
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

<Toaster richColors position="top-right" />

    {pdfUrl &&modalOpen && (

       <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/2">
          <h2>Generated PDF</h2>
          <iframe
            src={pdfUrl}
            title="Generated PDF"
            style={{ width: "100%", height: "500px", border: "1px solid #ccc" }}
          ></iframe>
     
        <button
                onClick={closeModal}
                className="bg-red-500 animate-pulse text-white px-4 py-2 rounded mr-2"
              >
                Close
              </button>
              </div>
        </div>
      )}
      </>
  );
};

export default SidebarComponent;
