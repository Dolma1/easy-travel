import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { PlusCircle } from "lucide-react";
import { toast } from "react-toastify";

import { useCreateJournalMutation } from "@/app/slices/journalApiSlice";
import { useGetJournalQuery } from "@/app/slices/journalApiSlice";
import Formfield from "../Formfield";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function AddJournal() {
  const [open, setOpen] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [createJournal, { isLoading }] = useCreateJournalMutation();
  const { refetch } = useGetJournalQuery();

  const moodOptions = [
    { value: "happy", label: "Happy" },
    { value: "sad", label: "Sad" },
    { value: "anxious", label: "Anxious" },
    { value: "excited", label: "Excited" },
    { value: "neutral", label: "neutral" },
    { value: "angry", label: "angry" },
    { value: "grateful", label: "grateful" },
  ];

  const {
    control,
    getValues,
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      isPrivate: true,
      mood: "neutral",
      budget: "",
      content: "",
      images: [],
    },
  });

  const onSubmit = async (data) => {
    // Check if imagePreviews is empty

    if (imagePreviews.length === 0) {
      setErrorMessage("Please upload at least one image.");
      return;
    }

    try {
      const updatedData = { ...data, tags };
      const res = await createJournal(updatedData).unwrap();

      refetch();
      toast.success("Journal entry created successfully!");
      setOpen(false);
      setImagePreviews([]);
      setTags([]);
    } catch (error) {
      console.error("Error creating journal:", error);
      toast.error(error?.data?.message || "Failed to create journal entry");
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) {
      setErrorMessage("Please select at least one image.");
      return;
    }

    let validImages = [];
    files.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`Image ${file.name} exceeds 5MB limit`);
      } else {
        validImages.push(file);
      }
    });

    if (validImages.length > 0) {
      validImages.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.readyState === 2) {
            setImagePreviews((prev) => [...prev, reader.result]);
            setValue("images", [...(getValues("images") || []), reader.result]);
            setErrorMessage(""); // Clear error message
          }
        };
        reader.readAsDataURL(file);
      });
    } else if (imagePreviews.length === 0) {
      setErrorMessage("Please upload at least one valid image.");
    }
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    const currentImages = getValues("images") || [];
    setValue(
      "images",
      currentImages.filter((_, i) => i !== index)
    );

    // Show error if no images are left
    if (imagePreviews.length === 1) {
      setErrorMessage("Please upload at least one image.");
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="m-3">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Journal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[70vw] overflow-y-auto h-[520px]">
        <DialogHeader>
          <DialogTitle>Create New Journal Entry</DialogTitle>
          <DialogDescription>
            Capture your thoughts, feelings, and moments. All fields help create
            a richer memory.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          encType="multipart/form-data"
        >
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
            moodOptions={moodOptions}
          />

          <DialogFooter>
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Journal Entry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
