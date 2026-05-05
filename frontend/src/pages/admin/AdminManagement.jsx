import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { adminAPI } from '../../services/api';
import '../../App.css';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  
  const [newAdmin, setNewAdmin] = useState({
    login_id: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  
  const [editAdmin, setEditAdmin] = useState({
    login_id: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, [searchTerm]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const params = searchTerm ? { search: searchTerm } : {};
      const response = await adminAPI.getAllAdmins(params);
      setAdmins(response.data);
    } catch (err) {
      setError('获取管理员列表失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewAdminChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin(prev => ({ ...prev, [name]: value }));
  };

  const handleEditAdminChange = (e) => {
    const { name, value } = e.target;
    setEditAdmin(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!newAdmin.login_id || !newAdmin.password) {
      setError('请填写登录号和密码');
      return;
    }
    
    if (newAdmin.password !== newAdmin.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }
    
    if (newAdmin.password.length < 6) {
      setError('密码长度至少为6位');
      return;
    }
    
    try {
      setSubmitting(true);
      
      const adminData = {
        login_id: newAdmin.login_id,
        password: newAdmin.password,
        name: newAdmin.name,
      };
      
      await adminAPI.createAdmin(adminData);
      
      setShowAddModal(false);
      setNewAdmin({
        login_id: '',
        password: '',
        confirmPassword: '',
        name: '',
      });
      
      fetchAdmins();
    } catch (err) {
      setError(err.response?.data?.error || '添加失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditAdmin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (editAdmin.password && editAdmin.password !== editAdmin.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }
    
    if (editAdmin.password && editAdmin.password.length < 6) {
      setError('密码长度至少为6位');
      return;
    }
    
    try {
      setSubmitting(true);
      
      const adminData = {};
      if (editAdmin.login_id) {
        adminData.login_id = editAdmin.login_id;
      }
      if (editAdmin.password) {
        adminData.password = editAdmin.password;
      }
      if (editAdmin.name !== undefined) {
        adminData.name = editAdmin.name;
      }
      
      await adminAPI.updateAdmin(selectedAdmin.id, adminData);
      
      setShowEditModal(false);
      fetchAdmins();
    } catch (err) {
      setError(err.response?.data?.error || '修改失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm('确定要删除这个管理员吗？')) {
      return;
    }
    
    try {
      await adminAPI.deleteAdmin(id);
      setShowDetailModal(false);
      fetchAdmins();
    } catch (err) {
      setError('删除失败');
      console.error(err);
    }
  };

  const openEditModal = (admin) => {
    setSelectedAdmin(admin);
    setEditAdmin({
      login_id: admin.login_id || '',
      password: '',
      confirmPassword: '',
      name: admin.name || '',
    });
    setShowEditModal(true);
  };

  const openDetailModal = (admin) => {
    setSelectedAdmin(admin);
    setShowDetailModal(true);
  };

  return (
    <div className="app">
      <Navbar isAdmin={true} />
      
      <main className="main-content">
        <div className="page-header">
          <h1>管理员管理</h1>
          <button 
            onClick={() => setShowAddModal(true)} 
            className="btn btn-primary"
          >
            + 添加管理员
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="search-bar">
          <div className="search-group">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索登录号或姓名..."
              className="search-input"
            />
          </div>
        </div>
        
        {loading ? (
          <div className="loading">加载中...</div>
        ) : admins.length === 0 ? (
          <div className="empty-state">
          <p>暂无管理员</p>
          <button 
            onClick={() => setShowAddModal(true)} 
            className="btn btn-primary"
          >
            添加第一个管理员
          </button>
        </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>登录号</th>
                  <th>姓名</th>
                  <th>创建时间</th>
                  <th>更新时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id}>
                    <td>{admin.login_id}</td>
                    <td>{admin.name || '-'}</td>
                    <td>{new Date(admin.created_at).toLocaleString('zh-CN')}</td>
                    <td>{new Date(admin.updated_at).toLocaleString('zh-CN')}</td>
                    <td>
                      <button 
                        onClick={() => openDetailModal(admin)}
                        className="btn btn-sm btn-secondary"
                      >
                        详情
                      </button>
                      <button 
                        onClick={() => openEditModal(admin)}
                        className="btn btn-sm btn-primary"
                      >
                        编辑
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>添加管理员</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="btn-close"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAddAdmin}>
              <div className="modal-body">
                <div className="form-group">
                  <label>登录号 *</label>
                  <input
                    type="text"
                    name="login_id"
                    value={newAdmin.login_id}
                    onChange={handleNewAdminChange}
                    required
                    placeholder="请输入登录号"
                  />
                </div>
                
                <div className="form-group">
                  <label>姓名</label>
                  <input
                    type="text"
                    name="name"
                    value={newAdmin.name}
                    onChange={handleNewAdminChange}
                    placeholder="请输入姓名"
                  />
                </div>
                
                <div className="form-group">
                  <label>密码 *</label>
                  <input
                    type="password"
                    name="password"
                    value={newAdmin.password}
                    onChange={handleNewAdminChange}
                    required
                    placeholder="请输入密码（至少6位）"
                  />
                </div>
                
                <div className="form-group">
                  <label>确认密码 *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={newAdmin.confirmPassword}
                    onChange={handleNewAdminChange}
                    required
                    placeholder="请再次输入密码"
                  />
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary"
                >
                  取消
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? '添加中...' : '添加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {showEditModal && selectedAdmin && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>编辑管理员</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="btn-close"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleEditAdmin}>
              <div className="modal-body">
                <div className="form-group">
                  <label>登录号</label>
                  <input
                    type="text"
                    name="login_id"
                    value={editAdmin.login_id}
                    onChange={handleEditAdminChange}
                    placeholder="请输入登录号"
                  />
                </div>
                
                <div className="form-group">
                  <label>姓名</label>
                  <input
                    type="text"
                    name="name"
                    value={editAdmin.name}
                    onChange={handleEditAdminChange}
                    placeholder="请输入姓名"
                  />
                </div>
                
                <div className="form-group">
                  <label>新密码（留空则不修改）</label>
                  <input
                    type="password"
                    name="password"
                    value={editAdmin.password}
                    onChange={handleEditAdminChange}
                    placeholder="请输入新密码（至少6位）"
                  />
                </div>
                
                <div className="form-group">
                  <label>确认新密码</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={editAdmin.confirmPassword}
                    onChange={handleEditAdminChange}
                    placeholder="请再次输入新密码"
                  />
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn btn-secondary"
                >
                  取消
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? '保存中...' : '保存'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {showDetailModal && selectedAdmin && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>管理员详情</h3>
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
                <span className="detail-value">{selectedAdmin.login_id}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">姓名：</span>
                <span className="detail-value">{selectedAdmin.name || '-'}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">创建时间：</span>
                <span className="detail-value">{new Date(selectedAdmin.created_at).toLocaleString('zh-CN')}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">更新时间：</span>
                <span className="detail-value">{new Date(selectedAdmin.updated_at).toLocaleString('zh-CN')}</span>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                onClick={() => handleDeleteAdmin(selectedAdmin.id)}
                className="btn btn-danger"
              >
                删除
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

export default AdminManagement;
