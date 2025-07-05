import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import "../index.css"

const HouseholdCertificateForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "",
    address: "",
    phone: "",
    email: "",
    purpose: "",
    familyMembers: [],
  });

  const [files, setFiles] = useState({
    proofIdentity: null,
    proofResidence: null,
    affidavit: null,
    passportPhoto: null,
  });

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    toast.warning("📌 Please upload all documents in PDF format only.");
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { id, files: fileList } = e.target;
    setFiles((prev) => ({
      ...prev,
      [id]: fileList[0],
    }));
  };

  const handleMemberChange = (index, field, value) => {
    const updated = [...formData.familyMembers];
    updated[index][field] = value;
    setFormData({ ...formData, familyMembers: updated });
  };

  const handleAddMember = () => {
    setFormData({
      ...formData,
      familyMembers: [...formData.familyMembers, { name: "", relationship: "", dob: "" }],
    });
  };

  const handleRemoveMember = (index) => {
    const updated = formData.familyMembers.filter((_, i) => i !== index);
    setFormData({ ...formData, familyMembers: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "familyMembers") {
        submissionData.append(key, JSON.stringify(value));
      } else {
        submissionData.append(key, value);
      }
    });

    Object.entries(files).forEach(([key, file]) => {
      if (file) submissionData.append(key, file);
    });

    try {
      const response = await axios.post(`${apiUrl}/api/househould`, submissionData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("✅ Form submitted successfully!");
      setTimeout(() => navigate("/dashboard"), 2500);
    } catch (error) {
      toast.error("❌ Submission failed. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 sm:p-8 bg-white rounded-xl shadow-md max-w-3xl mx-auto mt-10 space-y-6 border border-gray-200"
    >
      <h1 className="text-3xl font-bold text-center text-blue-800">Household Certificate Application</h1>

      {/* Applicant Info */}
      <section>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Applicant Details</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <input name="fullName" onChange={handleInputChange} value={formData.fullName} placeholder="Full Name" className="form-input" required />
          <input name="dob" type="date" onChange={handleInputChange} value={formData.dob} className="form-input" required />
          <select name="gender" onChange={handleInputChange} value={formData.gender} className="form-input" required>
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <input name="phone" onChange={handleInputChange} value={formData.phone} placeholder="Phone Number" className="form-input" required />
          <input name="email" onChange={handleInputChange} value={formData.email} placeholder="Email Address" type="email" className="form-input" />
        </div>
        <textarea name="address" onChange={handleInputChange} value={formData.address} placeholder="Address" className="form-input mt-4" rows={3}></textarea>
      </section>

      {/* Family Members */}
      <section>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-700">Family Members</h2>
          <button
            type="button"
            onClick={handleAddMember}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            + Add Member
          </button>
        </div>
        {formData.familyMembers.map((member, index) => (
          <div key={index} className="grid sm:grid-cols-4 gap-4 items-end my-4">
            <input
              value={member.name}
              onChange={(e) => handleMemberChange(index, "name", e.target.value)}
              placeholder="Full Name"
              className="form-input"
              required
            />
            <input
              value={member.relationship}
              onChange={(e) => handleMemberChange(index, "relationship", e.target.value)}
              placeholder="Relationship"
              className="form-input"
              required
            />
            <input
              value={member.dob}
              type="date"
              onChange={(e) => handleMemberChange(index, "dob", e.target.value)}
              className="form-input"
              required
            />
            <button
              type="button"
              onClick={() => handleRemoveMember(index)}
              className="text-red-600 hover:text-red-800 font-semibold text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </section>

      {/* Purpose */}
      <section>
        <h2 className="text-xl font-semibold text-gray-700">Purpose</h2>
        <textarea
          name="purpose"
          value={formData.purpose}
          onChange={handleInputChange}
          placeholder="State the purpose of this application"
          className="form-input mt-2"
          rows={3}
        ></textarea>
      </section>

      {/* File Uploads */}
      <section>
        <h2 className="text-xl font-semibold text-gray-700">Documents</h2>
        <p className="text-sm text-gray-500 mb-2">Only PDF format accepted.</p>
        {[
          { id: "proofIdentity", label: "Proof of Identity (Aadhaar, PAN, Voter ID)" },
          { id: "proofResidence", label: "Proof of Residence (Electricity Bill, Ration Card)" },
          { id: "affidavit", label: "Affidavit Declaring Household Members" },
          { id: "passportPhoto", label: "Passport Size Photograph" },
        ].map((doc) => (
          <div key={doc.id} className="mb-4">
            <label htmlFor={doc.id} className="block text-gray-600 font-medium mb-1">
              {doc.label}
            </label>
            <input
              type="file"
              id={doc.id}
              accept=".pdf"
              onChange={handleFileChange}
              className="form-input"
            />
          </div>
        ))}
      </section>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
      >
        Submit Application
      </button>

      <Toaster position="top-right" richColors />
    </form>
  );
};

export default HouseholdCertificateForm;
