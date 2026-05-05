import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { statsAPI } from '../services/api';
import '../App.css';

const Stats = () => {
  const [viewMode, setViewMode] = useState('monthly');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState('');
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [yearlyStats, setYearlyStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const months = [
    { value: '', label: '全年' },
    { value: '1', label: '1月' },
    { value: '2', label: '2月' },
    { value: '3', label: '3月' },
    { value: '4', label: '4月' },
    { value: '5', label: '5月' },
    { value: '6', label: '6月' },
    { value: '7', label: '7月' },
    { value: '8', label: '8月' },
    { value: '9', label: '9月' },
    { value: '10', label: '10月' },
    { value: '11', label: '11月' },
    { value: '12', label: '12月' },
  ];

  useEffect(() => {
    fetchStats();
  }, [viewMode, selectedYear, selectedMonth]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');

      if (viewMode === 'monthly') {
        const params = { year: selectedYear };
        if (selectedMonth) {
          params.month = selectedMonth;
        }
        const response = await statsAPI.getMonthly(params);
        setMonthlyStats(response.data);
      } else {
        const params = {};
        if (selectedYear) {
          params.year = selectedYear;
        }
        const response = await statsAPI.getYearly(params);
        setYearlyStats(response.data);
      }
    } catch (err) {
      setError('获取统计数据失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (month) => {
    const monthNames = ['', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    return monthNames[month] || month;
  };

  const calculateTotals = (stats) => {
    const totalIncome = stats.reduce((sum, s) => sum + s.income, 0);
    const totalExpense = stats.reduce((sum, s) => sum + s.expense, 0);
    const totalNet = totalIncome - totalExpense;
    return { totalIncome, totalExpense, totalNet };
  };

  const totals = viewMode === 'monthly' 
    ? calculateTotals(monthlyStats)
    : calculateTotals(yearlyStats);

  return (
    <div className="app">
      <Navbar />
      
      <main className="main-content">
        <h1>财务统计</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="stats-controls">
          <div className="view-toggle">
            <button 
              className={`btn ${viewMode === 'monthly' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('monthly')}
            >
              月统计
            </button>
            <button 
              className={`btn ${viewMode === 'yearly' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('yearly')}
            >
              年统计
            </button>
          </div>
          
          <div className="filter-controls">
            <div className="filter-group">
              <label>年份：</label>
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}年</option>
                ))}
              </select>
            </div>
            
            {viewMode === 'monthly' && (
              <div className="filter-group">
                <label>月份：</label>
                <select 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  {months.map(month => (
                    <option key={month.value} value={month.value}>{month.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
        
        <div className="stats-cards">
          <div className="stat-card income">
            <h3>{viewMode === 'monthly' ? (selectedMonth ? '本月收入' : '年度总收入') : '年度收入'}</h3>
            <p className="amount">¥{totals.totalIncome.toFixed(2)}</p>
          </div>
          
          <div className="stat-card expense">
            <h3>{viewMode === 'monthly' ? (selectedMonth ? '本月支出' : '年度总支出') : '年度支出'}</h3>
            <p className="amount">¥{totals.totalExpense.toFixed(2)}</p>
          </div>
          
          <div className="stat-card net">
            <h3>{viewMode === 'monthly' ? (selectedMonth ? '本月结余' : '年度总结余') : '年度结余'}</h3>
            <p className={`amount ${totals.totalNet >= 0 ? 'positive' : 'negative'}`}>
              ¥{totals.totalNet.toFixed(2)}
            </p>
          </div>
        </div>
        
        {loading ? (
          <div className="loading">加载中...</div>
        ) : (
          <div className="section">
            <h2>{viewMode === 'monthly' ? '月度明细' : '年度明细'}</h2>
            
            {viewMode === 'monthly' ? (
              monthlyStats.length === 0 ? (
                <div className="empty-state">
                  <p>暂无统计数据</p>
                </div>
              ) : (
                <div className="stats-table-container">
                  <table className="stats-table">
                    <thead>
                      <tr>
                        <th>月份</th>
                        <th>收入</th>
                        <th>支出</th>
                        <th>结余</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyStats.sort((a, b) => a.month - b.month).map((stat, index) => (
                        <tr key={index}>
                          <td>{stat.year}年{getMonthName(stat.month)}</td>
                          <td className="income">¥{stat.income.toFixed(2)}</td>
                          <td className="expense">¥{stat.expense.toFixed(2)}</td>
                          <td className={stat.net_income >= 0 ? 'positive' : 'negative'}>
                            ¥{stat.net_income.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              yearlyStats.length === 0 ? (
                <div className="empty-state">
                  <p>暂无统计数据</p>
                </div>
              ) : (
                <div className="stats-table-container">
                  <table className="stats-table">
                    <thead>
                      <tr>
                        <th>年份</th>
                        <th>收入</th>
                        <th>支出</th>
                        <th>结余</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yearlyStats.sort((a, b) => b.year - a.year).map((stat, index) => (
                        <tr key={index}>
                          <td>{stat.year}年</td>
                          <td className="income">¥{stat.income.toFixed(2)}</td>
                          <td className="expense">¥{stat.expense.toFixed(2)}</td>
                          <td className={stat.net_income >= 0 ? 'positive' : 'negative'}>
                            ¥{stat.net_income.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Stats;
