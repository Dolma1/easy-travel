import { ListGroup, SideBar } from "../components/index";

const GroupListPage = () => {
  return (
    <>
      <div className="flex">
        <SideBar />
        <div className="w-full">
          <ListGroup />
        </div>
      </div>
    </>
  );
};

export default GroupListPage;
