import React, { useState } from "react";
import axios from "axios";
import "../styles/Register.css";
import {useNavigate} from "react-router-dom";
import {toast , Toaster} from "sonner"
// import "react-toastify/dist/ReactToastify.css"; // Import toastify styles




const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "Male",
    dob: "",
    address: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
    mobile: "",
    aadhar: "",
    profilePicture: null,
    occupation: "",
    nationality: "",
    emergencyContact: "",
  });

  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("address")) {
      const addressField = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        address: { ...prevData.address, [addressField]: value },
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  // Handle file change (for profile picture)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({ ...prevData, profilePicture: file }));
  };

  const navigate = useNavigate();
  // Handle form submit (uploading data to Cloudinary and saving to Firebase)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resp = await axios.post(`${apiUrl}/api/register`,formData,{      withCredentials: true
      }, {headers: {'Content-Type': 'multipart/form-data'}});
      const res = resp.data;
      if (res.status === 201) {
        toast.success("Registration successful!", {
          position: "top-right",
          draggable: false,
        });

        const userData = res.data;
        sessionStorage.setItem("user", JSON.stringify(userData));

        // Redirect to the dashboard
        setTimeout(() => {
          navigate("/dashboard");
          
        },2000)
      } else {
        // If not status 201, show error
        toast.error(res.message || "Something went wrong!", {
          position: "top-right",
          draggable: false,
        });
      }
    } catch (error) {
      // Handle error in case of failed request
      if (error.response) {
        const { status, message } = error.response.data;

        if (status === 409) {
          toast.error("User already exists!", {
            position: "top-right",
            draggable: false,
          });
        } else if (status === 400) {
          toast.error("All fields are required!", {
            position: "top-right",
            draggable: false,
          });
        } else {
          toast.error(message || "Registration failed!", {
            position: "top-right",
            draggable: false,
          });
        }
      } else {
        toast.error("Something went wrong!", {
          position: "top-right",
          draggable: false,
        });
      }
    } finally {
      setLoading(false);
    }

  };



  return (

    <>
<Toaster richColors position="top-right" />
    
    <form className="register-form" onSubmit={handleSubmit}>
    <h2>Register</h2>
  
    {/* Username Field */}
    <div className="input-group">
      <label>Username:</label>
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleInputChange}
        placeholder="Enter your username"
      />
    </div>
  
    {/* Email Field */}
    <div className="input-group">
      <label>Email:</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Enter your email"
      />
    </div>
  
    {/* Password Field */}
    <div className="input-group">
      <label>Password:</label>
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        placeholder="Enter your password"
      />
    </div>
  
    {/* First Name Field */}
    <div className="input-group">
      <label>First Name:</label>
      <input
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleInputChange}
      />
    </div>
  
    {/* Middle Name Field */}
    <div className="input-group">
      <label>Middle Name:</label>
      <input
        type="text"
        name="middleName"
        value={formData.middleName}
        onChange={handleInputChange}
      />
    </div>
  
    {/* Last Name Field */}
    <div className="input-group">
      <label>Last Name (Surname):</label>
      <input
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleInputChange}
      />
    </div>
  
    {/* Gender Field */}
    <div className="input-group">
      <label>Gender:</label>
      <select
        name="gender"
        value={formData.gender}
        onChange={handleInputChange}
      >
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
    </div>
  
    {/* Date of Birth Field */}
    <div className="input-group">
      <label>Date of Birth:</label>
      <input
        type="date"
        name="dob"
        value={formData.dob}
        onChange={handleInputChange}
      />
    </div>
  
    {/* Address Fields */}
    <div className="input-group">
      <label>Permanent Address:</label>
      <input
        type="text"
        name="address.addressLine1"
        value={formData.address.addressLine1}
        onChange={handleInputChange}
        placeholder="Address Line 1"
      />
      <input
        type="text"
        name="address.addressLine2"
        value={formData.address.addressLine2}
        onChange={handleInputChange}
        placeholder="Address Line 2"
      />
      <input
        type="text"
        name="address.city"
        value={formData.address.city}
        onChange={handleInputChange}
        placeholder="City"
      />
      <input
        type="text"
        name="address.state"
        value={formData.address.state}
        onChange={handleInputChange}
        placeholder="State"
      />
      <input
        type="text"
        name="address.zip"
        value={formData.address.zip}
        onChange={handleInputChange}
        placeholder="ZIP Code"
      />
      <input
        type="text"
        name="address.country"
        value={formData.address.country}
        onChange={handleInputChange}
        placeholder="Country"
      />
    </div>
  
    {/* Mobile Number Field */}
    <div className="input-group">
      <label>Mobile Number:</label>
      <input
        type="text"
        name="mobile"
        value={formData.mobile}
        onChange={handleInputChange}
        placeholder="Mobile Number"
      />
    </div>
  
    {/* Aadhar Number Field */}
    <div className="input-group">
      <label>Aadhar Number (Optional):</label>
      <input
        type="text"
        name="aadhar"
        value={formData.aadhar}
        onChange={handleInputChange}
      />
    </div>
  
    {/* Profile Picture Field */}
    <div className="input-group">
      <label>Profile Picture:</label>
      <input
        type="file"
        name="profilePicture"
        accept=".jpeg,.jpg,.png"
        onChange={handleFileChange}
      />
    </div>
  
    {/* Occupation Field */}
    <div className="input-group">
      <label>Occupation:</label>
      <input
        type="text"
        name="occupation"
        value={formData.occupation}
        onChange={handleInputChange}
      />
    </div>
  
    {/* Nationality Field */}
    <div className="input-group">
      <label>Nationality:</label>
      <input
        type="text"
        name="nationality"
        value={formData.nationality}
        onChange={handleInputChange}
      />
    </div>
  
    {/* Emergency Contact Field */}
    <div className="input-group">
      <label>Emergency Contact:</label>
      <input
        type="text"
        name="emergencyContact"
        value={formData.emergencyContact}
        onChange={handleInputChange}
      />
    </div>
  
    {/* Submit Button */}
    <button type="submit" disabled={loading} className="submit-button">
      {loading ? "Registering..." : "Register"}
    </button>
  </form>
      <ToastContainer />

  </>
  );
};

export default Register;
