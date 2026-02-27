import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "../Styles/Profile.css";

function Profile() {
  const { user } = useContext(AuthContext);

  const [employeeId, setEmployeeId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [leave, setLeave] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const token = user?.token;

      const res = await axios.post(
        "http://localhost:3001/api/employee",
        { employeeId, name, email, password, leave },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessageType("success");
      setMessage(res.data.message);
      setEmployeeId("");
      setName("");
      setEmail("");
      setPassword("");
      setLeave("");
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "Error saving details");
    }
  };

  const handleCancel = () => {
    setEmployeeId("");
    setName("");
    setEmail("");
    setPassword("");
    setLeave("");
    setMessage("");
    setMessageType("");
  };

  return (
    <div className="profile-page">
      {/* Header Section */}
      <div className="profile-header">
        <div className="header-gradient"></div>
        <div className="header-content">
          <h1 className="page-title">👤 Employee Profile</h1>
          <p className="page-subtitle">Manage your employee information and details</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-content">
        <div className="profile-container">
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <h2>Employee Details</h2>
              <p>Update your profile information</p>
            </div>

            {/* Employee ID */}
            <div className="form-group">
              <label className="form-label">Employee ID</label>
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Enter your employee ID"
                className="form-input"
              />
            </div>

            {/* Name */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="form-input"
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="form-input"
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="form-input"
              />
            </div>

            {/* Leaves */}
            <div className="form-group">
              <label className="form-label">Number of Leaves</label>
              <input
                type="number"
                value={leave}
                onChange={(e) => setLeave(e.target.value)}
                placeholder="Enter number of leaves"
                className="form-input"
              />
            </div>

            {/* Message Display */}
            {message && (
              <div className={`message-box message-${messageType}`}>
                {messageType === "success" ? "✓" : "⚠️"} {message}
              </div>
            )}

            {/* Button Group */}
            <div className="button-group">
              <button type="submit" className="btn btn-submit">
                ✓ Save Changes
              </button>
              <button type="button" className="btn btn-cancel" onClick={handleCancel}>
                ✕ Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
