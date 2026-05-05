import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';

const Register = () => {
  const [formData, setFormData] = useState({
    login_id: '',
    password: '',
    confirmPassword: '',
    name: '',
    gender: '',
    age: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    if (formData.password.length < 6) {
      setError('密码长度至少为6位');
      return;
    }

    setLoading(true);

    const { confirmPassword, ...registerData } = formData;
    
    const processedData = { ...registerData };
    
    if (processedData.age === undefined || processedData.age === '' || processedData.age === null) {
      delete processedData.age;
    } else {
      const ageNum = parseInt(processedData.age, 10);
      if (!isNaN(ageNum) && ageNum > 0) {
        processedData.age = ageNum;
      } else {
        delete processedData.age;
      }
    }
    
    const result = await register(processedData);
    
    if (result.success) {
      navigate('/login');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <h2>用户注册</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>登录号 *</label>
              <input
                type="text"
                name="login_id"
                value={formData.login_id}
                onChange={handleChange}
                required
                placeholder="请输入登录号"
              />
            </div>
            
            <div className="form-group">
              <label>姓名</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="请输入姓名"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>密码 *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="请输入密码（至少6位）"
              />
            </div>
            
            <div className="form-group">
              <label>确认密码 *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="请再次输入密码"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>性别</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">请选择</option>
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>年龄</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="请输入年龄"
                min="1"
                max="150"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>电话</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="请输入电话号码"
            />
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '注册中...' : '注册'}
          </button>
        </form>
        
        <div className="auth-footer">
          已有账号？ <Link to="/login">立即登录</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
