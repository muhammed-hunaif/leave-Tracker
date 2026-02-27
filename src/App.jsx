import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Profile from "./Pages/Profile";
import Home from "./Pages/Home";
import AdminDashboard from "./Pages/AdminDashboard";
import EmployeeDashboard from "./Pages/EmployeeDashboard";
import LeaveDetails from "./Pages/LeaveDetails";
import LeaveView from "./Pages/LeaveView";
import ApplyLeave from "./Pages/ApplyLeave";
import ApplyLeaveHistory from "./Pages/ApplyLeaveHistory";
import EmployeeDetails from "./Pages/EmployeeDetails";
import EmployeeView from "./Pages/EmployeeView";
import AdminLayout from "./Layouts/AdminLayout";
import EmployeeLayout from "./Layouts/EmployeeLayout";

export default function App() {

  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ---------------- ADMIN ROUTES ---------------- */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="create" element={<Profile />} />
          <Route path="employees" element={<EmployeeDetails />} />
          <Route path="employee/:id" element={<EmployeeView />} />
          <Route path="leaves" element={<LeaveDetails />} />
          <Route path="leaves/:id" element={<LeaveView />} />
        </Route>

        {/* ---------------- EMPLOYEE ROUTES ---------------- */}
        <Route path="/employee" element={<EmployeeLayout />}>
          <Route index element={<EmployeeDashboard />} />
          <Route path="apply-leave" element={<ApplyLeave />} />
          <Route path="leave-history" element={<ApplyLeaveHistory />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
