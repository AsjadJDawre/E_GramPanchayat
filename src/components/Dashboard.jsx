import React, { useEffect ,useState} from "react";
import "../styles/Dashboard.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  console.log("Dashboard component rendered!");

  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await axios.post(`${apiUrl}/api/verify`, {}, { withCredentials: true });
  console.log("This is my reponse",response)
        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          navigate("/");
        }
      } catch (error) {
        navigate("/");
      } finally {
        setLoading(false);  // This ensures the loading state is updated correctly
      }
    };
  
    checkUser();
  }, []);
  useEffect(() => {
    console.log(`Updated state: loading=${loading}, isAuthenticated=${isAuthenticated}`);
  }, [loading, isAuthenticated]);
    

  // useEffect(() => {
  //   const verifyJWT = async () => {
  //     try {
  //       const response = await axios.get("/api/user/dashboard");
  //       if (response.status === 200) {
  //         // toast.success("Welcome to the dashboard!");
  //         console.log("Welcome Back")
  //       }
  //     } catch (error) {
  //       console.error("JWT verification failed:", error);
  //       toast.error("Unauthorized access. Redirecting to login...");
  //       navigate("/");
  //     }
  //   };

  //   verifyJWT();
  // }, [navigate]);



  const handleLogout = async () => {
    const resp = await axios
    .post(`${apiUrl}/api/logout`,{},{withCredentials:true})
    .then((response) => {
        console.log(response.data);
        toast.success("User logged out successfully!");

        // Delay navigation after showing the success message
        setTimeout(() => {
          navigate("/");
        }, 2000); // Wait 2 seconds before redirecting
      })
      .catch((error) => {
        console.error("Logout error:", error);
        toast.error("Logout failed, please try again.");
      });
  };
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
    <div style={{ fontFamily: 'Arial, sans-serif', margin: '0', padding: '0', width: '100%', color: '#000' }}>
      
      {/* Header */}
      <div style={{ backgroundColor: '#000', padding: '10px', color: '#FFA500', textAlign: 'center', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
          GOVERNMENT OF INDIA | MINISTRY OF PANCHAYATI RAJ
        </div>
        <div>
          <span style={{ color: '#FFFFFF', marginRight: '20px' }}>Languages</span>
          {/* <span style={{ color: '#FFFFFF', marginRight: '20px' }}>Screen Reader Access</span> */}
          <Link to={"/viewApplication"} style={{ color: '#FFFFFF', marginRight: '20px' }}>View Applications</Link>
          <span style={{ color: '#FFFFFF', marginRight: '20px' }}>Home</span>
          <button onClick={handleLogout} style={{ color: 'red' }}>LogOut</button>
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
            <div className="ml-[-16rem]" style={{ fontSize: '2em', fontWeight: 'bold', color: '#4B0082', marginBottom: '5px' }}>
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
      
      
      {/* Footer */}
      <div style={{ backgroundColor: '#D11B1B', padding: '10px', color: '#FFFFFF', textAlign: 'center' }}>
        <span className="ml-[-39rem]" style={{ fontWeight: 'bold', marginRight: '10px' }}>LATEST UPDATES</span>
        <span>Now integrated with Bhashini</span>
        <a href="https://mActionSoftAppDownloadLink.com" style={{ color: '#FFFFFF', textDecoration: 'none', marginLeft: '10px' }}>Download mActionSoft App</a>
      </div>
    </div>
 
   
      <section className="content">
  <Link to="/birth_cert">
      <section className="content">
        <div className="card">
          <img src="service1.jpg" alt="Service 1" />
          <div className="card-content">
            <h3>Birth Certificate Services</h3>
            <p>Apply for and download Birth Certificate.</p>
          </div>
        </div>
        </section>
        </Link>
        <div className="card">
          <img src="service2.jpg" alt="Service 2" />
          <div className="card-content">
            <h3>Community Development</h3>
            <p>Initiatives to improve local infrastructure and wellbeing.</p>
          </div>
        </div>

        <div className="card">
          <img src="service3.jpg" alt="Service 3" />
          <div className="card-content">
            <h3>Grievance Redressal</h3>
            <p>Submit complaints and track their resolution online.</p>
          </div>
        </div>
      </section>

      <footer  style={{ backgroundColor: '#D11B1B', padding: '10px', color: '#FFFFFF', textAlign: 'center' }} >
        <p className="text-white text-xl">&copy; 2024 E-Gram Panchayat. All rights reserved.</p>
      </footer>
      <Toaster richColors position="top-right" />
    </div>
    </>
    )
    : (
     <div className="text-center">
       <p>You are not authorized to access this page.</p>
     </div>
      
     )}
    </div>
  );
};

export default Dashboard;
