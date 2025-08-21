import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";


export default function Rules() {
    const navigate=useNavigate()

      const handleStartGame = () => {
    navigate("/memory-matrix"); // redirect to /game route
  };
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col p-6">
      {/* Back button */}
      <button className="flex items-center gap-2 text-gray-300 hover:text-white mb-6" onClick={()=>{navigate("/")}}>
        <ArrowLeft size={20} />
        Back
      </button>

      {/* Title */}
      <h1 className="text-3xl font-bold text-center mb-6">Memory Matrix</h1>

      {/* Image section */}
      <div className="flex justify-center mb-8">
        <img
          src="https://res.cloudinary.com/dje6kfwo1/image/upload/v1755494061/memory_1_mslbw9.png"
          alt="Rules illustration"
          className="w-full max-w-xs rounded-lg"
        />
      </div>

      {/* Rules section */}
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 text-gray-200">
        <ul className="space-y-4 list-disc list-inside">
          <li>
            In each level of the Game, Users should be able to see the Grid with{" "}
            <b>(N X N)</b> size starting from 3 and the grid will highlight N
            cells in Blue, the N highlighted cells will be picked randomly.
          </li>
          <li>
            The highlighted cells will remain N seconds for the user to memorize
            the cells. At this point, the user should not be able to perform any
            action.
          </li>
          <li>
            After N seconds, the grid will clear the N highlighted cells.
          </li>
        </ul>

        <ul className="space-y-4 list-disc list-inside">
          <li>
            At N seconds, the user can click on any cell. Clicking on a cell
            that was highlighted before it will turn blue. Clicking on the other
            cells that were not highlighted before then will turn to red.
          </li>
          <li>
            The user should be promoted to the next level if they guess all N
            cells correctly in one attempt.
          </li>
          <li>
            The user should be taken to the results page if the user clicks on
            the wrong cell.
          </li>
          <li>
            If the user completed all the levels, then the user should be taken
            to the results page.
          </li>
        </ul>
      </div>

      {/* Button */}
      <div className="flex justify-center mt-10">
        <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full shadow-md text-white font-medium" onClick={handleStartGame}>
          Start playing
        </button>
      </div>
    </div>
  );
}
