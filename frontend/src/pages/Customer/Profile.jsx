import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  User,
  Mail,
  Shield,
  Pencil,
  Trash2,
  LogOut,
  X,
  Save,
} from "lucide-react";

import {
  getProfile,
  updateProfile,
  deleteProfile,
} from "../../services/userService";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);

  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const [showDeletePopup, setShowDeletePopup] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProfile();

        setUser(data.user);

        setFormData({
          name: data.user.name,
          email: data.user.email,
        });
      } catch (error) {
        console.error("Profile error:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");

          window.dispatchEvent(
            new Event("authChange")
          );

          navigate("/login");

          return;
        }

        setError(
          error.response?.data?.message ||
            "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setError("");
    setSuccess("");

    setFormData({
      name: user.name,
      email: user.email,
    });

    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setError("");
    setSuccess("");

    setFormData({
      name: user.name,
      email: user.email,
    });

    setIsEditing(false);
  };

  const handleUpdateProfile = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const name = formData.name.trim();
    const email = formData.email.trim();

    if (!name) {
      setError("Name is required.");
      return;
    }

    if (!email) {
      setError("Email is required.");
      return;
    }

    try {
      setSaving(true);

      const data = await updateProfile(user._id, {
        name,
        email,
      });

      setUser(data.user);

      setFormData({
        name: data.user.name,
        email: data.user.email,
      });

      setIsEditing(false);

      setSuccess("Profile updated successfully.");
    } catch (error) {
      console.error("Update profile error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    window.dispatchEvent(
      new Event("authChange")
    );

    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);
      setError("");

      await deleteProfile(user._id);

      localStorage.removeItem("token");

      window.dispatchEvent(
        new Event("authChange")
      );

      navigate("/login");
    } catch (error) {
      console.error("Delete account error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete account"
      );

      setShowDeletePopup(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm text-gray-500">
            Loading profile...
          </p>
        </div>
      </section>
    );
  }

  if (error && !user) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <p className="text-sm font-medium text-red-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Go Home
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#14245c]">
          My Profile
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your account information
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {/* Profile Card */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

        {/* Profile Header */}
        <div className="border-b border-gray-100 px-6 py-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

            {/* Avatar */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-indigo-50">
              <User
                size={36}
                strokeWidth={1.7}
                className="text-indigo-600"
              />
            </div>

            {/* User Details */}
            <div className="min-w-0">
              <h2 className="text-xl font-semibold text-[#14245c]">
                {user.name}
              </h2>

              <p className="mt-1 break-all text-sm text-gray-500">
                {user.email}
              </p>

              <span className="mt-2 inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium capitalize text-indigo-600">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="px-6 py-8">

          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-[#14245c]">
                Personal Information
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Your account details
              </p>
            </div>

            {!isEditing && (
              <button
                type="button"
                onClick={handleEdit}
                className="flex shrink-0 items-center gap-2 rounded-lg border border-indigo-600 px-4 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50"
              >
                <Pencil size={15} />
                Edit
              </button>
            )}
          </div>

          {/* Edit Form */}
          {isEditing ? (
            <form
              onSubmit={handleUpdateProfile}
              className="mt-6"
            >
              <div className="grid gap-5 sm:grid-cols-2">

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>

                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="mt-6 flex flex-wrap gap-3">

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={16} />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            /* Profile Information */
            <div className="mt-6 grid gap-5 sm:grid-cols-2">

              {/* Name */}
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <User
                    size={18}
                    className="text-indigo-500"
                  />

                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">
                      Full Name
                    </p>

                    <p className="mt-1 truncate text-sm font-medium text-[#14245c]">
                      {user.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <Mail
                    size={18}
                    className="text-indigo-500"
                  />

                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">
                      Email Address
                    </p>

                    <p className="mt-1 truncate text-sm font-medium text-[#14245c]">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Role */}
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <Shield
                    size={18}
                    className="text-indigo-500"
                  />

                  <div>
                    <p className="text-xs text-gray-500">
                      Account Type
                    </p>

                    <p className="mt-1 text-sm font-medium capitalize text-[#14245c]">
                      {user.role}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account ID */}
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <User
                    size={18}
                    className="text-indigo-500"
                  />

                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">
                      Account ID
                    </p>

                    <p className="mt-1 truncate text-sm font-medium text-[#14245c]">
                      {user._id}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Account Actions */}
        <div className="border-t border-gray-100 px-6 py-8">

          <h3 className="text-lg font-semibold text-[#14245c]">
            Account Actions
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Manage your account session and account status
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <LogOut size={16} />
              Logout
            </button>

            {/* Delete */}
            <button
              type="button"
              onClick={() => {
                setError("");
                setSuccess("");
                setShowDeletePopup(true);
              }}
              className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-5 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
            >
              <Trash2 size={16} />
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <Trash2
                size={22}
                className="text-red-500"
              />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-gray-900">
              Delete Account?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              This action will permanently delete your account.
              You will need to create a new account if you want
              to use CommerceX again.
            </p>

            <div className="mt-6 flex justify-end gap-3">

              <button
                type="button"
                disabled={deleting}
                onClick={() =>
                  setShowDeletePopup(false)
                }
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteAccount}
                className="rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting
                  ? "Deleting..."
                  : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Profile;