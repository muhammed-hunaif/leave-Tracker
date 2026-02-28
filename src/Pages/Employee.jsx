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
    <div className="employee-container" style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome Employee 👋</h1>

      {/* 🔹 Apply Leave */}
      <h2>Apply Leave</h2>
      <form className="leave-form" onSubmit={handleSubmit}>
        {/* 🔥 NEW: Leave Type Dropdown */}
        <select
          value={leaveTypeId}
          onChange={(e) => setLeaveTypeId(e.target.value)}
          required
        >
          <option value="">Select Leave Type</option>
          {leaveTypes.map((type) => (
            <option key={type._id} value={type._id}>
              {type.name}
            </option>
          ))}
        </select>
        <br /><br />

        <input
          type="number"
          placeholder="No of Leaves"
          value={leaves}
          onChange={(e) => setLeaves(e.target.value)}
          required
        />
        <br /><br />

        <textarea
          placeholder="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />
        <br /><br />

        <button type="submit">Submit</button>

        {/* 🔥 TOGGLE BUTTON */}
        <button
          type="button"
          onClick={() => setShowHistory(prev => !prev)}
          style={{ marginLeft: "10px" }}
        >
          {showHistory ? "Hide Leave History" : "Leave History"}
        </button>
      </form>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      {/* 🔽 Leave History (TOGGLE) */}
      {showHistory && (
        <>
          <hr />
          <h2>My Leave History</h2>

          <table border="1" align="center" cellPadding="5">
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
        </>
      )}
    </div>
  );
}

export default EmployeeWelcome;