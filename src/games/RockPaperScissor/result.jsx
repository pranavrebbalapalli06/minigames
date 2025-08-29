import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RequireAuth from "../../components/RequireAuth.jsx";
import { storage, users, scores } from "../../lib/api.js";

export default function RockPaperScissors() {
  const [showRules, setShowRules] = useState(false);
  const [bestScore, setBestScore] = useState(null);
  const navigate = useNavigate();

  // Always start fresh when this screen is opened
  useEffect(() => {
    sessionStorage.setItem("rpsScore", "0");
    return () => {
      sessionStorage.removeItem("rpsScore");
    };
  }, []);

  const choices = [
    { name: "rock", image: "https://res.cloudinary.com/dje6kfwo1/image/upload/v1754199948/Group_6941_rih46j.png" },
    { name: "paper", image: "https://res.cloudinary.com/dje6kfwo1/image/upload/v1754199941/Paper_bkjuyb.png" },
    { name: "scissor", image: "https://res.cloudinary.com/dje6kfwo1/image/upload/v1754199918/Group_6940_fia58w.png" },
  ];

  useEffect(() => {
    const u = storage.getUsername();
    if (!u) return;
    users.get(u).then((d) => setBestScore(d.data?.rockPaperScissorHighScore || null)).catch(() => {});
  }, []);

  // Handle back button navigation
  useEffect(() => {
    const handlePopState = () => {
      navigate("/", { replace: true });
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);

  const playGame = (choice) => {
    const compChoice = choices[Math.floor(Math.random() * choices.length)];

    let result = "";
    let scoreChange = 0;

    if (choice.name === compChoice.name) {
      // Draw → no score change
      result = "draw";
      scoreChange = 0;
    } else if (
      (choice.name === "rock" && compChoice.name === "scissor") ||
      (choice.name === "paper" && compChoice.name === "rock") ||
      (choice.name === "scissor" && compChoice.name === "paper")
    ) {
      // Win → +1
      result = "win";
      scoreChange = 1;
    } else {
      // Lose → -1
      result = "lose";
      scoreChange = -1;
    }

    // Update score in session storage
    const currentScore = parseInt(sessionStorage.getItem("rpsScore") || "0", 10);
    const updatedScore = currentScore + scoreChange;
    sessionStorage.setItem("rpsScore", String(updatedScore));

    // Update best score only if greater than current best
    const u = storage.getUsername();
    if (u && (bestScore === null || updatedScore > bestScore)) {
      setBestScore(updatedScore);
      scores
        .update(u, "rockpaperscissor", updatedScore)
        .then(() => {
          window.dispatchEvent(new CustomEvent("mg-leaderboard-updated"));
        })
        .catch(() => {});
    }

    // Navigate to result page with details
    navigate("/rock-paper-scissor/result", {
      state: {
        result,
        user: choice.name,
        opponent: compChoice.name,
        score: updatedScore,
      },
    });
  };

  return (
    <div className="bg-[#1e3555] min-h-screen flex flex-col items-center py-10 text-white relative">
      <RequireAuth />
      {/* Header */}
      <header className="absolute top-4 left-0 right-0 flex justify-between items-center px-6">
        <button
          onClick={() => navigate("/")}
          className="text-xs sm:text-sm md:text-base flex items-center gap-1 hover:text-blue-400"
        >
          ← Back
        </button>
        <div className="flex items-center gap-4">
          <span className="text-sm">Best: {bestScore ?? '-'} pts</span>
          <button
            onClick={() => setShowRules(true)}
            className="border border-gray-400 px-2 sm:px-3 py-1 text-xs sm:text-sm md:text-base rounded-lg hover:bg-gray-700 transition"
          >
            Rules
          </button>
        </div>
      </header>

      {/* Title */}
      <h1 className="text-3xl font-bold tracking-wide mt-16 mb-6">ROCK PAPER SCISSOR</h1>
      <p className="text-xl mb-10">Let's pick</p>

      {/* Choices */}
      <div className="flex flex-wrap justify-center gap-10">
        {choices.map((choice) => (
          <div
            key={choice.name}
            className="rounded-full bg-white p-4 cursor-pointer hover:scale-110 transition-transform"
            onClick={() => playGame(choice)}
          >
            <img src={choice.image} alt={choice.name} className="w-24 h-24 object-contain" />
          </div>
        ))}
      </div>

      {/* Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white text-[#1e3555] rounded-2xl shadow-xl p-6 w-96 relative">
            <h2 className="text-2xl font-bold mb-4 text-center">How to Play</h2>
            <ol className="list-decimal list-inside space-y-2 text-left">
              <li><strong>Choose one</strong>: Rock 🪨, Paper 📄, or Scissors ✂️.</li>
              <li>The <strong>computer chooses</strong> one at random.</li>
              <li><strong>Compare choices</strong>:
                <ul className="list-disc list-inside ml-5 mt-1 space-y-1">
                  <li>Rock beats Scissor 🪨 x ✂️</li>
                  <li>Scissor beats Paper ✂️ x 📄</li>
                  <li>Paper beats Rock 📄 x 🪨</li>
                </ul>
              </li>
              <li>If both choose the same → <strong>Draw</strong> 🔄.</li>
              <li><strong>Winner gets 1 point</strong>, loser loses 1 point.</li>
            </ol>
            <button
              onClick={() => setShowRules(false)}
              className="mt-6 w-full bg-[#1e3555] text-white py-2 rounded-lg hover:bg-[#2a4a73]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
