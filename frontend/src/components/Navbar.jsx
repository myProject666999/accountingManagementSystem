import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';

const Navbar = ({ isAdmin = false }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (isAdmin) {
    return (
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/admin/dashboard" className="nav-logo">
            记账管理系统（管理员）
          </Link>
          
          <div className="nav-menu">
            <Link to="/admin/dashboard" className="nav-link">
              首页
            </Link>
            <Link to="/admin/admins" className="nav-link">
              管理员管理
            </Link>
            <Link to="/admin/users" className="nav-link">
              用户管理
            </Link>
          </div>
          
          <div className="nav-user">
            <span className="user-name">欢迎，{user?.name || user?.login_id}</span>
            <button onClick={handleLogout} className="btn btn-logout">
              退出登录
            </button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/dashboard" className="nav-logo">
          记账管理系统
        </Link>
        
        <div className="nav-menu">
          <Link to="/dashboard" className="nav-link">
            首页
          </Link>
          <Link to="/transactions" className="nav-link">
            记账管理
          </Link>
          <Link to="/stats" className="nav-link">
            财务统计
          </Link>
          <Link to="/profile" className="nav-link">
            个人信息
          </Link>
        </div>
        
        <div className="nav-user">
          <span className="user-name">欢迎，{user?.name || user?.login_id}</span>
          <button onClick={handleLogout} className="btn btn-logout">
            退出登录
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
