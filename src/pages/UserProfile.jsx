import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";

export default function Profile() {
  const API_URL = "https://68370703664e72d28e432cf6.mockapi.io/login";
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    UserImage: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!userId) {
      toast.error("No user logged in. Please log in first.");
      setLoading(false);
      return;
    }

    axios
      .get(`${API_URL}/${userId}`)
      .then((res) => {
        const { fullName, email, password, UserImage } = res.data;
        setFormData({
          fullName,
          email,
          password,
          UserImage: UserImage || "",
        });
      })
      .catch(() => {
        toast.error("Failed to load profile.");
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((d) => ({ ...d, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    let imageURL = formData.UserImage.trim();
    if (!imageURL) {
      imageURL = "User_profile.svg";
    } else {
      try {
        new URL(imageURL);
      } catch {
        toast.error("Please enter a valid URL for the profile image.");
        setSubmitting(false);
        return;
      }
    }

    const payload = { ...formData, UserImage: imageURL };

    axios
      .put(`${API_URL}/${userId}`, payload)
      .then((res) => {
        const { fullName, email, UserImage } = res.data;
        localStorage.setItem("fullName", fullName);
        localStorage.setItem("email", email);
        localStorage.setItem("UserImage", UserImage);

        window.dispatchEvent(new Event("userProfileUpdated"));

        toast.success("Profile updated successfully!");
        navigate("/profile");
      })
      .catch(() => {
        toast.error("Failed to update profile.");
      })
      .finally(() => setSubmitting(false));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-teal-50">
        <p className="text-teal-600 animate-pulse">Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-teal-500 to-teal-600">
          <h2 className="text-center text-white text-2xl font-semibold">
            Edit Profile
          </h2>
        </div>
        <div className="px-6 py-6">
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
          />

          {formData.UserImage && (
            <div className="flex justify-center mb-6">
              <img
                src={formData.UserImage}
                alt="User avatar"
                className="w-24 h-24 rounded-full object-contain border-2 border-teal-200"
              />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            <div className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-teal-200 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-3 top-8 flex items-center text-teal-500 hover:text-teal-700"
              >
                {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
              </button>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Profile Image URL
              </label>
              <input
                type="text"
                name="UserImage"
                value={formData.UserImage}
                onChange={handleChange}
                placeholder="https://… or User_profile.svg"
                className="w-full px-4 py-2 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-2 rounded-lg text-white transition-all duration-200 
                ${
                  submitting
                    ? "bg-teal-300 cursor-not-allowed"
                    : "bg-teal-600 hover:bg-teal-700"
                }
              `}
            >
              {submitting ? "Updating…" : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
