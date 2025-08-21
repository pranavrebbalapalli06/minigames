// rules.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const RPSRules = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1B2B48] text-white flex flex-col items-center p-6">
      {/* Back Button */}
      <div className="w-full max-w-4xl mb-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-white hover:text-gray-300 transition"
        >
          <ArrowLeft /> Back
        </button>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold mb-4 text-center">ROCK PAPER SCISSOR</h1>

      {/* Main Logo */}
      <img
        src="https://res.cloudinary.com/dje6kfwo1/image/upload/v1755750957/Group_7469_1_pasmpl.png"
        alt="RPS Logo"
        className="w-36 h-36 mb-6"
      />

      {/* Rules Section */}
      <div className="bg-[#1B2B48] text-white p-6 rounded-2xl shadow-lg max-w-4xl w-full">
        <h2 className="text-xl font-semibold mb-4">Rules</h2>
        <div className="grid md:grid-cols-2 gap-6 text-sm leading-relaxed">
          <ul className="list-disc pl-5 space-y-2">
            <li>The game result should be based on user and user opponent choices</li>
            <li>When the user choice is rock and his opponent choice is rock then the result will be <span className="text-yellow-400">IT IS DRAW</span></li>
            <li>When the user choice is paper and his opponent choice is rock then the result will be <span className="text-green-400">YOU WON</span></li>
            <li>When the user choice is a scissor and his opponent choice is rock then the result will be <span className="text-red-400">YOU LOSE</span></li>
            <li>When the user choice is paper and his opponent choice is paper then the result will be <span className="text-yellow-400">IT IS DRAW</span></li>
            <li>When the user choice is scissors and his opponent choice is paper then the result will be <span className="text-green-400">YOU WON</span></li>
          </ul>

          <ul className="list-disc pl-5 space-y-2">
            <li>When the user choice is rock and his opponent choice is scissors then the result will be <span className="text-green-400">YOU WON</span></li>
            <li>When the user choice is paper and his opponent choice is scissors then the result will be <span className="text-red-400">YOU LOSE</span></li>
            <li>When the user choice is scissors and his opponent choice is scissors then the result will be <span className="text-yellow-400">IT IS DRAW</span></li>
            <li>When the result is <span className="text-green-400">YOU WON</span>, then the count of the score should be incremented by 1</li>
            <li>When the result is <span className="text-yellow-400">IT IS DRAW</span>, then the count of the score should be the same</li>
            <li>When the result is <span className="text-red-400">YOU LOSE</span>, then the count of the score should be decremented by 1.</li>
          </ul>
        </div>
      </div>

      {/* Start Playing Button */}
      <button
        onClick={() => navigate("/rock-paper-scissor")}
        className="mt-6 bg-white text-[#1B2B48] font-semibold px-6 py-2 rounded-lg hover:bg-gray-200 transition"
      >
        Start playing
      </button>
    </div>
  );
};

export default RPSRules;
