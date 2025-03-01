# 🏡 E-Gram Panchayat: A Digital Solution for Village Administration

📌 **Abstract**  
E-Gram Panchayat is a web-based platform aimed at digitizing administrative workflows for rural village councils. It streamlines the process of applying for and managing **Birth Certificates, NOCs, and Household Applications**. Built with **React, Tailwind CSS, Node.js, and MongoDB**, this platform enhances **transparency and efficiency** by replacing manual processes with a **user-friendly digital solution**.

---

## 🚀 Key Features  

### 🧑‍💻 User Dashboard  
✅ Apply for **Birth Certificates, NOCs, or Household Applications**  
✅ Track **application status** (*Pending, Approved, Rejected*)  
✅ Download **approved certificates in PDF format**  
🔹 **Tech Stack:** React (Vite), Tailwind CSS  

### 🔧 Admin Dashboard  
✅ **Approve/Reject** applications  
✅ View **application analytics** (*Pending, Approved, Rejected*)  
✅ Manage **staff roles**  
🔹 **Tech Stack:** React, Node.js, Express.js, MongoDB  

### 👨‍🏫 Staff Dashboard  
✅ Review and **verify user-submitted applications**  
✅ Update **application statuses** (*Verified/Rejected*)  
✅ **Filter applications** by status or service type  
🔹 **Tech Stack:** React, Node.js, MongoDB  

### 📜 Certificate Management  
✅ Generate **dynamic, professional PDF certificates** for:  
- **Birth Certificates** (applicant details)  
- **NOCs** (*e.g., business, construction permissions*)  
- **Household Applications** (*for schemes/utilities*)  
🔹 **Tech Stack:** `pdf-lib` for PDF generation  

### 📌 Application Sorting System  
✅ Automatically categorizes applications **by status and service type**  

### ⚠️ Custom Error Handling  
✅ User-friendly **404 Not Found Page** with navigation back to home/login  

---

## 🛠️ Technology Stack  

### 🌐 Frontend  
- **React (Vite)** → Fast build times, modular UI  
- **Tailwind CSS** → Modern, responsive styling  
- **React Router** → Seamless navigation  

### 🖥️ Backend  
- **Node.js + Express.js** → API handling, business logic  
- **MongoDB** → NoSQL database for flexible data management  

### 📝 PDF Generation  
- **pdf-lib** → Dynamic PDF certificate generation  

### 🚀 Deployment  
- Hosted on **Render Free Tier** *(Frontend & Backend)*  

---

## 🏗️ System Architecture  

### 📌 MVC Architecture  
✅ **Model** → MongoDB schemas for user and application data  
✅ **View** → React components for UI  
✅ **Controller** → Node.js APIs for managing workflows  

### 🔑 Role-Based Access Control (RBAC)  
👥 **Users** → Submit applications, track progress, download certificates  
👨‍🏫 **Staff** → Verify applications, update statuses  
🛡️ **Admin** → Approve/reject applications, manage staff  

---

## 🔄 User Flow  

1️⃣ **Login/Registration** → Secure authentication using **JWT sessions**  
2️⃣ **Application Submission** → Users upload required documents  
3️⃣ **Review** → Staff verifies and updates application status  
4️⃣ **Approval/Rejection** → Admin makes the final decision  
5️⃣ **Certificate Generation** → Approved applications generate **downloadable PDFs**  

---

## 🎯 Challenges & Solutions  

### 🖋️ Certificate Formatting  
📌 **Challenge:** Customizing PDF layouts for a professional look  
✅ **Solution:** Used `pdf-lib` for **dynamic template-based PDFs**  

### 🌐 Free-Tier Hosting  
📌 **Challenge:** Delays & performance lags  
✅ **Solution:** Optimized **backend queries & caching mechanisms**  

### 🔐 Role Management  
📌 **Challenge:** Secure **RBAC system**  
✅ **Solution:** Implemented **JWT-based authentication & access control middleware**  

### 📱 UI Responsiveness  
📌 **Challenge:** Ensuring mobile-friendliness  
✅ **Solution:** **Tailwind CSS media queries** for consistency across screen sizes  

---

## 🖼️ Project Screenshots  

### 📌 Admin Action  
![Admin Action](https://github.com/AsjadJDawre/E_GramPanchayat/blob/93aec744b788318a7ba6d542cf6beb494acb15bd/Admin_Action.png)  

### 📌 Admin Dashboard  
![Admin Dashboard](https://github.com/AsjadJDawre/E_GramPanchayat/blob/93aec744b788318a7ba6d542cf6beb494acb15bd/Admin_dashboard.png)  

### 📌 Password Recovery  
![Password Recovery](https://github.com/AsjadJDawre/E_GramPanchayat/blob/93aec744b788318a7ba6d542cf6beb494acb15bd/Forgot_pass1.png)  

### 📌 User Dashboard  
![User Dashboard](https://github.com/AsjadJDawre/E_GramPanchayat/blob/93aec744b788318a7ba6d542cf6beb494acb15bd/User-dashboard.png)  

### 📌 User View Application  
![User View Application](https://github.com/AsjadJDawre/E_GramPanchayat/blob/93aec744b788318a7ba6d542cf6beb494acb15bd/View_application.png)  

---

## 🔗 Live Demo & Repository  
🚀 **Live Site:** [Your Project Link](#)  
📂 **GitHub Repository:** [Your GitHub Link](#)  

---

## 📬 Contact & Social Links  
👤 **Asjad Johar Dawre**  
🔗 **LinkedIn:** [www.linkedin.com/in/asjad-johar](https://www.linkedin.com/in/asjad-johar)  
🌎 **Portfolio:** [asjad-dev.vercel.app](https://asjad-dev.vercel.app)

---

## 🎯 Conclusion  
The **E-Gram Panchayat system** effectively digitizes village administration workflows, making processes more **efficient, transparent, and user-friendly**. Despite **challenges** like hosting delays, the project establishes a **scalable foundation for digital governance**.  

🚀 *Future enhancements include SMS/email notifications, multilingual support, and a mobile app!*  

---

📌 **Star ⭐ the repository if you find this project useful!** 🚀
