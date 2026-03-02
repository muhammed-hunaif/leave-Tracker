import { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../api/api";
import Alert from "../Components/Alert";
import "../Styles/ApplyLeave.css";

function ApplyLeave() {
  const [leaveType, setLeaveType] = useState("");
  const [numOfLeaves, setNumOfLeaves] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [leaveTypesList, setLeaveTypesList] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);

  const token = localStorage.getItem("token");


  // 🔹 Fetch Leave Types
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/leaves/leave-types`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLeaveTypesList(response.data);
      } catch (error) {
        console.error("Error fetching leave types", error);
        setErrorMessage("Unable to load leave types");
      } finally {
        setLoadingTypes(false);
      }
    };

    fetchLeaveTypes();
  }, [token]);

  // 🔹 Submit Leave Application
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/leaves/apply`,
        {
          leaveType,
          numOfLeaves: Number(numOfLeaves),
          leaveReason,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccessMessage(response.data.message);

      // Reset form
      setTimeout(() => {
        setLeaveType("");
        setNumOfLeaves("");
        setLeaveReason("");
        setSuccessMessage("");
      }, 1500);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Error applying leave"
      );
    }
  };

  // 🔹 Handle Cancel
  const handleCancel = () => {
    setLeaveType("");
    setNumOfLeaves("");
    setLeaveReason("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  // 🔹 Custom Dropdown State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const selectedType = leaveTypesList.find(t => t._id === leaveType);

  return (
    <div className="apply-leave-page">
      {successMessage && (
        <Alert
          message={successMessage}
          type="success"
          onClose={() => setSuccessMessage("")}
        />
      )}
      {errorMessage && (
        <Alert
          message={errorMessage}
          type="error"
          onClose={() => setErrorMessage("")}
        />
      )}

      <div className="apply-leave-container">
        <div className="leave-header">
          <h1>📝 Apply For Leave</h1>
          <p>Submit your leave request and we'll process it shortly</p>
        </div>

        <form className="leave-form" onSubmit={handleSubmit}>
          {/* Leave Type - Professional Hover Dropdown */}
          <div className="form-group">
            <label className="form-label">Leave Type</label>
            <div
              className={`custom-leave-dropdown ${isDropdownOpen ? "is-open" : ""}`}
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <div className="dropdown-selected">
                {selectedType ? selectedType.name : "Choose Leave Type"}
                <span className="dropdown-caret"></span>
              </div>

              <div className="dropdown-menu">
                {loadingTypes ? (
                  <div className="dropdown-item disabled">Loading types...</div>
                ) : leaveTypesList.length === 0 ? (
                  <div className="dropdown-item disabled">No types found</div>
                ) : (
                  leaveTypesList.map((type) => (
                    <div
                      key={type._id}
                      className={`dropdown-item ${leaveType === type._id ? "selected" : ""}`}
                      onClick={() => {
                        setLeaveType(type._id);
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

          {/* Number of Leaves */}
          <div className="form-group">
            <label className="form-label">Number of Leaves</label>
            <input
              type="number"
              min="1"
              placeholder="e.g., 5"
              value={numOfLeaves}
              onChange={(e) => setNumOfLeaves(e.target.value)}
              required
              className="form-input"
            />
          </div>

          {/* Reason */}
          <div className="form-group">
            <label className="form-label">Reason</label>
            <textarea
              placeholder="Please provide a reason for your leave request..."
              value={leaveReason}
              onChange={(e) => setLeaveReason(e.target.value)}
              required
              className="form-textarea"
            />
          </div>

          {/* Button Group */}
          <div className="button-group">
            <button type="submit" className="btn btn-submit">
              ✓ Submit Request
            </button>
            <button type="button" className="btn btn-cancel" onClick={handleCancel}>
              ✕ Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplyLeave;
