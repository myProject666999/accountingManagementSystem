import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import '../../App.css';

const AdminDashboard = () => {
  return (
    <div className="app">
      <Navbar isAdmin={true} />
      
      <main className="main-content">
        <h1>管理员面板</h1>
        
        <div className="admin-stats">
          <div className="admin-stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>用户管理</h3>
              <p>管理系统用户，查看和删除用户信息</p>
              <Link to="/admin/users" className="btn btn-primary btn-sm">
                进入管理
              </Link>
            </div>
          </div>
          
          <div className="admin-stat-card">
            <div className="stat-icon">🔐</div>
            <div className="stat-info">
              <h3>管理员管理</h3>
              <p>管理系统管理员，添加、修改和删除管理员</p>
              <Link to="/admin/admins" className="btn btn-primary btn-sm">
                进入管理
              </Link>
            </div>
          </div>
        </div>
        
        <div className="section">
          <h2>系统说明</h2>
          <div className="info-card">
            <h3>用户管理</h3>
            <ul>
              <li>查看所有注册用户列表</li>
              <li>根据登录号、姓名、电话搜索用户</li>
              <li>删除不需要的用户账户</li>
            </ul>
          </div>
          
          <div className="info-card">
            <h3>管理员管理</h3>
            <ul>
              <li>查看所有管理员列表</li>
              <li>添加新的管理员账户</li>
              <li>修改管理员信息</li>
              <li>删除不需要的管理员账户</li>
              <li>根据登录号、姓名搜索管理员</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
