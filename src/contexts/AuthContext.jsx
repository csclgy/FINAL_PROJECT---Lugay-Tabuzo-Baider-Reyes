import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const isDevMode = () => {
        return process.env.NODE_ENV === 'development';
    };

    const isDevToken = (tokenToCheck) => {
        return tokenToCheck === 'dev-mock-token';
    };

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

            if (isDevMode() && isDevToken(token)) {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    try {
                        const userData = JSON.parse(storedUser);
                        setUser(userData);
                        console.log('Dev mode: User loaded from localStorage', userData);
                    } catch (error) {
                        console.error('Error parsing stored user data:', error);
                        logout();
                    }
                }
                setLoading(false);
                return;
            }

            // Regular token verification for production
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
    }, [token]);

    const login = async (credentials) => {
        try {
            setLoading(true);

            if (isDevMode() && 
                credentials.email === 'email@gmail.com' && 
                credentials.password === 'password') {
                
                const devUser = {
                    id: 'dev-user',
                    name: 'Development User',
                    email: 'email@gmail.com',
                    role: 'Admin'
                };
                
                const devToken = 'dev-mock-token';
                
                setToken(devToken);
                setUser(devUser);
                localStorage.setItem('token', devToken);
                localStorage.setItem('user', JSON.stringify(devUser));

                toast.success('Dev mode login successful!');
                navigate('/');
                return { success: true };
            }

            const response = await axios.post('/api/auth/login', credentials);
            const { token: newToken, user: userData } = response.data;

            setToken(newToken);
            setUser(userData);
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(userData));

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
            const { token: newToken, user } = response.data;

            setToken(newToken);
            setUser(user);
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(user));

            toast.success('Registration successful!');
            navigate('/');
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed. Please try again.';
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
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        navigate('/login');
        toast.success('Logged out successfully');
    };

    const isAuthenticated = () => !!token;

    const value = {
        user,
        token,
        authToken: token,
        login,
        register,
        logout,
        isAuthenticated,
        loading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}