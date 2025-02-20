import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Edit2,
  X,
  Check,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    occupation: "Senior Software Engineer",
    joinDate: "January 2024",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Passionate about building great software and solving complex problems.",
    password: "********", // Masked password in view mode
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: profile,
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({
          ...prev,
          avatar: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data) => {
    setProfile(data);
    setIsEditing(false);
  };

  const handleCancel = () => {
    reset(profile);
    setIsEditing(false);
  };

  const InputField = ({
    icon: Icon,
    label,
    name,
    control,
    rules,
    type = "text",
  }) => (
    <div className="flex items-center space-x-3">
      <Icon className="w-5 h-5 text-indigo-500 flex-shrink-0" />
      {isEditing ? (
        <div className="flex-1">
          <label className="block text-sm text-gray-500 mb-1">{label}</label>
          <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field }) => (
              <div className="relative">
                <input
                  {...field}
                  type={type}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
                {name === "password" && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                )}
              </div>
            )}
          />
          {errors[name] && (
            <p className="text-sm text-red-500 mt-1">{errors[name].message}</p>
          )}
        </div>
      ) : (
        <span className="text-gray-600">
          {name === "password" ? "********" : profile[name]}
        </span>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-indigo-600"></div>
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:space-x-5">
              <div className="relative">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
                />
                {isEditing && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="absolute bottom-0 right-0 opacity-0 w-10 h-10 cursor-pointer"
                  />
                )}
                <button
                  aria-label="Edit profile"
                  className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit2 className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div className="mt-6 sm:mt-0 text-center sm:text-left">
                {isEditing ? (
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: "Name is required" }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="text-3xl font-bold text-gray-900 border-b-2 border-indigo-500 focus:outline-none"
                      />
                    )}
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-gray-900">
                    {profile.name}
                  </h1>
                )}
                {isEditing ? (
                  <Controller
                    name="occupation"
                    control={control}
                    rules={{ required: "Occupation is required" }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="mt-1 text-gray-500 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                      />
                    )}
                  />
                ) : (
                  <p className="mt-1 text-gray-500">{profile.occupation}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="mt-8 grid gap-8 grid-cols-1 md:grid-cols-2">
          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Contact Information
            </h2>
            <div className="space-y-4">
              <InputField
                icon={Mail}
                label="Email"
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                }}
                type="email"
              />
              <InputField
                icon={Phone}
                label="Phone"
                name="phone"
                control={control}
                rules={{
                  required: "Phone is required",
                  pattern: {
                    value: /^\+?[0-9\s-]+$/,
                    message: "Invalid phone number",
                  },
                }}
                type="tel"
              />
              <InputField
                icon={MapPin}
                label="Location"
                name="location"
                control={control}
                rules={{ required: "Location is required" }}
              />
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Account Details
            </h2>
            <div className="space-y-4">
              <InputField
                icon={Briefcase}
                label="Occupation"
                name="occupation"
                control={control}
                rules={{ required: "Occupation is required" }}
              />
              <InputField
                icon={Lock}
                label="Password"
                name="password"
                control={control}
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                }}
                type={showPassword ? "text" : "password"} // Toggle password visibility
              />
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-indigo-500" />
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="text-gray-600">{profile.joinDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Bio</h2>
            {isEditing ? (
              <Controller
                name="bio"
                control={control}
                rules={{ required: "Bio is required" }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                )}
              />
            ) : (
              <p className="text-gray-600">{profile.bio}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
