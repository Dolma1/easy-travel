import React from "react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  DollarSign,
  Download,
  Plus,
  TrendingDown,
  TrendingUp,
  Upload,
  LayoutDashboard,
  Receipt,
  PieChart,
  Settings,
  Wallet,
  Menu,
  NotebookPen,
} from "lucide-react";
import JournalList from "./journal-list";
import NewJournalDialog from "./new-journal";
import { LogoutButton } from "@/components";
import { Link } from "react-router-dom";
const Journal = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigationItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: NotebookPen, label: "Journal", active: true, href: "/journal" },
    { icon: Wallet, label: "Budgets" },
    { icon: PieChart, label: "Reports" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
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
        <div className="flex-1 overflow-auto py-4 bg-[#4c5fa5]">
          <nav className="space-y-2 px-2">
            {navigationItems.map((item) => (
              <Link to={item.href} key={item.label}>
                <Button
                  variant={item.active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isSidebarCollapsed ? "px-3" : "px-4"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {!isSidebarCollapsed && (
                    <span className="ml-3 text-gray-400">{item.label}</span>
                  )}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t p-4">
          <Link
            variant="ghost"
            className={cn(
              " text-red-600 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50",
              isSidebarCollapsed ? "px-3" : "px-4"
            )}
          >
            {!isSidebarCollapsed && (
              <span className="ml-3">
                {" "}
                <LogoutButton />
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className=" mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Journals</h1>
        <NewJournalDialog />
        <JournalList />
      </div>
    </div>
  );
};

export default Journal;
