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
import NocForm from "./services/NocForm";
import Forgot_Password from "./components/Forgot_Password";
import AdminLandingPage from "./components/AdminLanding";
import ViewApplication from "./components/ViewApplication";
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
<Route path="/viewApplication/:username" element={<ViewApplication />} />
         {/* <Route path="/viewApplication-test" element={<ViewApplication />} /> */}
        {/* <Route path="/sidebar" element={<SidebarComponent />} />  */}
        <Route path="/staff_dashboard" element={<StaffDashboard />} /> 
        <Route path="/birth_cert" element={<BirthCert />} />
        <Route path="/Admin" element={<AdminLandingPage />} />
        <Route path="/Admin/Dashboard" element={<AdminDashboard />} />
        <Route path="/test" element={<Test />} />
        <Route path="/household" element={<HouseholdCertificateForm />} />
        <Route path="/noc"  element={<NocForm />} />
        <Route path="/forgot-password"  element={<Forgot_Password />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
