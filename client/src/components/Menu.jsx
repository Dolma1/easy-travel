import { MenuIcon, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Menu = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div onClick={() => setOpen((prev) => !prev)}>
        {open ? <X /> : <MenuIcon />}
      </div>

      <div>
        {open && (
          <div className=" md:hidden items-center gap-8 absolute top-20 left-0  bg-black w-full text-white h-[calc(100vh-80px)] flex flex-col justify-center z-10">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
