import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Changed from useHistory to useNavigate
import { useAuth } from '../../context/AuthContext.jsx';

function Navbar() {
    const { user, logout } = useAuth(); // Using useAuth hook instead of useContext directly
    const navigate = useNavigate(); // Changed from history to navigate

    const handleLogout = async () => {
        await logout();
        navigate('/login'); // Changed from history.push to navigate
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <Link className="navbar-brand" to="/">Event Ticketing</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        {user ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/profile">Profile</Link>
                                </li>
                                {user.role === 'admin' && ( // Note: Changed 'Admin' to lowercase 'admin'
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/admin/dashboard">Admin Dashboard</Link>
                                    </li>
                                )}
                                <li className="nav-item">
                                    <button 
                                        className="btn btn-outline-danger btn-sm" 
                                        onClick={handleLogout}>
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Register</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/forgot-password">Forgot Password</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;