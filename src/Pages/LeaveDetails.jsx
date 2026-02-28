import { useEffect, useState, useContext } from "react";
import axios from "axios";
import API_BASE_URL from "../api/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../Styles/LeaveDetails.css";

function LeaveDetails() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // 🔹 Initialize state from URL
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all");
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );
  //searchParams.get("page")this means => leaves?page=3

  const [leaves, setLeaves] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.token) return;

    // 🔹 Update URL
    const params = {};

    if (statusFilter !== "all") params.status = statusFilter;
    if (searchTerm) params.search = searchTerm;
    params.page = currentPage;
    params.limit = 6;

    setSearchParams(params);

    const fetchLeaves = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(`${API_BASE_URL}/leaves`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          params,
        });

        setLeaves(res.data.leaves);
        setTotalPages(res.data.totalPages);

      } catch (err) {
        console.error(err);
        setError("Unable to fetch leave details");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, [user, statusFilter, searchTerm, currentPage, setSearchParams]);

  return (
    <div className="leave-container">
      {/* Header Section */}
      <div className="leave-header">
        <div className="header-gradient"></div>
        <div className="leave-header-content">
          <h1 className="page-title" style={{ color: "wheat" }}>📋 Leave Requests</h1>
          <p className="page-subtitle">Review and manage all employee leave requests</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="leave-content">
        {/* Search + Filter */}
        <div className="search-filter-wrapper">
          <div className="search-filter-row">
            <input
              type="text"
              placeholder="Search by Name / ID / Email"
              value={searchTerm}
              onChange={(e) => {
                setCurrentPage(1); // reset page
                setSearchTerm(e.target.value);
              }}
              className="search-input-field"
            />

            <select
              value={statusFilter}
              onChange={(e) => {
                setCurrentPage(1); // reset page
                setStatusFilter(e.target.value);
              }}
              className="status-dropdown"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* 📋 Leave Cards */}
        <div className="leave-card-grid">
          {loading ? (
            <p>Loading...</p>
          ) : leaves.length === 0 ? (
            <p>No leave records found</p>
          ) : (
            leaves.map((leave) => (
              <div className="leave-card-box" key={leave._id}>
                <div className="card-top-row">
                  <span className="id-tag">#{leave.employeeId?.employeeId}</span>
                  <span className={`status-tag ${leave.status?.toLowerCase()}`}>
                    {leave.status}
                  </span>
                </div>

                <div className="card-main-content">
                  <h2 className="emp-name-text">{leave.employeeId?.name}</h2>
                  <p className="emp-email-text">{leave.employeeId?.email}</p>
                </div>

                <div className="card-leave-info">
                  <div className="info-badge">
                    <strong>{leave.leaves}</strong> Leaves
                  </div>
                  <p className="reason-text">"{leave.reason}"</p>
                </div>

                <button
                  className="card-view-btn"
                  onClick={() => navigate(`/admin/leaves/${leave._id}`)}
                >
                  View
                </button>
              </div>
            ))
          )}
        </div>

        {/* 🔥 Pagination Controls */}
        <div className="pagination-controls">
          <button
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            ← Previous
          </button>

          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next →
          </button>
        </div>

      </div>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default LeaveDetails;
