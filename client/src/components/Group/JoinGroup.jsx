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
import { ArrowBigLeft, Crown, Key, MapPin, Users, Users2 } from "lucide-react";
import {
  useJoinGroupMutation,
  useVerifyCodeMutation,
} from "@/app/slices/groupApiSlice";
import { toast } from "react-toastify";

const JoinGroup = ({ refetch }) => {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [groupInfo, setGroupInfo] = useState({});

  const [verifyCode, { isError: verifyError, isLoading }] =
    useVerifyCodeMutation();
  const [joinGroup, { isLoading: joinLoading }] = useJoinGroupMutation();

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

  return (
    <div className="bg-white rounded-lg shadow-md ">
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button className="bg-[#4338CA] text-white hover:bg-[#4338CA]/90">
            <Users2 className="mr-2" /> Join Group
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[650px] bg-white rounded-xl shadow-2xl">
          {Object.keys(groupInfo).length === 0 ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center">
                  <Key className="mr-3 text-blue-600" /> Group Access
                </DialogTitle>
                <DialogDescription className="text-center text-gray-600">
                  Enter your 6-digit group invitation code
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-3 p-4">
                <div className="flex flex-col items-center space-y-4">
                  <InputOTP
                    maxLength={10}
                    value={code}
                    onChange={(value) => setCode(value)}
                    className="w-full"
                    disabled={isLoading}
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
                    <p>Invalid or Expired Join code</p>
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full font-semibold py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out"
                  disabled={code.length !== 10 || isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Button>
              </form>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-800 flex items-center justify-center">
                  <Users className=" text-blue-600" /> Group Details
                </DialogTitle>
              </DialogHeader>
              {/* Group Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-lg">
                <div className="flex flex-col md:flex-row justify-between items-start ">
                  <div className=" md:mb-0">
                    <h1 className="text-xl font-bold text-white mb-1">
                      {groupInfo.name}
                    </h1>
                    <div className="flex items-center space-x-2 text-blue-100">
                      <MapPin className="h-4 w-4" />
                      <span>{groupInfo.trip.destination}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1">
                      <p className="text-md font-mono font-bold text-white tracking-wider">
                        {groupInfo.joinCode}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        groupInfo.groupStatus
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {groupInfo.groupStatus ? "Member" : "Not Joined"}
                    </span>
                  </div>
                </div>
              </div>
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 ">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-blue-600 text-sm font-medium mb-1">
                    Budget
                  </h3>
                  <p className="text-lg font-bold text-blue-900">
                    {groupInfo.currency} {groupInfo.budget.toLocaleString()}
                  </p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-indigo-600 text-sm font-medium">
                      Members
                    </h3>
                    <Users className="h-4 w-4 text-indigo-600" />
                  </div>
                  <p className="text-lg font-bold text-indigo-900">
                    {groupInfo.members?.length}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="text-purple-600 text-sm font-medium mb-1">
                    Expenses
                  </h3>
                  <p className="text-lg font-bold text-purple-900">
                    {groupInfo.currency}{" "}
                    {groupInfo.totalExpenses.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Members List */}
              <div className="bg-gray-50 rounded-lg p-2 ">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-gray-900">
                    Group Members
                  </h2>
                </div>
                <div className="space-y-2 max-h-44 overflow-y-auto">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 rounded-full p-1.5">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-1">
                          <p className="font-medium text-gray-900">
                            {groupInfo.members[0].user?.name}
                          </p>
                          {groupInfo.members[0].role === "admin" && (
                            <Crown className="h-3 w-3 text-yellow-500" />
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full  font-medium ">
                      + {groupInfo.members?.length} Others...
                    </span>
                  </div>
                </div>
              </div>
              <Button
                className="w-64 rounded-lg font-medium flex   mx-auto space-x-2"
                disabled={isLoading}
                onClick={() =>
                  !groupInfo.groupStatus && joinGroupHandler(groupInfo?._id)
                }
              >
                {groupInfo.groupStatus ? (
                  <>
                    <ArrowBigLeft className="h-5 w-5" />
                    <Button onClick={() => setOpen(false)}>
                      Back to Dashboard
                    </Button>
                  </>
                ) : (
                  <>
                    <Users2 className="h-5 w-5" />
                    <span>Join Group</span>
                  </>
                )}
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JoinGroup;
