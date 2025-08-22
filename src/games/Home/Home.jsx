import React from "react";
import homeList from "../../components/Homelist.jsx";
import { useNavigate } from "react-router-dom";
import { BackgroundBeamsWithCollision } from "../../components/ui/background-beams-with-collision.jsx";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background animation */}
      <BackgroundBeamsWithCollision className="absolute inset-0 -z-10" />

      {/* Main content */}
      <div className="min-h-screen flex flex-col items-center py-10 px-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-10 text-center drop-shadow-lg">
          Games
        </h1>

        {/* Responsive grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl px-2 sm:px-4">
          {homeList.map(({ id, name, image, path }) => (
            <div
              key={id}
              onClick={() => navigate(path)}
              className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl flex flex-col items-center p-6 hover:scale-105 transform transition-transform duration-300 cursor-pointer w-full hover:shadow-2xl"
            >
              <img
                src={image}
                alt={name}
                className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain"
              />
              <p className="mt-4 text-base sm:text-lg md:text-xl font-semibold text-center text-gray-800">
                {name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
