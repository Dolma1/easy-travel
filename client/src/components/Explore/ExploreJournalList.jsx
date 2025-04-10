import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useGetPublicJournalQuery } from "@/app/slices/journalApiSlice";
import { Link } from "react-router-dom";
import { Heart, MapPin, Tag } from "lucide-react";
import { AddJournal, DashboardNav } from "..";
import { useEffect, useState } from "react";

export default function ExploreJournalList() {
  const { data, isLoading, error } = useGetPublicJournalQuery();
  const stripHtmlTags = (htmlString) => {
    const doc = new DOMParser().parseFromString(htmlString, "text/html");
    return doc.body.textContent || "";
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const journals = Array.isArray(data?.allJournals) ? data.allJournals : [];
  const reversedData = [...journals].reverse();
  const [SearchData, setSearchData] = useState([]);
  useEffect(() => {
    if (journals.length) {
      const reversedData = [...journals].reverse();
      setSearchData(reversedData);
    }
  }, [journals]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse text-xl font-semibold text-gray-700 dark:text-gray-300">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-xl font-semibold text-red-600 dark:text-red-400">
          Failed to load journals.
        </div>
      </div>
    );
  }

  if (journals.length === 0) {
    return (
      <>
        <DashboardNav
          SearchData={SearchData}
          setSearchData={setSearchData}
          originalData={reversedData}
        />
        <div className="px-8 mt-6">
          <div className="pb-8 flex justify-between items-center ">
            <div className="">
              <h1 className="text-4xl font-bold">Explore Journals</h1>
              <p className="text-muted-foreground">
                View the Journals Written by fellow travellers
              </p>
            </div>
            <AddJournal />
          </div>
        </div>
        <div className="text-center py-10">
          <p className="text-xl text-gray-500">There are no public journals yet.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardNav
        SearchData={SearchData}
        setSearchData={setSearchData}
        originalData={reversedData}
      />
      <div className="px-8 mt-6">
        <div className="pb-8 flex justify-between items-center ">
          <div className="">
            <h1 className="text-4xl font-bold">Explore Journals</h1>
            <p className="text-muted-foreground">
              View the Journals Written by fellow travellers
            </p>
          </div>
          <AddJournal />
        </div>

        <ScrollArea className="h-[calc(100vh-29vh)] ">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 bg-gray-50 p-8 ">
            {SearchData.map((journal) => {
              return (
                <div
                  className="w-full max-w-md mx-auto relative group"
                  key={journal._id}
                  style={{ animation: "fadeIn 0.5s ease-in-out" }}
                >
                  <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 dark:bg-gray-900 dark:border dark:border-gray-700">
                    <div className="relative">
                      <img
                        src={journal.images[0]?.url}
                        alt={journal.title}
                        width={600}
                        height={400}
                        style={{ aspectRatio: "600/400", objectFit: "fill" }}
                      />
                    </div>

                    <div className="p-6 space-y-4">
                      <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
                        {journal.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {stripHtmlTags(journal.content.slice(0, 100))}...
                      </p>
                      <div className="flex flex-wrap gap-2 text-sm">
                        {journal.mood && (
                          <span className="inline-flex items-center px-3 py-1.5 bg-rose-50 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300 rounded-full">
                            <Heart className="w-4 h-4 mr-1.5" />
                            {journal.mood}
                          </span>
                        )}
                        {journal.location && (
                          <span className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 rounded-full">
                            <MapPin className="w-4 h-4 mr-1.5" />
                            {journal.location}
                          </span>
                        )}
                        {journal.tag && (
                          <span className="inline-flex items-center px-3 py-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 rounded-full">
                            <Tag className="w-4 h-4 mr-1.5" />
                            {journal.tag}
                          </span>
                        )}
                      </div>
                      <Link
                        to={`/journal/${journal._id}`}
                        className="block mt-4"
                      >
                        <Button className="w-full bg-[#FF9935] hover:bg-[#FF9935]/90 text-white dark:bg-indigo-500 dark:hover:bg-indigo-400">
                          Read More
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
