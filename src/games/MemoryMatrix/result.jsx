import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function MMResult() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { flips } = state || { flips: 1 };

  // Emojis for milestones
  const milestones = [
    { level: 1, emoji: "😐" },
    { level: 5, emoji: "😬" },
    { level: 7, emoji: "😊" },
    { level: 10, emoji: "😁" },
    { level: 12, emoji: "😃" },
    { level: 14, emoji: "🙂" },
    { level: 15, emoji: "😎" },
  ];

  const maxLevel = 15;
  const progress = Math.min((flips / maxLevel) * 100, 100);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-[#0d1117] text-center text-white">
      {/* Progress Section */}
      <div className="w-full max-w-3xl mb-8">
        <div className="flex justify-between mb-2">
          {milestones.map((m, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-xs sm:text-sm"
              style={{ width: `${100 / milestones.length}%` }}
            >
              <span className="text-xl sm:text-2xl">{m.emoji}</span>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Level Labels */}
        <div className="flex justify-between mt-2 text-xs sm:text-sm text-gray-300">
          {milestones.map((m, i) => (
            <span key={i}>Level {m.level}</span>
          ))}
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-blue-500">
        Congratulations!
      </h1>

      {/* Message */}
      <p className="text-lg md:text-xl mb-6">
        You have reached level {flips}
      </p>

      {/* Button */}
      <button
        onClick={() => navigate("/memory-matrix")}
        className="px-6 py-3 rounded-xl shadow-md text-lg font-semibold transition-all duration-300 bg-blue-500 hover:bg-blue-600"
      >
        Play Again 
      </button>
    </div>
  );
}
