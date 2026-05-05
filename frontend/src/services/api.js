import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isAdmin');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  userLogin: (loginId, password) => 
    api.post('/auth/user/login', { login_id: loginId, password }),
  
  userRegister: (userData) => 
    api.post('/auth/user/register', userData),
  
  adminLogin: (loginId, password) => 
    api.post('/auth/admin/login', { login_id: loginId, password }),
  
  logout: () => 
    api.post('/auth/logout'),
};

export const userAPI = {
  getProfile: () => 
    api.get('/user/profile'),
  
  updateProfile: (userData) => 
    api.put('/user/profile', userData),
};

export const transactionAPI = {
  create: (transactionData) => 
    api.post('/transactions', transactionData),
  
  getAll: (params = {}) => 
    api.get('/transactions', { params }),
  
  getById: (id) => 
    api.get(`/transactions/${id}`),
  
  delete: (id) => 
    api.delete(`/transactions/${id}`),
};

export const statsAPI = {
  getMonthly: (params = {}) => 
    api.get('/stats/monthly', { params }),
  
  getYearly: (params = {}) => 
    api.get('/stats/yearly', { params }),
};

export const adminAPI = {
  getProfile: () => 
    api.get('/admin/profile'),
  
  getAllAdmins: (params = {}) => 
    api.get('/admin/admins', { params }),
  
  getAdminById: (id) => 
    api.get(`/admin/admins/${id}`),
  
  createAdmin: (adminData) => 
    api.post('/admin/admins', adminData),
  
  updateAdmin: (id, adminData) => 
    api.put(`/admin/admins/${id}`, adminData),
  
  deleteAdmin: (id) => 
    api.delete(`/admin/admins/${id}`),
  
  getAllUsers: (params = {}) => 
    api.get('/admin/users', { params }),
  
  deleteUser: (id) => 
    api.delete(`/admin/users/${id}`),
};

export default api;
