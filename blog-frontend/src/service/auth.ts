import axios from 'axios';

export const login = async (username: string, password: string) => {
   const response = await axios.post('/api/token/', { username, password });
   if (response.data.access) {
       localStorage.setItem('access_token', response.data.access);
       localStorage.setItem('refresh_token', response.data.refresh);
   }
   return response.data;
};
export const logout = () => {
   localStorage.removeItem('access_token');
   localStorage.removeItem('refresh_token');
   localStorage.removeItem('user');
};
export const getCurrentUser = () => {
   return localStorage.getItem('access_token');
};