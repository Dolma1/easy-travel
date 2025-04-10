import { SideBar, ExploreJournalList } from "../components/index";

const ExploreJournalPage = () => {
  return (
    <>
      <div className="flex">
        <SideBar />
        <div className=" w-full ">
          <ExploreJournalList />
        </div>
      </div>
    </>
  );
};

export default ExploreJournalPage;
