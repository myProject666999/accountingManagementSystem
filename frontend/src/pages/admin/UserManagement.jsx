import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { adminAPI } from '../../services/api';
import '../../App.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = searchTerm ? { search: searchTerm } : {};
      const response = await adminAPI.getAllUsers(params);
      setUsers(response.data);
    } catch (err) {
      setError('获取用户列表失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('确定要删除这个用户吗？')) {
      return;
    }
    
    try {
      await adminAPI.deleteUser(id);
      setShowDetailModal(false);
      fetchUsers();
    } catch (err) {
      setError('删除失败');
      console.error(err);
    }
  };

  const openDetailModal = (user) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  return (
    <div className="app">
      <Navbar isAdmin={true} />
      
      <main className="main-content">
        <h1>用户管理</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="search-bar">
          <div className="search-group">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索登录号、姓名或电话..."
              className="search-input"
            />
          </div>
        </div>
        
        {loading ? (
          <div className="loading">加载中...</div>
        ) : users.length === 0 ? (
          <div className="empty-state">
          <p>暂无用户</p>
        </div>
        ) : (
          <div className="user-table-container">
            <table className="user-table">
              <thead>
                <tr>
                  <th>登录号</th>
                  <th>姓名</th>
                  <th>性别</th>
                  <th>年龄</th>
                  <th>电话</th>
                  <th>注册时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.login_id}</td>
                    <td>{user.name || '-'}</td>
                    <td>{user.gender || '-'}</td>
                    <td>{user.age || '-'}</td>
                    <td>{user.phone || '-'}</td>
                    <td>{new Date(user.created_at).toLocaleString('zh-CN')}</td>
                    <td>
                      <button 
                        onClick={() => openDetailModal(user)}
                        className="btn btn-sm btn-secondary"
                      >
                        详情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      
      {showDetailModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>用户详情</h3>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="btn-close"
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">登录号：</span>
                <span className="detail-value">{selectedUser.login_id}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">姓名：</span>
                <span className="detail-value">{selectedUser.name || '-'}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">性别：</span>
                <span className="detail-value">{selectedUser.gender || '-'}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">年龄：</span>
                <span className="detail-value">{selectedUser.age || '-'}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">电话：</span>
                <span className="detail-value">{selectedUser.phone || '-'}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">注册时间：</span>
                <span className="detail-value">{new Date(selectedUser.created_at).toLocaleString('zh-CN')}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">更新时间：</span>
                <span className="detail-value">{new Date(selectedUser.updated_at).toLocaleString('zh-CN')}</span>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                onClick={() => handleDeleteUser(selectedUser.id)}
                className="btn btn-danger"
              >
                删除用户
              </button>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="btn btn-secondary"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
