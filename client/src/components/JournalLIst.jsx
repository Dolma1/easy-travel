import { Link } from "react-router-dom";
import {
  Heart,
  MapPin,
  Tag,
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  Trash2,
  User,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

function JournalList({
  journal,
  isOwner,
  isLoading = false,
  error = false,
  onDelete,
  isDeleting = false,
  backLink,
  editLink,
}) {
  const stripHtmlTags = (htmlString) => {
    const doc = new DOMParser().parseFromString(htmlString, "text/html");
    return doc.body.textContent || "";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse text-xl font-semibold text-gray-700 dark:text-gray-300">
          Loading...
        </div>
      </div>
    );
  }

  console.log(journal)
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-xl font-semibold text-red-600 dark:text-red-400">
          Failed to load the journal.
        </div>
      </div>
    );
  }

  if (!journal) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">
            Journal not found.
          </p>
          <Link
            to={backLink}
            className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Journals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-screen">
      <div className="flex bg-gray-50 dark:bg-gray-900">
        <main className="flex-1 px-8 py-6">
          <div className="max-w-4xl mx-auto">
            {/* Header with Navigation */}
            <div className="flex items-center justify-between mb-8">
              <Link
                to={backLink}
                className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Journals
              </Link>

              {isOwner && editLink && (
                <div className="flex items-center gap-4">
                  <Link
                    to={editLink}
                    className="inline-flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Journal
                  </Link>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="inline-flex items-center"
                        disabled={isDeleting}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your journal entry.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={onDelete}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>

            {/* Main Content */}
            <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              {/* Hero Image */}
              <div className="relative h-[400px]">
                <img
                  src={journal.images[0].url}
                  alt={journal.title}
                  className="w-full h-full object-fill"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <h1 className="absolute bottom-8 left-8 right-8 text-4xl font-bold text-white">
                  {journal.title}
                </h1>
              </div>

              {/* Content Section */}
              <div className="p-8">
                {/* Metadata Tags */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {journal.mood && (
                    <span className="inline-flex items-center px-3 py-1.5 bg-rose-50 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300 rounded-full text-sm">
                      <Heart className="w-4 h-4 mr-1.5" />
                      {journal.mood}
                    </span>
                  )}
                  {journal.location && (
                    <span className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 rounded-full text-sm">
                      <MapPin className="w-4 h-4 mr-1.5" />
                      {journal.location}
                    </span>
                  )}
                  {journal.author && (
                    <span className="inline-flex items-centerm justify-self-end px-3 py-1.5 bg-blue-50 text-sky-500 dark:bg-blue-900/50 dark:text-blue-300 rounded-full text-sm">
                      <User className="w-4 h-4 mr-1.5" />
                      Author : {journal.author?.name}
                    </span>
                  )}
                  {journal.tag && (
                    <span className="inline-flex items-center px-3 py-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 rounded-full text-sm">
                      <Tag className="w-4 h-4 mr-1.5" />
                      {journal.tag}
                    </span>
                  )}
                </div>

                {/* Journal Content */}
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {stripHtmlTags(journal.content)}
                  </p>
                </div>

                {/* Timestamp Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                    <span className="inline-flex items-center">
                      <Calendar className="w-4 h-4 mr-1.5" />
                      {new Date().toLocaleDateString()}
                    </span>
                    <span className="inline-flex items-center">
                      <Clock className="w-4 h-4 mr-1.5" />
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </main>
      </div>
    </ScrollArea>
  );
}

export default JournalList;
