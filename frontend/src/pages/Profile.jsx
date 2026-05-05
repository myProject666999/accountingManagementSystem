import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../services/api';
import '../App.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    login_id: '',
    password: '',
    confirmPassword: '',
    name: '',
    gender: '',
    age: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        login_id: user.login_id || '',
        name: user.name || '',
        gender: user.gender || '',
        age: user.age || '',
        phone: user.phone || '',
      }));
    }
  }, [user]);

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
    setSuccess('');

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    if (formData.password && formData.password.length < 6) {
      setError('密码长度至少为6位');
      return;
    }

    try {
      setLoading(true);
      
      const updateData = {};
      if (formData.login_id && formData.login_id !== user?.login_id) {
        updateData.login_id = formData.login_id;
      }
      if (formData.password) {
        updateData.password = formData.password;
      }
      if (formData.name !== undefined) {
        updateData.name = formData.name;
      }
      if (formData.gender) {
        updateData.gender = formData.gender;
      }
      if (formData.age) {
        updateData.age = parseInt(formData.age);
      }
      if (formData.phone) {
        updateData.phone = formData.phone;
      }

      const response = await userAPI.updateProfile(updateData);
      updateUser(response.data.user);
      
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: '',
      }));
      
      setSuccess('个人信息更新成功！');
    } catch (err) {
      setError(err.response?.data?.error || '更新失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Navbar />
      
      <main className="main-content">
        <h1>个人信息</h1>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <div className="profile-card">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>登录号</label>
                <input
                  type="text"
                  name="login_id"
                  value={formData.login_id}
                  onChange={handleChange}
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
                <label>新密码（留空则不修改）</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="请输入新密码（至少6位）"
                />
              </div>
              
              <div className="form-group">
                <label>确认新密码</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="请再次输入新密码"
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
            
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? '更新中...' : '保存修改'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Profile;
