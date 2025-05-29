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

    // Default to placeholder SVG if empty, otherwise validate URL
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
      <div className="flex justify-center items-center h-48">
        <p className="text-gray-500">Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow relative">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />

      <h2 className="text-2xl font-semibold mb-4 text-center">Edit Profile</h2>

      {/* Profile Image Preview */}
      {formData.UserImage && (
        <div className="flex justify-center mb-4">
          <img
            src={formData.UserImage}
            alt="User avatar"
            className="w-24 h-24 rounded-full object-contain border"
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block mb-1 font-medium">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Password with toggle */}
        <div className="relative">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 top-7 flex items-center px-3 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
          </button>
        </div>

        {/* Profile Image URL */}
        <div>
          <label className="block mb-1 font-medium">Profile Image URL</label>
          <input
            type="text"
            name="UserImage"
            value={formData.UserImage}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="https://… or User_profile.svg"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-2 rounded text-white ${
            submitting
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {submitting ? "Updating…" : "Update Profile"}
        </button>
      </form>
    </div>
  );
}
