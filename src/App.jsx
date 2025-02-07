import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import SidebarComponent from "./components/SidebarComponent";
import BirthCert from "./services/birth_cert";

import "react-toastify/dist/ReactToastify.css";
import StaffDashboard from "./components/StaffDashboard";
import Test from "./components/Test";
import AdminDashboard from "./components/AdminDashboard";
import NotFound from "./components/NotFound";
import HouseholdCertificateForm from "./services/houseHold"
function App() {
  // useEffect(() => {
  //   axios.get('/api/dashboard').then((response) => {
  //     console.log(response.data);
  //   }).
  //   catch((error) => {
  //     console.log(error);
  //   });
  // })
 
  return (
<>



    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/viewApplication" element={<SidebarComponent />} />
        {/* <Route path="/sidebar" element={<SidebarComponent />} />  */}
        <Route path="/staff_dashboard" element={<StaffDashboard />} /> 
        <Route path="/birth_cert" element={<BirthCert />} />
        <Route path="/Admin" element={<AdminDashboard />} />
        <Route path="/test" element={<Test />} />
        <Route path="/household" element={<HouseholdCertificateForm />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
