import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL } from '../constants';

export const refreshToken = async () => {
  const refreshToken = Cookies.get('refreshToken');
  if (!refreshToken) return null;

  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/refreshToken`, { refreshToken: refreshToken });
    const { accessToken } = response.data;
    Cookies.set('accessToken', accessToken, { expires: 2 / 24 }); // Expires in 1 hour
    return accessToken;
  } catch (error) {
    console.error('Failed to refresh access token:', error);
    Cookies.remove('accessToken');
/*     Cookies.remove('refreshToken');
 */    return null;
  }
};