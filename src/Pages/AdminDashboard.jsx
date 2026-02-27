import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/admin/dashboard-stats", {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [user]);

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate approval rate
  const totalRequests = stats?.totalLeaveRequests || 0;
  const approvedLeaves = stats?.approvedLeaves || 0;
  const approvalRate = totalRequests > 0 ? Math.round((approvedLeaves / totalRequests) * 100) : 0;

  return (
    <div className="admin-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-gradient"></div>
        <div className="header-content">
          <h1 className="page-title">📊 Admin Dashboard</h1>
          <p className="page-subtitle">System overview and employee management</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Top Hero Stats */}
        <div className="hero-stats">
          <div className="hero-card primary-hero">
            <div className="hero-icon">👥</div>
            <div className="hero-info">
              <p className="hero-label">Total Employees</p>
              <h2 className="hero-value">{stats?.totalEmployees || 0}</h2>
            </div>
          </div>

          <div className="hero-card accent-hero">
            <div className="hero-icon">📄</div>
            <div className="hero-info">
              <p className="hero-label">Total Requests</p>
              <h2 className="hero-value">{stats?.totalLeaveRequests || 0}</h2>
            </div>
          </div>
        </div>

        {/* Secondary Stats Grid */}
        <div className="stats-section">
          <h3 className="section-title">Leave Request Status</h3>

          <div className="stats-grid">
            {/* Pending Card */}
            <div className="stat-card pending-stat">
              <div className="stat-header">
                <span className="stat-icon">⏳</span>
                <span className="stat-label">Pending</span>
              </div>
              <div className="stat-number">{stats?.pendingLeaves || 0}</div>
              <div className="stat-bar">
                <div
                  className="stat-bar-fill pending-fill"
                  style={{ width: totalRequests > 0 ? ((stats?.pendingLeaves || 0) / totalRequests * 100) + '%' : 0 }}
                ></div>
              </div>
              <p className="stat-percentage">
                {totalRequests > 0 ? Math.round(((stats?.pendingLeaves || 0) / totalRequests) * 100) : 0}% awaiting approval
              </p>
            </div>

            {/* Approved Card */}
            <div className="stat-card approved-stat">
              <div className="stat-header">
                <span className="stat-icon">✓</span>
                <span className="stat-label">Approved</span>
              </div>
              <div className="stat-number">{stats?.approvedLeaves || 0}</div>
              <div className="stat-bar">
                <div
                  className="stat-bar-fill approved-fill"
                  style={{ width: totalRequests > 0 ? (approvedLeaves / totalRequests * 100) + '%' : 0 }}
                ></div>
              </div>
              <p className="stat-percentage">{approvalRate}% approval rate</p>
            </div>

            {/* Rejected Card */}
            <div className="stat-card rejected-stat">
              <div className="stat-header">
                <span className="stat-icon">✕</span>
                <span className="stat-label">Rejected</span>
              </div>
              <div className="stat-number">{stats?.rejectedLeaves || 0}</div>
              <div className="stat-bar">
                <div
                  className="stat-bar-fill rejected-fill"
                  style={{ width: totalRequests > 0 ? ((stats?.rejectedLeaves || 0) / totalRequests * 100) + '%' : 0 }}
                ></div>
              </div>
              <p className="stat-percentage">
                {totalRequests > 0 ? Math.round(((stats?.rejectedLeaves || 0) / totalRequests) * 100) : 0}% rejected
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
