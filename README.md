# E-Gram Panchayat 🏛️

A comprehensive digital governance platform for Panchayati Raj Institutions, enabling citizens to access government services online and administrators to manage applications efficiently.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [Known Issues & TODOs](#known-issues--todos)
- [License](#license)
- [Contact](#contact)

## 🎯 Overview

E-Gram Panchayat is a modern web application designed to digitize and streamline the operations of Gram Panchayats (village councils) in India. The platform serves as a bridge between citizens and local government bodies, providing a user-friendly interface for accessing essential government services.

### Key Objectives
- **Digital Transformation**: Modernize traditional paper-based processes
- **Accessibility**: Provide 24/7 access to government services
- **Transparency**: Enable real-time tracking of application status
- **Efficiency**: Reduce processing time and administrative overhead
- **Inclusivity**: Support both authenticated users and guest visitors

## ✨ Features

### 🏠 User Features
- **Multi-role Authentication**: Separate interfaces for citizens, staff, and administrators
- **Service Applications**: Apply for various certificates and documents
  - Birth Certificates
  - Household Certificates
  - No Objection Certificates (NOC)
- **Application Tracking**: Real-time status updates and notifications
- **Document Management**: Secure file upload and verification
- **Guest Mode**: Explore services without registration
- **Responsive Design**: Mobile-friendly interface

### 👨‍💼 Administrative Features
- **Dashboard Analytics**: Comprehensive overview of applications and statistics
- **Application Management**: Review, approve, or reject applications
- **Document Verification**: Secure document review system
- **User Management**: Staff and citizen account administration
- **Notification System**: Automated alerts and updates
- **Reporting**: Generate reports and analytics

### 🔧 Technical Features
- **Real-time Updates**: Live application status tracking
- **File Upload**: Secure document submission with Cloudinary integration
- **PDF Generation**: Automated certificate generation
- **Search & Filter**: Advanced application filtering and sorting
- **Responsive UI**: Modern, accessible interface with Tailwind CSS
- **Progressive Web App**: Fast loading and offline capabilities

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Modern UI library with hooks
- **Vite 6.0.1** - Fast build tool and development server
- **React Router DOM 7.6.3** - Client-side routing
- **Tailwind CSS 3.4.16** - Utility-first CSS framework
- **Framer Motion 12.23.0** - Animation library
- **React Icons 5.4.0** - Icon library
- **React Toastify 11.0.2** - Toast notifications
- **Sonner 1.7.1** - Modern toast notifications
- **Recharts 3.0.2** - Chart library for analytics

### Backend & Services
- **Firebase 11.1.0** - Backend-as-a-Service
  - **Firebase Auth** - User authentication
  - **Firestore** - NoSQL database
  - **Firebase Storage** - File storage
- **Cloudinary** - Cloud-based image and video management
- **Axios 1.11.0** - HTTP client for API calls

### Development Tools
- **ESLint 9.15.0** - Code linting
- **PostCSS 8.4.49** - CSS processing
- **Autoprefixer 10.4.20** - CSS vendor prefixing

## 📁 Project Structure

```
e-grampanchayat/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── context/        # React context providers
│   │   │   └── GuestContext.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── StaffDashboard.jsx
│   │   └── ...
│   ├── services/           # Service forms
│   │   ├── birth_cert.jsx
│   │   ├── houseHold.jsx
│   │   └── NocForm.jsx
│   ├── styles/             # CSS files
│   ├── assets/             # Images and static files
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # Application entry point
│   └── firebaseConfig.js   # Firebase configuration
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── firestore.rules         # Firestore security rules
├── firestore.indexes.json  # Firestore indexes
└── .env-sample             # Environment variables template
```

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher)
- **npm** (v8.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **Git** (for version control)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AsjadJDawre/e-grampanchayat.git
   cd e-grampanchayat
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env-sample .env
   ```

4. **Configure environment variables**
   Edit the `.env` file with your actual API keys and configuration:
   ```env
   VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   VITE_CLOUDINARY_API_KEY=your-cloudinary-api-key
   VITE_CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   VITE_API_URL=your-backend-api-url
   VITE_USE_DUMMY_DATA=false
   ```

## ⚙️ Configuration

### Firebase Setup ( optional)
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication, Firestore, and Storage services
3. Update `src/firebaseConfig.js` with your Firebase configuration
4. Configure Firestore security rules in `firestore.rules`
5. Set up Firestore indexes in `firestore.indexes.json`

### Cloudinary Setup
1. Create a Cloudinary account at [Cloudinary](https://cloudinary.com/)
2. Get your cloud name, API key, and API secret
3. Update the environment variables with your Cloudinary credentials

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

### Production Build
```bash
npm run build
# or
yarn build
```

### Preview Production Build
```bash
npm run preview
# or
yarn preview
```

### Linting
```bash
npm run lint
# or
yarn lint
```

## 📖 Usage Guide

### For Citizens
1. **Registration**: Create an account with valid credentials
2. **Service Selection**: Choose from available services (Birth Certificate, Household Certificate, NOC)
3. **Application Submission**: Fill out forms and upload required documents
4. **Tracking**: Monitor application status through the dashboard
5. **Notifications**: Receive updates on application progress

### For Staff
1. **Login**: Access staff dashboard with authorized credentials
2. **Application Review**: Review submitted applications
3. **Document Verification**: Verify uploaded documents
4. **Status Updates**: Update application status and provide feedback
5. **Communication**: Send notifications to applicants

### For Administrators
1. **Dashboard Access**: View comprehensive analytics and statistics
2. **Application Management**: Oversee all applications across services
3. **User Management**: Manage staff and citizen accounts
4. **System Configuration**: Configure application settings and workflows
5. **Reporting**: Generate reports and export data

### Guest Mode
- Explore available services without registration
- View sample applications and processes
- Understand the platform's capabilities

## 🔌 API Documentation

The application integrates with various APIs:

### Firebase Services
- **Authentication**: User registration, login, and session management
- **Firestore**: Application data storage and retrieval
- **Storage**: Document and file storage

### Cloudinary API
- **File Upload**: Secure document upload and management
- **Image Processing**: Automatic image optimization and transformation

### External APIs
- **Backend API**: Custom backend services (configured via `VITE_API_URL`)

## 🤝 Contributing

We welcome contributions from the community! Please follow these guidelines:

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

### Code Standards
- Follow ESLint configuration
- Use meaningful commit messages
- Write clear, documented code
- Test your changes thoroughly
- Follow React best practices

### Pull Request Guidelines
- Provide a clear description of changes
- Include screenshots for UI changes
- Ensure all tests pass
- Update documentation if needed

## 🐛 Known Issues & TODOs

### Current Limitations
- Limited offline functionality
- No multi-language support
- Basic reporting features
- Limited integration with external government systems

### Planned Features
- [ ] Multi-language support (Hindi, English, regional languages)
- [ ] Advanced analytics and reporting
- [ ] Mobile application
- [ ] Integration with government databases
- [ ] Digital signature support
- [ ] Bulk application processing
- [ ] Advanced search and filtering
- [ ] API rate limiting and caching
- [ ] Enhanced security features
- [ ] Automated document verification

### Technical Debt
- [ ] Improve error handling
- [ ] Add comprehensive unit tests
- [ ] Optimize bundle size
- [ ] Implement proper TypeScript
- [ ] Add accessibility improvements
- [ ] Enhance performance monitoring

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author & Contact

**Project Maintainer**: [Your Name]

### Contact Information
- **Email**: [your.email@example.com]
- **GitHub**: [@yourusername](https://github.com/yourusername)
- **LinkedIn**: [Your LinkedIn Profile]

### Support
- **Issues**: [GitHub Issues](https://github.com/yourusername/e-grampanchayat/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/e-grampanchayat/discussions)
- **Documentation**: [Project Wiki](https://github.com/yourusername/e-grampanchayat/wiki)

---

<div align="center">

**Made with ❤️ for Digital India**

*Empowering Rural Communities Through Technology*

[![Digital India](https://img.shields.io/badge/Digital%20India-Initiative-blue?style=for-the-badge&logo=government)](https://digitalindia.gov.in/)

</div>
