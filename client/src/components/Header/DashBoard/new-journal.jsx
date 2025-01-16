// 'use client'

// import { useState } from 'react'
// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { PlusCircle, ImageIcon } from 'lucide-react'

// export default function NewJournalDialog() {
//   const [open, setOpen] = useState(false)
//   const [imagePreview, setImagePreview] = useState(null)

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     // Here you would typically handle the form submission
//     // For now, we'll just close the dialog
//     setOpen(false)
//     setImagePreview(null)
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button className="mb-6">
//           <PlusCircle className="mr-2 h-4 w-4" />
//           New Journal
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Create New Journal</DialogTitle>
//           <DialogDescription>
//             Add a new journal entry here. Click submit when you're done.
//           </DialogDescription>
//         </DialogHeader>
//         <form onSubmit={handleSubmit}>
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="title" className="text-right">
//                 Title
//               </Label>
//               <Input id="title" className="col-span-3" />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="body" className="text-right">
//                 Body
//               </Label>
//               <Textarea id="body" className="col-span-3" />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="photo" className="text-right">
//                 Photo
//               </Label>
//               <div className="col-span-3">
//                 <Input id="photo" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
//                 <Button type="button" variant="outline" onClick={() => document.getElementById('photo')?.click()}>
//                   <ImageIcon className="mr-2 h-4 w-4" />
//                   Upload Photo
//                 </Button>
//               </div>
//             </div>
//             {imagePreview && (
//               <div className="col-span-4">
//                 <div className="relative h-48 w-full">
//                   <img
//                     src={imagePreview || "/placeholder.svg"}
//                     alt="Preview"
//                     fill
//                     className="object-cover rounded-md"
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
//           <DialogFooter>
//             <Button type="submit">Submit</Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, ImageIcon } from "lucide-react";
import { useCreateJournalMutation } from "@/app/slices/userApiSlice";
import { toast } from "react-toastify";
export default function NewJournalDialog() {
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [createJournal, { isLoading }] = useCreateJournalMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await createJournal(data).unwrap();
      console.log(response);
      // setOpen(false)
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setOpen(false);
    }

    // setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-6">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Journal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Journal</DialogTitle>
          <DialogDescription>
            Add a new journal entry here. Click submit when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                {...register("title", {
                  required: "Title is required",
                  minLength: 4,
                })}
                className="col-span-3"
              />
              {errors.title && (
                <p className="col-span-4 text-sm text-red-500">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="body" className="text-right">
                Body
              </Label>
              <Textarea
                id="body"
                {...register("body", {
                  required: "Body is required",
                  minLength: 11,
                })}
                className="col-span-3"
              />
              {errors.body && (
                <p className="col-span-4 text-sm text-red-500">
                  {errors.body.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="photo" className="text-right">
                Photo
              </Label>
              <div className="col-span-3">
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register("photo", { required: "Photo is required" })}
                  onChange={(e) => {
                    handleImageChange(e); // For preview
                    if (e.target.files?.[0]) {
                      setValue("photoName", e.target.files[0].name); // Store the file name
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("photo")?.click()}
                >
                  <ImageIcon className="mr-2 h-4 w-4" />
                  {watch("photoName") ? watch("photoName") : "Upload Photo"}
                </Button>
                {watch("photoName") && (
                  <p className="mt-2 text-sm text-gray-600">
                    Uploaded: {watch("photoName")}
                  </p>
                )}
              </div>
            </div>

            {/* {imagePreview && (
              <div className="col-span-4">
                <div className="relative h-48 w-full">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className="object-cover rounded-md"
                  />
                </div>
              </div>
            )} */}
          </div>
          <DialogFooter>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
