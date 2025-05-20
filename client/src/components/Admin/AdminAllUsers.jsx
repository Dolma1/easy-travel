import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  User as UserIcon,
  Ban,
  UserPlus,
  LockOpen,
  RefreshCw,
} from "lucide-react";
import {
  useGetUsersQuery,
  useAddUserMutation,
  useBanUserMutation,
} from "@/app/slices/adminApiSlice";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

function AdminAllUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);

  // React Hook Form for Add User
  const {
    register: registerAddUser,
    handleSubmit: handleAddUserSubmit,
    formState: { errors: addUserErrors },
    reset: resetAddUserForm,
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Get Users
  const { data, isLoading, isError, refetch } = useGetUsersQuery();

  // Add User
  const [addUser, { isLoading: addUserLoading }] = useAddUserMutation();

  // Ban/Unban User - single mutation for both actions
  const [banUser, { isLoading: banUserLoading }] = useBanUserMutation();

  const users = data?.users || [];

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBanUser = (user) => {
    setSelectedUser(user);
    setShowBanDialog(true);
  };

  const confirmBanUser = async () => {
    try {
      const response = await banUser(selectedUser._id).unwrap();

      if (response.success) {
        toast.success(
          response.isBanned
            ? "User banned successfully"
            : "User unbanned successfully"
        );
        refetch();
        setShowBanDialog(false);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update user status");
    }
  };

  const onSubmitAddUser = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await addUser({
        name: data.name,
        email: data.email,
        password: data.password,
      }).unwrap();

      if (response.success) {
        toast.success(response.message || "User added successfully");
        refetch();
        setShowAddUserDialog(false);
        resetAddUserForm();
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add user");
    }
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-500" />
          <p className="text-gray-500">Loading Users...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500 text-xl">Error while fetching users</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[100vh] flex-1">
      <div className="overflow-auto">
        <div className="p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold">All Users</h1>
                <p className="text-muted-foreground">
                  Manage and monitor user accounts
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  onClick={() => setShowAddUserDialog(true)}
                  className="flex items-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Add New User
                </Button>
                <Button
                  variant="outline"
                  onClick={() => refetch()}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>

            <Card className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="pb-4 text-left">User</th>
                      <th className="pb-4 text-left">Contact</th>
                      <th className="pb-4 text-left">Role</th>
                      <th className="pb-4 text-left">Status</th>
                      <th className="pb-4 text-left">Joined Date</th>
                      <th className="pb-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr key={user._id} className="border-b last:border-0">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              {user.avatar?.url ? (
                                <img
                                  src={user.avatar.url}
                                  alt={user.name}
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                                  <UserIcon className="h-5 w-5 text-gray-500" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <p className="text-sm">
                              {user.phone ? user.phone : "No Contact Details"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {user.address
                                ? user.address
                                : "Address not found"}
                            </p>
                          </td>
                          <td className="py-4">
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize bg-blue-100 text-blue-800">
                              {user.role}
                            </span>
                          </td>
                          <td className="py-4">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                user.isBanned
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {user.isBanned ? "Banned" : "Active"}
                            </span>
                          </td>

                          <td className="py-4">{formatDate(user.createdAt)}</td>
                          <td className="py-4">
                            <div className="flex gap-2">
                              {user.role !== "admin" && (
                                <Button
                                  variant={
                                    !user.isBanned ? "destructive" : "outline"
                                  }
                                  size="sm"
                                  onClick={() => handleBanUser(user)}
                                  className="flex items-center gap-1"
                                >
                                  {!user.isBanned ? (
                                    <>
                                      <Ban className="h-4 w-4" />
                                      Ban
                                    </>
                                  ) : (
                                    <>
                                      <LockOpen className="h-3 w-3" />
                                      Unban
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-6 text-center text-gray-500"
                        >
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Ban User Dialog */}
      <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {!selectedUser?.isBanned ? "Ban User" : "Unban User"}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to{" "}
              {!selectedUser?.isBanned ? "ban" : "unban"} {selectedUser?.name}?
              This action can be reversed later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBanDialog(false)}>
              Cancel
            </Button>
            <Button
              variant={!selectedUser?.isBanned ? "destructive" : "default"}
              onClick={confirmBanUser}
              disabled={banUserLoading}
            >
              {banUserLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : !selectedUser?.isBanned ? (
                "Ban User"
              ) : (
                "Unban User"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New User Dialog */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account. Fill in all the required information.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleAddUserSubmit(onSubmitAddUser)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                {...registerAddUser("name", { required: "Name is required" })}
                placeholder="John Doe"
              />
              {addUserErrors.name && (
                <p className="text-sm text-red-500">
                  {addUserErrors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...registerAddUser("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                placeholder="john@example.com"
              />
              {addUserErrors.email && (
                <p className="text-sm text-red-500">
                  {addUserErrors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...registerAddUser("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {addUserErrors.password && (
                <p className="text-sm text-red-500">
                  {addUserErrors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...registerAddUser("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
              />
              {addUserErrors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {addUserErrors.confirmPassword.message}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddUserDialog(false);
                  resetAddUserForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={addUserLoading}>
                {addUserLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add User"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </ScrollArea>
  );
}

export default AdminAllUsers;
