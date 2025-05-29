// src/components/Profile.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
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
        setFormData({ fullName, email, password, UserImage });
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

    axios
      .put(`${API_URL}/${userId}`, formData)
      .then((res) => {
        const { fullName, email, UserImage } = res.data;
        localStorage.setItem("fullName", fullName);
        localStorage.setItem("email", email);
        localStorage.setItem("UserImage", UserImage);

        // dispatch our custom event:
        window.dispatchEvent(new Event("userProfileUpdated"));

        toast.success("Profile updated successfully!");
        navigate("/profile"); // or wherever
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
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
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

        {/* Password */}
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* UserImage URL */}
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
