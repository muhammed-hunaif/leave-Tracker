import { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/EmployeeDashboard.css";

function EmployeeDashboard() {
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      console.log("No token found");
      return;
    }

    axios.get("http://localhost:3001/api/employee/dashboard-stats", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        console.log("EMPLOYEE DASHBOARD DATA:", res.data);
        setStats(res.data);
      })
      .catch(err => {
        console.error("Dashboard Error:", err.response?.data || err.message);
      });
  }, [token]);

  if (!stats) return <p>Loading dashboard...</p>;

  const totalRequests = (stats.pendingLeaves || 0) + (stats.approvedLeaves || 0) + (stats.rejectedLeaves || 0) || 1;
  const pendingPercent = totalRequests > 0 ? Math.round((stats.pendingLeaves || 0) / totalRequests * 100) : 0;
  const approvedPercent = totalRequests > 0 ? Math.round((stats.approvedLeaves || 0) / totalRequests * 100) : 0;
  const rejectedPercent = totalRequests > 0 ? Math.round((stats.rejectedLeaves || 0) / totalRequests * 100) : 0;

  return (
    <div className="employee-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-gradient"></div>
        <div className="header-content">
          <h1 className="page-title">📅 Employee Dashboard</h1>
          <p className="page-subtitle">Track your leave requests and approvals</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        <div className="charts-container">
          {/* Total Applied Leaves */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>📋 Total Leaves Applied</h3>
              <span className="chart-value">{stats.totalLeavesApplied || 0}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill all" style={{ width: '100%' }}></div>
            </div>
            <p className="chart-info">Total requests submitted</p>
          </div>

          {/* Pending Leaves */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>🟡 Pending Leaves</h3>
              <span className="chart-value">{stats.pendingLeaves || 0}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill pending" style={{ width: `${pendingPercent}%` }}></div>
            </div>
            <div className="chart-footer">
              <span className="percentage">{pendingPercent}%</span>
              <span className="label">Awaiting approval</span>
            </div>
          </div>

          {/* Approved Leaves */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>🟢 Approved Leaves</h3>
              <span className="chart-value">{stats.approvedLeaves || 0}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill approved" style={{ width: `${approvedPercent}%` }}></div>
            </div>
            <div className="chart-footer">
              <span className="percentage">{approvedPercent}%</span>
              <span className="label">Confirmed requests</span>
            </div>
          </div>

          {/* Rejected Leaves */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>🔴 Rejected Leaves</h3>
              <span className="chart-value">{stats.rejectedLeaves || 0}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill rejected" style={{ width: `${rejectedPercent}%` }}></div>
            </div>
            <div className="chart-footer">
              <span className="percentage">{rejectedPercent}%</span>
              <span className="label">Declined requests</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
