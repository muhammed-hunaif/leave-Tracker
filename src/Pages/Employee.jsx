import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../api/api";
import "../Styles/Employee.css";

function EmployeeWelcome() {
  const [leaves, setLeaves] = useState("");
  const [reason, setReason] = useState("");
  const [leaveTypeId, setLeaveTypeId] = useState(""); // 🔥 NEW: Leave Type Selection
  const [leaveTypes, setLeaveTypes] = useState([]); // 🔥 NEW: Available Leave Types
  const [history, setHistory] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const token = localStorage.getItem("token");

  // 🔽 Fetch leave history and leave types on mount
  useEffect(() => {
    const fetchMyLeaves = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/leaves/my`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setHistory(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchLeaveTypes = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/leaves/leave-types/active`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLeaveTypes(res.data);
      } catch (err) {
        console.error("Failed to fetch leave types", err);
      }
    };

    fetchMyLeaves();
    fetchLeaveTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔽 Apply leave
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccess("");

    if (!leaveTypeId) {
      setErrorMessage("Please select a leave type");
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}/leaves/apply`,
        { leaves, reason, leaveTypeId }, // 🔥 Include leave type
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess(res.data.message);
      setLeaves("");
      setReason("");
      setLeaveTypeId("");

      // 🔁 Refresh history
      const historyRes = await axios.get(
        `${API_BASE_URL}/leaves/my`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHistory(historyRes.data);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Error applying leave");
    }
  };

  return (
    <div className="employee-container">
      <h1 className="welcome-title">Welcome Employee 👋</h1>

      {/* 🔹 Apply Leave */}
      <div className="apply-leave-section">
        <h2 className="section-title">Apply Leave</h2>
        <form className="leave-form" onSubmit={handleSubmit}>
          {/* Leave Type Selection - Professional Dropdown */}
          <div className="form-group">
            <div
              className={`custom-leave-dropdown ${isDropdownOpen ? "is-open" : ""}`}
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <div className="dropdown-selected">
                {leaveTypeId
                  ? leaveTypes.find((t) => t._id === leaveTypeId)?.name
                  : "Select Leave Type"}
                <span className="dropdown-caret"></span>
              </div>

              <div className="dropdown-menu">
                {leaveTypes.length === 0 ? (
                  <div className="dropdown-item disabled">No types available</div>
                ) : (
                  leaveTypes.map((type) => (
                    <div
                      key={type._id}
                      className={`dropdown-item ${leaveTypeId === type._id ? "selected" : ""}`}
                      onClick={() => {
                        setLeaveTypeId(type._id);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {type.name}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="form-group">
            <input
              type="number"
              placeholder="No of Leaves"
              value={leaves}
              onChange={(e) => setLeaves(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <textarea
              placeholder="Reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="form-textarea"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="apply-btn">Submit</button>

            {/* 🔥 TOGGLE BUTTON */}
            <button
              type="button"
              className="history-toggle-btn"
              onClick={() => setShowHistory(prev => !prev)}
            >
              {showHistory ? "Hide History" : "View History"}
            </button>
          </div>
        </form>
      </div>

      {errorMessage && <p className="error-text">{errorMessage}</p>}
      {success && <p className="success-text">{success}</p>}

      {/* 🔽 Leave History (TOGGLE) */}
      {showHistory && (
        <div className="leave-history-section">
          <hr className="divider" />
          <h2 className="section-title">My Leave History</h2>

          <div className="table-responsive">
            <table className="leave-history-table">
              <thead>
                <tr>
                  <th>Leave Type</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan="4">No leave history found</td>
                  </tr>
                ) : (
                  history.map((leave) => (
                    <tr key={leave._id}>
                      <td>{leave.leaveType?.name || "N/A"}</td>
                      <td>{leave.leaves}</td>
                      <td>{leave.reason}</td>
                      <td>{leave.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeWelcome;