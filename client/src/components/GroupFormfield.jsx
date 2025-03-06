import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "./ui/select";
import { Controller } from "react-hook-form";

export default function GroupFormfield({
  control,
  register,
  errors,
  setValue,
  getValues,
  errorMessage,
  setErrorMessage,
  startDate, // Receive startDate as a prop
}) {
  const defaultMinDate = new Date().toISOString().split("T")[0];

  return (
    <div className="grid grid-cols-[1fr_auto] gap-6">
      {/* Left Column */}
      <div className="space-y-4">
        {/* Name Field */}
        <div className="flex flex-col gap-1">
          <div className="flex flex-row items-center gap-11">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <div className="flex flex-col w-full">
              <Input
                id="name"
                placeholder="Give your entry a meaningful name"
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 4,
                    message: "Name must be at least 4 characters",
                  },
                })}
                className="col-span-3"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mb-1">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Start Date Field */}
        <div className="flex flex-row items-center gap-5">
          <Label htmlFor="startDate" className="min-w-max">
            Start Date
          </Label>
          <div className="flex flex-col w-full">
            <Input
              id="startDate"
              type="date"
              min={defaultMinDate}
              {...register("startDate", {
                required: "Start Date is required",
              })}
              className="col-span-3"
            />
            {errors.startDate && (
              <p className="text-sm text-red-500">{errors.startDate.message}</p>
            )}
          </div>
        </div>

        {/* End Date Field */}
        <div className="flex flex-row items-center gap-5">
          <Label htmlFor="endDate" className="min-w-max">
            End Date
          </Label>
          <div className="flex flex-col w-full">
            <Input
              id="endDate"
              type="date"
              min={startDate || defaultMinDate} // Set min to startDate or fallback to default
              {...register("endDate", {
                required: "End Date is required",
                validate: (value) => {
                  const start = getValues("startDate");
                  if (!start) return true; // No validation if startDate isn't set
                  return (
                    new Date(value) >= new Date(start) ||
                    "End Date must be on or after Start Date"
                  );
                },
              })}
              className="col-span-3"
            />
            {errors.endDate && (
              <p className="text-sm text-red-500">{errors.endDate.message}</p>
            )}
          </div>
        </div>

        {/* Destination Field */}
        <div className="flex flex-col gap-1">
          <div className="flex flex-row items-center gap-2">
            <Label htmlFor="destination" className="">
              Destination
            </Label>
            <div className="flex flex-col w-full">
              <Input
                id="destination"
                placeholder="Give your destination"
                {...register("destination", {
                  required: "Destination is required",
                })}
                className="col-span-3"
              />
              {errors.destination && (
                <p className="text-sm text-red-500">
                  {errors.destination.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Budget Field */}
        <div className="flex items-center gap-9">
          <Label htmlFor="budget" className="text-right">
            Budget
          </Label>
          <div className="col-span-3 relative w-full flex">
            {/* Currency Select */}
            <Controller
              name="currency"
              control={control}
              defaultValue="NPR"
              rules={{ required: "Currency is required" }}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value}
                >
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

            {/* Amount Input */}
            <Input
              type="number"
              id="budget"
              placeholder="Estimated Budget..."
              {...register("budget", {
                required: "Budget is required",
                min: { value: 0, message: "Budget cannot be negative" },
                valueAsNumber: true,
              })}
              className="flex-1 ml-2"
            />
          </div>
        </div>

        {/* Error Handling */}
        {errors?.currency && (
          <p className="text-red-500 text-sm">{errors.currency.message}</p>
        )}

        {errors?.budget && (
          <p className="text-red-500 text-sm">{errors.budget.message}</p>
        )}
      </div>
    </div>
  );
}
