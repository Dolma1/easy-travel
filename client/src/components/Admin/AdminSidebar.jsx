import { useState } from "react";
import {
  LayoutDashboard,
  Menu,
  NotebookPen,
  Layers,
  Users2,
  Handshake,
  MapPinned,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import LogoutButton from "@/components/Header/LogoutButton";

const SideBar = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/admin",
    },
    { icon: NotebookPen, label: "Journal", href: "/admin/all-journals" },
    { icon: MapPinned, label: "Travels Groups", href: "/admin/all-groups" },
    { icon: Users2, label: "Users", href: "/admin/all-users" },
    { icon: Handshake, label: "Settlement", href: "/admin/settlements" },
  ];

  return (
    <div
      className={cn(
        "flex  flex-col border-r  bg-slate-100 transition-all duration-300 ",
        isSidebarCollapsed ? "w-[80px]" : "w-[250px]"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4 ">
        {!isSidebarCollapsed ? (
          <span className="text-lg font-semibold flex gap-2 items-center text-[#586BAF]">
            <Layers className="h-6 w-6" />
            Admin
          </span>
        ) : (
          <Layers className="h-6 w-6  text-[#586BAF]" />
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-2 px-2">
          {navigationItems.map((item) => (
            <Link to={item.href} key={item.label}>
              <Button
                variant={
                  location.pathname === item.href ? "secondary" : "ghost"
                }
                className={cn(
                  "w-full justify-start",
                  isSidebarCollapsed ? "px-3" : "px-4"
                )}
              >
                <item.icon className="h-5 w-5" />
                {!isSidebarCollapsed && (
                  <span className="ml-3">{item.label} </span>
                )}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t p-4">
        <LogoutButton
          className="bg-no w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50"
          isSidebarCollapsed={isSidebarCollapsed} // Pass this prop
        />
      </div>
    </div>
  );
};

export default SideBar;
