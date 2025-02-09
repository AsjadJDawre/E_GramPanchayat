import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "sonner";

export default function NocForm() {
  const [applicantName, setApplicantName] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [plotNumber, setPlotNumber] = useState("");
  const [documents, setDocuments] = useState({});

  // Consolidated Business Details State
  const [businessDetails, setBusinessDetails] = useState({
    businessName: "",
    purpose: "",
    location: "",
  });

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    toast.warning("Fill each detail carefully and upload only PDF files", {
      duration: 5000,
    });
  }, []);

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setDocuments((prev) => ({
        ...prev,
        [fieldName]: file, // Dynamically add file to the corresponding field name
      }));
    } else {
      toast.error("Only PDF files are allowed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !applicantName ||
      !aadhaarNumber ||
      !contactNumber ||
      !plotNumber ||
      !businessDetails.businessName ||
      !businessDetails.purpose ||
      !businessDetails.location ||
      Object.keys(documents).length === 0
    ) {
      toast.error("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("applicantName", applicantName);
    formData.append("aadhaarNumber", aadhaarNumber);
    formData.append("contactNumber", contactNumber);
    formData.append("plotNumber", plotNumber);
    formData.append("businessName", businessDetails.businessName);
    formData.append("purpose", businessDetails.purpose);
    formData.append("location", businessDetails.location);

    for (const [key, value] of Object.entries(documents)) {
      formData.append(key, value); // Append each file with its respective field name
    }

    console.log("Submitted Data:", {
      applicantName,
      aadhaarNumber,
      contactNumber,
      plotNumber,
      ...businessDetails,
      documents,
    });

    try {
      const response = await axios.post(
        `${apiUrl}/api/noc`,
        formData,
        {
          withCredentials: true, // Include this here
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      // console.log(response)
      if (response.status >= 200 && response.status < 300) {
        const message = response.data.message; // Corrected the typo here
        toast.success(message);
      }
      
    } catch (error) {
      toast.error("Failed to submit NOC.");
    }
  };

  const handleBusinessDetailChange = (field, value) => {
    setBusinessDetails((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-lg space-y-4">
      <Toaster richColors position="top-right" />
      <h1 className="text-2xl font-bold text-gray-800 mb-4">NOC Application Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Applicant Details */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Applicant Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Aadhaar Number</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
              value={aadhaarNumber}
              onChange={(e) => setAadhaarNumber(e.target.value)}
              placeholder="Enter your Aadhaar number"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Contact Number</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="Enter your contact number"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Plot Number</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
              value={plotNumber}
              onChange={(e) => setPlotNumber(e.target.value)}
              placeholder="Enter plot number"
            />
          </div>

          {/* Business Details */}
          <div>
            <label className="block text-gray-700 font-medium">Business Name</label>
            <input
              type="text"
              value={businessDetails.businessName}
              onChange={(e) => handleBusinessDetailChange("businessName", e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter business name"
            />
          </div>

          {businessDetails.businessName && (
            <div>
              <label className="block text-gray-700 font-medium">Purpose</label>
              <input
                type="text"
                value={businessDetails.purpose}
                onChange={(e) => handleBusinessDetailChange("purpose", e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter purpose of the business"
              />
            </div>
          )}

          {businessDetails.purpose && (
            <div>
              <label className="block text-gray-700 font-medium">Location</label>
              <input
                type="text"
                value={businessDetails.location}
                onChange={(e) => handleBusinessDetailChange("location", e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter business location"
              />
            </div>
          )}

          {/* Document Upload Section */}
       
{/* Applicant Identity Proof */}
<div>
  <label className="block text-gray-700 font-medium mb-2">Upload Aadhaar Card / Identity Proof (PDF)</label>
  <input
    type="file"
    accept="application/pdf"
    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
    onChange={(e) => handleFileChange(e, 'identityProof')}
  />
</div>

{/* Land Ownership Proof */}
<div>
  <label className="block text-gray-700 font-medium mb-2">Upload Land Ownership Proof (PDF)</label>
  <input
    type="file"
    accept="application/pdf"
    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
    onChange={(e) => handleFileChange(e, 'landProof')}
  />
</div>

{/* Application Letter or Proposal */}
<div>
  <label className="block text-gray-700 font-medium mb-2">Upload Application Letter / Proposal (PDF)</label>
  <input
    type="file"
    accept="application/pdf"
    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
    onChange={(e) => handleFileChange(e, 'applicationLetter')}
  />
</div>

{/* Land Use Map or Site Plan */}
<div>
  <label className="block text-gray-700 font-medium mb-2">Upload Land Use Map / Site Plan (PDF)</label>
  <input
    type="file"
    accept="application/pdf"
    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
    onChange={(e) => handleFileChange(e, 'landMap')}
  />
</div>

{/* Environmental Clearance (Optional) */}
<div>
  <label className="block text-gray-700 font-medium mb-2">Upload Environmental Clearance (PDF) (if applicable)</label>
  <input
    type="file"
    accept="application/pdf"
    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
    onChange={(e) => handleFileChange(e, 'environmentalClearance')}
  />
</div>

{/* Neighbor NOC (Optional) */}
<div>
  <label className="block text-gray-700 font-medium mb-2">Upload No Objection Certificate from Neighbors (PDF) (if applicable)</label>
  <input
    type="file"
    accept="application/pdf"
    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
    onChange={(e) => handleFileChange(e, 'neighborNoc')}
  />
</div>
</div>
        <button
          type="submit"
          className="mt-6 w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
}
