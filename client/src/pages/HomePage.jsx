import { Button } from "@/components/ui/button";
import React from "react";
import { useSelector } from "react-redux";
import { LogoutButton } from "../components";
import { Link } from "react-router-dom";
const HomePage = () => {
  const userdata = useSelector((state) => state.auth.user);
  return (
    <>
      <div className="flex">
        <p>Hello {userdata ? userdata.name : "Stranger"}</p>
        <div className="mt-12">
          {!userdata && (
            <>
              <Link
                to={"/login"}
                className="p-4 bg-black text-white mt-3 mx-3 rounded-lg"
              >
                Login
              </Link>
              <Link
                to={"/register"}
                className="p-4 bg-black text-white mt-3 rounded-lg"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
      {userdata && <LogoutButton />}
    </>
  );
};

export default HomePage;
