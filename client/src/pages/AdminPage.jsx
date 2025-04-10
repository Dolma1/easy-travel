import { ScrollArea } from "@/components/ui/scroll-area";
import { AdminSidebar, AdminNavbar } from "../components";
import { Outlet } from "react-router-dom";
const AdminDashboardPage = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex flex-col w-full">
        <AdminNavbar />
        <ScrollArea className="h-[calc(100vh-75px)]">
          <Outlet />
        </ScrollArea>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
