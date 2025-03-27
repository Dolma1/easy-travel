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

  const [inviteCode] = useInviteCodeMutation();

  const generateCode = async () => {
    try {
      const res = await inviteCode(groupId).unwrap();
      console.log(res);
      if (res.success) {
        setGeneratedCode(res.data.code);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setOpen(true); // Open dialog after generating code
  };

  const copyToClipboard = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCopied(true); // Show "Copied!" animation
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
              className="bg-[#554CCF] hover:bg-[#554CCF]/90 text-white"
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
                  className="bg-[#554CCF] hover:bg-[#554CCF]/90 text-white"
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
