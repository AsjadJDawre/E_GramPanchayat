import React, { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import "../styles/BirthCert.css";

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
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, fieldName) => {
    const selectedFiles = e.target.files;
    setFiles((prev) => ({ ...prev, [fieldName]: selectedFiles }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submissionData = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        submissionData.append(key, value)
      );
      Object.entries(files).forEach(([key, value]) => {
        if (value) {
          for (let i = 0; i < value.length; i++) {
            submissionData.append(`${key}Files`, value[i]);
          }
        }
      });

      const response = await axios.post(
        `${apiUrl}/api/user/services/birth-cert`,
        submissionData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Application submitted successfully!");
      setTimeout(() => navigate("/dashboard"), 1800);
    } catch (error) {
      if (error?.response?.status === 410) {
        toast.warning("An application for this child already exists.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
      console.error("Submit Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="birth-cert-form">
        <h2 className="form-heading">Apply for Birth Certificate</h2>

        <section className="form-section">
          <h4>Child Details</h4>
          <div className="grid-3">
            <div className="input-group">
              <label>First Name</label>
              <input name="childFirstName" value={formData.childFirstName} onChange={handleInputChange} required />
            </div>
            <div className="input-group">
              <label>Middle Name</label>
              <input name="childMiddleName" value={formData.childMiddleName} onChange={handleInputChange} />
            </div>
            <div className="input-group">
              <label>Last Name</label>
              <input name="childLastName" value={formData.childLastName} onChange={handleInputChange} required />
            </div>
          </div>

          <div className="grid-2">
            <div className="input-group">
              <label>Father's Name</label>
              <input name="fatherName" value={formData.fatherName} onChange={handleInputChange} required />
            </div>
            <div className="input-group">
              <label>Mother's Name</label>
              <input name="motherName" value={formData.motherName} onChange={handleInputChange} required />
            </div>
          </div>

          <div className="grid-2">
            <div className="input-group">
              <label>Date of Birth</label>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} required />
            </div>
            <div className="input-group">
              <label>Place of Birth</label>
              <input name="placeOfBirth" value={formData.placeOfBirth} onChange={handleInputChange} required />
            </div>
          </div>
        </section>

        <section className="form-section">
          <h4>Document Uploads</h4>

          <div className="input-group">
            <label>Proof of Birth</label>
            <select name="proofOfBirth" value={formData.proofOfBirth} onChange={handleInputChange} required>
              <option value="" disabled>Select Proof</option>
              <option value="birthCertificate">Birth Certificate</option>
              <option value="aadhaar">Aadhaar</option>
              <option value="passport">Passport</option>
              <option value="hospitalSummary">Hospital Summary</option>
              <option value="schoolLeaving">School Leaving</option>
            </select>
            <input type="file" multiple accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, "proofOfBirth")} />
          </div>

          <div className="input-group">
            <label>Parent Identity Proof</label>
            <select name="parentIdentityProof" value={formData.parentIdentityProof} onChange={handleInputChange} required>
              <option value="" disabled>Select Identity Proof</option>
              <option value="aadhaar">Aadhaar</option>
              <option value="passport">Passport</option>
              <option value="voterId">Voter ID</option>
              <option value="drivingLicense">Driving License</option>
              <option value="panCard">PAN</option>
            </select>
            <input type="file" multiple accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, "parentIdentityProof")} />
          </div>

          <div className="input-group">
            <label>Parent Address Proof</label>
            <select name="parentAddressProof" value={formData.parentAddressProof} onChange={handleInputChange} required>
              <option value="" disabled>Select Address Proof</option>
              <option value="aadhaar">Aadhaar</option>
              <option value="passport">Passport</option>
              <option value="rationCard">Ration Card</option>
              <option value="voterId">Voter ID</option>
              <option value="drivingLicense">Driving License</option>
              <option value="utilityBill">Utility Bill</option>
            </select>
            <input type="file" multiple accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, "parentAddressProof")} />
          </div>

          <div className="input-group">
            <label>Marriage Certificate (if any)</label>
            <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, "marriageCertificate")} />
          </div>
        </section>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
      <Toaster richColors position="top-right" />
    </>
  );
};

export default BirthCert;
