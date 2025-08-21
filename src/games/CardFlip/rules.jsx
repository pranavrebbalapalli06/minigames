// RulesPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";


export default function CRules() {
  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate("/cards-game"); // redirect to /game route
  };

  return (
    <div className="min-h-screen bg-[#0F2E2E] text-white flex flex-col items-center px-6 py-10">
      {/* Back Button */}
      <div className="w-full max-w-6xl mb-6">
        <button
          onClick={() => navigate(-1)} // go back to previous page
          className="flex items-center gap-2 text-white hover:text-gray-300"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </div>

      {/* Header with Image */}
      <div className="w-full max-w-4xl flex justify-center mb-12">
        <div className="relative">
          <img
            src="https://res.cloudinary.com/dje6kfwo1/image/upload/v1755666433/animals_2_lgcayf.png"
            alt="Forest Header"
            className="w-full max-h-72 object-contain"
          />
        </div>
      </div>

      {/* Rules Section */}
      <div className="w-full max-w-6xl">
        <h2 className="text-2xl font-semibold mb-6">Rules</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-200 text-base leading-relaxed">
          <ul className="space-y-3 list-disc pl-6">
            <li>When the game is started, the users should be able to see the list of Cards that are shuffled and turned face down.</li>
            <li>When a user starts the game, the user should be able to see the Timer running.</li>
            <li>The Timer starts from 2 Minutes.</li>
            <li>If the two cards have the same image, they remain face up. If not, they should be flipped face down again after 2 seconds.</li>
          </ul>

          <ul className="space-y-3 list-disc pl-6">
            <li>Users should be able to compare only two cards at a time.</li>
            <li>When the user is not able to find all the cards before the timer ends then the game should end and redirect to the Time Up Page.</li>
            <li>If the user finds all the matching cards before the timer ends, then the user should be redirected to the results page.</li>
          </ul>
        </div>

        {/* CTA Button */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={handleStartGame}
            className="px-6 py-3 bg-white text-black font-medium rounded-xl shadow-lg hover:bg-gray-200 transition"
          >
            Start playing
          </button>
        </div>
      </div>
    </div>
  );
}
