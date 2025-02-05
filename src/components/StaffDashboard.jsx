import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast, Toaster } from 'sonner';
import { useNavigate } from 'react-router-dom';

  function StaffDashboard() {
    const [activeTab, setActiveTab] = useState("birth Certificates");
    const [apple, setApple] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAppId, setSelectedAppId] = useState(null); // Store the selected app._id
    const [documentList, setDocumentList] = useState([]); // Store the documents for the selected app
    const [verificationStatus, setVerificationStatus] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
  
    const navigate = useNavigate();
    useEffect(() => {
      const checkUser = async () => {
        try {
          const user = await axios.post("/api/verify", {}, { withCredentials: true });
  
          if (user.status === 200) {
            setIsAuthenticated(true);
          } else {
            setTimeout(() => {
              navigate("/");
            }, 2000);
          }
        } catch (error) {
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } finally {
          setTimeout(() => {
            setLoading(false);
          }, 500); // Ensure spinner is visible for at least 500ms
        }
      };
  
      checkUser();
    }, [navigate]);
  
  
  
    useEffect(() => {
      if (!isAuthenticated) return;

      const fetchApplications = async () => {
        try {
          const response = await axios.get("/api/getapplication");
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
    }, []);
  
    const fetchDocuments = async (appId) => {
      try {
        const response = await axios.get(`/api/getDocuments/${appId}/${activeTab}`);
        setDocumentList(response.data.supportingDocuments || []);
        console.log(response.data.supportingDocuments);
      } catch (error) {
        console.error("Error fetching documents:", error);
        setDocumentList([]);
      }
    };
  
    const handleTabClick = (status) => {
      setActiveTab(status);
    };
  
    const openModal = (appId) => {
      setSelectedAppId(appId);
      fetchDocuments(appId); // Fetch related documents
      setModalOpen(true);
    };
  
    const closeModal = () => {
      setModalOpen(false);
      setSelectedAppId(null);
      setDocumentList([]);
      setVerificationStatus("");
      setMessage("");
    };
  
    const handleVerify = async() => {
      const reqData={
        appId: selectedAppId,
        status: verificationStatus,
        message: message,
        collection : activeTab
      };
      console.log({
        appId: selectedAppId,
        status: verificationStatus,
        message: message,
      });

      try {
        const response = await axios.post("/api/verify", reqData);


        if(response.status ===200){
          toast.success("Application verified successfully!");
        }
        else {
          toast.error("Application verification failed!");
        }
          // You can send this data to your backend for further processing
        closeModal();
      } catch (error) {
        console.error("Error verifying application:", error);
        
      }
    };
  
    const filteredData = Array.isArray(apple)
      ? apple.filter((category) => category.category.toLowerCase() === activeTab.toLowerCase())
      : [];

      if (loading) {
        return (
          <div className="flex justify-center items-center h-screen">
            <div className="spinner-border animate-spin h-8 w-8 border-t-4 border-blue-600 rounded-full"></div>
          </div>
        );
      }

  return (
    <div className="wrapper">
    {
        isAuthenticated?  ( 
<>
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

    <div className="application-status-container p-4  ml-28" >
      {/* Tabs */}
      <div className="tabs flex border-b">
        {["Birth Certificates", "Household", "NOC"].map((status) => (
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
        {filteredData.length > 0 ? (
          filteredData.map((category) => (
            <div key={category.category}>
              <h3 className="text-lg font-semibold mb-4">{category.category}</h3>
              {category.data.length > 0 ? (
                <table className="w-full border-collapse border-black">
                  <thead>
                    <tr className="bg-black-100">
                      <th className="border p-2">Applicant ID</th>
                      <th className="border p-2">Department Name</th>
                      <th className="border p-2">Scheme Name</th>
                      <th className="border p-2">Status</th>
                      <th className="border p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.data.map((app) => (
                      <tr key={app.applicantId} className="hover:bg-gray-50">
                        <td className="border p-2">{app._id}</td>
                        <td className="border p-2">{app.department || "N/A"}</td>
                        <td className="border p-2">{app.scheme || "N/A"}</td>
                        <td className="border p-2">{app.status || "N/A"}</td>
                        <td className="border p-2">
                          <button
                            onClick={() => openModal(app._id)}
                            className="text-blue-500 underline"
                          >
                            {app.action || "N/A"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center text-gray-500 mt-4">
                  No applications available for {category.category}.
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-4">
            No applications available.
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/2">
            <h2 className="text-xl font-semibold mb-4">Documents for Application: {selectedAppId}</h2>
            <ul className="mb-4">
              {documentList.length > 0 ? (
                documentList.map((doc, index) => (
                  <li key={index}>
                    <a
                      href={doc.filePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {doc.fileName}
                    </a>
                  </li>
                ))
              ) : (
                <p>No documents available.</p>
              )}
            </ul>
            <div className="mb-4">
              <label className="block font-medium mb-2">Verification Status</label>
              <select
                className="border p-2 w-full"
                value={verificationStatus}
                onChange={(e) => setVerificationStatus(e.target.value)}
              >
                <option value="">Select</option>
                <option value="Verified">Verified</option>
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
      )}

    </div>

    <Toaster richColors />
</> 

)
: (
 <div className="text-center">
   <p>You are not authorized to access this page.</p>
 </div>
  
 )}
</div>)
}

export default StaffDashboard