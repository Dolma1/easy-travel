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

import { useCreateExpenseMutation } from "@/app/slices/expenseApiSlice";
import { useGetJournalQuery } from "@/app/slices/journalApiSlice";
import GroupFormfield from "../GroupFormfield";
import { useSelector } from "react-redux";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function AddGroup() {
  const [open, setOpen] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [createExpense, { isLoading }] = useCreateExpenseMutation();
  const { refetch } = useGetJournalQuery();
  const authStatus = useSelector((state) => state?.auth?.user?._id);

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "settled", label: "Settled" },
    { value: "disputed", label: "Disputed" },
  ];

  const paymentOptions = [
    { value: "cash", label: "Cash" },
    { value: "khalti", label: "Khalti" },
    { value: "others", label: "Others" },
  ];
  const categoryOptions = [
    { value: "accommodation", label: "Accommodation" },
    { value: "transport", label: "Transport" },
    { value: "food", label: "Food" },
    { value: "activities", label: "Activities" },
    { value: "shopping", label: "Shopping" },
    { value: "others", label: "Others" },
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
      receipt: [],
      status: "pending",
    },
  });

  const onSubmit = async (data) => {
    if (imagePreviews.length === 0) {
      setErrorMessage("Please upload at least one Receipt.");
      return;
    }

    try {
      const updatedData = { ...data, paidBy: authStatus };
      const res = await createExpense(updatedData).unwrap();
      console.log("Expense created:", res);
      refetch();
      toast.success("Expense entry created successfully!");
      setOpen(false);
      setImagePreviews([]);
    } catch (error) {
      console.error("Error creating Expense:", error);
      toast.error(error?.data?.message || "Failed to create Expense entry");
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) {
      setErrorMessage("Please select at least one ");
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
            setValue("receipt", [
              ...(getValues("receipt") || []),
              reader.result,
            ]);
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
    const currentImages = getValues("receipt") || [];
    setValue(
      "receipt",
      currentImages.filter((_, i) => i !== index)
    );

    // Show error if no receipt are left
    if (imagePreviews.length === 1) {
      setErrorMessage("Please upload at least one image.");
    }
  };

  if (!authStatus) {
    console.error("User is not authenticated!");
    return;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-6">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[70vw] overflow-y-auto h-[520px]">
        <DialogHeader>
          <DialogTitle>Add New Group Entry</DialogTitle>
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
          <GroupFormfield
            control={control}
            register={register}
            errors={errors}
            setValue={setValue}
            getValues={getValues}
            imagePreviews={imagePreviews}
            setImagePreviews={setImagePreviews}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            handleImageChange={handleImageChange}
            removeImage={removeImage}
            statusOptions={statusOptions}
            paymentOptions={paymentOptions}
            categoryOptions={categoryOptions}
          />

          <DialogFooter>
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Group"}
            </Button>
            <p>oo {authStatus}</p>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
