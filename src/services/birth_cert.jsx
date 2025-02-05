import React, { useState } from "react";
import axios from "axios";
import "../styles/BirthCert.css";
import { toast,Toaster } from "sonner";
import { useNavigate } from "react-router-dom";

const BirthCert = () => {
  const [formData, setFormData] = useState({
    childFirstName: "",
    childMiddleName: "",
    childLastName: "",
    fatherName: "",
    motherName: "",
    dateOfBirth: "",
    placeOfBirth: "",
    proofOfBirth: "",
    parentIdentityProof: "",
    parentAddressProof: "",
  });

  const [files, setFiles] = useState({
    proofOfBirth: null,
    parentIdentityProof: null,
    parentAddressProof: null,
    marriageCertificate: null,
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e, fieldName) => {
    const selectedFiles = e.target.files;
    setFiles((prevState) => ({
      ...prevState,
      [fieldName]: selectedFiles,
    }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submissionData = new FormData();

      // Append form data
      Object.entries(formData).forEach(([key, value]) => {
        submissionData.append(key, value);
      });

      // Append files
      Object.entries(files).forEach(([key, value]) => {
        if (value) {
          for (let i = 0; i < value.length; i++) {
            submissionData.append(`${key}Files`, value[i]);
          }
        }
      });

      const response = await axios.post(
        "/api/user/services/birth-cert",
        submissionData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // console.log(response.status); // Check the response structure

      
    
      // console.log("Response:", response.data.message);
      toast.success("Application submitted successfully!");
      setTimeout(() => {
        navigate('/dashboard');
      },1800)
    } 
    
  
  catch (error) {
    if (error.status === 410) {toast.warning("An application for this child already exists.");}
      console.error("Error submitting application:", error);
      // alert("Failed to submit the application. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
    <form onSubmit={handleSubmit} className="birth-cert-form">
      <h2 className="form-heading">Birth Certificate Application</h2>
      <div className="input-group">
        <label>Child's First Name:</label>
        <input
          type="text"
          name="childFirstName"
          value={formData.childFirstName}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="input-group">
        <label>Child's Middle Name:</label>
        <input
          type="text"
          name="childMiddleName"
          value={formData.childMiddleName}
          onChange={handleInputChange}
        />
      </div>
      <div className="input-group">
        <label>Child's Last Name:</label>
        <input
          type="text"
          name="childLastName"
          value={formData.childLastName}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="input-group">
        <label>Father's Name:</label>
        <input
          type="text"
          name="fatherName"
          value={formData.fatherName}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="input-group">
        <label>Mother's Name:</label>
        <input
          type="text"
          name="motherName"
          value={formData.motherName}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="input-group">
        <label>Date of Birth:</label>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="input-group">
        <label>Place of Birth:</label>
        <input
          type="text"
          name="placeOfBirth"
          value={formData.placeOfBirth}
          onChange={handleInputChange}
          required
        />
      </div>

    

      <div className="file-upload-group">

      <h3 className="document-heading">Mandatory Documents</h3>

      <div className="file-upload-group">
        <label>
          Proof of Birth:
          <select
            name="proofOfBirth"
            value={formData.proofOfBirth}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-purple-500 text-gray-700"
          >
            <option value="" disabled>
              Select Proof of Birth
            </option>
            <option value="birthCertificate">Birth Certificate</option>
            <option value="aadhaar">Aadhaar Card</option>
            <option value="passport">Passport</option>
            <option value="hospitalSummary">
              Hospital Discharge Summary
            </option>
            <option value="schoolLeaving">School Leaving Certificate</option>
          </select>
        </label>
        <input
          type="file"
          multiple
          name="proofOfBirth"
          accept="image/*,application/pdf"
          onChange={(e) => handleFileChange(e, "proofOfBirth")}
        />
      </div>

      <div className="file-upload-group">
        <label>
          Identity Proof of Parents:
          <select
            name="parentIdentityProof"
            value={formData.parentIdentityProof}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
          >
            <option value="" disabled>
              Select Identity Proof
            </option>
            <option value="aadhaar">Aadhaar Card</option>
            <option value="passport">Passport</option>
            <option value="voterId">Voter ID Card (EPIC)</option>
            <option value="drivingLicense">Driving License</option>
            <option value="panCard">PAN Card</option>
          </select>
        </label>
        <input
          type="file"
          multiple
          name="parentIdentityProof"
          accept="image/*,application/pdf"
          onChange={(e) => handleFileChange(e, "parentIdentityProof")}
        />
      </div>

      <div className="file-upload-group">
        <label>
          Proof of Address of Parents:
          <select
            name="parentAddressProof"
            value={formData.parentAddressProof}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-700"
          >
            <option value="" disabled>
              Select Address Proof
            </option>
            <option value="aadhaar">Aadhaar Card</option>
            <option value="passport">Passport</option>
            <option value="voterId">Voter ID Card (EPIC)</option>
            <option value="drivingLicense">Driving License</option>
            <option value="utilityBill">
              Utility Bill (Electricity/Water/Gas)
            </option>
          </select>
        </label>
        <input
          type="file"
          multiple
          name="parentAddressProof"
          accept="image/*,application/pdf"
          onChange={(e) => handleFileChange(e, "parentAddressProof")}
        />
      </div>

      <div className="file-upload-group">
        <label>Marriage Certificate:</label>
        <input
          type="file"
          name="marriageCertificate"
          
          accept="image/*,application/pdf"
          onChange={(e) => handleFileChange(e, "marriageCertificate")}
        />
      </div>

      <button type="submit" disabled={loading} className="submit-btn">
        {loading ? "Submitting..." : "Submit Application"}
      </button>
      </div>
    </form>

    <Toaster />
    </>
  );
};

export default BirthCert;
