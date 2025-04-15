import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

import {
  useGetSingleJournalQuery,
  useUpdateJournalMutation,
  useGetJournalQuery,
} from "@/app/slices/journalApiSlice";
import Formfield from "../Formfield";

const stripHtmlTags = (htmlString) => {
  const doc = new DOMParser().parseFromString(htmlString, "text/html");
  return doc.body.textContent || "";
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function EditJournal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [existingImages, setExistingImages] = useState([]); // Store existing images
  const [imagePreviews, setImagePreviews] = useState([]); // Store new images
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [updateJournal, { isLoading: isUpdating }] = useUpdateJournalMutation();
  const {
    data: journalData,
    isLoading: isLoadingJournal,
    refetch,
  } = useGetSingleJournalQuery(id);
  const { refetch: allRefetch } = useGetJournalQuery();

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

  console.log(journalData);

  useEffect(() => {
    if (journalData?.journal) {
      const { journal } = journalData;
      reset({
        title: journal.title,
        content: journal.content,
        mood: journal.mood,
        location: journal.location,
        isPrivate: journal.isPrivate,
        budget: journal.budget,
        images: journal.images || [],
      });
      setTags(journal.tags || []);
      setExistingImages(journal.images.map((img) => img.url) || []); // Set existing images
    }
  }, [journalData, reset]);

  const onSubmit = async (data) => {
    if (imagePreviews.length === 0 && existingImages.length === 0) {
      setErrorMessage("Please upload at least one image.");
      return;
    }
    try {
      const updatedData = {
        ...data,
        tags,
        _id: id,
        content: stripHtmlTags(data.content),
        images: [...existingImages, ...imagePreviews], // Combine existing and new images
      };
      await updateJournal(updatedData).unwrap();
      refetch();
      allRefetch();
      toast.success("Journal entry updated successfully!");
      navigate(`/journal`);
    } catch (error) {
      console.error("Error updating journal:", error);
      toast.error(error?.data?.message || "Failed to update journal entry");
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    files.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`Image ${file.name} exceeds 5MB limit`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagePreviews((prev) => [...prev, reader.result]); // Store new images
          setValue("images", [...(getValues("images") || []), reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index, isNewImage) => {
    if (isNewImage) {
      // Remove from new images
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
      const currentImages = getValues("images") || [];
      setValue(
        "images",
        currentImages.filter((_, i) => i !== index)
      );
    } else {
      // Remove from existing images
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    }
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(`/journal`)}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Journal
          </button>
          <h1 className="text-2xl mx-auto font-bold text-gray-800">
            Edit Journal Entry
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Formfield
              control={control}
              register={register}
              errors={errors}
              setValue={setValue}
              getValues={getValues}
              imagePreviews={imagePreviews}
              setImagePreviews={setImagePreviews}
              tags={tags}
              setTags={setTags}
              tagInput={tagInput}
              setTagInput={setTagInput}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
              handleImageChange={handleImageChange}
              handleAddTag={handleAddTag}
              removeTag={removeTag}
              removeImage={removeImage}
              existingImages={existingImages}
              moodOptions={moodOptions}
            />
            <div className="flex justify-end gap-4 mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/journal")}
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
