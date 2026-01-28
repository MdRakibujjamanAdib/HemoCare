import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIChat from './components/AIChat';
import Home from './pages/Home';
import About from './pages/About';
import DonorRegistration from './pages/DonorRegistration';
import DonorList from './pages/DonorList';
import DonationRequest from './pages/DonationRequest';
import Doctors from './pages/Doctors';
import Hospitals from './pages/Hospitals';
import Contact from './pages/Contact';

import AdminLayout from './components/AdminLayout';
import AdminLogin from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageDonors from './pages/admin/ManageDonors';
import ManageDoctors from './pages/admin/ManageDoctors';
import ManageHospitals from './pages/admin/ManageHospitals';
import DonorApproval from './pages/admin/DonorApproval';
import DonationRequestApproval from './pages/admin/DonationRequestApproval';
import ManageDonationRequests from './pages/admin/ManageDonationRequests';
import GeneralSettings from './pages/admin/GeneralSettings';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/register" element={<DonorRegistration />} />
            <Route path="/donors" element={<DonorList />} />
            <Route path="/donation-request" element={<DonationRequest />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/hospitals" element={<Hospitals />} />
            <Route path="/contact" element={<Contact />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="settings" element={<GeneralSettings />} />
              <Route path="approvals" element={<DonorApproval />} />
              <Route path="donation-requests" element={<DonationRequestApproval />} />
              <Route path="manage-donations" element={<ManageDonationRequests />} />
              <Route path="donors" element={<ManageDonors />} />
              <Route path="doctors" element={<ManageDoctors />} />
              <Route path="hospitals" element={<ManageHospitals />} />
            </Route>
          </Routes>
        </main>
        <Footer />
        <AIChat />
      </div>
    </Router>
  );
};

export default App;
