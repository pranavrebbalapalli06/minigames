import { useLocation, useNavigate } from "react-router-dom";

function CResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const flips = location.state?.flips || 0;
  const isWin = location.state?.isWin || false; // decide win/lose

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0D3B2E] text-white">
      <img
        src={isWin ? "https://res.cloudinary.com/dje6kfwo1/image/upload/v1755679020/03_Optimistic_rd5tht.png" : "https://res.cloudinary.com/dje6kfwo1/image/upload/v1755679052/05_Pokerface_poat30.png"} // conditional image
        alt={isWin ? "Win" : "Lose"}
        className="w-24 h-24 mb-4"
      />

      <h1 className="text-3xl font-bold text-green-400 mb-2">
        {isWin ? "Congratulations!" : "Better luck next time!"}
      </h1>

      <p className="text-md mb-2 font-serif">No. of Flips - {flips}</p>

      <p className="text-lg mb-6 font-serif">
        {isWin
          ? "You matched all of the cards in record time"
          : "You did not match all of the cards in record time"}
      </p>

      <button
        onClick={() => navigate("/cards-game")}
        className="bg-white text-black px-4 py-2 rounded-md shadow hover:bg-gray-200 transition"
      >
        Play Again
      </button>
    </div>
  );
}

export default CResult;
