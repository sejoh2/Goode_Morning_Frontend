import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const WeeklyReview = () => {
  const [weeklyData, setWeeklyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingReport, setGeneratingReport] = useState(false);
  const navigate = useNavigate();

  // Fetch weekly data on component mount
  useEffect(() => {
    fetchWeeklyData();
  }, []);

  const fetchWeeklyData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.error("No token found");
        navigate("/");
        return;
      }

      const response = await fetch("http://localhost:5000/api/weekly", {
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
      setWeeklyData(data);
      console.log("Weekly data fetched:", data);
    } catch (error) {
      console.error("Failed to fetch weekly data:", error);
      if (error.message.includes("401")) {
        localStorage.clear();
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please sign in again");
        navigate("/");
        return;
      }

      const response = await fetch("http://localhost:5000/api/weekly/generate-report", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
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
      alert(result.message || "Weekly report generated successfully!");
      
      // Refresh the weekly data
      await fetchWeeklyData();
    } catch (error) {
      console.error("Failed to generate report:", error);
      alert("Failed to generate report. Please try again.");
    } finally {
      setGeneratingReport(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get current week range for fallback
  const getCurrentWeekRange = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    return {
      start: monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      end: sunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
  };

  // Calculate consistency chart points based on checklist data
  const getConsistencyChartPoints = () => {
    if (!weeklyData?.checklistData || weeklyData.checklistData.length === 0) {
      return "0,80 50,55 100,65 150,30 200,50 250,75 300,90";
    }

    const points = [];
    const days = weeklyData.checklistData;
    
    days.forEach((day, index) => {
      const x = (300 / 7) * index;
      const completedTasks = [day.hydrate, day.meditate, day.stretch_move].filter(Boolean).length;
      const percentage = (completedTasks / 3) * 100;
      const y = 100 - percentage; // Invert for SVG (0 at top)
      points.push([x, y]);
    });

    // If we have less than 7 days, fill the rest with the last value
    while (points.length < 7) {
      const lastPoint = points[points.length - 1] || [points.length * 50, 50];
      points.push([lastPoint[0] + 50, lastPoint[1]]);
    }

    return points.map(p => `${p[0]},${p[1]}`).join(" ");
  };

  // Calculate sleep chart points
  const getSleepChartPoints = () => {
    if (!weeklyData?.sleepData || weeklyData.sleepData.length === 0) {
      return "0,60 50,50 100,55 150,40 200,45 250,50 300,52";
    }

    const points = [];
    const sleepData = weeklyData.sleepData;
    
    sleepData.forEach((day, index) => {
      const x = (300 / 7) * index;
      const hours = day.total_hours || 0;
      // Normalize: 4h = 80, 10h = 20 (inverted for SVG)
      const y = Math.max(20, Math.min(80, 100 - ((hours - 4) * 10)));
      points.push([x, y]);
    });

    while (points.length < 7) {
      const lastPoint = points[points.length - 1] || [points.length * 50, 50];
      points.push([lastPoint[0] + 50, lastPoint[1]]);
    }

    return points.map(p => `${p[0]},${p[1]}`).join(" ");
  };

  // Get mood emojis for calendar
  const getMoodEmojis = () => {
    if (!weeklyData?.moodData || weeklyData.moodData.length === 0) {
      return ["🙂", "😊", "😐", "😊", "😴", "🙂", "😊"];
    }

    const moodEmojis = {
      1: "😀",  // Very happy
      2: "🙂",  // Happy
      3: "😐",  // Neutral
      4: "😔",  // Sad
      5: "😢",  // Very sad
    };

    const moods = weeklyData.moodData.map(day => moodEmojis[day.mood] || "😐");
    
    // Fill remaining days with neutral
    while (moods.length < 7) {
      moods.push("😐");
    }

    return moods.slice(0, 7);
  };

  if (loading) {
    return (
      <main className="flex-1 h-screen p-8 overflow-y-auto bg-[#f5f6fa] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your weekly review...</p>
        </div>
      </main>
    );
  }

  const weekRange = weeklyData?.weekRange || {};
  const currentWeek = getCurrentWeekRange();

  return (
    <main className="flex-1 h-screen p-4 sm:p-6 md:p-8 overflow-y-auto bg-[#f5f6fa] text-gray-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 sm:gap-0">
        <div>
          <h1 className="text-2xl font-semibold">Weekly Review</h1>
          <p className="text-sm text-gray-400">
            {weekRange.start && weekRange.end 
              ? `${formatDate(weekRange.start)} — ${formatDate(weekRange.end)}`
              : `${currentWeek.start} — ${currentWeek.end}`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <button 
            onClick={fetchWeeklyData}
            className="px-4 py-2 border rounded-lg text-sm w-full sm:w-auto hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <button 
            onClick={handleGenerateReport}
            disabled={generatingReport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm w-full sm:w-auto hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {generatingReport ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Generating...
              </>
            ) : (
              <>
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Report
              </>
            )}
          </button>
        </div>
      </div>

      {/* Top Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Routine Consistency */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl border">
          <div className="flex justify-between mb-4">
            <div>
              <h3 className="font-medium">Routine Consistency</h3>
              <p className="text-xs text-gray-400">
                Percentage of morning tasks completed
              </p>
            </div>
            <p className="text-xs text-gray-400">Completion %</p>
          </div>

          {/* Line chart */}
          <div className="h-48 w-full">
            <svg viewBox="0 0 300 100" className="w-full h-full">
              <polyline
                fill="none"
                stroke="#60a5fa"
                strokeWidth="3"
                points={getConsistencyChartPoints()}
              />
              {getConsistencyChartPoints().split(" ").map((point, i) => {
                const [x, y] = point.split(",").map(Number);
                return <circle key={i} cx={x} cy={y} r="4" fill="#3b82f6" />;
              })}
            </svg>
          </div>

          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
          
          {weeklyData?.checklistData && (
            <div className="mt-4 text-xs text-gray-500">
              Based on {weeklyData.checklistData.length} days of data
            </div>
          )}
        </div>

        {/* Milestones */}
        <div className="bg-gradient-to-b from-orange-400 to-yellow-400 p-6 rounded-xl text-white">
          <h3 className="font-semibold mb-4">Milestones Reached</h3>

          <div className="space-y-3">
            {weeklyData?.milestones && weeklyData.milestones.length > 0 ? (
              weeklyData.milestones.map((milestone, index) => {
                let emoji = "🏆";
                if (milestone.includes("Streak")) emoji = "🔥";
                if (milestone.includes("Hydration")) emoji = "💧";
                if (milestone.includes("Zen") || milestone.includes("meditation")) emoji = "🧘";
                
                return (
                  <div key={index} className="bg-white/20 p-3 rounded-lg">
                    {emoji} {milestone}
                    <p className="text-xs opacity-80 mt-1">
                      {milestone.includes("Streak") ? "Keep up the great work!" :
                       milestone.includes("Hydration") ? "Excellent hydration habits!" :
                       "Consistent mindfulness practice!"}
                    </p>
                  </div>
                );
              })
            ) : (
              <>
                <div className="bg-white/20 p-3 rounded-lg">
                  🔥 No milestones yet
                  <p className="text-xs opacity-80">Complete more daily routines to earn milestones</p>
                </div>
                <div className="bg-white/10 p-3 rounded-lg text-white/70">
                  💧 7 Day Streak
                  <p className="text-xs opacity-60">Complete your routine for 7 consecutive days</p>
                </div>
                <div className="bg-white/10 p-3 rounded-lg text-white/70">
                  🧘 Perfect Hydration Week
                  <p className="text-xs opacity-60">Hydrate every day for a week</p>
                </div>
              </>
            )}
          </div>
          
          {weeklyData?.streak && weeklyData.streak.current_streak > 0 && (
            <div className="mt-4 text-xs opacity-80">
              Current streak: {weeklyData.streak.current_streak} days
            </div>
          )}
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Sleep Quality */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl border">
          <h3 className="font-medium mb-1">Sleep Quality Trends</h3>
          <p className="text-xs text-gray-400 mb-4">Duration vs Quality Score</p>

          <div className="h-48 w-full">
            <svg viewBox="0 0 300 100" className="w-full h-full">
              <polyline
                fill="none"
                stroke="#818cf8"
                strokeWidth="3"
                points={getSleepChartPoints()}
              />
              {getSleepChartPoints().split(" ").map((point, i) => {
                const [x, y] = point.split(",").map(Number);
                return <circle key={i} cx={x} cy={y} r="4" fill="#6366f1" />;
              })}
            </svg>
          </div>

          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
          
          {weeklyData?.sleepData && (
            <div className="mt-4 text-xs text-gray-500">
              Average sleep: {weeklyData.avgSleepHours || 0}h
            </div>
          )}
        </div>

        {/* Mood Calendar */}
        <div className="bg-white p-6 rounded-xl border">
          <div className="flex justify-between mb-3">
            <h3 className="font-medium">Mood Calendar</h3>
            <span className="text-xs text-blue-500">
              {weekRange.start ? formatDate(weekRange.start).split(" ")[0] : "This"} Week
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-lg">
            {getMoodEmojis().map((mood, i) => (
              <div 
                key={i} 
                className="bg-gray-100 p-2 rounded hover:bg-gray-200 transition-colors"
                title={`Day ${i + 1}: ${mood}`}
              >
                {mood}
              </div>
            ))}
          </div>

          {weeklyData?.moodData && weeklyData.moodData.length > 0 ? (
            <p className="text-xs text-gray-600 mt-4 bg-gray-50 p-3 rounded">
              {weeklyData.moodData.filter(m => m.mood <= 2).length >= 5 
                ? "You've been feeling great most days this week! Keep up the positive mindset. 🌟"
                : weeklyData.moodData.filter(m => m.mood >= 4).length >= 3
                ? "You've had some tough days. Remember to practice self-care and reach out if you need support. 💝"
                : "Your mood has been relatively stable this week. Consistency is key to wellbeing. 🌈"}
            </p>
          ) : (
            <p className="text-xs text-gray-400 mt-4 bg-gray-50 p-3 rounded">
              "Track your daily mood to see patterns and insights about your wellbeing."
            </p>
          )}
          
          {weeklyData?.moodData && (
            <div className="mt-2 text-xs text-gray-500">
              {weeklyData.moodData.length} mood entries this week
            </div>
          )}
        </div>
      </div>

      {/* Weekly Average */}
      <div className="mt-6 w-full md:w-80 bg-white p-6 rounded-xl border">
        <h4 className="text-xs text-gray-400 mb-2">WEEKLY AVERAGE</h4>
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <p className="text-2xl font-semibold text-blue-600">
              {weeklyData?.consistencyPercentage || 0}%
            </p>
            <p className="text-xs text-gray-400">CONSISTENCY</p>
            {weeklyData?.checklistData && (
              <p className="text-xs text-gray-500 mt-1">
                {weeklyData.checklistData.filter(day => 
                  day.hydrate && day.meditate && day.stretch_move
                ).length}/{weeklyData.checklistData.length} perfect days
              </p>
            )}
          </div>
          <div>
            <p className="text-2xl font-semibold text-indigo-600">
              {weeklyData?.avgSleepHours ? weeklyData.avgSleepHours.toFixed(1) : "0.0"}h
            </p>
            <p className="text-xs text-gray-400">AVG SLEEP</p>
            {weeklyData?.sleepData && (
              <p className="text-xs text-gray-500 mt-1">
                {weeklyData.sleepData.length} days tracked
              </p>
            )}
          </div>
        </div>
        
        {/* Debug info (optional - remove in production) */}
        {process.env.NODE_ENV === 'development' && weeklyData && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <details className="text-xs">
              <summary className="text-gray-500 cursor-pointer">Debug Data</summary>
              <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-auto">
                {JSON.stringify(weeklyData, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border">
        <h4 className="font-medium text-gray-800 mb-3">Weekly Insights & Tips</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Consistency Tip</span>
            </div>
            <p className="text-sm text-gray-600">
              {weeklyData?.consistencyPercentage >= 80 
                ? "Excellent consistency! Try adding one new small habit to your routine."
                : weeklyData?.consistencyPercentage >= 60
                ? "Good progress! Focus on completing all 3 tasks for the next 3 days."
                : "Start by focusing on just one task consistently, then build from there."}
            </p>
          </div>
          
          <div className="bg-white/50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-indigo-600 mb-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Sleep Recommendation</span>
            </div>
            <p className="text-sm text-gray-600">
              {weeklyData?.avgSleepHours >= 8
                ? "Great sleep duration! Maintain this for optimal health and energy."
                : weeklyData?.avgSleepHours >= 7
                ? "Good sleep habits. Aim for 7-9 hours consistently."
                : "Try going to bed 30 minutes earlier to improve your sleep duration."}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default WeeklyReview;