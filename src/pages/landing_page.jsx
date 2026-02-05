import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SignInModal from "../modals/SignInModal";
import SignUpModal from "../modals/signUpModal";
import MainLayout from "./Operations/main_layout";


export default function MorningRise() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (user && token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleSignInSuccess = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    setShowSignIn(false);
    navigate("/dashboard"); 
  };

  const handleSignUpSuccess = (userData, token) => {
    // For now, we'll show a message to sign in
    // You could auto-login if you want
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    setShowSignUp(false);
     navigate("/dashboard"); 
    // Or show a success message and ask to sign in
    // alert("Account created successfully! Please sign in.");
    // setShowSignUp(false);
    // setShowSignIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // If authenticated, show the MainLayout
  // if (isAuthenticated) {
  //   return <MainLayout onLogout={handleLogout} />;
  // }

  // If not authenticated, show the landing page
  return (
    <div className="font-sans text-gray-800">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-2 bg-white text-gray-800 shadow-md">
        <div className="flex items-center gap-2 font-semibold">
          <span className="inline-block h-3 w-3 rounded-full bg-orange-500" />
          MorningRise
        </div>
        <nav className="flex items-center gap-8 text-sm">
          <button
            onClick={() => setShowSignIn(true)}
            className="rounded bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
          >
            Sign In
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section
        className="flex h-[800px] flex-col items-center justify-center text-center text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuA0CJlHbalk0aNr7gtMItYAu6Hi_uBpuh10CDH6pLA9q57mATAbmM8_Qxp8nEnKNNL8GaFz1EX6l5LHYMHuK0mVMmqS-wn9LxCizAWMfILicn_uIvTmGN53D7SZ3DKWQctXvCUhgYFRsL5LzNaxg0iHPYIpSByZ-ce4lRmg0mYG2NULVK3EKNrzxMiVfzimUMWonsTuIMDJRExZZIOaZ7K5a3VbTTXapdONzfv7j4R2MDl-3Q-a3Qp8fJYZtNSF4cfL8LlkrPlSqGu0')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="mb-4 text-5xl font-bold leading-tight">
          Start Your Day with
          <br />
          Intention
        </h1>
        <p className="mb-8 max-w-xl text-sm text-gray-200">
          Join thousands of early risers who have transformed
          <br />
          their lives through a mindful morning routine.
        </p>
        <button
          onClick={() => setShowSignUp(true)}
          className="rounded bg-orange-500 px-6 py-3 text-sm font-semibold hover:bg-orange-600"
        >
          Start Your Day
        </button>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16">
        <p className="mb-10 text-center text-xs font-semibold uppercase tracking-widest text-gray-400">
          Join the movement
        </p>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-6 md:grid-cols-3">
          {/* Feature 1 */}
          <div className="rounded-lg bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 flex items-center justify-center rounded-full bg-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3" />
              </svg>
            </div>
            <h3 className="mb-2 font-semibold">Mindful Meditation</h3>
            <p className="text-sm text-gray-500">
              Guided sessions to center
              <br />
              your mind every morning.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-lg bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 flex items-center justify-center rounded-full bg-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10  text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2l4-4" />
              </svg>
            </div>
            <h3 className="mb-2 font-semibold">Habit Tracking</h3>
            <p className="text-sm text-gray-500">
              Build consistency with
              <br />
              simple daily progress tools.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-lg bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 flex items-center justify-center rounded-full bg-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8h18M3 16h18" />
              </svg>
            </div>
            <h3 className="mb-2 font-semibold">Global Community</h3>
            <p className="text-sm text-gray-500">
              Connect with others rising
              <br />
              early to reach their goals.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-white py-20">
        <h2 className="mb-14 text-center text-2xl font-semibold text-gray-800">
          How it Works
        </h2>

        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-12 px-6 md:flex-row">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="mb-2 font-semibold">Set Your Goals</h3>
            <p className="max-w-xs text-sm text-gray-500">
              Define your morning intentions and choose the habits that matter most
              to you.
            </p>
          </div>

          {/* Divider */}
          <div className="hidden h-px w-24 bg-gray-200 md:block" />

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3" />
              </svg>
            </div>
            <h3 className="mb-2 font-semibold">Follow Your Routine</h3>
            <p className="max-w-xs text-sm text-gray-500">
              Experience guided flows designed to keep you focused and energized
              from sunrise.
            </p>
          </div>

          {/* Divider */}
          <div className="hidden h-px w-24 bg-gray-200 md:block" />

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3v18h18" />
              </svg>
            </div>
            <h3 className="mb-2 font-semibold">Track Progress</h3>
            <p className="max-w-xs text-sm text-gray-500">
              Monitor your daily streaks and visualize your long-term personal
              growth.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2 font-semibold">
              <span className="inline-block h-3 w-3 rounded-full bg-orange-400" />
              MorningRise
            </div>
            <p className="text-sm text-gray-500">
              Our mission is to empower individuals to reclaim their mornings and
              transform their lives through mindfulness and intentional daily habits.
            </p>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Newsletter
            </h4>
            <p className="mb-4 text-sm text-gray-500">
              Get morning tips and inspiration delivered to your inbox.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="w-full rounded-l border border-gray-300 px-3 py-2 text-sm focus:outline-none"
              />
              <button className="rounded-r bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">
                Subscribe
              </button>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Follow Us
            </h4>
            <div className="flex gap-4 text-gray-400">
              <span>Instagram</span>
              <span>Twitter</span>
              <span>Facebook</span>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t px-6 pt-6 text-xs text-gray-400 md:flex-row md:gap-0">
          <span>© 2024 MorningRise. All rights reserved.</span>
          <div className="flex gap-4">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showSignIn && (
        <SignInModal
          onClose={() => setShowSignIn(false)}
          onSwitch={() => {
            setShowSignIn(false);
            setShowSignUp(true);
          }}
          onSuccess={handleSignInSuccess}
        />
      )}

      {showSignUp && (
        <SignUpModal
          onClose={() => setShowSignUp(false)}
          onSwitch={() => {
            setShowSignUp(false);
            setShowSignIn(true);
          }}
          onSuccess={handleSignUpSuccess}
        />
      )}
    </div>
  );
}