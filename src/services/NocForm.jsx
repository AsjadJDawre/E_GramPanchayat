import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";

export default function NocForm() {
  const [applicantName, setApplicantName] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [plotNumber, setPlotNumber] = useState("");
  const [documents, setDocuments] = useState({});

  const [businessDetails, setBusinessDetails] = useState({
    businessName: "",
    purpose: "",
    location: "",
  });

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    toast.warning("⚠️ Fill all details carefully and upload only PDF files", { duration: 4000 });
  }, []);

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setDocuments((prev) => ({
        ...prev,
        [fieldName]: file,
      }));
    } else {
      toast.error("❌ Only PDF files are allowed.");
    }
  };

  const handleBusinessDetailChange = (field, value) => {
    setBusinessDetails((prev) => ({ ...prev, [field]: value }));
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
      toast.error("All fields and documents are required.");
      return;
    }

    const formData = new FormData();
    formData.append("applicantName", applicantName);
    formData.append("aadhaarNumber", aadhaarNumber);
    formData.append("contactNumber", contactNumber);
    formData.append("plotNumber", plotNumber);
    Object.entries(businessDetails).forEach(([key, value]) =>
      formData.append(key, value)
    );
    Object.entries(documents).forEach(([key, file]) =>
      formData.append(key, file)
    );

    try {
      const response = await axios.post(`${apiUrl}/api/noc`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(response.data.message || "NOC submitted successfully!");
      setTimeout(() => navigate("/dashboard"), 2500);
    } catch (error) {
      toast.error("Submission failed. Try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 mt-10">
      <Toaster position="top-right" richColors />
      <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">
        NOC Application Form
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section: Applicant Info */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Applicant Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              placeholder="Applicant Full Name"
              className="form-input"
              required
            />
            <input
              type="text"
              value={aadhaarNumber}
              onChange={(e) => setAadhaarNumber(e.target.value)}
              placeholder="Aadhaar Number"
              className="form-input"
              required
            />
            <input
              type="text"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="Contact Number"
              className="form-input"
              required
            />
            <input
              type="text"
              value={plotNumber}
              onChange={(e) => setPlotNumber(e.target.value)}
              placeholder="Plot Number"
              className="form-input"
              required
            />
          </div>
        </section>

        {/* Section: Business Info */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Business Details</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={businessDetails.businessName}
              onChange={(e) => handleBusinessDetailChange("businessName", e.target.value)}
              placeholder="Business Name"
              className="form-input"
              required
            />
            {businessDetails.businessName && (
              <>
                <input
                  type="text"
                  value={businessDetails.purpose}
                  onChange={(e) => handleBusinessDetailChange("purpose", e.target.value)}
                  placeholder="Purpose of Business"
                  className="form-input"
                  required
                />
                <input
                  type="text"
                  value={businessDetails.location}
                  onChange={(e) => handleBusinessDetailChange("location", e.target.value)}
                  placeholder="Business Location"
                  className="form-input"
                  required
                />
              </>
            )}
          </div>
        </section>

        {/* Section: Document Uploads */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Upload Documents (PDF Only)</h2>
          <div className="space-y-4">
            {[
              { id: "identityProof", label: "Aadhaar Card / Identity Proof" },
              { id: "landProof", label: "Land Ownership Proof" },
              { id: "applicationLetter", label: "Application Letter / Proposal" },
              { id: "landMap", label: "Land Use Map / Site Plan" },
              { id: "environmentalClearance", label: "Environmental Clearance (Optional)" },
              { id: "neighborNoc", label: "No Objection Certificate from Neighbors (Optional)" },
            ].map(({ id, label }) => (
              <div key={id}>
                <label className="block text-gray-600 font-medium mb-1">{label}</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleFileChange(e, id)}
                  className="form-input"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
}
