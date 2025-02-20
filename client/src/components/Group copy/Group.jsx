import { SideBar } from "..";
import AddGroup from "./AddGroup";
import ListGroup from "./ListGroup";

const Group = () => {
  return (
    <div className="flex w-full min-h-screen bg-background">
      {/* Sidebar */}
      <SideBar /> {/* Sidebar takes up 50% of the width */}
      
      {/* Content Area (AddGroup and ListGroup) */}
      <div className="px-10 py-8 w-full"> {/* ListGroup and AddGroup take up 50% of the width */}
        <AddGroup />
        <ListGroup />
      </div>
    </div>
  );
};

export default Group;
