import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, User, MapPin, Wallet } from "lucide-react";
import { useGetGroupQuery } from "@/app/slices/groupApiSlice";
import { Link } from "react-router-dom";
import AddGroup from "./AddGroup";

function ListGroup() {
  const { data } = useGetGroupQuery();
  const group = Array.isArray(data?.data) ? data.data : [];
  const getData = [...group].reverse();

  return (
    <>
      <div className="px-8 mt-6">
        <div className=" flex justify-between items-center">
          <div className="mb-6">
            <h1 className="text-4xl font-bold">My Groups</h1>
            <p className="text-muted-foreground">
              View and manage your group entries
            </p>
          </div>
          <AddGroup />
        </div>
        <ScrollArea className="h-[calc(100vh-130px)] ">
          <div className="min-h-screen bg-[#F9FAFB] ">
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
              {/* Expense List */}
              <div className="overflow-hidden space-y-4 sm:rounded-md    ">
                {getData.map((group) => (
                  <div
                    key={group._id}
                    className="transform transition duration-200   bg-white hover:scale-[1.02]"
                  >
                    <Link
                      to={`/groups/${group._id}`}
                      state={group.name}
                      className="block"
                    >
                      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                        <div className="p-8">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                {group.name.charAt(0).toUpperCase() +
                                  group.name.slice(1)}
                              </h3>
                              <div className="flex items-center text-sm text-gray-600 mb-3">
                                <User className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" />
                                <span>Created by {group.creator.name}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700">
                                <Wallet className="w-4 h-4 mr-1.5" />
                                {group.budget} {group.currency}
                              </span>
                              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                                <MapPin className="w-4 h-4 mr-1.5" />
                                {group.trip.destination}
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap items-center gap-4">
                            <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full">
                              <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-green-500" />
                              <span>
                                From:{" "}
                                {new Date(
                                  group.trip.startDate
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full">
                              <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-amber-500" />
                              <span>
                                To:{" "}
                                {new Date(
                                  group.trip.endDate
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          {/* {expense.notes && (
                      <div className="mt-4 flex items-start text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        <AlertCircle className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400 mt-0.5" />
                        <p className="line-clamp-2">{expense.notes}</p>
                      </div>
                    )} */}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </main>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}

export default ListGroup;
