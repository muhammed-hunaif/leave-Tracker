import { Outlet } from "react-router-dom";
import EmployeeNavbar from "../Components/EmployeeNavbar";

function EmployeeLayout() {
  return (
    <div>
      <EmployeeNavbar />
      <Outlet />
    </div>
  );
}

export default EmployeeLayout;
