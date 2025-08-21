import { useLocation, useNavigate } from "react-router-dom";

function EResult() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const score = state?.score || 0;
  const total = state?.total || 0;
  const isWin = state?.result === "win"; // pass 'win' or 'lose' when navigating

  // Dynamic content based on result
  const title = isWin ? "You Won" : "You Lose";
  const scoreColor = isWin ? "text-indigo-600" : "text-red-600";
  const buttonText = isWin ? "Play Again" : "Try Again";
  const imageUrl = isWin
    ? "https://res.cloudinary.com/dje6kfwo1/image/upload/v1754374502/Image_1_u2c2q7.png"
    : "https://res.cloudinary.com/dje6kfwo1/image/upload/v1754374537/Image_2_svq6vw.png";

  return (
    <div className="bg-gradient-to-b from-purple-300 to-pink-200 min-h-screen flex flex-col items-center">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 py-4 w-full bg-white">
        <img
          src="https://res.cloudinary.com/dje6kfwo1/image/upload/v1754374760/wink_1_mklxcf.jpg"
          alt="logo"
          className="w-8 h-8 rounded-full"
        />
        <h2 className="text-lg font-bold">Emoji Game</h2>
      </div>

      {/* Result Box */}
      <div className="bg-white bg-opacity-20 rounded-2xl shadow-lg p-10 flex flex-col md:flex-row items-center gap-8 mt-10">
        <div className="flex flex-col items-center md:items-start">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="mt-2 text-gray-800 text-lg">
            {isWin ? "Best Score" : "Score"}{" "}
            <span className={`${scoreColor} font-bold`}>
              {score}/{total}
            </span>
          </p>
          <button
            onClick={() => navigate("/emoji-game")}
            className="bg-yellow-400 mt-4 px-6 py-2 rounded-full font-semibold hover:bg-yellow-500 transition"
          >
            {buttonText}
          </button>
        </div>

        <img src={imageUrl} alt={isWin ? "win" : "lose"} className="w-56 h-auto" />
      </div>
    </div>
  );
}

export default EResult;
