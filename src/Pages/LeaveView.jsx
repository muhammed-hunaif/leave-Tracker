import { useEffect, useState, useContext } from "react";
import axios from "axios";
import API_BASE_URL from "../api/api";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../Styles/LeaveView.css";

function LeaveView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [leave, setLeave] = useState(null);
  const [actionReason, setActionReason] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // 🔹 Fetch single leave
  useEffect(() => {
    if (!user?.token) return;

    const fetchLeave = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/leaves`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const selectedLeave = res.data.leaves.find(l => l._id === id);
        setLeave(selectedLeave);
      } catch {
        setError("Failed to fetch leave details");
      }
    };

    fetchLeave();
  }, [id, user]);

  // ✅ ONLY pending leave actions
  const isPending = leave?.status === "pending";

  // 🔹 Approve / Reject
  const handleAction = async (status) => {
    if (!actionReason.trim()) {
      setError("Reason is required");
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      await axios.put(
        `${API_BASE_URL}/leaves/${id}/action`,
        { status, actionReason },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      // ✅ UI immediately update
      setLeave(prev => ({
        ...prev,
        status,
      }));

      setSuccessMessage(`Leave ${status} successfully ✅`);
      setActionReason("");
      setError("");

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch {
      setError("Action failed ❌");
      setTimeout(() => setError(""), 3000);
    }
  };

  if (error && !leave) return (
    <div className="leave-view">
      <div className="error-container">
        <p className="error-text">{error}</p>
      </div>
    </div>
  );

  if (!leave) return (
    <div className="leave-view">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading leave details...</p>
      </div>
    </div>
  );

  return (
    <div className="leave-view">
      <button className="back-button" onClick={() => navigate(-1)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Back</span>
      </button>

      <div className="header-section">
        <div className="leave-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1>Leave Request Details</h1>
        <span className={`status-badge ${leave.status}`}>
          {leave.status === "pending" && "⏳ Pending"}
          {leave.status === "approved" && "✅ Approved"}
          {leave.status === "rejected" && "❌ Rejected"}
        </span>
      </div>

      <div className="card info-card">
        <div className="card-header">
          <h2>Employee Information</h2>
        </div>

        <div className="info-grid">
          <div className="info-item">
            <label>Employee ID</label>
            <span>{leave.employeeId?.employeeId}</span>
          </div>

          <div className="info-item">
            <label>Full Name</label>
            <span>{leave.employeeId?.name}</span>
          </div>

          <div className="info-item">
            <label>Email Address</label>
            <span>{leave.employeeId?.email}</span>
          </div>

          {/* <div className="info-item">
            <label>Leave Type</label>
            <span>{leave.leaveType?.name || "N/A"}</span>
          </div> */}

          <div className="info-item">
            <label>Number of Days</label>
            <span className="days-count">{leave.leaves} days</span>
          </div>

          <div className="info-item full-width">
            <label>Reason for Leave</label>
            <span className="reason-text">{leave.reason}</span>
          </div>
        </div>
      </div>

      {/* Manager Action Section - Only if Pending */}
      {isPending && (
        <div className="card action-card">
          <div className="card-header">
            <h2>Manager Action</h2>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 11l3 3L22 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="action-content">
            <div className="form-group">
              <label>Reason for Decision</label>
              <textarea
                placeholder="Enter reason for approval or rejection..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                rows="4"
                className="modern-textarea"
              />
            </div>

            <div className="action-buttons">
              <button
                className="approve-btn"
                onClick={() => handleAction("approved")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Approve Leave
              </button>

              <button
                className="reject-btn"
                onClick={() => handleAction("rejected")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Reject Leave
              </button>
            </div>

            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
          </div>
        </div>
      )}

      {/* Show action reason if already approved/rejected */}
      {!isPending && leave.actionReason && (
        <div className="card decision-card">
          <div className="card-header">
            <h2>Manager Decision</h2>
          </div>
          <div className="decision-content">
            <p className="decision-reason">{leave.actionReason}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeaveView;