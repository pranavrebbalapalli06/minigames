import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function ERules() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-300 to-pink-200 flex justify-center items-center p-4">
      <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-2xl shadow-lg max-w-5xl w-full p-6 md:p-10 relative">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 flex items-center gap-1 text-gray-700 hover:text-black transition"
        >
          <ArrowLeft size={20} /> Back
        </button>

        {/* Layout: Image + Rules */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Left Side - Emoji Image & Title */}
          <div className="flex flex-col items-center md:items-center w-full md:w-1/2">
            <img
              src="https://res.cloudinary.com/dje6kfwo1/image/upload/v1755750275/Group_7428_foohps.png"
              alt="Emoji Game Logo"
              className="w-56 md:w-72 h-auto"
            />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-4">
              Emoji Game
            </h1>
          </div>

          {/* Right Side - Rules */}
          <div className="w-full md:w-1/2 text-gray-800">
            <h2 className="text-2xl font-bold mb-4 text-center md:text-left">Rules</h2>
            <ul className="space-y-3 text-sm md:text-base leading-relaxed list-disc pl-5">
              <li>User should be able to see the list of Emojis.</li>
              <li>
                When the user clicks any one of the Emoji for the first time, then
                the count of the score should be incremented by 1 and the list of
                emoji cards should be shuffled.
              </li>
              <li>
                This process should be repeated every time the user clicks on an
                emoji card.
              </li>
              <li>
                When the user clicks on all Emoji cards without clicking any of
                them twice, the user will win the game.
              </li>
              <li>
                When the user clicks on the same Emoji for the second time, the
                user will lose the game.
              </li>
              <li>
                Once the game is over, the user will be redirected to the results
                page.
              </li>
            </ul>
          </div>
        </div>

        {/* Start Playing Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate("/emoji-game")}
            className="bg-gray-800 text-white px-6 py-2 rounded-md font-semibold hover:bg-black transition"
          >
            Start Playing
          </button>
        </div>
      </div>
    </div>
  );
}

export default ERules;
