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
const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const [storeLogin, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await storeLogin(data).unwrap();
      dispatch(setCredentials({ user: res.user }));
      // navigate("/");
      navigate("/dashboard");
      toast.success("Login Successfull");
    } catch (error) {
      toast.error("Invalid Email or Password");
    }
  };

  return (
    <div className=" flex items-center h-screen justify-center bg-[#586BAF] ">
      <Card className="w-1/4 bg">
        <CardHeader>
          <CardTitle className="text-center">Login to your account</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "Enter your email",
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
                {...register("password", { required: "Password is required" })}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col  space-y-4">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Submitting..." : "Login"}
            </Button>

            <p className="text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => navigate("/register")}
              >
                Signup
              </span>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
