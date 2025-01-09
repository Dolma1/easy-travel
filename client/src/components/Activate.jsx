import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useActivateMutation } from "../app/slices/userApiSlice";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { Input } from "./ui/input";
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
      const errorMessage = err?.data?.message.charAt(0).toUpperCase() + err?.data?.message.slice(1);
      toast.error(errorMessage || "Activation failed. Please try again.")
    }
  };

  return (
    <>
      <div className="flex items-center h-screen justify-center">
        <Card className="lg:w-1/4 text-center  ">
          <CardHeader>
            <CardTitle>Verify Your Email</CardTitle>
            <p>Please Enter The Verification Code</p>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="flex justify-center">
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
                  <div>
                    <InputOTP
                      maxLength={6}
                      onChange={onChange}
                      value={value || ""}
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
                      <p className="error-message text-red-500">
                        {error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Submitting" : "Submit"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
};

export default Activate;
