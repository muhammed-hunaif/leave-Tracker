import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "../styles/EmployeeDetails.css";


function EmployeeDetails() {
  const { user } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.token) return;

    axios
      .get("http://localhost:3001/api/employee/", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => setEmployees(res.data))
      .catch((err) => console.log(err));
  }, [user]);

  return (
    <div className="employee-details-page">
      {/* Header Section */}
      <div className="details-header">
        <div className="header-gradient"></div>
        <div className="header-content">
          <h1 className="page-title">👥 Employee Directory</h1>
          <p className="page-subtitle">Manage and view all employees in your system</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="details-content">
        <div className="employee-grid">
        {employees.map((emp) => (
          <div className="employee-card" key={emp._id}>
            <div className="card-header">
              <span className="emp-id">#{emp.employeeId}</span>
              <span className="emp-leave-badge">{emp.leave} Leaves</span>
            </div>

            <div className="card-body">
              <h2 className="emp-name">{emp.name}</h2>
              <p className="emp-email">{emp.email}</p>
            </div>

            <div className="card-footer">
              <button
                className="action-btn"
                onClick={() => navigate(`/admin/employee/${emp._id}`)}
              >
                View
              </button>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}

export default EmployeeDetails;
