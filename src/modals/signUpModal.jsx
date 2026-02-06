import React, { useState } from "react";

export default function SignUpModal({ onClose, onSwitch, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://good-morning-routine.onrender.com/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Sign up failed");
      }

      // Store both token and user data
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      
      // Show loading spinner for a moment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Close modal and trigger success callback with both user and token
      onClose();
      if (onSuccess) {
        onSuccess(data.user, data.token);
      }

    } catch (err) {
      setError(err.message || "An error occurred during sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[1px]">
      <div className="relative w-full max-w-sm rounded-lg bg-white/60 p-6 shadow-xl backdrop-blur">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          disabled={loading}
        >
          ✕
        </button>

        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
            🌅
          </div>
          <h2 className="text-lg font-semibold">Create an Account</h2>
          <p className="text-sm text-gray-500">
            Start your mindful mornings today
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 text-sm focus:outline-none disabled:opacity-50"
            required
            disabled={loading}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 text-sm focus:outline-none disabled:opacity-50"
            required
            disabled={loading}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 text-sm focus:outline-none disabled:opacity-50"
            disabled={loading}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 text-sm focus:outline-none disabled:opacity-50"
            required
            minLength={6}
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded bg-orange-500 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <button
            onClick={onSwitch}
            className="font-semibold text-orange-500 hover:underline disabled:opacity-50"
            disabled={loading}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}