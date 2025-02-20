import { SideBar, SingleGroup } from "../components/index";

const SingleGroupPage = () => {
  return (
    <>
      <div className="flex min-h-screen  w-full bg-background">
        <SideBar />
        <div className="w-full">
          <SingleGroup />
        </div>
      </div>
    </>
  );
};

export default SingleGroupPage;
