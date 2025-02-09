import React, { useState } from "react";
import axios from "axios";
import { toast ,Toaster } from "sonner";

function NocForm() {
  const [applicantName, setApplicantName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [landDetails, setLandDetails] = useState("");
  const [supportingDocuments, setSupportingDocuments] = useState(null);
  const [businessDetails, setBusinessDetails] = useState({
    businessName: "",
    purpose: "",
    location: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!applicantName || !contactNumber || !address || !aadhaarNumber || !landDetails || !supportingDocuments || !businessDetails.businessName || !businessDetails.purpose || !businessDetails.location) {
      toast.error("Please fill out all fields and upload the required document.");
      return;
    }

    const formData = new FormData();
    formData.append("applicantName", applicantName);
    formData.append("contactNumber", contactNumber);
    formData.append("address", address);
    formData.append("aadhaarNumber", aadhaarNumber);
    formData.append("landDetails", landDetails);
    formData.append("supportingDocuments", supportingDocuments);
    formData.append("businessName", businessDetails.businessName);
    formData.append("purpose", businessDetails.purpose);
    formData.append("location", businessDetails.location);

    console.log({
      applicantName,
      contactNumber,
      address,
      aadhaarNumber,
      landDetails,
      supportingDocuments,
      businessDetails,
    });

    try {
      const response = await axios.post("/api/noc", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("NOC application submitted successfully.");
    } catch (error) {
      toast.error("Failed to submit NOC application. Please try again.");
    }
  };

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      return;
    }
    setSupportingDocuments(file);
  };

  const handleBusinessDetailChange = (field, value) => {
    setBusinessDetails((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">NOC Application Form</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow">
        <div>
          <label className="block text-gray-700 font-medium">Applicant Name</label>
          <input
            type="text"
            value={applicantName}
            onChange={(e) => setApplicantName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Contact Number</label>
          <input
            type="text"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter your contact number"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter your address"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Aadhaar Number</label>
          <input
            type="text"
            value={aadhaarNumber}
            onChange={(e) => setAadhaarNumber(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter your Aadhaar number"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Land Details</label>
          <textarea
            value={landDetails}
            onChange={(e) => setLandDetails(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter details of the land"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Supporting Documents (PDF only)</label>
          <input
            type="file"
            onChange={handleDocumentChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Business Details Section */}
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

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
    <Toaster richColors position="top-right" />
    </>

  );
}

export default NocForm;
