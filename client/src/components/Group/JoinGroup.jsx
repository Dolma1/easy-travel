import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  ArrowBigLeft,
  Calendar,
  Clock,
  Crown,
  Key,
  MapPin,
  Users,
  Users2,
  Wallet,
  Receipt,
} from "lucide-react";
// import {
//   MapPin,
//   Clock,
//   Users,
//   Calendar,
//   Crown,
//   Users2,
//   ArrowBigLeft,
// } from 'lucide-react';

import {
  useGetGroupQuery,
  useJoinGroupMutation,
  useVerifyCodeMutation,
} from "@/app/slices/groupApiSlice";

import { toast } from "react-toastify";
import { Badge } from "../ui/badge";

const JoinGroup = () => {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [groupInfo, setGroupInfo] = useState({});

  const [verifyCode, { isError: verifyError, isLoading: verifyLoading }] =
    useVerifyCodeMutation();
  const [joinGroup, { isLoading: joinLoading }] = useJoinGroupMutation();
  const { refetch } = useGetGroupQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await verifyCode({ joinCode: code }).unwrap();
      console.log(res);
      if (res.success) {
        setGroupInfo({
          ...res.group,
          groupStatus: res.isMember,
        });
      }
    } catch (error) {
      toast.error(error.data?.message || "Failed to verify code");
    }
  };

  const joinGroupHandler = async (groupId) => {
    try {
      const res = await joinGroup({ groupId }).unwrap();
      console.log(res);
      if (res.success) {
        setGroupInfo((prevState) => ({
          ...prevState,
          groupStatus: true,
        }));
        setOpen(false);
        toast.success("Successfully joined the group!");
      }
    } catch (error) {
      toast.error(error.data?.message || "Failed to join group");
    } finally {
      refetch();
    }
  };

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
    if (!isOpen) {
      setGroupInfo({});
      setCode("");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="space-y-4">
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <div>
              <Button>
                <Users2 className="mr-2" /> Join Group
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-[650px] bg-white rounded-xl shadow-2xl">
            {Object.keys(groupInfo).length === 0 ? (
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center">
                  <Key className="mr-3 text-blue-600" /> Group Access
                </DialogTitle>
                <DialogDescription className="text-center text-gray-600">
                  Enter your 6-digit group invitation code
                </DialogDescription>
              </DialogHeader>
            ) : (
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center">
                  <Users className="mr-3 text-blue-600" /> Group Details
                </DialogTitle>
              </DialogHeader>
            )}

            {Object.keys(groupInfo).length === 0 ? (
              <form onSubmit={handleSubmit} className="space-y-6 p-4">
                <div className="flex flex-col items-center space-y-4">
                  <InputOTP
                    maxLength={10}
                    value={code}
                    onChange={(value) => setCode(value)}
                    className="w-full"
                    disabled={verifyLoading || joinLoading}
                  >
                    <InputOTPGroup className="flex justify-center space-x-2">
                      {Array.from({ length: 10 }).map((_, index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className="w-12 h-16 text-2xl border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                  <p className="text-sm text-gray-500 text-center italic">
                    Tip: Paste or type your 10-character code
                  </p>
                </div>
                {verifyError && (
                  <div className="text-center py-4 text-red-600">
                    <p>Failed to verify code. Please try again.</p>
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={code.length !== 10 || verifyLoading || joinLoading}
                >
                  {verifyLoading ? "Verifying..." : "Verify Code"}
                </Button>
              </form>
            ) : (
              <div className=" bg-gradient-to-br from-blue-50 to-indigo-50 ">
                <div className="  bg-white rounded-2xl shadow-xl overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 text-white flex justify-between ">
                    <div className="">
                      <h1 className="text-xl font-bold mb-1 ml-2">
                        {groupInfo.name}
                      </h1>
                      <div className="flex items-center space-x-2 ml-1">
                        <MapPin className="h-5 w-5" />
                        <span className="text-lg">
                          {groupInfo.trip.destination}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 justify-center ">
                      <Badge
                        variant={
                          groupInfo.groupStatus ? "secondary" : "default"
                        }
                        className="tex-sm flex"
                      >
                        {groupInfo.groupStatus
                          ? `Already Joined`
                          : "Not Joined"}
                      </Badge>
                    </div>

                    <div className="flex gap-2 flex-col">
                      <div className="flex items-center gap-3 ">
                        <Clock className="h-6 w-6  text-gray-200" />
                        <h2 className="text-lg font-semibold">JOIN CODE</h2>
                      </div>
                      <p className="flex justify-end">{groupInfo.joinCode}</p>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="p-5 space-y-4">
                    {/* Key Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-blue-50 rounded-xl p-2">
                        <div className="flex items-center space-x-3">
                          {/* <DollarSign className="h-8 w-8 text-blue-600" /> */}
                          <p className="text-blue-700  text-2xl font-bold    "></p>
                          <div>
                            <p className="text-sm text-gray-600">Budget</p>
                            <p className="text-xl font-bold text-gray-900">
                              {groupInfo.currency}{" "}
                              {groupInfo.budget.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-indigo-50 rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                          <Users className="h-8 w-8 text-indigo-600" />
                          <div>
                            <p className="text-sm text-gray-600">Members</p>
                            <p className="text-xl font-bold text-gray-900">
                              {groupInfo.members?.length}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-purple-50 rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                          <div>
                            <p className="text-sm text-gray-600">
                              Total Expenses
                            </p>
                            <p className="text-xl font-bold text-gray-900">
                              {groupInfo.currency}{" "}
                              {groupInfo.totalExpenses.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Trip Details */}
                    <div className="bg-gray-50 rounded-xl px-6 pt-6 pb-2 ">
                      <h2 className="text-lg font-semibold mb-2 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                        Trip Duration
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-gray-600">Start Date</p>
                          <p className="text-md font-medium">
                            {formatDate(groupInfo.trip?.startDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">End Date</p>
                          <p className="text-md font-medium">
                            {formatDate(groupInfo.trip?.endDate)}
                          </p>
                        </div>
                      </div>
                      {!groupInfo.groupStatus ? (
                        <Button
                          className=" flex justify-self-end"
                          disabled={verifyLoading || joinLoading}
                          onClick={() => joinGroupHandler(groupInfo._id)}
                        >
                          <Users2 /> Join Group
                        </Button>
                      ) : (
                        <Button
                          className=" flex justify-self-end"
                          onClick={() => setOpen(false)}
                        >
                          <ArrowBigLeft /> BACK
                        </Button>
                      )}
                    </div>

                    {/* Members List */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4  ">
                      <h2 className="text-xl font-semibold mb-1 flex items-center">
                        <Users className="h-4 w-4 mr-2 text-blue-600" />
                        Group Members
                      </h2>
                      <div className="space-y-2">
                        {groupInfo.members?.map((member, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              {member.role === "admin" && (
                                <Crown className="h-5 w-5 text-yellow-500" />
                              )}
                              <div>
                                <p className="font-medium">
                                  User {member.user.slice(-6)}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Joined{" "}
                                  {new Date(
                                    member.joinedAt
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                              {member.role}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              // TODO: Another part is this
              // <div className="relative">
              //   {/* Header Banner */}
              //   <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 p-8">
              //     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              //       <div className="space-y-3">
              //         <h1 className="text-3xl font-bold text-white">
              //           {groupInfo.name}
              //         </h1>
              //         <div className="flex items-center space-x-3 text-white/90">
              //           <MapPin className="h-5 w-5" />
              //           <span className="text-lg">
              //             {groupInfo.trip.destination}
              //           </span>
              //         </div>
              //       </div>

              //       <div className="flex flex-col items-end gap-3">
              //         <div
              //           className={`px-4 py-2 rounded-full text-sm font-semibold ${
              //             groupInfo.groupStatus
              //               ? "bg-green-500 text-white"
              //               : "bg-white text-indigo-900"
              //           }`}
              //         >
              //           {groupInfo.groupStatus
              //             ? "Already a Member"
              //             : "Not Joined"}
              //         </div>
              //         <div className="flex items-center gap-2 text-white/90">
              //           <Clock className="h-5 w-5" />
              //           <span className="font-medium">Code: </span>
              //           <span className="font-mono">{groupInfo.joinCode}</span>
              //         </div>
              //       </div>
              //     </div>
              //   </div>

              //   {/* Stats Cards */}
              //   <div className="p-8">
              //     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              //       <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              //         <div className="flex items-center gap-4">
              //           <div className="p-3 bg-blue-50 rounded-lg">
              //             <Wallet className="h-6 w-6 text-blue-600" />
              //           </div>
              //           <div>
              //             <p className="text-sm text-gray-500">Budget</p>
              //             <p className="text-xl font-bold text-gray-900">
              //               {groupInfo.currency}{" "}
              //               {groupInfo.budget.toLocaleString()}
              //             </p>
              //           </div>
              //         </div>
              //       </div>

              //       <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              //         <div className="flex items-center gap-4">
              //           <div className="p-3 bg-indigo-50 rounded-lg">
              //             <Users className="h-6 w-6 text-indigo-600" />
              //           </div>
              //           <div>
              //             <p className="text-sm text-gray-500">Members</p>
              //             <p className="text-xl font-bold text-gray-900">
              //               {groupInfo.members?.length}
              //             </p>
              //           </div>
              //         </div>
              //       </div>

              //       <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              //         <div className="flex items-center gap-4">
              //           <div className="p-3 bg-purple-50 rounded-lg">
              //             <Receipt className="h-6 w-6 text-purple-600" />
              //           </div>
              //           <div>
              //             <p className="text-sm text-gray-500">
              //               Total Expenses
              //             </p>
              //             <p className="text-xl font-bold text-gray-900">
              //               {groupInfo.currency}{" "}
              //               {groupInfo.totalExpenses.toLocaleString()}
              //             </p>
              //           </div>
              //         </div>
              //       </div>
              //     </div>

              //     {/* Trip Details */}
              //     <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
              //       <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900">
              //         <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
              //         Trip Duration
              //       </h2>
              //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              //         <div className="bg-gray-50 rounded-lg p-4">
              //           <p className="text-sm text-gray-500">Start Date</p>
              //           <p className="text-lg font-semibold text-gray-900">
              //             {formatDate(groupInfo.trip?.startDate)}
              //           </p>
              //         </div>
              //         <div className="bg-gray-50 rounded-lg p-4">
              //           <p className="text-sm text-gray-500">End Date</p>
              //           <p className="text-lg font-semibold text-gray-900">
              //             {formatDate(groupInfo.trip?.endDate)}
              //           </p>
              //         </div>
              //       </div>
              //     </div>

              //     {/* Members List */}
              //     <div className="bg-white rounded-xl p-6 shadow-sm">
              //       <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900">
              //         <Users className="h-5 w-5 mr-2 text-indigo-600" />
              //         Group Members
              //       </h2>
              //       <div className="space-y-3">
              //         {groupInfo.members?.map((member, index) => (
              //           <div
              //             key={index}
              //             className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              //           >
              //             <div className="flex items-center gap-4">
              //               <div className="p-2 bg-white rounded-full shadow-sm">
              //                 {member.role === "admin" ? (
              //                   <Crown className="h-6 w-6 text-yellow-500" />
              //                 ) : (
              //                   <Users className="h-6 w-6 text-gray-400" />
              //                 )}
              //               </div>
              //               <div>
              //                 <p className="font-semibold text-gray-900">
              //                   User {member.user.slice(-6)}
              //                 </p>
              //                 <p className="text-sm text-gray-500">
              //                   Joined{" "}
              //                   {new Date(member.joinedAt).toLocaleDateString()}
              //                 </p>
              //               </div>
              //             </div>
              //             <span
              //               className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              //                 member.role === "admin"
              //                   ? "bg-yellow-100 text-yellow-800"
              //                   : "bg-blue-100 text-blue-800"
              //               }`}
              //             >
              //               {member.role}
              //             </span>
              //           </div>
              //         ))}
              //       </div>
              //     </div>

              //     {/* Action Buttons */}
              //     <div className="mt-8 flex justify-end gap-4">
              //       <Button
              //         onClick={() => setOpen(false)}
              //         className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              //       >
              //         <ArrowBigLeft className="w-5 h-5" />
              //         Back
              //       </Button>
              //       {!groupInfo.groupStatus && (
              //         <Button
              //           onClick={() => joinGroupHandler(groupInfo._id)}
              //           disabled={verifyLoading || joinLoading}
              //           className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              //         >
              //           <Users2 className="w-5 h-5" />
              //           Join Group
              //         </Button>
              //       )}
              //     </div>
              //   </div>
              // </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default JoinGroup;
