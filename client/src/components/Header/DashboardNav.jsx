import { Bell, Search, Settings, UserCircle } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { LogoutButton } from "..";

const DashboardNav = ({ SearchData, setSearchData, originalData }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const userdata = useSelector((state) => state.auth.user);

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchData(originalData);
      return;
    }

    const filtered = originalData.filter((item) =>
      Object.values(item).some(
        (value) =>
          (typeof value === "string" || typeof value === "number") &&
          value.toString().toLowerCase().includes(query.toLowerCase())
      )
    );

    setSearchData(filtered);
  };

  return (
    <div className="top-0 left-[211px] right-0 h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between z-10 backdrop-blur-sm bg-white/90">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search ..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-lg relative">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <Settings className="h-5 w-5 text-gray-600" />
        </button>
        <div className="flex items-center gap-3 ml-4">
          <div className="flex items-center space-x-4">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger className="flex items-center space-x-2 focus:outline-none">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <UserCircle className="w-6 h-6 text-indigo-600" />
                </div>
                <span className="text-gray-700">{userdata.name}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="ml-2 text-md shadow-sm">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link to="/profile">
                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 p-3">
                    <UserCircle className="mr-2 ml-3" />
                    <span className="font-medium text-md">Profile</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />

                <Link to="/settings">
                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 p-3">
                    <Settings className="mr-2 ml-2" />
                    <span className="font-medium text-md">Settings</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <LogoutButton className="bg-no w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50" />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNav;
