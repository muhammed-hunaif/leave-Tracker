import React from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      <div className="home-card">
        <h1>Leave Tracker</h1>
        <p className="home-subtitle">Manage your time, simplify your work life.</p>

        <div className="home-buttons">
          <button className="btn-signup" onClick={() => navigate("/signup")}>
            Create Account
          </button>

          <button className="btn-admin" onClick={() => navigate("/login?role=admin")}>
            Admin Portal
          </button>

          <button className="btn-employee" onClick={() => navigate("/login?role=employee")}>
            Employee Portal
          </button>
        </div>

        <div className="home-footer">
          &copy; {new Date().getFullYear()} Leave Management System
        </div>
      </div>
    </div>
  );
}

export default Home;
