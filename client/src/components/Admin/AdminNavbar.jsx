import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { LogIn, UserPlus, UserCircle, Settings } from "lucide-react";

import LogoutButton from "@/components/Header/LogoutButton";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdminNavbar = () => {
  const userdata = useSelector((state) => state.auth.user);

  return (
    <nav className="bg-white max-h-20 shadow-md px-6 py-4">
      <div className="flex justify-end items-center">
 
        <div className="hidden md:flex md:items-center md:space-x-4">
          {!userdata ? (
            <>
              <Link
                to="/login"
                className="flex items-center space-x-1 px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                <UserPlus className="h-4 w-4" />
                <span>Register</span>
              </Link>
            </>
          ) : (
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

                  <DropdownMenuSeparator />
                  <LogoutButton className="bg-no w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50" />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
