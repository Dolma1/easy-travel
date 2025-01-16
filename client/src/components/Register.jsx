import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"; // Adjust import based on your file structure
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRegisterMutation } from "../app/slices/userApiSlice";
import { toast } from "react-toastify";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const password = watch("password"); // Watch the password field for validation

  const navigate = useNavigate();
  const [storeRegister, { isLoading }] = useRegisterMutation();

  const onSubmit = async (data) => {
    try {
      const res = await storeRegister(data);
      console.log(res);
      // dispatch(setCredentials(res.data));
      navigate("/activate", {
        state: { activationToken: res.data.activationToken },
      });
      toast.success("Please check your mail");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className=" flex items-center justify-center h-screen bg-[#586BAF]">
      <Card className="lg:w-1/4">
        <CardHeader>
          <CardTitle className="text-center">Register Your Details</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                {...register("name", { required: "Name is required" })}
                placeholder="Enter your name"
                className="mt-1"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: true,
                  validate: {
                    matchPattern: (value) =>
                      /([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}/gim.test(value) ||
                      "Invalid email address",
                  },
                })}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col  space-y-4">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Submitting..." : "Register"}
            </Button>
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;
