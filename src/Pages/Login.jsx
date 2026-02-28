import React, { useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../api/api";
import "../Styles/Login.css";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const role = searchParams.get("role");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedRole, setSelectedRole] = useState(role || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Email and Password are required");
      return;
    }

    if (!selectedRole) {
      setErrorMessage("Please select a role (Admin or Employee)");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/login`,
        { email, password, role: selectedRole }
      );

      dispatch({ type: "LOGIN", payload: response.data });
      localStorage.setItem("token", response.data.token);

      if (response.data.role === "employee") {
        navigate("/employee");
      } else {
        navigate("/admin");
      }

    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Invalid email or password"
      );
    }
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const roles = [
    { value: "admin", label: "Administrator" },
    { value: "employee", label: "Employee" }
  ];

  const handleRoleSelect = (roleVal) => {
    setSelectedRole(roleVal);
    setIsDropdownOpen(false);
  };

  return (
    <div className="login-page-wrapper">
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      <div className="login-card">
        <div className="login-header">
          <h1>{role === "employee" ? "Employee Portal" : "Admin Portal"}</h1>
          <p>Enter your credentials to access your dashboard</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Access Role</label>
            <div
              className={`custom-role-dropdown ${isDropdownOpen ? "is-open" : ""}`}
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <div className="dropdown-selected">
                {selectedRole ?
                  roles.find(r => r.value === selectedRole)?.label :
                  "Choose Role"}
                <span className="dropdown-caret"></span>
              </div>

              <div className="dropdown-menu">
                {roles.map((r) => (
                  <div
                    key={r.value}
                    className={`dropdown-item ${selectedRole === r.value ? "selected" : ""}`}
                    onClick={() => handleRoleSelect(r.value)}
                  >
                    {r.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="e.g. name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {errorMessage && <p className="error-text-msg">{errorMessage}</p>}

          <button type="submit" className="signin-btn">Sign In to Dashboard</button>

          <div className="back-home" onClick={() => navigate("/")}>
            <span>&larr;</span> Back to Selection
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
