import { useState } from "react";
import { useNavigate } from "react-router-dom";
import emojiList from "../../components/EmojiGamelist.jsx";

function EmojiGame() {
  const [items, setItems] = useState(emojiList);
  const [clickedCards, setClickedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(true);
  const [showRules, setShowRules] = useState(false);

  const navigate = useNavigate();

  // Shuffle function
  const shuffleArray = (array) => {
    let newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const resetGame = () => {
    setClickedCards([]);
    setItems(shuffleArray(emojiList));
    setScore(0);
    setGameActive(true);
  };

const handleClick = (id) => {
  if (!gameActive) return;

  // Case: Clicking an already clicked card → Lose
  if (clickedCards.includes(id)) {
    setGameActive(false);
    navigate("/emoji-game/result", {
      state: { score, total: emojiList.length, result: "lose" },
    });
    return;
  }

  const newClicked = [...clickedCards, id];
  setClickedCards(newClicked);
  setScore(newClicked.length);

  // Case: All cards clicked → Win
  if (newClicked.length === emojiList.length) {
    setGameActive(false);
    navigate("/emoji-game/result", {
      state: { score: newClicked.length, total: emojiList.length, result: "win" },
    });
    return;
  }

  // Continue game → Shuffle cards
  setItems(shuffleArray(items));
};


  return (
    <div className="bg-gradient-to-b from-purple-300 to-purple-500 min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-4 sm:px-6 py-4">
        <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
          <span role="img" aria-label="emoji">😊</span> Emoji Game
        </h2>
        <p className="text-base sm:text-lg font-semibold">
          Score: <span className="text-black">{score}</span>
        </p>
      </div>

      {/* Buttons Row (Below Header) */}
      <div className="flex justify-between items-center px-6 mb-4">
        <button
          onClick={() => navigate("/")}
          className="text-black underline hover:text-purple-800"
        >
          ← Back
        </button>
        <button
          onClick={() => setShowRules(true)}
          className="text-black underline hover:text-purple-800"
        >
          Rules
        </button>
      </div>

      {/* Fixed Cards Grid */}
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
      <div className="flex justify-center  mt-4 mb-6">
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
