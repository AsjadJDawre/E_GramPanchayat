import React, { useState } from "react";
import axios from "axios";
import "../styles/Register.css";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { FiUser, FiMail, FiLock, FiCalendar, FiHome, FiPhone, FiImage, FiBriefcase, FiGlobe, FiAlertCircle } from "react-icons/fi";

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

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

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
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({ ...prevData, profilePicture: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'username', 'email', 'password', 'firstName', 'lastName', 
      'dob', 'mobile', 'occupation', 'nationality', 'emergencyContact'
    ];
    
    // Check required fields
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });
    
    // Check address fields
    if (!formData.address.addressLine1) newErrors['address.addressLine1'] = 'Address Line 1 is required';
    if (!formData.address.city) newErrors['address.city'] = 'City is required';
    if (!formData.address.country) newErrors['address.country'] = 'Country is required';
    
    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (formData.mobile && !/^[6-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid Mobile Number';
    }
    if (formData.emergencyContact && !/^[6-9]\d{9}$/.test(formData.emergencyContact)) {
      newErrors.emergencyContact = 'Please enter a valid Mobile Number';
    }
    // Aadhar validation
if (formData.aadhar && !/^[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}$/.test(formData.aadhar)) {
      newErrors.aadhar = 'Please enter a valid Aadhar Number';
    }
    // Password validation
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'address') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === 'profilePicture' && formData[key]) {
          formDataToSend.append(key, formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const resp = await axios.post(`${apiUrl}/api/register`, formDataToSend, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const res = resp.data;
      if (res.status === 201) {
        toast.success("Registration successful!");
        sessionStorage.setItem("user", JSON.stringify(res.data));
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        toast.error(res.message || "Something went wrong!");
      }
    } catch (error) {
      if (error.response) {
        const { status, message } = error.response.data;
        if (status === 409) {
          toast.error("User already exists!");
        } else if (status === 400) {
          toast.error("All fields are required!");
        } else {
          toast.error(message || "Registration failed!");
        }
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <Toaster richColors position="top-right" />
      
      <div className="register-header">
        <h2>Create Your Account</h2>
        <p>Join our community by filling out the registration form below</p>
      </div>
      
      <form className="register-form" onSubmit={handleSubmit}>
        {/* Personal Information Section */}
        <div className="form-section">
          <h3 className="form-section-title">
            <FiUser /> Personal Information
          </h3>
          
          <div className="form-grid">
            <div className={`input-group ${errors.username ? 'error' : ''}`}>
              <label>Username*</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Choose a username"
              />
              {errors.username && <span className="error-message">{errors.username}</span>}
            </div>
            
            <div className={`input-group ${errors.email ? 'error' : ''}`}>
              <label>Email*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            
            <div className={`input-group ${errors.password ? 'error' : ''}`}>
              <label>Password*</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="At least 6 characters"
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
          </div>
        </div>
        
        {/* Name Information Section */}
        <div className="form-section">
          <h3 className="form-section-title">
            <FiUser /> Name Information
          </h3>
          
          <div className="form-grid">
            <div className={`input-group ${errors.firstName ? 'error' : ''}`}>
              <label>First Name*</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>
            
            <div className="input-group">
              <label>Middle Name</label>
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleInputChange}
              />
            </div>
            
            <div className={`input-group ${errors.lastName ? 'error' : ''}`}>
              <label>Last Name*</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>
          </div>
        </div>
        
        {/* Personal Details Section */}
        <div className="form-section">
          <h3 className="form-section-title">
            <FiCalendar /> Personal Details
          </h3>
          
          <div className="form-grid">
            <div className="input-group">
              <label>Gender</label>
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
            
            <div className={`input-group ${errors.dob ? 'error' : ''}`}>
              <label>Date of Birth*</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
              />
              {errors.dob && <span className="error-message">{errors.dob}</span>}
            </div>
            
            <div className="input-group">
              <label>Profile Picture</label>
              <div className="file-upload" onClick={() => document.getElementById('profilePicture').click()}>
                <input
                  type="file"
                  id="profilePicture"
                  name="profilePicture"
                  accept=".jpeg,.jpg,.png"
                  onChange={handleFileChange}
                />
                <div className="file-upload-label">
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="file-preview" />
                  ) : (
                    <>
                      <FiImage className="file-upload-icon" />
                      <span className="file-upload-text">Click to upload profile picture</span>
                      <span className="file-upload-hint">JPEG, JPG or PNG (Max 5MB)</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Address Section */}
        <div className="form-section">
          <h3 className="form-section-title">
            <FiHome /> Address Information
          </h3>
          
          <div className="form-grid">
            <div className={`input-group ${errors['address.addressLine1'] ? 'error' : ''}`}>
              <label>Address Line 1*</label>
              <input
                type="text"
                name="address.addressLine1"
                value={formData.address.addressLine1}
                onChange={handleInputChange}
                placeholder="Street address, P.O. box"
              />
              {errors['address.addressLine1'] && <span className="error-message">{errors['address.addressLine1']}</span>}
            </div>
            
            <div className="input-group">
              <label>Address Line 2</label>
              <input
                type="text"
                name="address.addressLine2"
                value={formData.address.addressLine2}
                onChange={handleInputChange}
                placeholder="Apartment, suite, unit, building, floor"
              />
            </div>
            
            <div className={`input-group ${errors['address.city'] ? 'error' : ''}`}>
              <label>City*</label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleInputChange}
              />
              {errors['address.city'] && <span className="error-message">{errors['address.city']}</span>}
            </div>
            
            <div className="input-group">
              <label>State/Province/Region</label>
              <input
                type="text"
                name="address.state"
                value={formData.address.state}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="input-group">
              <label>ZIP/Postal Code</label>
              <input
                type="text"
                name="address.zip"
                value={formData.address.zip}
                onChange={handleInputChange}
              />
            </div>
            
            <div className={`input-group ${errors['address.country'] ? 'error' : ''}`}>
              <label>Country*</label>
              <input
                type="text"
                name="address.country"
                value={formData.address.country}
                onChange={handleInputChange}
              />
              {errors['address.country'] && <span className="error-message">{errors['address.country']}</span>}
            </div>
          </div>
        </div>
        
        {/* Contact & Professional Information */}
        <div className="form-section">
          <h3 className="form-section-title">
            <FiPhone /> Contact & Professional Information
          </h3>
          
          <div className="form-grid">
            <div className={`input-group ${errors.mobile ? 'error' : ''}`}>
              <label>Mobile Number*</label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                placeholder="+1 (123) 456-7890"
              />
              {errors.mobile && <span className="error-message">{errors.mobile}</span>}
            </div>
            
            <div className="input-group">
              <label>Aadhar Number (Optional)</label>
              <input
                type="text"
                name="aadhar"
                value={formData.aadhar}
                onChange={handleInputChange}
              />
            </div>
            
            <div className={`input-group ${errors.occupation ? 'error' : ''}`}>
              <label>Occupation*</label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
              />
              {errors.occupation && <span className="error-message">{errors.occupation}</span>}
            </div>
            
            <div className={`input-group ${errors.nationality ? 'error' : ''}`}>
              <label>Nationality*</label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
              />
              {errors.nationality && <span className="error-message">{errors.nationality}</span>}
            </div>
            
            <div className={`input-group ${errors.emergencyContact ? 'error' : ''}`}>
              <label>Emergency Contact*</label>
              <input
                type="text"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleInputChange}
                placeholder="Name and phone number"
              />
              {errors.emergencyContact && <span className="error-message">{errors.emergencyContact}</span>}
            </div>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Registering...
            </>
          ) : "Register Now"}
        </button>
      </form>
    </div>
  );
};

export default Register;