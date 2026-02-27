import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/LeaveHistory.css";

function ApplyLeaveHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3001/api/leaves/my",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setHistory(res.data);
      } catch (err) {
        setError("Failed to load leave history");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, [token]);

  return (
    <div className="leave-history-page">
      {/* Header Section */}
      <div className="history-header">
        <div className="header-gradient"></div>
        <div className="header-content">
          <h1 className="page-title">Leave History</h1>
          <p className="page-subtitle">Track all your leave requests and their current status</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="history-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your leave history...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
          </div>
        ) : history.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h2>No Leave Requests Yet</h2>
            <p>You haven't submitted any leave requests. Start by applying for leave.</p>
          </div>
        ) : (
          <div className="timeline-container">
            {history.map((leave, index) => (
              <div key={leave._id} className="timeline-item">
                {/* Timeline Dot */}
                <div className={`timeline-dot ${leave.status.toLowerCase()}`}>
                  {leave.status === 'approved' && '✓'}
                  {leave.status === 'pending' && '⏳'}
                  {leave.status === 'rejected' && '✕'}
                </div>

                {/* Timeline Content */}
                <div className="timeline-content">
                  <div className="content-header">
                    <span className={`status-badge ${leave.status.toLowerCase()}`}>
                      {leave.status}
                    </span>
                    <span className="days-badge">📅 {leave.leaves} day{leave.leaves > 1 ? 's' : ''}</span>
                  </div>

                  <div className="content-body">
                    <p className="reason-text">{leave.reason}</p>
                  </div>

                  <div className="content-footer">
                    <small className="request-type">Leave Request #{index + 1}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ApplyLeaveHistory;
