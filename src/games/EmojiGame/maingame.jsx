import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import emojiList from "../../components/EmojiGamelist.jsx";
import RequireAuth from "../../components/RequireAuth.jsx";
import { storage, users, scores } from "../../lib/api.js";

function EmojiGame() {
  const [items, setItems] = useState(emojiList);
  const [clickedCards, setClickedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(true);
  const [showRules, setShowRules] = useState(false);
  const [timer, setTimer] = useState(0);
  const [bestTime, setBestTime] = useState(null);

  const timerRef = useRef(null);
  const navigate = useNavigate();

  // Load server best time
  useEffect(() => {
    const u = storage.getUsername();
    if (!u) return;
    users.get(u).then((d) => setBestTime(d.data?.emojiGameHighScore || null)).catch(() => {});
  }, []);

  const shuffleArray = (array) => {
    let newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  useEffect(() => {
    if (gameActive) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [gameActive]);

  const resetGame = () => {
    clearInterval(timerRef.current);
    setClickedCards([]);
    setItems(shuffleArray(emojiList));
    setScore(0);
    setTimer(0);
    setGameActive(true);
  };

  const saveHighScore = async (timeTaken) => {
    const u = storage.getUsername();
    if (!u) return;
    const prevBest = bestTime ?? Infinity;
    if (timeTaken < prevBest) {
      setBestTime(timeTaken);
      try {
        await scores.update(u, 'emojigame', timeTaken);
        window.dispatchEvent(new CustomEvent('mg-leaderboard-updated'));
      } catch {}
    }
  };

  const handleClick = (id) => {
    if (!gameActive) return;

    if (clickedCards.includes(id)) {
      clearInterval(timerRef.current);
      setGameActive(false);
      navigate("/emoji-game/result", {
        state: { score, total: emojiList.length, result: "lose", time: timer },
      });
      return;
    }

    const newClicked = [...clickedCards, id];
    setClickedCards(newClicked);
    setScore(newClicked.length);

    if (newClicked.length === emojiList.length) {
      clearInterval(timerRef.current);
      setGameActive(false);
      saveHighScore(timer);
      navigate("/emoji-game/result", {
        state: { score: newClicked.length, total: emojiList.length, result: "win", time: timer },
      });
      return;
    }

    setItems(shuffleArray(items));
  };

  return (
    <div className="bg-gradient-to-b from-purple-300 to-purple-500 min-h-screen flex flex-col">
      <RequireAuth />
      {/* Header */}
      <div className="flex justify-between items-center px-4 sm:px-6 py-4">
        <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
          <span role="img" aria-label="emoji">😊</span> Emoji Game
        </h2>
        <div className="flex gap-4 items-center">
          <p className="text-base sm:text-lg font-semibold">
            Score: <span className="text-black">{score}</span>
          </p>
          <p className="text-base sm:text-lg font-semibold">
            Time: <span className="text-black">{timer}s</span>
          </p>
          {bestTime !== null && (
            <p className="text-base sm:text-lg font-semibold">
              Best: <span className="text-green-800">{bestTime}s</span>
            </p>
          )}
        </div>
      </div>

      {/* Buttons Row */}
      <div className="flex justify-between items-center px-6 mb-4">
        <button onClick={() => navigate("/")} className="text-black underline hover:text-purple-800">
          ← Back
        </button>
        <button onClick={() => setShowRules(true)} className="text-black underline hover:text-purple-800">
          Rules
        </button>
      </div>

      {/* Cards Grid */}
      <div className="flex-1 flex justify-center items-center px-4">
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-4xl">
          {items.map(({ id, image }) => (
            <div
              key={id}
              onClick={() => handleClick(id)}
              className={`bg-white bg-opacity-20 rounded-xl flex items-center justify-center hover:scale-105 transition-all cursor-pointer
                ${gameActive ? "" : "opacity-50 cursor-not-allowed"}`}
            >
              <div className="w-full aspect-square flex items-center justify-center">
                <img src={image} alt="emoji" className="w-12 sm:w-16 md:w-20 lg:w-24 h-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Restart Button */}
      <div className="flex justify-center mt-4 mb-6">
        <button
          onClick={resetGame}
          className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 transition"
        >
          Restart
        </button>
      </div>

      {/* Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-11/12 sm:w-96 shadow-lg">
            <h3 className="text-lg font-bold mb-4">Game Rules</h3>
            <ul className="list-disc pl-6 text-sm space-y-2">
              <li>Click each emoji only once.</li>
              <li>If you click the same emoji twice, you lose.</li>
              <li>Click all emojis without repeating to win.</li>
              <li>Try to beat your best time!</li>
            </ul>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowRules(false)}
                className="text-purple-700 font-semibold underline hover:text-purple-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmojiGame;
