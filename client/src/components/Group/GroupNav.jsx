import { useGetSingleTravelGroupQuery } from "@/app/slices/travelGroupApiSlice";
import { useSelector } from "react-redux";
import ShareCodeGenerator from "./ShareCodeGenerator";
import GroupDetails from "./GroupDetails";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
const GroupNav = ({ id }) => {
  const {
    data: groupData,
    refetch,
  } = useGetSingleTravelGroupQuery(id);
  const nav = useNavigate();
  const handleBack = () => nav(-1);
  const userdata = useSelector((state) => state.auth?.user?._id);
  
  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <h1 className="text-xl font-semibold text-gray-900">
            {groupData?.group?.name
              ? groupData.group.name.charAt(0).toUpperCase() +
                groupData.group.name.slice(1)
              : "Travel Group"}
          </h1>

          <div className="flex gap-6">
            {userdata === groupData?.group?.creator?._id && (
              <ShareCodeGenerator groupId={id} />
            )}
            <GroupDetails isView={groupData} refetch={refetch} />
          </div>
        </div>
      </header>
    </>
  );
};

export default GroupNav;
