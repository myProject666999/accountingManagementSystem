import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { transactionAPI, statsAPI } from '../services/api';
import '../App.css';

const Dashboard = () => {
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [transactionsRes, statsRes] = await Promise.all([
        transactionAPI.getAll(),
        statsAPI.getMonthly(),
      ]);
      
      setRecentTransactions(transactionsRes.data.slice(0, 5));
      
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const currentMonthStats = statsRes.data.find(
        s => s.year === currentYear && s.month === currentMonth
      );
      
      setMonthlyStats(currentMonthStats || { income: 0, expense: 0, net_income: 0 });
    } catch (err) {
      setError('获取数据失败，请稍后重试');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN');
  };

  if (loading) {
    return (
      <div className="app">
        <Navbar />
        <div className="loading">加载中...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar />
      
      <main className="main-content">
        <h1>欢迎回来</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="stats-cards">
          <div className="stat-card income">
            <h3>本月收入</h3>
            <p className="amount">¥{monthlyStats?.income?.toFixed(2) || '0.00'}</p>
          </div>
          
          <div className="stat-card expense">
            <h3>本月支出</h3>
            <p className="amount">¥{monthlyStats?.expense?.toFixed(2) || '0.00'}</p>
          </div>
          
          <div className="stat-card net">
            <h3>本月结余</h3>
            <p className={`amount ${(monthlyStats?.net_income || 0) >= 0 ? 'positive' : 'negative'}`}>
              ¥{monthlyStats?.net_income?.toFixed(2) || '0.00'}
            </p>
          </div>
        </div>
        
        <div className="section">
          <div className="section-header">
            <h2>最近记账</h2>
            <Link to="/transactions" className="btn btn-secondary">
              查看全部
            </Link>
          </div>
          
          {recentTransactions.length === 0 ? (
            <div className="empty-state">
              <p>暂无记账记录</p>
              <Link to="/transactions" className="btn btn-primary">
                添加第一条记账
              </Link>
            </div>
          ) : (
            <div className="transaction-list">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="transaction-item">
                  <div className="transaction-info">
                    <h4>{transaction.name}</h4>
                    <p className="transaction-meta">
                      {transaction.type} · {transaction.category} · {formatDate(transaction.time)}
                    </p>
                  </div>
                  <p className={`transaction-amount ${transaction.type === '收入' ? 'income' : 'expense'}`}>
                    {transaction.type === '收入' ? '+' : '-'}¥{transaction.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="quick-actions">
          <Link to="/transactions" className="action-card">
            <div className="action-icon">📝</div>
            <h3>添加记账</h3>
            <p>记录新的收入或支出</p>
          </Link>
          
          <Link to="/stats" className="action-card">
            <div className="action-icon">📊</div>
            <h3>查看统计</h3>
            <p>了解您的财务状况</p>
          </Link>
          
          <Link to="/profile" className="action-card">
            <div className="action-icon">👤</div>
            <h3>个人信息</h3>
            <p>管理您的账户信息</p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
