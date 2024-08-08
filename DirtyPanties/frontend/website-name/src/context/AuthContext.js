import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { refreshToken } from '../utils/auth';
import  axios from 'axios';
import { API_BASE_URL } from '../constants';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      let accessToken = Cookies.get('accessToken');
      if (!accessToken) {
        accessToken = await refreshToken();
      }
      if (accessToken) {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/auth/verifyToken`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          if (response.status === 200) {
            setUser(response.data.user);
            setIsAuthenticated(true);
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};