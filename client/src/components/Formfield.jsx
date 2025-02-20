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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ImageIcon, MapPin, Tag, SmilePlus, X } from "lucide-react";

export default function Formfield({
  control,
  register,
  errors,
  setValue,
  getValues,
  imagePreviews,
  setImagePreviews,
  tags,
  setTags,
  tagInput,
  setTagInput,
  errorMessage,
  setErrorMessage,
  handleImageChange,
  handleAddTag,
  removeTag,
  removeImage,
  moodOptions,
  existingImages,
}) {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-6">
      {/* Left Column */}
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

        {/* Content Field */}
        <div className="ml-14">
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                placeholder="Write your thoughts here..."
                className="w-full h-40 p-2 border rounded-md"
              />
            )}
          />
        </div>

        {/* Mood Field */}
        <div className="flex items-center gap-4">
          <Label className="text-right">Mood</Label>
          <div className="col-span-3 w-full">
            <Controller
              name="mood"
              control={control}
              defaultValue="neutral"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
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
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag(e)}
                />
              </div>
              <Button type="button" onClick={handleAddTag} variant="outline">
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

      {/* Right Column - Image Upload */}
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
          {/* Display existing images */}
          {existingImages?.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="h-[120px] w-full object-cover rounded-md"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 rounded-full"
                onClick={() => removeImage(index, false)} // Remove existing image
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {/* Display new images */}
          {imagePreviews?.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="h-[120px] w-full object-cover rounded-md"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 rounded-full"
                onClick={() => removeImage(index, true)} // Remove new image
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {/* Display placeholder if no images */}
          {existingImages?.length === 0 && imagePreviews.length === 0 && (
            <div className="h-[120px] w-full rounded-md border border-dashed border-gray-200 flex items-center justify-center">
              <div className="text-sm text-muted-foreground text-center p-4">
                <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No images uploaded</p>
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
