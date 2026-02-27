import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";

function AdminLayout() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Outlet />
      </div>
    </>
  );
}

export default AdminLayout;
