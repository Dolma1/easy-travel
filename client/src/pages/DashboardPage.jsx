import { Dashboard, SideBar } from "../components/index";
const DashboardPage = () => {
  return (
    <div className="flex ">
      <SideBar />
      <div className="w-full">
        {/* <DashboardNav /> */}
        <Dashboard />
      </div>
    </div>
  );
};

export default DashboardPage;
