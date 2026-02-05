import React, { useState, useEffect } from "react";
import SleepInputModal from "../../components/SleepInputModal";


export default function Dashboard() {
  const [checklist, setChecklist] = useState({
    hydrate: false,
    meditate: false,
    stretch_move: false,
  });
  const [mood, setMood] = useState(null);
  const [dailyIntention, setDailyIntention] = useState("");
  const [streak, setStreak] = useState({ current_streak: 0, longest_streak: 0 });
  const [sleep, setSleep] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showSleepModal, setShowSleepModal] = useState(false);
  const [sleepHistory, setSleepHistory] = useState([]);

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch("http://localhost:5000/api/dashboard", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Update state with fetched data
      if (data.checklist) {
        setChecklist(data.checklist);
      }
      if (data.mood !== undefined && data.mood !== null) {
        setMood(data.mood - 1); // Convert from 1-5 to 0-4 for UI
      }
      if (data.dailyIntention) {
        setDailyIntention(data.dailyIntention);
      }
      if (data.streak) {
        setStreak(data.streak);
      }
      if (data.sleep) {
        setSleep(data.sleep);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch sleep history
  const fetchSleepHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("http://localhost:5000/api/dashboard/sleep/history?days=7", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSleepHistory(data.sleepHistory || []);
      }
    } catch (error) {
      console.error("Failed to fetch sleep history:", error);
    }
  };

  // Initialize both data fetches
  useEffect(() => {
    fetchDashboardData();
    fetchSleepHistory();
  }, []);

  const handleChecklistChange = async (key) => {
    const updatedChecklist = { ...checklist, [key]: !checklist[key] };
    setChecklist(updatedChecklist);
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch("http://localhost:5000/api/dashboard/checklist", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedChecklist),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh streak data after checklist update
      const updatedStreak = await fetch("http://localhost:5000/api/dashboard", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).then(res => res.json());
      
      if (updatedStreak.streak) {
        setStreak(updatedStreak.streak);
      }
    } catch (error) {
      console.error("Failed to update checklist:", error);
      setChecklist(checklist); // Revert on error
    }
  };

  const handleMoodChange = async (moodIndex) => {
    const moodValue = moodIndex + 1; // Convert from 0-4 to 1-5 for backend
    setMood(moodIndex);
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch("http://localhost:5000/api/dashboard/mood", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mood: moodValue }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to update mood:", error);
    }
  };

  const handleIntentionSave = async () => {
    if (!dailyIntention.trim()) return;
    
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch("http://localhost:5000/api/dashboard/intention", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ intention: dailyIntention }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert("Intention saved successfully!");
    } catch (error) {
      console.error("Failed to save intention:", error);
      alert("Failed to save intention. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Handle sleep data save
  const handleSaveSleepData = async (sleepData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch("http://localhost:5000/api/dashboard/sleep", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sleepData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Sleep data saved:", result);
      
      // Update local sleep state
      setSleep(result.sleep);
      
      // Refresh sleep history
      fetchSleepHistory();
      
      alert("Sleep data saved successfully!");
      return result;
    } catch (error) {
      console.error("Failed to save sleep data:", error);
      throw error;
    }
  };

  // Format sleep hours for display
  const formatSleepHours = (hours) => {
    if (!hours) return "0h";
    return `${hours}h`;
  };

  // Calculate sleep quality
  const getSleepQuality = (hours) => {
    if (!hours) return "No data";
    if (hours >= 7) return "😊 Good";
    if (hours >= 6) return "😐 Fair";
    return "😔 Poor";
  };

  if (loading) {
    return (
      <div className="flex-grow p-10 bg-[#fff8f0] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow p-10 space-y-10 bg-[#fff8f0] text-gray-900">
      <h1 className="text-2xl font-bold text-gray-900">
        Good Morning, <span className="capitalize">{user?.name?.split(" ")[0] || "Alex"}</span>!
      </h1>
      <p className="text-gray-600 mb-6">Ready to start your day with intention?</p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-6">
        {/* ✅ Daily Intention Display Card */}
        <section className="col-span-1 md:col-span-2 bg-gradient-to-b from-yellow-100 to-yellow-50 rounded-lg shadow-md overflow-hidden">
          <div className="flex items-center justify-center h-28 bg-yellow-200">
            <span className="text-4xl">🧘</span>
          </div>
          <div className="p-5">
            <h3 className="font-semibold text-gray-800 mb-2">Daily Intention</h3>
            <p className="text-sm text-gray-600">
              {dailyIntention || "Today, I will focus on being present and mindful in every conversation."}
            </p>
          </div>
        </section>

        {/* Morning Checklist */}
        <section className="col-span-1 md:col-span-2 bg-[#fff8f0] p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-900">Morning Checklist</h2>
            <button
              title="Refresh"
              aria-label="Refresh Checklist"
              className="text-gray-400 hover:text-gray-600"
              onClick={() => fetchDashboardData()}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          <form>
            <label className="flex items-center gap-3 text-gray-700 mb-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={checklist.hydrate}
                onChange={() => handleChecklistChange("hydrate")}
                className="form-checkbox h-5 w-5 text-orange-400"
                disabled={loading}
              />
              Hydrate (500ml)
            </label>
            <label className="flex items-center gap-3 text-gray-700 mb-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={checklist.meditate}
                onChange={() => handleChecklistChange("meditate")}
                className="form-checkbox h-5 w-5 text-orange-400"
                disabled={loading}
              />
              Meditate (10 mins)
            </label>
            <label className="flex items-center gap-3 text-gray-700 mb-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={checklist.stretch_move}
                onChange={() => handleChecklistChange("stretch_move")}
                className="form-checkbox h-5 w-5 text-orange-400"
                disabled={loading}
              />
              <span className={checklist.stretch_move ? "line-through" : ""}>
                Stretch & Move
              </span>
            </label>
          </form>
          <div className="mt-4 text-xs text-gray-500">
            All changes are automatically saved
          </div>
        </section>

        {/* Sleep Summary */}
        <section className="col-span-1 md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Sleep Summary</h2>
            <button
              onClick={() => setShowSleepModal(true)}
              className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1"
              title="Add sleep data"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {sleep ? "Edit" : "Add"}
            </button>
          </div>
          
          {sleep ? (
            <div className="flex items-center justify-center gap-4">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24" viewBox="0 0 36 36">
                  <circle
                    className="text-gray-300"
                    strokeWidth="3"
                    stroke="currentColor"
                    fill="none"
                    cx="18"
                    cy="18"
                    r="15"
                  />
                  <circle
                    className="text-purple-500"
                    strokeWidth="3"
                    stroke="currentColor"
                    strokeDasharray={`${(sleep.total_hours / 10) * 100}, 100`}
                    strokeLinecap="round"
                    fill="none"
                    cx="18"
                    cy="18"
                    r="15"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-2xl font-semibold">{sleep.total_hours}h</p>
                  <p className="text-xs text-gray-500">TOTAL</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {getSleepQuality(sleep.total_hours)}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full" />
                  <span>Total: {sleep.total_hours}h</span>
                </div>
                {sleep.deep_sleep_hours && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-400 rounded-full" />
                    <span>Deep: {sleep.deep_sleep_hours}h</span>
                  </div>
                )}
                {sleep.rem_hours && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full" />
                    <span>REM: {sleep.rem_hours}h</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">😴</div>
              <p className="text-gray-600 mb-3">No sleep data recorded today</p>
              <button
                onClick={() => setShowSleepModal(true)}
                className="text-sm text-purple-600 hover:text-purple-800 font-medium"
              >
                Add your sleep data →
              </button>
            </div>
          )}
          
          {/* Sleep History Preview */}
          {sleepHistory.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Recent Sleep</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {sleepHistory.slice(0, 5).map((day, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded flex flex-col items-center justify-center text-xs"
                      style={{
                        backgroundColor: day.total_hours >= 7 
                          ? '#e0e7ff'  // blue for good sleep
                          : day.total_hours >= 6 
                          ? '#fef3c7'  // yellow for fair sleep
                          : '#fee2e2', // red for poor sleep
                        color: day.total_hours >= 7 
                          ? '#3730a3'
                          : day.total_hours >= 6
                          ? '#92400e'
                          : '#991b1b'
                      }}
                      title={`${day.total_hours}h on ${new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}`}
                    >
                      <span className="font-medium">{day.total_hours}</span>
                      <span className="text-[10px]">h</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => alert("View detailed sleep history")}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  View history →
                </button>
              </div>
            </div>
          )}
          
          <p className="mt-4 text-xs text-gray-500 text-center">
            Last updated: {sleep ? "Today" : "Never"}
          </p>
        </section>

        {/* Daily Streak */}
        <section className="col-span-1 md:col-span-2 bg-gradient-to-tr from-orange-400 to-yellow-300 p-6 rounded-lg shadow-md text-white">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold text-lg">Daily Streak</h2>
            <button 
              className="opacity-50 hover:opacity-100"
              onClick={() => fetchDashboardData()}
              title="Refresh streak"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          <div className="text-5xl font-bold leading-none mb-3">
            {streak.current_streak || 0}
          </div>
          <div>Days Running</div>
          <div className="mt-4 text-xs flex items-center gap-2 opacity-75">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M9 12l2 2l4-4" />
            </svg>
            <span>Next Milestone</span>
            <span className="ml-auto font-semibold">
              {streak.current_streak >= 21 ? "🏆 Achieved!" : 
               streak.current_streak >= 14 ? "7 days to Silver Medal" :
               streak.current_streak >= 7 ? "7 days to next milestone" :
               "7 Day Streak"}
            </span>
          </div>
        </section>

        {/* Morning Mood */}
        <section className="col-span-1 md:col-span-2 bg-[#fff8f0] p-6 rounded-lg shadow-md">
          <h2 className="font-semibold mb-2">Morning Mood</h2>
          <div className="flex gap-4 mb-3">
            {["😀", "🙂", "😐", "😔", "😢"].map((emoji, idx) => (
              <button
                key={idx}
                onClick={() => handleMoodChange(idx)}
                className={`text-3xl rounded-full p-1 hover:scale-110 transition-transform ${
                  mood === idx ? "ring-2 ring-orange-400 scale-110" : ""
                }`}
                aria-label={`Mood ${emoji}`}
                disabled={loading}
              >
                {emoji}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            {mood !== null ? 
              `You're feeling ${["great", "good", "neutral", "down", "sad"][mood]} today!` : 
              "How are you feeling right now?"}
          </p>
        </section>

        {/* Daily Intention Input */}
        <section className="col-span-1 md:col-span-4 bg-white p-6 rounded-lg shadow-md flex flex-col">
          <h2 className="font-semibold mb-2">Daily Intention</h2>
          <textarea
            value={dailyIntention}
            onChange={(e) => setDailyIntention(e.target.value)}
            placeholder="What's your main focus today? (This will be saved when you click Save Note)"
            className="flex-grow resize-none rounded border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            rows={3}
            disabled={saving}
          />
          <button
            onClick={handleIntentionSave}
            disabled={saving || !dailyIntention.trim()}
            className="mt-3 self-end rounded bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Saving...
              </>
            ) : (
              "Save Note"
            )}
          </button>
        </section>

        {/* Guided Meditation */}
        <section className="col-span-1 md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold">Guided Meditation</h2>
            <button 
              title="Recommended: Inner Peace" 
              className="text-gray-400 text-xs hover:text-gray-600"
              onClick={() => alert("Starting meditation...")}
            >
              Recommended: Inner Peace
            </button>
          </div>
          <audio
            controls
            className="w-full rounded"
            src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          />
          <p className="mt-2 text-xs text-gray-500">
            Take 10 minutes to center yourself
          </p>
        </section>
      </div>

      {/* Quote */}
      <blockquote className="mt-12 mx-auto max-w-4xl italic text-center text-gray-600">
        &quot;The way you spend your morning often determines the kind of day you are going to have.&quot;
        <br />
        <span className="font-semibold mt-3 block">— DANIEL HANDLER</span>
      </blockquote>
      <p className="mt-8 text-center text-xs text-gray-400 italic">
        &quot;Every morning is a new opportunity to become who you want to be.&quot;
      </p>

      {/* Sleep Input Modal */}
      <SleepInputModal
        isOpen={showSleepModal}
        onClose={() => setShowSleepModal(false)}
        onSave={handleSaveSleepData}
        currentData={sleep}
      />
    </div>
  );
}