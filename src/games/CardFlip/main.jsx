import React, { useState, useEffect } from "react";
import cardsData from "../../components/CardsGameList";
import { useNavigate } from "react-router-dom";
import RequireAuth from "../../components/RequireAuth.jsx";
import { storage, users, scores } from "../../lib/api.js";

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

function Cards() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [timer, setTimer] = useState(120);
  const [flipCount, setFlipCount] = useState(0);
  const [showRules, setShowRules] = useState(false);
  const [bestTime, setBestTime] = useState(null);

  useEffect(() => {
    const duplicated = [...cardsData, ...cardsData].map((card, index) => ({
      ...card,
      id: index + 1,
    }));
    setCards(shuffleArray(duplicated));
  }, []);

  useEffect(() => {
    const u = storage.getUsername();
    if (!u) return;
    users.get(u).then((d) => setBestTime(d.data?.cardFlipGameHighScore || null)).catch(() => {});
  }, []);

  useEffect(() => {
    if (timer > 0 && matched.length < cardsData.length) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }

    if (timer === 0) {
      // navigate to Result.jsx with lose state
      navigate("/cards-game/result", { state: { flips: flipCount, isWin: false } });
    }
  }, [timer, matched, navigate, flipCount]);

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (cards[first].name === cards[second].name) {
        setMatched((prev) => [...prev, cards[first].name]);
      }
      setTimeout(() => setFlipped([]), 1000);
    }
  }, [flipped, cards]);

  const handleFlip = (index) => {
    if (
      flipped.length < 2 &&
      !flipped.includes(index) &&
      !matched.includes(cards[index].name)
    ) {
      setFlipped((prev) => [...prev, index]);
      setFlipCount((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (matched.length === cardsData.length) {
      const u = storage.getUsername();
      if (u) {
        // Use time taken (120 - timer) as best time, lower is better
        const timeTaken = 120 - timer;
        const prev = bestTime ?? Infinity;
        if (timeTaken < prev) {
          setBestTime(timeTaken);
          scores.update(u, 'cardflipgame', timeTaken).then(()=>{
            window.dispatchEvent(new CustomEvent('mg-leaderboard-updated'));
          }).catch(() => {});
        }
      }
      navigate("/cards-game/result", { state: { flips: flipCount, isWin: true } });
    }
  }, [matched, navigate, flipCount, timer, bestTime]);

  const formatTime = (time) => {
    const minutes = String(Math.floor(time / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start p-4 sm:p-6 text-white relative"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dje6kfwo1/image/upload/v1755751915/beach_o83dqg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <RequireAuth />
      {/* Top Buttons */}
      <div className="absolute top-4 left-4">
        <button
          onClick={() => navigate("/")}
          className="text-xs sm:text-sm md:text-base flex items-center gap-1 hover:text-blue-400"
        >
          ← Back
        </button>
      </div>

      <div className="absolute top-4 right-4">
        <button
          onClick={() => setShowRules(true)}
          className="border border-gray-400 px-2 sm:px-3 py-1 text-xs sm:text-sm md:text-base rounded-lg hover:bg-gray-700 transition"
        >
          Rules
        </button>
      </div>

      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-center">
        Card-Flip Memory Game
      </h1>

      <div className="flex justify-center gap-4 sm:gap-8 text-sm sm:text-lg font-semibold mb-4">
        <span>⏱ {formatTime(timer)}</span>
        <span>Flips: {flipCount}</span>
        <span>Best: {bestTime ?? '-'}s</span>
        <span>Score: {matched.length}</span>
      </div>

      {/* Responsive grid */}
      <div className="grid grid-cols-4 md:grid-cols-5 gap-2 sm:gap-4 bg-green-900/80 p-3 sm:p-4 rounded-lg shadow-lg w-full max-w-3xl">
        {cards.map((card, index) => {
          const isFlipped =
            flipped.includes(index) || matched.includes(card.name);

          return (
            <div
              key={card.id}
              className={`aspect-square flex items-center justify-center rounded-lg cursor-pointer border-2 sm:border-4 transition-all duration-300
            ${
              isFlipped
                ? "bg-white border-green-500"
                : "bg-green-600 border-green-800 hover:scale-105"
            }`}
              onClick={() => handleFlip(index)}
            >
              {isFlipped ? (
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-2/3 h-2/3 object-contain"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center bg-green-400 rounded-lg"
                  style={{
                    backgroundImage: "url('footprint.png')",
                    backgroundSize: "40%",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                  }}
                ></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white text-black rounded-xl shadow-xl p-6 w-11/12 max-w-md relative">
            <h2 className="text-xl font-bold mb-3">Game Rules</h2>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base">
              <li>Flip 2 cards at a time to find matching pairs.</li>
              <li>Matched pairs stay flipped.</li>
              <li>You have 120 seconds to match all pairs.</li>
              <li>Win by matching all pairs before time runs out.</li>
            </ul>
            <button
              onClick={() => setShowRules(false)}
              className="absolute top-3 right-3 text-xl font-bold text-gray-700 hover:text-red-500"
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cards;
