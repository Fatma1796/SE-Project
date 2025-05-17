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

function App() {
    return (
        <Router>
            <AuthProvider>
                <Navbar />
                <div className="container mt-4">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/register" element={<RegisterForm />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />
                        <Route path="/admin/*" element={<PrivateRoute element={<AdminDashboard />} allowedRoles={['admin']} />} />
                        <Route path="/unauthorized" element={<UnauthorizedPage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;