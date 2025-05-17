import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Temporary import if authAPI isn't defined yet

// Create and export the context
export const AuthContext = createContext();

// Mock API services if they don't exist yet
const authAPI = {
    login: async (credentials) => {
        // Mock implementation
        return {
            data: {
                token: 'mock-token',
                user: {
                    id: '123',
                    name: credentials.email.split('@')[0],
                    email: credentials.email,
                    role: credentials.email.includes('admin') ? 'admin' : 'user'
                }
            }
        };
    },
    register: async (userData) => {
        return {
            data: {
                message: 'Registration successful'
            }
        };
    },
    logout: async () => {
        return { data: { message: 'Logged out successfully' } };
    },
    forgotPassword: async (email) => {
        return { data: { message: 'Password reset email sent' } };
    }
};

const userAPI = {
    getProfile: async () => {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (!user) throw new Error('User not found');
        return { data: user };
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
            navigate('/login');
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            // Even if there's an error with the logout API call,
            // we still want to remove the user from local state
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setLoading(false);
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
            // Save the updated user data
            const updatedUser = { ...user, ...userData };
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
    }, [user]);

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