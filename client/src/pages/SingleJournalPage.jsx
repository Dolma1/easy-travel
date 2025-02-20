import { SingleJournalDetail, SideBar } from "@/components";

SingleJournalDetail;
const SingleJournalPage = () => {
  return (
    <>
      <div className="flex">
        <SideBar />
        <div className="w-full">
          <SingleJournalDetail />
        </div>
      </div>
    </>
  );
};

export default SingleJournalPage;
