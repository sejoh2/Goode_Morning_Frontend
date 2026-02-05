import React, { useState, useEffect } from "react";
import Dashboard from "./dashboard";
import WeeklyReview from "./weekly_review";
import Settings from "./settings";

export default function MainLayout() {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data on component mount
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
    setLoading(false);
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "weeklyReview":
        return <WeeklyReview />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  const handleNavClick = (page) => {
    setActivePage(page);
    setSidebarOpen(false); // Close sidebar on navigation click for mobile
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  // Function to get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Function to get user's first name
  const getUserFirstName = () => {
    if (!user?.name) return "User";
    return user.name.split(" ")[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff8f0] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#fff8f0] text-gray-900">
      {/* Hamburger Icon for Mobile */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-md bg-white shadow-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-40 flex flex-col bg-white border-r border-gray-200 w-60 h-full transition-transform transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:flex`}
      >
        <div className="p-6 flex-grow">
          <div className="flex items-center gap-2 font-semibold text-xl mb-12 text-[#1d365f]">
            <svg
              className="w-6 h-6 text-orange-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <path
                d="M12 6v6l4 2"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            MorningRise
          </div>

          <nav className="flex flex-col space-y-4 text-sm font-semibold text-gray-600">
            <button
              className={`flex items-center gap-3 px-3 py-2 rounded ${
                activePage === "dashboard"
                  ? "bg-[#e6f0ff] text-[#0f3baf]"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleNavClick("dashboard")}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Dashboard
            </button>
            <button
              className={`flex items-center gap-3 px-3 py-2 rounded ${
                activePage === "weeklyReview"
                  ? "bg-[#e6f0ff] text-[#0f3baf]"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleNavClick("weeklyReview")}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Weekly Review
            </button>
            <button
              className={`flex items-center gap-3 px-3 py-2 rounded ${
                activePage === "settings"
                  ? "bg-[#e6f0ff] text-[#0f3baf]"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleNavClick("settings")}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Settings
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 rounded text-red-600 hover:bg-red-50 hover:text-red-700 mt-4"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </nav>
        </div>

        {/* Profile Section - Always at bottom */}
        <div className="p-6 mt-auto">
          <div 
            className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-tr from-orange-300 to-orange-400 text-white cursor-pointer select-none hover:from-orange-400 hover:to-orange-500 transition-all"
            onClick={() => handleNavClick("settings")}
          >
            {/* User Avatar with Initials */}
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
              {getUserInitials()}
            </div>
            <div>
              <p className="text-sm font-semibold">
                {user?.name || "Welcome"}
              </p>
              <p className="text-xs opacity-80">
                {user?.email ? user.email.split('@')[0] + "@..." : "Sign in to continue"}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  PREMIUM MEMBER
                </span>
                <span className="text-xs opacity-70">
                  • Since {new Date().getFullYear()}
                </span>
              </div>
            </div>
          </div>
          
          {/* Quick Stats (Optional) */}
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-gray-50 p-2 rounded">
              <div className="font-semibold text-gray-800">Today</div>
              <div className="text-gray-500">Tasks</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="font-semibold text-gray-800">Week</div>
              <div className="text-gray-500">Review</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="font-semibold text-gray-800">⚙️</div>
              <div className="text-gray-500">Settings</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-grow p-10">
        {renderPage()}
      </main>
    </div>
  );
}