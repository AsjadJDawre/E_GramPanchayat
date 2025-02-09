import React, { useEffect, useState } from "react";
import axios from "axios";
import {toast , Toaster} from 'sonner';
import { useNavigate } from "react-router-dom";

const   HouseholdCertificateForm = () => {
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

  useEffect(() => {
    toast.warning("Please upload all document in pdf format only.");
  }, []);

  const apiUrl = import.meta.env.VITE_API_URL
const navigate = useNavigate()
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [files, setFiles] = useState({
    proofIdentity: null,
    proofResidence: null,
    affidavit: null,
    passportPhoto: null,
  });

  const handleFileChange = (e) => {
    const { id, files: fileList } = e.target;
    setFiles((prevFiles) => ({
      ...prevFiles,
      [id]: fileList[0], // Save the selected file
    }));
  };


  // Handle family member input changes
  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...formData.familyMembers];
    updatedMembers[index][field] = value;
    setFormData({ ...formData, familyMembers: updatedMembers });
  };

  // Add a new family member row
  const handleAddMember = () => {
    setFormData({
      ...formData,
      familyMembers: [...formData.familyMembers, { name: "", relationship: "", dob: "" }],
    });
  };

  // Remove a family member row
  const handleRemoveMember = (index) => {
    const updatedMembers = formData.familyMembers.filter((_, i) => i !== index);
    setFormData({ ...formData, familyMembers: updatedMembers });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Create a FormData object
    const submissionData = new FormData();
  
    // Append text fields from `formData` state
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "familyMembers") {
        // If `familyMembers` is an array, convert it to JSON string
        submissionData.append(key, JSON.stringify(value));
      } else {
        submissionData.append(key, value);
      }
    });
  
    // Append files from `files` state
    Object.entries(files).forEach(([key, file]) => {
      if (file) {
        submissionData.append(key, file);
      }
    });
  

    // console.log("Logging FormData contents:");
    // for (let pair of submissionData.entries()) {
    //     console.log(`${pair[0]}:`, pair[1]);
    // }

    try {
      const response = await axios.post(`${apiUrl}/api/househould`, submissionData, {withCredentials:true},{
        headers: {
          "Content-Type": "multipart/form-data",
        },
      } );
  
      if (response.status >= 200 && response.status < 300) {
        const data = await response
        toast.success(data.message || "Form submitted successfully!");
        setTimeout(()=>{
          navigate('/dashboard')
        })
      } else {
        const errorData = await response 
        // console.log(errorData);
        toast.error(errorData.error || "Form submission failed!");
      }
    //   console.log("Form submitted successfully:", response.data);
    } catch (error) {
      toast.error("Error submitting form. Please try again.");
    //   console.error("Error submitting form:", error.response?.data || error.message);
    }
  };
  
  

  return (
    <form
      className="p-6 bg-white rounded-lg shadow-md max-w-screen-md mx-auto border border-gray-300"
      onSubmit={handleSubmit}
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Household Certificate Registration
      </h1>

      {/* Applicant Details */}
      <div className="mb-4">
        <label className="block text-gray-600 font-medium mb-1">Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          placeholder="Enter your full name"
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-600 font-medium mb-1">Date of Birth</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-600 font-medium mb-1">Gender</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-600 font-medium mb-1">Address</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Enter your address"
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>

      {/* Family Member Details */}
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Family Member Details</h2>
      {formData.familyMembers.map((member, index) => (
        <div key={index} className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-gray-600 font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={member.name}
              onChange={(e) => handleMemberChange(index, "name", e.target.value)}
              placeholder="Enter name"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-1">Relationship</label>
            <input
              type="text"
              value={member.relationship}
              onChange={(e) => handleMemberChange(index, "relationship", e.target.value)}
              placeholder="Enter relationship"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-1">Date of Birth</label>
            <input
              type="date"
              value={member.dob}
              onChange={(e) => handleMemberChange(index, "dob", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="button"
            onClick={() => handleRemoveMember(index)}
            className="bg-red-500 text-white hover:bg-red-600 font-medium mt-2 px-4 py-2 rounded-lg shadow-md transition duration-200"
            >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddMember}
        className="text-blue-600 hover:text-blue-800 font-medium mb-6"
      >
        + Add Another Member
      </button>

      {/* Contact Information */}
      <div className="mb-4">
        <label className="block text-gray-600 font-medium mb-1">Phone Number</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="Enter your phone number"
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-600 font-medium mb-1">Email Address</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Purpose */}
      <div className="mb-4">
        <label className="block text-gray-600 font-medium mb-1">Purpose of Application</label>
        <textarea
          name="purpose"
          value={formData.purpose}
          onChange={handleInputChange}
          placeholder="Enter purpose of the application"
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>

      <div className="w-full mt-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Upload Supporting Documents</h2>

      {/* Proof of Identity */}
      <div className="mb-6">
        <label htmlFor="proofIdentity" className="block text-gray-600 font-medium mb-2">
          Proof of Identity (Aadhaar, Voter ID, PAN Card)
        </label>
        <input
          type="file"
          id="proofIdentity"
          accept=".pdf"
          onChange={handleFileChange}
          className="block w-full border border-gray-300 rounded-md p-2 text-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Proof of Residence */}
      <div className="mb-6">
        <label htmlFor="proofResidence" className="block text-gray-600 font-medium mb-2">
          Proof of Residence (Electricity Bill, Ration Card)
        </label>
        <input
          type="file"
          id="proofResidence"
          onChange={handleFileChange}
          className="block w-full border border-gray-300 rounded-md p-2 text-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Affidavit */}
      <div className="mb-6">
        <label htmlFor="affidavit" className="block text-gray-600 font-medium mb-2">
          Affidavit Declaring Household Members
        </label>
        <input
          type="file"
          id="affidavit"
          onChange={handleFileChange}
          className="block w-full border border-gray-300 rounded-md p-2 text-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Passport-Sized Photograph */}
      <div className="mb-6">
        <label htmlFor="passportPhoto" className="block text-gray-600 font-medium mb-2">
          Passport-Sized Photograph
        </label>
        <input
          type="file"
          id="passportPhoto"
          onChange={handleFileChange}
          className="block w-full border border-gray-300 rounded-md p-2 text-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
      </div>






      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
        onSubmit={()=>alert("Form submitted successfully!")}
      >
        Submit Application
      </button>
      <Toaster  richColors toastOptions={{ duration: 3000 }}   position="top-right" />
    </form>
  );
}

export default HouseholdCertificateForm;