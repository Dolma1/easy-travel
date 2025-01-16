// import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useGetAllJournalQuery } from "@/app/slices/userApiSlice";
import { useEffect } from "react";
// Updated mock data to include image URLs
const mockJournals = [
  {
    id: 1,
    title: "My First Journal",
    date: "2023-05-01",
    preview: "Today was an amazing day...",
    image: `https://images.unsplash.com/photo-1707343848552-893e05dba6ac?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
  },
  {
    id: 2,
    title: "Reflections",
    date: "2023-05-05",
    preview: "I've been thinking a lot about...",
    image: `https://images.unsplash.com/photo-1707343848552-893e05dba6ac?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
  },
  {
    id: 3,
    title: "Adventure Time",
    date: "2023-05-10",
    preview: "Explored a new hiking trail today...",
    image: `https://images.unsplash.com/photo-1707343848552-893e05dba6ac?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
  },
];

// get all the data from the database

export default function JournalList() {
  if (mockJournals.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-gray-500">You have no journals yet.</p>
      </div>
    );
  }

  // Get all journals
  const { data, isLoading, error, refetch } = useGetAllJournalQuery();
  console.log(data);
  useEffect(() => {
    refetch();
  }, [refetch]);

  return isLoading ? (
    <h2>"loading...."</h2>
  ) : (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.map((journal) => (
          <div className="w-full max-w-md mx-auto" key={journal.id}>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl dark:bg-gray-950">
              <img
                src={journal.photo}
                alt="Product Image"
                width={600}
                height={400}
                className="w-full h-64 object-cover"
                style={{ aspectRatio: "600/400", objectFit: "cover" }}
              />
              <div className="p-4 space-y-2">
                <h3 className="text-xl font-semibold">{journal.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {journal.preview}
                </p>
                <div className="flex items-center justify-between">
                  {/* <span className="text-lg font-bold">$49.99</span> */}
                  <Button>Read more</Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
