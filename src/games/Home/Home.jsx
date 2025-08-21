import React from "react";
import homeList from "../../components/Homelist.jsx";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-purple-400 to-purple-600 min-h-screen flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Games</h1>

      {/* Responsive grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-6 lg:grid-cols-2 lg:w-200 gap-6 w-full max-w-7xl">
        {homeList.map(({ id, name, image, path }) => (
          <div
            key={id}
            onClick={() => navigate(path)}
            className="bg-white rounded-2xl shadow-lg flex flex-col items-center p-6 hover:scale-105 transform transition duration-300 cursor-pointer w-full"
          >
            <img
              src={image}
              alt={name}
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain"
            />
            <p className="mt-4 text-base sm:text-lg font-semibold text-center">
              {name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
