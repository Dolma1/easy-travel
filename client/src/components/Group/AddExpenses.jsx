import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useCreateExpenseMutation } from "@/app/slices/expenseApiSlice";
import ExpensesFromfield from "../ExpensesFromfield";
import { useGetTravelExpensesQuery } from "@/app/slices/travelGroupApiSlice";
import { useGetSingleTravelGroupQuery } from "@/app/slices/travelGroupApiSlice";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function AddExpenses() {
  const [open, setOpen] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [createExpense, { isLoading }] = useCreateExpenseMutation();
  const { id } = useParams();
  const { refetch } = useGetTravelExpensesQuery(id);
  const { refetch: re } = useGetSingleTravelGroupQuery(id);

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
    { value: "other", label: "Others" },
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
      if (res.success) {
        toast.success("Expense entry created successfully!");
        await re();
        await refetch();
      }
    } catch (error) {
      console.error("Error creating Expense:", error);
      toast.error(error?.data?.message || "Failed to create Expense entry");
    } finally {
      reset();
      setOpen(false);
      setImagePreviews([]);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) {
      setErrorMessage("Please select at least one image");
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
    <div className="relative">
      {/* Toggle Button */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-[#FE9935] text-white rounded-full  hover:bg-[#FE9935]/90 hover:shadow-2xl transition-colors flex items-center justify-center"
        >
          <PlusCircle className="w-6 h-6 hover:animate-spin hover:sha" />
        </button>
      )}

      {/* Form Content */}
      {open && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-[70vw] overflow-y-auto h-[470px] p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold">Add New Expense Entry</h2>
              <p>Fill in the details below</p>
              <hr className="my-2" />
            </div>

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

              <div className="flex justify-end gap-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Expense"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
