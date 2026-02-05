import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    theme_color: 'orange',
    interface_mode: 'light',
    morning_reminders: true,
    weekly_reports: true,
    sound_alerts: false
  });
  const [profile, setProfile] = useState({
    phone: ''
  });
  const [tempProfile, setTempProfile] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const navigate = useNavigate();

  // Fetch settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        navigate("/");
        return;
      }

      const response = await fetch("https://good-morning-routine.onrender.com/api/settings", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Settings data:", data);
      
      setUser(data.user);
      setSettings(data.settings);
      setProfile(data.profile);
      
      // Set temp profile for editing
      setTempProfile({
        name: data.user?.name || '',
        email: data.user?.email || '',
        phone: data.profile?.phone || ''
      });
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      if (error.message.includes("401")) {
        localStorage.clear();
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (field, value) => {
    setTempProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please sign in again");
        navigate("/");
        return;
      }

      const response = await fetch("https://good-morning-routine.onrender.com/api/settings/profile", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: tempProfile.name,
          phone: tempProfile.phone
        }),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        alert("Session expired. Please sign in again.");
        navigate("/");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Profile update result:", result);
      
      // Update local storage user data
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      storedUser.name = tempProfile.name;
      localStorage.setItem("user", JSON.stringify(storedUser));
      
      // Update user state
      setUser(prev => ({ ...prev, name: tempProfile.name }));
      
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationToggle = async (type, enabled) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      // Optimistic update
      setSettings(prev => ({
        ...prev,
        [type]: enabled
      }));

      const response = await fetch("https://good-morning-routine.onrender.com/api/settings/notifications", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, enabled }),
      });

      if (!response.ok) {
        // Revert on error
        setSettings(prev => ({
          ...prev,
          [type]: !enabled
        }));
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("Notification setting updated:", type, enabled);
    } catch (error) {
      console.error("Failed to update notification:", error);
    }
  };

  const handleThemeChange = async (theme) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      // Optimistic update
      setSettings(prev => ({
        ...prev,
        theme_color: theme
      }));

      const response = await fetch("https://good-morning-routine.onrender.com/api/settings/settings", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...settings,
          theme_color: theme
        }),
      });

      if (!response.ok) {
        // Revert on error
        setSettings(prev => ({
          ...prev,
          theme_color: settings.theme_color
        }));
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("Theme updated to:", theme);
      alert(`Theme changed to ${theme}. Refresh page to see changes.`);
    } catch (error) {
      console.error("Failed to update theme:", error);
    }
  };

  const handleInterfaceModeChange = async (mode) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      // Optimistic update
      setSettings(prev => ({
        ...prev,
        interface_mode: mode
      }));

      const response = await fetch("https://good-morning-routine.onrender.com/api/settings/settings", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...settings,
          interface_mode: mode
        }),
      });

      if (!response.ok) {
        // Revert on error
        setSettings(prev => ({
          ...prev,
          interface_mode: settings.interface_mode
        }));
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("Interface mode updated to:", mode);
      alert(`Interface mode changed to ${mode}. Refresh page to see changes.`);
    } catch (error) {
      console.error("Failed to update interface mode:", error);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please sign in again");
        navigate("/");
        return;
      }

      const response = await fetch("https://good-morning-routine.onrender.com/api/settings/settings", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        alert("Session expired. Please sign in again.");
        navigate("/");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Settings update result:", result);
      
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (loading) {
    return (
      <main className="flex-1 h-screen p-10 overflow-y-auto bg-[#f3efe7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your settings...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 h-screen p-4 sm:p-6 md:p-10 overflow-y-auto bg-[#f3efe7] text-gray-700">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-gray-400">
          Manage your account preferences and app configurations.
        </p>
      </div>

      {/* Profile Settings */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border mb-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-medium">Profile Settings</h3>
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Saving...
              </>
            ) : (
              "Save Profile"
            )}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative mx-auto sm:mx-0">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center text-white text-2xl">
              {user?.name?.charAt(0) || "U"}
            </div>
            <button className="absolute bottom-0 right-0 bg-blue-600 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs hover:bg-blue-700">
              📷
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1 w-full">
            <div>
              <p className="text-xs text-gray-400 mb-1">FULL NAME</p>
              <input
                value={tempProfile.name}
                onChange={(e) => handleProfileChange('name', e.target.value)}
                className="w-full bg-gray-100 p-3 rounded-lg outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-1">EMAIL ADDRESS</p>
              <input
                value={tempProfile.email}
                readOnly
                className="w-full bg-gray-100 p-3 rounded-lg outline-none cursor-not-allowed"
                title="Email cannot be changed"
              />
            </div>

            <div className="sm:col-span-2">
              <p className="text-xs text-gray-400 mb-1">PHONE NUMBER</p>
              <input
                value={tempProfile.phone}
                onChange={(e) => handleProfileChange('phone', e.target.value)}
                className="w-full bg-gray-100 p-3 rounded-lg outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Enter your phone number"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border mb-6">
        <h3 className="font-medium mb-6">Notification Preferences</h3>

        <div className="space-y-4">
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg gap-4">
            <div>
              <p className="font-medium text-sm">Morning Reminders</p>
              <p className="text-xs text-gray-400">
                Get alerted when it's time to start your routine
              </p>
            </div>
            <button
              onClick={() => handleNotificationToggle('morning_reminders', !settings.morning_reminders)}
              className={`w-12 h-6 rounded-full flex items-center px-1 shrink-0 transition-colors ${settings.morning_reminders ? 'bg-blue-500' : 'bg-gray-300'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.morning_reminders ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg gap-4">
            <div>
              <p className="font-medium text-sm">Weekly Reports</p>
              <p className="text-xs text-gray-400">
                A detailed summary of your progress every Sunday
              </p>
            </div>
            <button
              onClick={() => handleNotificationToggle('weekly_reports', !settings.weekly_reports)}
              className={`w-12 h-6 rounded-full flex items-center px-1 shrink-0 transition-colors ${settings.weekly_reports ? 'bg-blue-500' : 'bg-gray-300'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.weekly_reports ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg gap-4">
            <div>
              <p className="font-medium text-sm">Sound Alerts</p>
              <p className="text-xs text-gray-400">
                Play a gentle chime when a task is completed
              </p>
            </div>
            <button
              onClick={() => handleNotificationToggle('sound_alerts', !settings.sound_alerts)}
              className={`w-12 h-6 rounded-full flex items-center px-1 shrink-0 transition-colors ${settings.sound_alerts ? 'bg-blue-500' : 'bg-gray-300'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.sound_alerts ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border mb-6">
        <h3 className="font-medium mb-6">Appearance</h3>

        <div className="flex flex-col md:flex-row md:items-center gap-10">
          {/* Interface Mode */}
          <div>
            <p className="text-xs text-gray-400 mb-3">INTERFACE MODE</p>

            <div className="flex gap-4 flex-wrap">
              <button
                onClick={() => handleInterfaceModeChange('light')}
                className={`w-24 sm:w-28 h-24 rounded-xl flex flex-col items-center justify-center transition-all ${settings.interface_mode === 'light' ? 'border-2 border-blue-500 text-blue-600 bg-blue-50' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
              >
                <span className="text-2xl">☀️</span>
                <p className="text-sm mt-1">Light</p>
                {settings.interface_mode === 'light' && (
                  <div className="mt-2 text-xs text-blue-500">• Active</div>
                )}
              </button>

              <button
                onClick={() => handleInterfaceModeChange('dark')}
                className={`w-24 sm:w-28 h-24 rounded-xl flex flex-col items-center justify-center transition-all ${settings.interface_mode === 'dark' ? 'border-2 border-blue-500 text-blue-600 bg-blue-50' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
              >
                <span className="text-2xl">🌙</span>
                <p className="text-sm mt-1">Dark</p>
                {settings.interface_mode === 'dark' && (
                  <div className="mt-2 text-xs text-blue-500">• Active</div>
                )}
              </button>
            </div>
          </div>

          {/* Theme Colors */}
          <div>
            <p className="text-xs text-gray-400 mb-3">PRIMARY THEME</p>

            <div className="flex gap-4 flex-wrap">
              {['blue', 'orange', 'purple', 'green', 'gradient'].map((color) => (
                <button
                  key={color}
                  onClick={() => handleThemeChange(color)}
                  className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${settings.theme_color === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                  style={{
                    background: color === 'gradient' 
                      ? 'linear-gradient(to right, #ec4899, #3b82f6)'
                      : color === 'blue' ? '#3b82f6'
                      : color === 'orange' ? '#f97316'
                      : color === 'purple' ? '#8b5cf6'
                      : '#10b981'
                  }}
                  title={color.charAt(0).toUpperCase() + color.slice(1)}
                />
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Current: <span className="font-medium">{settings.theme_color}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border">
        <h3 className="font-medium mb-6">Account Actions</h3>
        
        <div className="space-y-4">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
          
          <button
            onClick={() => alert("This feature is coming soon!")}
            className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Debug Info (Development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6 bg-gray-100 p-4 rounded-xl">
          <h4 className="font-medium text-gray-700 mb-2">Debug Info</h4>
          <details>
            <summary className="text-sm text-gray-500 cursor-pointer">Show settings data</summary>
            <pre className="mt-2 p-2 bg-gray-800 text-gray-100 rounded text-xs overflow-auto">
              {JSON.stringify({ user, settings, profile }, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </main>
  );
};

export default Settings;