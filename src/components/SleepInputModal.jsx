import React, { useState } from "react";

export default function SleepInputModal({ isOpen, onClose, onSave, currentData }) {
  const [sleepData, setSleepData] = useState({
    total_hours: currentData?.total_hours || "",
    deep_sleep_hours: currentData?.deep_sleep_hours || "",
    rem_hours: currentData?.rem_hours || ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Allow empty or numeric values
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setSleepData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validate input
    if (!sleepData.total_hours || parseFloat(sleepData.total_hours) < 0) {
      setError("Please enter valid total sleep hours");
      return;
    }
    
    if (sleepData.deep_sleep_hours && parseFloat(sleepData.deep_sleep_hours) > parseFloat(sleepData.total_hours)) {
      setError("Deep sleep hours cannot exceed total sleep hours");
      return;
    }
    
    if (sleepData.rem_hours && parseFloat(sleepData.rem_hours) > parseFloat(sleepData.total_hours)) {
      setError("REM sleep hours cannot exceed total sleep hours");
      return;
    }

    setLoading(true);
    try {
      await onSave({
        total_hours: parseFloat(sleepData.total_hours),
        deep_sleep_hours: sleepData.deep_sleep_hours ? parseFloat(sleepData.deep_sleep_hours) : null,
        rem_hours: sleepData.rem_hours ? parseFloat(sleepData.rem_hours) : null
      });
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save sleep data");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          disabled={loading}
        >
          ✕
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Track Your Sleep</h2>
          <p className="text-sm text-gray-500">Enter your sleep data from last night</p>
        </div>

        {error && (
          <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Total Sleep Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Sleep Hours *
            </label>
            <div className="relative">
              <input
                type="text"
                name="total_hours"
                value={sleepData.total_hours}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 focus:border-orange-400 focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50 outline-none"
                placeholder="e.g., 7.5"
                required
                disabled={loading}
              />
              <div className="absolute left-3 top-3 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                </svg>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Recommended: 7-9 hours for adults
            </p>
          </div>

          {/* Deep Sleep Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deep Sleep Hours (Optional)
            </label>
            <div className="relative">
              <input
                type="text"
                name="deep_sleep_hours"
                value={sleepData.deep_sleep_hours}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 focus:border-purple-400 focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 outline-none"
                placeholder="e.g., 2.0"
                disabled={loading}
              />
              <div className="absolute left-3 top-3 text-purple-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Typically 1-2 hours per night
            </p>
          </div>

          {/* REM Sleep Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              REM Sleep Hours (Optional)
            </label>
            <div className="relative">
              <input
                type="text"
                name="rem_hours"
                value={sleepData.rem_hours}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 outline-none"
                placeholder="e.g., 1.5"
                disabled={loading}
              />
              <div className="absolute left-3 top-3 text-blue-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Typically 1.5-2 hours per night
            </p>
          </div>

          {/* Sleep Quality Quick Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Sleep Quality
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { hours: 4, label: "Poor", color: "bg-red-100 text-red-700" },
                { hours: 6, label: "Fair", color: "bg-yellow-100 text-yellow-700" },
                { hours: 7.5, label: "Good", color: "bg-green-100 text-green-700" },
                { hours: 9, label: "Great", color: "bg-blue-100 text-blue-700" }
              ].map((option) => (
                <button
                  key={option.hours}
                  type="button"
                  onClick={() => setSleepData(prev => ({ ...prev, total_hours: option.hours.toString() }))}
                  className={`rounded-lg p-3 text-center text-sm font-medium ${option.color} hover:opacity-90 transition-opacity`}
                  disabled={loading}
                >
                  {option.label}
                  <div className="text-xs mt-1">{option.hours}h</div>
                </button>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="rounded-lg bg-blue-50 p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Sleep Tips</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Aim for 7-9 hours of sleep per night</li>
              <li>• Deep sleep helps with physical restoration</li>
              <li>• REM sleep is important for memory and learning</li>
              <li>• Consistency is key for quality sleep</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-3 text-sm font-medium text-white hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Sleep Data
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}