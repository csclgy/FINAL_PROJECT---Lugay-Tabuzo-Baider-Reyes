import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [ user, setUser ] = useState(null);
    const [ token, setToken ] = useState(localStorage.getItem('token') || null);
    const [ loading, setLoading ] = useState(true);
    const navigate = useNavigate();

    //axios defaults
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);
    
    //checks if token is valid on initial load
    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('/api/auth/me');
                setUser(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Token verification failed', error);
                logout();
                setLoading(false);
            }
        };

        verifyToken();
    }, []);

    const login = async (credentials) => {
        try {
            setLoading(true);
            const response = await axios.post('/api/auth/login', credentials);
            const { token, user } = response.data;

            setToken(token);
            setUser(user);
            localStorage.setItem('token', token);

            toast.success('Login successful!');
            navigate('/');
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed. Please try again.';
            toast.error(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            setLoading(true);
            const response = await axios.post('/api/auth/register', userData);
            const { token, user } = response.data;

            setToken(token);
            setUser(user);
            localStorage.setItem('token', token);

            toast.success('Registration successful!');
            navigate('/');
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed. Please try again.';
            toast.error(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        navigate('/login');
        toast.success('Logged out successfully');
    };

    const isAuthenticated = () => !!token;

    const value = {
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated,
        loading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}