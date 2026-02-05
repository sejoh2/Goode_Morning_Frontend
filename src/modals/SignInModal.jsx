import React, { useState } from "react";

export default function SignInModal({ onClose, onSwitch, onSuccess }) {
  const [formData, setFormData] = useState({
    email: "",
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
      const response = await fetch("https://good-morning-routine.onrender.com/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Sign in failed");
      }

      // Show loading spinner for a moment before navigation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call success callback with user data and token
      onSuccess(data.user, data.token);
      
      // Close modal
      onClose();

    } catch (err) {
      setError(err.message || "An error occurred during sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[1px]">
      <div className="relative w-full max-w-sm rounded-lg bg-white/60 p-6 shadow-xl backdrop-blur">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-600 hover:text-black"
          disabled={loading}
        >
          ✕
        </button>

        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
            🔒
          </div>
          <h2 className="text-lg font-semibold">Welcome Back</h2>
          <p className="text-sm text-gray-500">
            Please enter your details to sign in
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 text-sm focus:outline-none disabled:opacity-50"
            required
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
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <button
            onClick={onSwitch}
            className="font-semibold text-orange-500 hover:underline"
            disabled={loading}
          >
            Sign up for free
          </button>
        </p>
      </div>
    </div>
  );
}