import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/EmployeeNavbar.css";
import Alert from "./Alert";

function EmployeeNavbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleNav = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setSuccessMessage("Logged out successfully!");
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <div className="employee-navbar">
      {successMessage && (
        <Alert
          message={successMessage}
          type="error"
          onClose={() => setSuccessMessage("")}
        />
      )}
      <button className="nav-back-btn" onClick={() => navigate(-1)}>
        <span>&larr;</span> Back
      </button>
      <div className="logo">Employee Dashboard</div>

      <div className="menu-icon" onClick={toggleMenu}>
        <div className={isOpen ? "bar open" : "bar"}></div>
        <div className={isOpen ? "bar open" : "bar"}></div>
        <div className={isOpen ? "bar open" : "bar"}></div>
      </div>

      <div className={`nav-links ${isOpen ? "active" : ""}`}>
        <span onClick={() => handleNav("/employee")}>Dashboard</span>
        <span onClick={() => handleNav("/employee/apply-leave")}>Apply Leave</span>
        <span onClick={() => handleNav("/employee/leave-history")}>Leave History</span>
        <span className="logout" onClick={handleLogout}>Logout</span>
      </div>
    </div>
  );
}

export default EmployeeNavbar;
