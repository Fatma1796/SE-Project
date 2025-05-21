import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import PrivateRoute from './components/routes/PrivateRoute';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ForgotPassword from './components/auth/ForgotPassword';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import UserBookingsPage from './pages/UserBookingsPage.jsx';
import Footer from './components/components/Footer';
import MyEventsPage from './pages/MyEventsPage';
import EditEventPage from './pages/EditEventPage';  // Add this import
import OrganizerAnalyticsPage from './pages/OrganizerAnalyticsPage';  // Add this import
import EventDetails from './components/EventDetails';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BookingDetailsPage from './pages/BookingDetailsPage';import UpdateProfilePage from './pages/UpdateProfilePage.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for styling

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <div className="container mt-4">
          {/* ToastContainer should be outside <Routes> */}
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            // Update your router configuration
           <Route path="/my-events" element={ <PrivateRoute element={<MyEventsPage />} allowedRoles={['Organizer']} />  }/>
             <Route path="/my-events/analytics" element={<OrganizerAnalyticsPage />} />
            
            <Route path="/my-events/:id/edit"  element={<PrivateRoute   element={<EditEventPage />}                  allowedRoles={['Organizer']}   />     }    /> 
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />
            <Route path="/update-profile" element={<PrivateRoute element={<UpdateProfilePage />} />} />
            <Route path="/admin/*" element={<PrivateRoute element={<AdminDashboard />} allowedRoles={['System Admin']} />} />
            <Route path="/my-bookings" element={<PrivateRoute element={<UserBookingsPage />} allowedRoles={['Standard User']} />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
                   
          </Routes>
        </div>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;