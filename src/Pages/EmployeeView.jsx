import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "../styles/EmployeeView.css";

function EmployeeView() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [employee, setEmployee] = useState(null);
  const [originalEmployee, setOriginalEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [adminPassword, setAdminPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [activeSection, setActiveSection] = useState(null);

  // ✅ Dynamic Leave Types
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [isLeaveEditing, setIsLeaveEditing] = useState(false);
  const [leaveMessage, setLeaveMessage] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // 🔹 Fetch Employee
  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/employee/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        setEmployee(res.data);
        setOriginalEmployee(res.data);
      })
      .catch((err) => console.log(err));
  }, [id, user]);

  // 🔹 Fetch Leave Types + Employee Balances
  const fetchLeaveTypes = async () => {
    try {
      const typesRes = await axios.get("http://localhost:3001/api/leaves/leave-types/active",
        {
          headers: { Authorization: `Bearer ${user.token}` }
        }
      );

      const balanceRes = await axios.get(
        `http://localhost:3001/api/leaves/employee-leave-settings/${id}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const balances = balanceRes.data.leaveBalances || [];

      const merged = typesRes.data.map((type) => {
        const found = balances.find(
          (b) => b.leaveTypeId._id === type._id
        );

        return {
          ...type,
          days: found ? found.days : 0,
          newDays: found ? found.days : 0, // ✅ Initialize with current balance
        };
      });

      setLeaveTypes(merged);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔹 Update Employee Info
  const handleUpdateDetails = async () => {
    try {
      const res = await axios.put(
        `http://localhost:3001/api/employee/${id}`,
        { name: employee.name, email: employee.email },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      alert(res.data.message);
      setOriginalEmployee(employee);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  // 🔹 Cancel Edit
  const handleCancelEdit = () => {
    setEmployee(originalEmployee);
    setIsEditing(false);
    setError("");
  };

  // 🔹 Change Password
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:3001/api/employee/${id}/password`,
        { adminPassword, newPassword },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setMessage(res.data.message);
      setAdminPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Password update failed");
    }
  };

  // 🔹 Cancel Password Change (Smart Cancel)
  const handleCancelPassword = () => {
    // Check if any field has input
    const hasInput = adminPassword || newPassword || confirmPassword;

    if (hasInput) {
      // If user has typed something, just clear the fields
      setAdminPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      setMessage("");
    } else {
      // If fields are empty, close the section
      setActiveSection(null);
    }
  };

  // 🔹 Save Leave Types - Set exact value
  const handleLeaveSave = async () => {
    try {
      for (const leave of leaveTypes) {
        if (leave.newDays !== undefined && leave.newDays !== "") {
          await axios.put(
            "http://localhost:3001/api/leaves/employee-leave-settings/update",
            {
              employeeId: id,
              leaveTypeId: leave._id,
              days: Number(leave.newDays), // ✅ Set exact days value (not adding)
            },
            { headers: { Authorization: `Bearer ${user.token}` } }
          );
        }
      }

      setLeaveMessage("Leave balance updated successfully ✅");
      setIsLeaveEditing(false);
      fetchLeaveTypes();
      setTimeout(() => setLeaveMessage(""), 2500);
    } catch {
      setLeaveMessage("Update failed ❌");
    }
  };

  if (!employee) return (
    <div className="employee-view">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading employee data...</p>
      </div>
    </div>
  );

  return (
    <div className="employee-view">
      <button className="back-button" onClick={() => window.history.back()}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Back</span>
      </button>

      <div className="header-section">
        <div className="profile-avatar">
          {employee.name.charAt(0).toUpperCase()}
        </div>
        <h1>{employee.name}</h1>
        <p className="employee-id">ID: {employee.employeeId}</p>
      </div>

      {/* Profile Information Card */}
      <div className="card profile-card">
        <div className="card-header">
          <h2>Profile Information</h2>
          {!isEditing && (
            <button className="edit-icon-btn" onClick={() => setIsEditing(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>

        <div className="profile-info">
          <div className="info-row">
            <label>Full Name</label>
            {isEditing ? (
              <input
                type="text"
                value={employee.name}
                onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
                className="modern-input"
              />
            ) : (
              <span className="info-value">{employee.name}</span>
            )}
          </div>

          <div className="info-row">
            <label>Email Address</label>
            {isEditing ? (
              <input
                type="email"
                value={employee.email}
                onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
                className="modern-input"
              />
            ) : (
              <span className="info-value">{employee.email}</span>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="action-buttons">
            <button className="cancel-btn" onClick={handleCancelEdit}>
              Cancel
            </button>
            <button className="save-btn" onClick={handleUpdateDetails}>
              Save Changes
            </button>
          </div>
        )}

        {error && <p className="error-text">{error}</p>}
      </div>

      {/* Password Section */}
      <div className="section-card">
        <button
          className={`section-toggle ${activeSection === "password" ? "active" : ""}`}
          onClick={() => setActiveSection(activeSection === "password" ? null : "password")}
        >
          <div className="toggle-content">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Change Password</span>
          </div>
          <svg className="chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {activeSection === "password" && (
          <div className="section-content">
            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label>Admin Password</label>
                <input
                  type="password"
                  placeholder="Enter admin password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                  className="modern-input"
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="modern-input"
                />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="modern-input"
                />
              </div>

              <div className="action-buttons">
                <button type="button" className="cancel-btn" onClick={handleCancelPassword}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">Update Password</button>
              </div>

              {error && <p className="error-text">{error}</p>}
              {message && <p className="success-text">{message}</p>}
            </form>
          </div>
        )}
      </div>

      {/* Leave Management Section */}
      <div className="section-card">
        <button
          className={`section-toggle ${activeSection === "leaves" ? "active" : ""}`}
          onClick={() => {
            setActiveSection(activeSection === "leaves" ? null : "leaves");
            if (activeSection !== "leaves") fetchLeaveTypes();
          }}
        >
          <div className="toggle-content">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Leave Balance</span>
          </div>
          <svg className="chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {activeSection === "leaves" && (
          <div className="section-content">
            {leaveMessage && <p className="success-text">{leaveMessage}</p>}

            <div className="leave-table">
              {leaveTypes.map((leave) => (
                <div key={leave._id} className="leave-item">
                  <div className="leave-info">
                    <span className="leave-name">{leave.name}</span>
                    <span className="leave-balance">{leave.days} days</span>
                  </div>

                  {isLeaveEditing && (
                    <div className="leave-input-group">
                      <label>Set days:</label>
                      <input
                        type="number"
                        min="0"
                        value={leave.newDays}
                        onChange={(e) =>
                          setLeaveTypes(prev =>
                            prev.map(l =>
                              l._id === leave._id ? { ...l, newDays: e.target.value } : l
                            )
                          )
                        }
                        className="leave-input"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="action-buttons">
              {!isLeaveEditing ? (
                <button className="edit-btn compact-btn" onClick={() => setIsLeaveEditing(true)}>
                  Edit Leave Balance
                </button>
              ) : (
                <>
                  <button className="cancel-btn" onClick={() => {
                    setIsLeaveEditing(false);
                    fetchLeaveTypes();
                  }}>
                    Cancel
                  </button>
                  <button className="save-btn" onClick={handleLeaveSave}>
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeeView;