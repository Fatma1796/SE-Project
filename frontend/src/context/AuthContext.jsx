import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Create and export the context
export const AuthContext = createContext();

// Real API services connecting to your backend
const authAPI = {
    login: async (credentials) => {
        return await axios.post('/api/v1/users/login', credentials, {
            withCredentials: true
        });
    },
    register: async (userData) => {
        console.log("Sending registration data to backend:", userData);
        return await axios.post('/api/v1/users/register', userData, {
            withCredentials: true
        });
    },
    logout: async () => {
        const token = localStorage.getItem('token');
        return await axios.post('/api/v1/users/logout', {}, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });
    },
    forgotPassword: async (email) => {
        return await axios.post('/api/v1/users/forgotPassword', { email }, {
            withCredentials: true
        });
    }
};

const userAPI = {
    getProfile: async () => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');
        
        return await axios.get('/api/v1/users/profile', {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });
    },
    updateProfile: async (userData) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');
        
        return await axios.put('http://localhost:3000/api/v1/users/profile', userData, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });
    }
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Check if user is already logged in when app loads
    useEffect(() => {
        const checkUserLoggedIn = async () => {
            // Only attempt to get profile if token exists
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await userAPI.getProfile();
                setUser(response.data);
                setError(null);
            } catch (err) {
                console.error('Auth verification failed:', err);
                setUser(null);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            } finally {
                setLoading(false);
            }
        };

        checkUserLoggedIn();
    }, []);

    // Define auth methods with useCallback to maintain reference stability
    const login = useCallback(async (credentials) => {
        try {
            setLoading(true);
            setError(null);
            const response = await authAPI.login(credentials);
            const { token, user: userData } = response.data;
            
            // Save the token and user data
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            
            // Set the user data
            setUser(userData);
            return userData;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const register = useCallback(async (userData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await authAPI.register(userData);
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            setLoading(true);
            await authAPI.logout();
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            // Even if there's an error with the logout API call,
            // we still want to remove the user from local state
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setLoading(false);
            navigate('/login');
        }
    }, [navigate]);

    const forgotPassword = useCallback(async (email) => {
        try {
            setLoading(true);
            setError(null);
            const response = await authAPI.forgotPassword(email);
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Password reset request failed. Please try again.';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateProfile = useCallback(async (userData) => {
        try {
            setLoading(true);
            setError(null);
            
            // Make actual API call to update profile
            const response = await userAPI.updateProfile(userData);
            const updatedUser = response.data;
            
            // Update local storage and state
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            return updatedUser;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Profile update failed. Please try again.';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Memoize the context value with stable function references
    const value = React.useMemo(() => ({
        user,
        loading,
        error,
        login,
        register,
        logout,
        forgotPassword,
        clearError,
        updateProfile,
        isAuthenticated: !!user,
        role: user?.role || 'guest'
    }), [user, loading, error, login, register, logout, forgotPassword, clearError, updateProfile]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Export API services for use elsewhere
export { authAPI, userAPI };