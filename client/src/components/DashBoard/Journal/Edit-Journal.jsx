import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ImageIcon, MapPin, Tag, SmilePlus, X, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import TextEditor from "./TextEditor";
import { useSelector } from "react-redux";

import {
  useGetJournalQuery,
  useUpdateJournalMutation,
} from "@/app/slices/journalSlice";

const stripHtmlTags = (htmlString) => {
  const doc = new DOMParser().parseFromString(htmlString, "text/html");
  return doc.body.textContent || ""; // Extract plain text from the HTML
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function EditJournal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imagePreviews, setImagePreviews] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const userdata = useSelector((state) => state.auth.user);

  const { data: journalData, isLoading: isLoadingJournal } =
    useGetJournalQuery();
  const [updateJournal, { isLoading: isUpdating }] = useUpdateJournalMutation();

  const moodOptions = [
    { value: "happy", label: "Happy" },
    { value: "sad", label: "Sad" },
    { value: "anxious", label: "Anxious" },
    { value: "excited", label: "Excited" },
    { value: "neutral", label: "Neutral" },
    { value: "angry", label: "Angry" },
    { value: "grateful", label: "Grateful" },
  ];

  const {
    control,
    getValues,
    handleSubmit,
    setValue,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      isPrivate: true,
      mood: "neutral",
      content: "",
      images: [],
    },
  });

  useEffect(() => {
    if (journalData?.allJournals) {
      const journal = journalData.allJournals.find((j) => j._id === id);
      if (journal) {
        reset({
          title: journal.title,
          content: journal.content,
          mood: journal.mood,
          location: journal.location,
          isPrivate: journal.isPrivate,
          images: journal.images || [],
        });
        setTags(journal.tags || []);
        setImagePreviews(journal.images || []);
      }
    }
  }, [journalData, id, reset]);

  const onSubmit = async (data) => {
    try {
      const updatedData = {
        ...data,
        tags,
        _id: id,
        content: stripHtmlTags(data.content),
      };
      await updateJournal(updatedData).unwrap();

      toast.success("Journal entry updated successfully!");
      // refetch();
      navigate(`/journal/${id}`);
    } catch (error) {
      console.error("Error updating journal:", error);
      toast.error(error?.data?.message || "Failed to update journal entry");
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) {
      setErrorMessage("Please select at least one image.");
      return;
    }

    files.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`Image ${file.name} exceeds 5MB limit`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagePreviews((prev) => [...prev, reader.result]);
          setValue("images", [...(getValues("images") || []), reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    const currentImages = getValues("images") || [];
    setValue(
      "images",
      currentImages.filter((_, i) => i !== index)
    );
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    } else {
      toast.error("Invalid or duplicate tag");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  if (isLoadingJournal) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-xl font-semibold text-gray-700">
          Loading...
        </div>
      </div>
    );
  }
  // console.log(journalData);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(`/journal`)}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Journal
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Edit Journal Entry
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-[1fr_auto] gap-6">
              {/* Left Column - Form Fields */}
              <div className="space-y-4">
                {/* Title Field */}
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row items-center gap-8">
                    <Label htmlFor="title" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="title"
                      placeholder="Give your entry a meaningful title"
                      {...register("title", {
                        required: "Title is required",
                        minLength: {
                          value: 4,
                          message: "Title must be at least 4 characters",
                        },
                      })}
                      className="col-span-3"
                    />
                  </div>
                  {errors.title && (
                    <p className="text-sm text-red-500 text-center w-full">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="ml-14">
                  <TextEditor
                    label="Content :"
                    name="content"
                    control={control}
                    defaultValue={getValues("content")}
                  />
                </div>

                {/* Mood Field */}
                <div className="flex items-center gap-4">
                  <Label className="text-right">Mood</Label>
                  <div className="col-span-3 w-full">
                    <Controller
                      name="mood"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select your mood" />
                          </SelectTrigger>
                          <SelectContent>
                            {moodOptions.map((mood) => (
                              <SelectItem key={mood.value} value={mood.value}>
                                <div className="flex items-center">
                                  <SmilePlus className="mr-2 h-4 w-4" />
                                  {mood.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                {/* Location Field */}
                <div className="flex items-center gap-2">
                  <Label htmlFor="location" className="text-right">
                    Location
                  </Label>
                  <div className="col-span-3 relative w-full">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="location"
                      placeholder="Where are you?"
                      {...register("location")}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Tags Field */}
                <div className="flex items-center gap-4">
                  <Label className="text-right pt-2">Tags</Label>
                  <div className="col-span-3 space-y-2 w-full">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          placeholder="Add tags..."
                          className="pl-10"
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleAddTag(e)
                          }
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={handleAddTag}
                        variant="outline"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-red-500"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Privacy Toggle */}
                <div className="flex items-center gap-4">
                  <Label htmlFor="isPrivate" className="text-right">
                    Private Entry
                  </Label>
                  <div className="col-span-3 flex items-center space-x-2">
                    <Controller
                      name="isPrivate"
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="isPrivate"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <Label
                            htmlFor="isPrivate"
                            className="text-sm text-muted-foreground"
                          >
                            Make this entry private
                          </Label>
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Image Section */}
              <div className="w-[200px] space-y-4">
                <div className="space-y-2">
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById("photo")?.click()}
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Upload Photos
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Max size: 5MB per image
                  </p>
                </div>

                <div className="space-y-2">
                  {imagePreviews.length > 0 ? (
                    imagePreviews.map((images, index) => (
                      <div key={index} className="relative">
                        <img
                          src={images.url}
                          alt={`Preview ${index + 1}`}
                          className="h-[120px] w-full object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 rounded-full"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="h-[120px] w-full rounded-md border border-dashed border-gray-200 flex items-center justify-center">
                      <div className="text-sm text-muted-foreground text-center p-4">
                        <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No images uploaded</p>
                      </div>
                    </div>
                  )}
                  
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/journal/${id}`)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-700 text-white"
                disabled={isUpdating}
              >
                {isUpdating ? "Updating..." : "Update Journal Entry"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
