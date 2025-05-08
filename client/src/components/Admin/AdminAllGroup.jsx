import { useState } from "react";
import { useGetGroupsQuery } from "@/app/slices/adminApiSlice";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Users,
  Calendar,
  Banknote,
  MapPin,
} from "lucide-react";

export default function GroupsTable() {
  const { data, isLoading, error } = useGetGroupsQuery();
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading)
    return (
      <div className="flex items-center justify-center p-8">
        Loading groups data...
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 p-8">
        Error loading groups: {error.toString()}
      </div>
    );
  if (!data?.groups) return <div className="p-8">No groups available</div>;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredGroups = data.groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.trip.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.creator.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full bg-white rounded-lg shadow-sm px-5 mt-1">
      {/* Header */}
      <div className="p-6 mt-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">Travel Groups</h2>
            <p className="text-gray-500 mt-1">
              Monitor all travel groups in your system
            </p>
          </div>
          <div className="w-full md:w-auto flex gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search groups..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left py-3 px-4 font-medium text-gray-500">
                Group Name
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">
                Destination
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">
                Trip Dates
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">
                Members
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">
                Budget
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => (
                <tr key={group._id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="font-medium">{group.name}</div>
                    <div className="text-xs text-gray-500">
                      Created by {group.creator.name}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      {group.trip.destination}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>
                        {formatDate(group.trip.startDate)} -{" "}
                        {formatDate(group.trip.endDate)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{group.memberCount}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <Banknote className="h-4 w-4 text-gray-500" />
                        <span>
                          {formatCurrency(group.budget, group.currency)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        Spent:{" "}
                        {formatCurrency(group.totalExpenses, group.currency)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge
                      className={
                        group.trip.status === "planning"
                          ? "bg-blue-100 text-blue-800 border-blue-200"
                          : "bg-green-100 text-green-800 border-green-200"
                      }
                    >
                      {group.trip.status.charAt(0).toUpperCase() +
                        group.trip.status.slice(1)}
                    </Badge>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="h-24 text-center text-gray-500">
                  No groups found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
