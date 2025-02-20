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
import { useParams } from "react-router-dom";

import { useCreateExpenseMutation } from "@/app/slices/expenseApiSlice";
import { useGetExpenseQuery } from "@/app/slices/expenseApiSlice";
import ExpensesFromfield from "../ExpensesFromfield";
// import { useSelector } from "react-redux";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function AddGroup() {
  const [open, setOpen] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [createExpense, { isLoading }] = useCreateExpenseMutation();
  const { refetch } = useGetExpenseQuery();
  // const authStatus = useSelector((state) => state?.auth?.user?._id);
  const { id } = useParams();
  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "settled", label: "Settled" },
    { value: "disputed", label: "Disputed" },
  ];

  const paymentOptions = [
    { value: "cash", label: "Cash" },
    { value: "khalti", label: "Khalti" },
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
    reset,
  } = useForm({
    defaultValues: {
      receipt: [],
      status: "pending",
    },
  });

  const onSubmit = async (data) => {
    try {
      const updatedData = { ...data, groupId: id };
      const res = await createExpense(updatedData).unwrap();
      console.log("Expense created:", res);
      location.reload();
      refetch();
      reset();
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
            setErrorMessage("");
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

    if (imagePreviews.length === 1) {
      setErrorMessage("Please upload at least one image.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="fixed bottom-6 right-6 w-14 h-14 bg-[#FE9935] text-white rounded-full shadow-lg hover:bg-[#FE9935]/40 transition-colors flex items-center justify-center  ">
          <PlusCircle className="w-6 h-6 hover:animate-spin" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-[70vw] overflow-y-auto h-[470px]">
        <DialogHeader>
          <DialogTitle>Add New Expenses Entry</DialogTitle>
          <p>Fill in the details below</p>
          <hr />
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          encType="multipart/form-data"
        >
          <ExpensesFromfield
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
              {isLoading ? "Creating..." : "Create Expenses"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
