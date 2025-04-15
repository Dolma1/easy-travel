import { Report, SideBar } from "@/components";

const ReportPage = () => {
  return (
    <>
      <div className="flex">
        <SideBar />
        <div className="w-full">
          <Report />
        </div>
      </div>
    </>
  );
};

export default ReportPage;
