import { useState } from "react";
import {
  LayoutDashboard,
  PieChart,
  Settings,
  Wallet,
  Menu,
  NotebookPen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { LogoutButton } from "..";

const Side_bar = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigationItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true, href: "/dashboard" },
    { icon: NotebookPen, label: "Journal", href: "/journal" },
    { icon: Wallet, label: "Budgets" },
    { icon: PieChart, label: "Reports" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <div
      className={cn(
        "flex h-screen flex-col border-r bg-card transition-all duration-300",
        isSidebarCollapsed ? "w-[80px]" : "w-[250px]"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!isSidebarCollapsed && (
          <span className="text-lg font-semibold">ExpenseTracker</span>
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
                key={item.label}
                variant={item.active ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isSidebarCollapsed ? "px-3" : "px-4"
                )}
              >
                <item.icon className="h-5 w-5" />
                {!isSidebarCollapsed && (
                  <span className="ml-3">{item.label}</span>
                )}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t p-4">
        <LogoutButton className="bg-no w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50" />
      </div>
    </div>
  );
};

export default Side_bar;
