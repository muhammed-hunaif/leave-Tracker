import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../Styles/Navbar.css";
import Alert from "./Alert";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu
  const [successMessage, setSuccessMessage] = useState("");

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleNav = (path) => {
    navigate(path);
    setIsOpen(false); // Close menu after clicking
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setSuccessMessage("Logged out successfully!");
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  // Hide back button on the main admin dashboard page
  const showBack = location.pathname !== "/admin" && location.pathname !== "/admin/";

  return (
    <div className="admin-navbar">
      {successMessage && (
        <Alert
          message={successMessage}
          type="error"
          onClose={() => setSuccessMessage("")}
        />
      )}

      {showBack && (
        <button type="button" className="nav-back-btn" onClick={() => window.history.back()}>
          <span>&larr;</span> Back
        </button>
      )}
      <div className="logo">Admin Dashboard</div>

      {/* Hamburger Icon for Mobile */}
      <div className="menu-icon" onClick={toggleMenu}>
        <div className={isOpen ? "bar open" : "bar"}></div>
        <div className={isOpen ? "bar open" : "bar"}></div>
        <div className={isOpen ? "bar open" : "bar"}></div>
      </div>

      <div className={`nav-links ${isOpen ? "active" : ""}`}>
        <span onClick={() => handleNav("/admin")}>Dashboard</span>
        <span onClick={() => handleNav("/admin/create")}>Create Employee</span>
        <span onClick={() => handleNav("/admin/employees")}>Employees</span>
        <span onClick={() => handleNav("/admin/leaves")}>Leaves</span>
        <span className="logout" onClick={handleLogout}>Logout</span>
      </div>
    </div>
  );
}

export default Navbar;