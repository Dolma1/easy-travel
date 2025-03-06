import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { ClipboardCopy, CheckCircle, Share2 } from "lucide-react";
import { useInviteCodeMutation } from "@/app/slices/groupApiSlice";

const ShareCodeGenerator = ({ groupId }) => {
  const [generatedCode, setGeneratedCode] = useState();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  console.log(generatedCode)

  const [inviteCode, { isLoading, isError }] = useInviteCodeMutation();

  const generateCode = async () => {
    try {
      const res = await inviteCode(groupId).unwrap();
      console.log(res);
      if (res.success) {
        setGeneratedCode(res.data.code);

      }
    } catch (error) {
      console.log(error);
    }

    setOpen(true); // Open dialog after generating code
  };

  const copyToClipboard = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCopied(true); // Show "Copied!" animation
      toast.success("Copied!");
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md ">
      <div className="space-y-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={generateCode}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              <Share2 />
              Share
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] p-6 rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-gray-800">
                <div className="flex gap-2 items-center">
                  <Share2 size={18} />
                  Share Code
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 flex justify-between items-center">
                <span className="text-lg font-mono text-gray-800">
                  {generatedCode}
                </span>
                <Button
                  onClick={copyToClipboard}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md flex items-center gap-1 transition-all duration-300"
                >
                  {copied ? (
                    <CheckCircle size={18} />
                  ) : (
                    <ClipboardCopy size={18} />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
              <p className="text-sm text-gray-500 text-center">
                Click "Copy" to save it to your clipboard.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ShareCodeGenerator;
