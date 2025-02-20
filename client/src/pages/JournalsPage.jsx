import { SideBar, AddJournal,JournalList  } from "../components/index";

const JournalsPage = () => {
  return (
    <>
      <div className="flex">
        <SideBar />
        <div className=" w-full ">
        <JournalList/>
        </div>
      </div>
    </>
  );
};

export default JournalsPage;
