import { useState } from "react";
import { useAddOrRemoveMembersMutation } from "@/app/slices/groupApiSlice";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { User, UserMinus, Users } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const GroupDetails = ({ isView, refetch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [removeMembers, { isLoading }] = useAddOrRemoveMembersMutation();
  const userdata = useSelector((state) => state.auth?.user?._id);
  const nav = useNavigate();

  const handleViewDetails = () => {
    setIsOpen(true);
  };

  const handleRemoveMembers = async (groupId, userId, isNavigate = false) => {
    try {
      const response = await removeMembers({ groupId, userId }).unwrap();
      if (response.success) {
        refetch();
        setIsOpen(false);
      }
      if (isNavigate) {
        nav("/groups");
        toast.success("Member Left successfully");
      } else {
        toast.success("Member removed successfully");
      }
    } catch (error) {
      toast.error(error?.message || "Failed to remove member");
    }
  };

  const isCreator =
    isView?.group?.creator?._id?.toString() === userdata?.toString();

  return (
    <div>
      {isView && isView.length !== 0 && (
        <Button
          onClick={handleViewDetails}
          className="flex items-center gap-2"
          variant="outline"
        >
          <Users size={16} />
          View Group Details
        </Button>
      )}

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader className="space-y-2">
            <SheetTitle className="text-2xl font-bold flex items-center gap-2">
              <Users className="text-primary" />
              {(isView?.group?.name || "Group Details")
                .charAt(0)
                .toUpperCase() +
                (isView?.group?.name || "Group Details").slice(1)}
            </SheetTitle>
            <SheetDescription>
              {"View  group members details below."}
            </SheetDescription>
          </SheetHeader>

          <Separator className="my-4" />

          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User size={18} />
              Members ({isView?.group?.members?.length || 0})
            </h3>
          </div>

          <ScrollArea className="h-72 mt-2 pr-4">
            <div className="space-y-2">
              {isView?.group?.members?.map((member) => (
                <Card key={member.user._id} className="overflow-hidden">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border">
                          <AvatarImage src={member.user?.avatar?.url} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {member.user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.user.name}</p>
                          <Badge
                            variant={
                              member.role === "admin" ? "default" : "outline"
                            }
                            className="mt-1"
                          >
                            {member.role}
                          </Badge>
                        </div>
                      </div>

                      {isCreator && member.role !== "admin" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            handleRemoveMembers(
                              isView?.group?._id,
                              member.user._id
                            )
                          }
                          disabled={isLoading}
                          className="flex items-center gap-1"
                        >
                          <UserMinus size={14} />
                          Remove
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>

          <SheetFooter className="mt-6">
            {!isCreator && (
              <Button
                onClick={() =>
                  handleRemoveMembers(isView?.group?._id, userdata, true)
                }
                className="w-full "
              >
                Left
              </Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default GroupDetails;
