import { useState } from "react";
import {
  useGetJournalsQuery,
  useRemoveJournalMutation,
} from "@/app/slices/adminApiSlice";
import {
  Search,
  RefreshCw,
  Book,
  Trash2,
  TrashIcon,
  Trash2Icon,
  CloudCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { toast } from "react-toastify";

const AdminAllJournal = () => {
  const { data, error, isLoading, refetch } = useGetJournalsQuery();
  const [removeJournal] = useRemoveJournalMutation();

  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-500" />
          <p className="text-gray-500">Loading Journals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("Failed to fetch journals:", error);
    toast.error(
      error?.data?.message || "Failed to fetch journals. Please try again."
    );
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Error loading journals</p>
      </div>
    );
  }

  const handleRemoveJournal = async (id) => {
    console.log(id);
    try {
      const response = await removeJournal(id).unwrap();
      if (response.success) {
        toast.success(response.message);
        refetch();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Filter journals based on search term
  const filteredJournals =
    data?.journals?.filter(
      (journal) =>
        journal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        journal.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        journal.mood.toLowerCase().includes(searchTerm.toLowerCase()) ||
        journal.location.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get mood badge color based on mood
  const getMoodColor = (mood) => {
    switch (mood) {
      case "happy":
        return "bg-green-400 hover:bg-green-500";
      case "sad":
        return "bg-blue-400 hover:bg-blue-500";
      case "angry":
        return "bg-red-400 hover:bg-red-500";
      case "anxious":
        return "bg-yellow-400 hover:bg-yellow-500";
      case "excited":
        return "bg-purple-400 hover:bg-purple-500";
      default:
        return "bg-gray-400 hover:bg-gray-500";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Book className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Journals</h1>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search journals by title, author, mood or location..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Mood</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Privacy</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJournals.length > 0 ? (
              filteredJournals.map((journal) => (
                <TableRow key={journal._id}>
                  <TableCell className="font-medium">
                    <div className="w-16 h-16 rounded-lg overflow-hidden">
                      {journal.images && journal.images.length > 0 ? (
                        <img
                          src={journal.images[0].url}
                          alt={journal.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Book className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{journal.title}</TableCell>
                  <TableCell>{journal.author.name}</TableCell>
                  <TableCell>
                    <Badge className={getMoodColor(journal.mood)}>
                      {journal.mood.charAt(0).toUpperCase() +
                        journal.mood.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{journal.location}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        journal.isPrivate
                          ? "bg-red-400 hover:bg-red-500"
                          : "bg-green-400 hover:bg-green-500"
                      }
                    >
                      {journal.isPrivate ? "Private" : "Public"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(journal.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {journal.tags && journal.tags.length > 0 ? (
                        journal.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">No tags</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      className="bg-red-600 hover:bg-red-600 text-white p-4 "
                      onClick={(e) => handleRemoveJournal(journal._id)}
                    >
                      <Trash2Icon className="w-5 h-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-6 text-gray-500"
                >
                  No journals found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminAllJournal;
