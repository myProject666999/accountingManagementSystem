import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { transactionAPI } from '../services/api';
import '../App.css';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  
  const [searchParams, setSearchParams] = useState({
    search: '',
    type: '',
    category: '',
  });
  
  const [newTransaction, setNewTransaction] = useState({
    name: '',
    type: '支出',
    category: '',
    time: '',
    amount: '',
    description: '',
  });
  
  const [submitting, setSubmitting] = useState(false);

  const expenseCategories = ['餐饮', '交通', '购物', '娱乐', '医疗', '教育', '住房', '其他'];
  const incomeCategories = ['工资', '奖金', '投资', '兼职', '礼金', '其他'];

  useEffect(() => {
    fetchTransactions();
  }, [searchParams]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchParams.search) params.search = searchParams.search;
      if (searchParams.type) params.type = searchParams.type;
      if (searchParams.category) params.category = searchParams.category;
      
      const response = await transactionAPI.getAll(params);
      setTransactions(response.data);
    } catch (err) {
      setError('获取记账记录失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleNewTransactionChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!newTransaction.name || !newTransaction.category || !newTransaction.time || !newTransaction.amount) {
      setError('请填写所有必填项');
      return;
    }
    
    try {
      setSubmitting(true);
      
      const transactionData = {
        ...newTransaction,
        amount: parseFloat(newTransaction.amount),
      };
      
      await transactionAPI.create(transactionData);
      
      setShowAddModal(false);
      setNewTransaction({
        name: '',
        type: '支出',
        category: '',
        time: '',
        amount: '',
        description: '',
      });
      
      fetchTransactions();
    } catch (err) {
      setError(err.response?.data?.error || '添加失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm('确定要删除这条记账记录吗？')) {
      return;
    }
    
    try {
      await transactionAPI.delete(id);
      setShowDetailModal(false);
      fetchTransactions();
    } catch (err) {
      setError('删除失败');
      console.error(err);
    }
  };

  const viewTransactionDetail = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailModal(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN');
  };

  const getCategories = () => {
    return newTransaction.type === '收入' ? incomeCategories : expenseCategories;
  };

  return (
    <div className="app">
      <Navbar />
      
      <main className="main-content">
        <div className="page-header">
          <h1>记账管理</h1>
          <button 
            onClick={() => setShowAddModal(true)} 
            className="btn btn-primary"
          >
            + 添加记账
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="search-bar">
          <div className="search-group">
            <input
              type="text"
              name="search"
              value={searchParams.search}
              onChange={handleSearchChange}
              placeholder="搜索名称或用途..."
              className="search-input"
            />
          </div>
          
          <div className="search-group">
            <select
              name="type"
              value={searchParams.type}
              onChange={handleSearchChange}
              className="search-select"
            >
              <option value="">全部类型</option>
              <option value="收入">收入</option>
              <option value="支出">支出</option>
            </select>
          </div>
          
          <div className="search-group">
            <select
              name="category"
              value={searchParams.category}
              onChange={handleSearchChange}
              className="search-select"
            >
              <option value="">全部分类</option>
              {[...expenseCategories, ...incomeCategories].filter((cat, index, self) => 
                self.indexOf(cat) === index
              ).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="loading">加载中...</div>
        ) : transactions.length === 0 ? (
          <div className="empty-state">
            <p>暂无记账记录</p>
            <button 
              onClick={() => setShowAddModal(true)} 
              className="btn btn-primary"
            >
              添加第一条记账
            </button>
          </div>
        ) : (
          <div className="transaction-table-container">
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>名称</th>
                  <th>类型</th>
                  <th>分类</th>
                  <th>时间</th>
                  <th>金额</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.name}</td>
                    <td>
                      <span className={`type-badge ${transaction.type === '收入' ? 'income' : 'expense'}`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td>{transaction.category}</td>
                    <td>{formatDate(transaction.time)}</td>
                    <td className={`amount-cell ${transaction.type === '收入' ? 'income' : 'expense'}`}>
                      {transaction.type === '收入' ? '+' : '-'}¥{transaction.amount.toFixed(2)}
                    </td>
                    <td>
                      <button 
                        onClick={() => viewTransactionDetail(transaction)}
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
      
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>添加记账</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="btn-close"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAddTransaction}>
              <div className="modal-body">
                <div className="form-group">
                  <label>名称 *</label>
                  <input
                    type="text"
                    name="name"
                    value={newTransaction.name}
                    onChange={handleNewTransactionChange}
                    required
                    placeholder="请输入名称"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>类型 *</label>
                    <select
                      name="type"
                      value={newTransaction.type}
                      onChange={handleNewTransactionChange}
                      required
                    >
                      <option value="支出">支出</option>
                      <option value="收入">收入</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>分类 *</label>
                    <select
                      name="category"
                      value={newTransaction.category}
                      onChange={handleNewTransactionChange}
                      required
                    >
                      <option value="">请选择</option>
                      {getCategories().map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>时间 *</label>
                    <input
                      type="datetime-local"
                      name="time"
                      value={newTransaction.time}
                      onChange={handleNewTransactionChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>金额 *</label>
                    <input
                      type="number"
                      name="amount"
                      value={newTransaction.amount}
                      onChange={handleNewTransactionChange}
                      required
                      min="0.01"
                      step="0.01"
                      placeholder="请输入金额"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>用途</label>
                  <textarea
                    name="description"
                    value={newTransaction.description}
                    onChange={handleNewTransactionChange}
                    placeholder="请输入用途说明（可选）"
                    rows="3"
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
      
      {showDetailModal && selectedTransaction && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>记账详情</h3>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="btn-close"
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">名称：</span>
                <span className="detail-value">{selectedTransaction.name}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">类型：</span>
                <span className={`detail-value type-badge ${selectedTransaction.type === '收入' ? 'income' : 'expense'}`}>
                  {selectedTransaction.type}
                </span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">分类：</span>
                <span className="detail-value">{selectedTransaction.category}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">时间：</span>
                <span className="detail-value">{formatDate(selectedTransaction.time)}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">金额：</span>
                <span className={`detail-value amount ${selectedTransaction.type === '收入' ? 'income' : 'expense'}`}>
                  {selectedTransaction.type === '收入' ? '+' : '-'}¥{selectedTransaction.amount.toFixed(2)}
                </span>
              </div>
              
              {selectedTransaction.description && (
                <div className="detail-row">
                  <span className="detail-label">用途：</span>
                  <span className="detail-value">{selectedTransaction.description}</span>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button 
                onClick={() => handleDeleteTransaction(selectedTransaction.id)}
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

export default Transactions;
