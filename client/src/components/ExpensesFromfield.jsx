import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";
import { Card } from "./ui/card";

export default function ExpensesFromfield({
  control,
  register,
  errors,
  setValue,
  getValues,
  imagePreviews,
  setImagePreviews,
  errorMessage,
  setErrorMessage,
  handleImageChange,
  removeImage,
  statusOptions,
  existingImages,
  paymentOptions,
  categoryOptions,
}) {
  return (
    <div className="grid grid-cols-[2fr_1fr] gap-8">
      {/* Left Column - Form Fields */}
      <div className="space-y-6">
        {/* Description Field */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description
          </Label>
          <Input
            id="description"
            placeholder="Enter a meaningful description"
            className="w-full"
            {...register("description", {
              required: "Description is required",
              minLength: {
                value: 4,
                message: "Description must be at least 4 characters",
              },
            })}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Status, Payment, Category Row */}
        <div className="grid grid-cols-3 gap-4">
          {/* Status Field */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Status</Label>
            <Controller
              name="status"
              control={control}
              rules={{ required: "Status is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status.message}</p>
            )}
          </div>

          {/* Payment Field */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Payment Method</Label>
            <Controller
              name="payment"
              control={control}
              rules={{ required: "Payment is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentOptions.map((payment) => (
                      <SelectItem key={payment.value} value={payment.value}>
                        {payment.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.payment && (
              <p className="text-sm text-red-500">{errors.payment.message}</p>
            )}
          </div>

          {/* Category Field */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Category</Label>
            <Controller
              name="category"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>
        </div>

        {/* Amount Field */}
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-medium">
            Amount
          </Label>
          <div className="flex gap-2">
            <Controller
              name="currency"
              control={control}
              defaultValue="NPR"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NPR">NPR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="INR">INR</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <Input
              type="number"
              id="amount"
              placeholder="Enter amount"
              className="flex-1"
              {...register("amount", {
                required: "Amount is required",
                min: { value: 0, message: "Amount cannot be negative" },
                valueAsNumber: true,
              })}
            />
          </div>
          {errors.amount && (
            <p className="text-sm text-red-500">{errors.amount.message}</p>
          )}
        </div>
      </div>

      {/* Right Column - Image Upload */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Receipt Images</Label>
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
            Upload Receipt
          </Button>
          <p className="text-xs text-gray-500 text-center">
            Max size: 5MB per image
          </p>
        </div>

        <div className="space-y-3">
          {/* Existing Images */}
          {existingImages?.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview}
                alt={`Receipt ${index + 1}`}
                className="h-[120px] w-full object-cover rounded-md transition-opacity group-hover:opacity-75"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index, false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {/* New Images */}
          {imagePreviews?.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview}
                alt={`Receipt ${index + 1}`}
                className="h-[120px] w-full object-cover rounded-md transition-opacity group-hover:opacity-75"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index, true)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {/* Empty State */}
          {existingImages?.length === 0 && imagePreviews.length === 0 && (
            <div className="h-[120px] w-full rounded-md border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center">
              <div className="text-sm text-gray-500 text-center p-4">
                <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No receipts uploaded</p>
              </div>
            </div>
          )}
        </div>

        {errorMessage && (
          <p className="text-sm text-red-500 text-center">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}
