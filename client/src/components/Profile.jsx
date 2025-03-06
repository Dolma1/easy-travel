import { useState, useEffect } from "react"; // Add useEffect
import { useForm, Controller } from "react-hook-form";
import {
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Users,
  Calendar,
  Edit2,
  X,
  Check,
  User as UserIcon,
  Bookmark,
  Lock,
} from "lucide-react";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from "@/app/slices/userApiSlice";
import { toast } from "react-toastify";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const { data, refetch, isLoading } = useGetUserProfileQuery();
  const [updateProfile, { isLoading: updateLoading }] =
    useUpdateUserProfileMutation();
  const user = data?.user;

  // Initialize profile state with default values
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "Add your phone number",
    address: "Add your address",
    joinDate: new Date().toLocaleString(),
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Tell us about yourself...",
    role: "user",
    journalStats: {
      totalEntries: 0,
      publicEntries: 0,
      privateEntries: 0,
    },
    groupStats: {
      totalGroups: 0,
      createdGroups: 0,
    },
  });

  // Update profile state when user data is available
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "John Doe",
        email: user.email || "john.doe@example.com",
        phone: user.phone || "Add your phone number",
        address: user.address || "Add your address",
        joinDate:
          user.createdAt?.toLocaleString() || new Date().toLocaleString(),
        avatar:
          user.avatar?.url ||
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        bio: user.bio || "Tell us about yourself...",
        role: user.role || "user",
        journalStats: user.journalStats || {
          totalEntries: 0,
          publicEntries: 0,
          privateEntries: 0,
        },
        groupStats: user.groupStats || {
          totalGroups: 0,
          createdGroups: 0,
        },
      });
    }
  }, [user]); // Run this effect whenever `user` changes

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: profile,
  });

  // Reset form values when profile state changes
  useEffect(() => {
    reset(profile);
  }, [profile, reset]);

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

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await updateProfile(data).unwrap();
      if (response.success) {
        toast.success("Profile updated Succesfully.");
        refetch();
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsEditing(false);
      setProfile(data);
    }
  };

  const handleCancel = () => {
    reset(profile);
    setIsEditing(false);
  };

  const StatCard = ({ icon: Icon, label, value, className = "" }) => (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-indigo-100 rounded-lg">
          <Icon className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  const InputField = ({
    icon: Icon,
    label,
    name,
    control,
    rules,
    type = "text",
  }) => (
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-indigo-100 rounded-lg">
        <Icon className="w-5 h-5 text-indigo-600" />
      </div>
      {isEditing ? (
        <div className="flex-1">
          <label className="block text-sm text-gray-500 mb-1">{label}</label>
          <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field }) => (
              <input
                {...field}
                type={type}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            )}
          />
          {errors[name] && (
            <p className="text-sm text-red-500 mt-1">{errors[name].message}</p>
          )}
        </div>
      ) : (
        <div className="flex-1">
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-gray-900">{profile[name]}</p>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-20 sm:space-x-5">
              <div className="relative group">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-40 h-40 rounded-full border-4 border-white shadow-lg object-cover"
                />
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Edit2 className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
              <div className="mt-6 sm:mt-0 text-center sm:text-left flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    {isEditing ? (
                      <Controller
                        name="name"
                        control={control}
                        rules={{ required: "Name is required" }}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            className="text-3xl font-bold text-gray-900 border-b-2 border-indigo-500 focus:outline-none bg-transparent"
                          />
                        )}
                      />
                    ) : (
                      <h1 className="text-3xl font-bold text-gray-900">
                        {profile.name}
                      </h1>
                    )}
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 capitalize">
                        {profile.role}
                      </span>
                      <span className="text-gray-500">·</span>
                      <span className="text-gray-500">
                        Joined {new Date(profile.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={BookOpen}
            label="Total Journal Entries"
            value={profile.journalStats.totalEntries}
          />
          {/* <StatCard
            icon={Lock}
            label="Private Entries"
            value={profile.journalStats.privateEntries}
          />
          <StatCard
            icon={Bookmark}
            label="Public Entries"
            value={profile.journalStats.publicEntries}
          /> */}
          <StatCard
            icon={Users}
            label="Total Groups"
            value={profile.groupStats.totalGroups}
          />
        </div>

        {/* Profile Information */}
        <div className="mt-8 grid gap-8 grid-cols-1 lg:grid-cols-2">
          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Contact Information
            </h2>
            <div className="space-y-6">
              <InputField
                icon={Mail}
                label="Email Address"
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                }}
                type="email"
              />
              <InputField
                icon={Phone}
                label="Phone Number"
                name="phone"
                control={control}
                rules={{
                  pattern: {
                    value: /^\+?[0-9\s-]+$/,
                    message: "Invalid phone number",
                  },
                }}
              />
              <InputField
                icon={MapPin}
                label="Address"
                name="address"
                control={control}
              />
            </div>
          </div>

          {/* Bio Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              About Me
            </h2>
            {isEditing ? (
              <Controller
                name="bio"
                control={control}
                rules={{
                  required: "Bio is required",
                  maxLength: {
                    value: 100,
                    message: "Bio must be less than 100 characters",
                  },
                }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Tell us about yourself..."
                  />
                )}
              />
            ) : (
              <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={updateLoading}
              className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Check className="w-4 h-4" />
              {updateLoading ? <span>Saving...</span> :
              <span>Save Changes</span>
              }
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
