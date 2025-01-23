import { useForm, Controller } from "react-hook-form";
import { ShieldCheck, Mail, KeyRound } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useActivateMutation } from "../app/slices/userApiSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "react-toastify";

const Activate = () => {
  const { control, handleSubmit } = useForm();

  const location = useLocation();
  const activationToken = location.state?.activationToken;
  const [activateAccount, { isLoading }] = useActivateMutation();
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    if (!activationToken) {
      alert("Activation token is missing.");
      return;
    }

    // Combine the activation code from user input and token from location state
    const payload = {
      activation_code: data.otp,
      activation_token: activationToken,
    };
    console.log(payload);
    try {
      const response = await activateAccount(payload).unwrap();
      if (response.success) {
        navigate("/login");
        // Perform further actions like redirecting to login
        toast.success("Registration was successfull");
      }
    } catch (err) {
      const errorMessage =
        err?.data?.message.charAt(0).toUpperCase() +
        err?.data?.message.slice(1);
      toast.error(errorMessage || "Activation failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-3">
        <div className="flex justify-center">
          <div className="rounded-full bg-white p-3">
            <ShieldCheck className="w-28 h-28 text-[#586BAF]" />
          </div>
        </div>

        <Card className="w-full">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">
              Activate Your Account
            </CardTitle>
            <CardDescription>
              Enter the code we sent to your email to activate your account.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Mail className="w-12 h-12 text-[#586BAF]" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-medium">
                    Enter your activation code
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Check your inbox for the 6-digit code
                  </p>
                </div>

                <div className="flex justify-center">
                  <Controller
                    name="otp"
                    control={control}
                    rules={{
                      required: "OTP is required",
                      validate: (value = "") =>
                        value.length === 6 || "OTP must be exactly 6 digits",
                    }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <div className="space-y-2">
                        <InputOTP
                          maxLength={6}
                          onChange={onChange}
                          value={value || ""}
                          className="gap-2"
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                        {error && (
                          <p className="text-sm text-red-500 text-center">
                            {error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full " disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Activating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 justify-center">
                      <KeyRound className="w-4 h-4" />
                      Activate Account
                    </div>
                  )}
                </Button>
              </div>

              <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
                <ShieldCheck className="w-4 h-4" />
                Your account is protected by industry-standard encryption
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Activate;
