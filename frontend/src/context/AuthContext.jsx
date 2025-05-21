import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000';


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
    try {
        const token = localStorage.getItem('token');
        return await axios.post('/api/v1/users/logout', {}, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });
    } catch (error) {
        console.error('Logout API error:', error);
        // Still return a resolved promise so UI logout proceeds even if API fails
        return Promise.resolve();
    }
},
    // logout: async () => {
    //     const token = localStorage.getItem('token');
    //     return await axios.post('/api/v1/users/logout', {}, {
    //         headers: { Authorization: `Bearer ${token}` },
    //         withCredentials: true
    //     });
    // },
    forgotPassword: async (email) => {
         console.log("Sending forgot password request with email:", email);

        return await axios.put('/api/v1/users/forgetPassword', { email }, {
            withCredentials: true
        });
    }, 
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
    const [bookings, setBookings] = useState([]); // <-- bookings state here
    const navigate = useNavigate();
    
    // Check if user is already logged in when app loads
    useEffect(() => {
        const checkUserLoggedIn = async () => {
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

    // Auth methods
    const login = useCallback(async (credentials) => {
        try {
            setLoading(true);
            setError(null);
            const response = await authAPI.login(credentials);
            const { token, user: userData } = response.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            
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
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setBookings([]); // clear bookings on logout too
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
            
            const response = await userAPI.updateProfile(userData);
            const updatedUser = response.data;
            
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
/*
    // Fetch bookings and store in state
  const getBookings = useCallback(async () => {
    try {
        const token = localStorage.getItem('token');
        console.log("Token from localStorage:", token); // 👈 Add this line

        if (!token) {
            throw new Error('No token found in localStorage');
        }

        const res = await axios.get('http://localhost:3000/api/v1/users/bookings', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        setBookings(res.data || []);
        return res.data;
    } catch (error) {
        console.error('Error in getBookings:', error);
        setBookings([]);
        throw error;
    }
}, []);

    
*/


 // Fetch bookings and store in state
  const getBookings = useCallback(async () => {
    try {
        const token = localStorage.getItem('token');
        console.log("Token from localStorage:", token); // 👈 Add this line

        if (!token) {
            throw new Error('No token found in localStorage');
        }

        const res = await axios.get('http://localhost:3000/api/v1/users/bookings', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        setBookings(res.data || []);
        return res.data;
    } catch (error) {
        console.error('Error in getBookings:', error);
        setBookings([]);
        throw error;
    }
}, []);



    // Context value
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
        getBookings,
        bookings,              // <-- include bookings here
        isAuthenticated: !!user,
        role: user?.role || 'guest'
    }), [user, loading, error, login, register, logout, forgotPassword, clearError, updateProfile, getBookings, bookings]);

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
