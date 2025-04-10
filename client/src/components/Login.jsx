import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { setCredentials } from "../app/slices/authSlice";
import { useLoginMutation } from "../app/slices/userApiSlice";
import { toast } from "react-toastify";
import { Lock, Mail, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react"; // Import useState hook

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const [storeLogin, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const onSubmit = async (data) => {
    try {
      const res = await storeLogin(data).unwrap();
      dispatch(setCredentials({ user: res.user }));
      console.log(res.user.role)
      if (res.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
      toast.success("Login Successful");
    } catch (errors) {
      toast.error(errors.message || "Invalid email or password");
    }
  };

  return (
    <div className="login-container min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <Card className="glass-card">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Lock className="w-6 h-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-gray-800">
              Welcome Back
            </CardTitle>
            <p className="text-sm text-center text-gray-600">
              Enter your credentials to access your account
            </p>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-10 input-transition"
                    {...register("email", {
                      required: "Email is required",
                      validate: {
                        matchPattern: (value) =>
                          /([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}/gim.test(
                            value
                          ) || "Invalid email address",
                      },
                    })}
                    placeholder="name@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"} // Toggle input type
                    className="pl-10 pr-10 input-transition" // Added pr-10 for the eye icon
                    {...register("password", {
                      required: "Password is required",
                    })}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)} // Toggle visibility
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FF8E1F] hover:bg-[#FF8E1F]/90 text-black"
              >
                {isLoading ? (
                  "Signing in..."
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>

              <p className="text-sm text-center text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="text-primary hover:underline font-medium"
                >
                  Create account
                </button>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
