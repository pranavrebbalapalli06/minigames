import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const images = {
  rock: 'https://res.cloudinary.com/dje6kfwo1/image/upload/v1754199948/Group_6941_rih46j.png',
  paper: 'https://res.cloudinary.com/dje6kfwo1/image/upload/v1754199941/Paper_bkjuyb.png',
  scissor: 'https://res.cloudinary.com/dje6kfwo1/image/upload/v1754199918/Group_6940_fia58w.png', // changed to match "scissor"
  win: 'https://res.cloudinary.com/dje6kfwo1/image/upload/v1754203452/Group_7618_ar1w6t.png',
  lose: 'https://res.cloudinary.com/dje6kfwo1/image/upload/v1754203452/Group_7618_1_rq82lk.png',
  draw: 'https://res.cloudinary.com/dje6kfwo1/image/upload/v1754203600/Group_7618_2_rhnhyk.png',
};

const resultConfig = {
  win: { text: 'YOU WON', button: 'Play Again', emoji: images.win },
  lose: { text: 'YOU LOST', button: 'Try Again', emoji: images.lose },
  draw: { text: "IT'S A DRAW", button: 'Play Again', emoji: images.draw },
};

const RPSResult = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { text, button, emoji } = resultConfig[state?.result] || resultConfig.draw;

  return (
    <div className="bg-[#1e3555] min-h-screen text-white flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-6">ROCK PAPER SCISSOR</h1>

      {/* Score + Emoji Section */}
      <div className="flex items-center gap-6 border px-10 py-4 rounded mb-10">
        <ul className="text-left leading-8">
          <li>Rock</li>
          <li>Paper</li>
          <li>Scissor</li>
        </ul>
        <img src={emoji} alt="result emoji" className="w-20 h-20" />
        <div className="bg-white text-[#1e3555] px-6 py-2 rounded text-lg font-bold">
          Score<br />{state?.score}
        </div>
      </div>

      {/* User & Opponent Section */}
      <div className="flex gap-20 items-center mb-6">
        <div className="text-center">
          <p className="mb-2 font-semibold">You</p>
          <div className="bg-white p-4 rounded-full border-8 border-blue-500">
            <img src={images[state?.user]} alt="You" className="w-20 h-20" />
          </div>
        </div>
        <div className="text-center">
          <p className="mb-2 font-semibold">Opponent</p>
          <div className="bg-white p-4 rounded-full border-8 border-red-500">
            <img src={images[state?.opponent]} alt="Opponent" className="w-20 h-20" />
          </div>
        </div>
      </div>

      {/* Result Text */}
      <p className="text-xl font-bold my-2">{text}</p>

      {/* Button */}
      <button
        onClick={() => navigate('/rock-paper-scissor')}
        className="mt-2 bg-white text-[#1e3555] px-6 py-2 rounded font-semibold"
      >
        {button}
      </button>
    </div>
  );
};

export default RPSResult;
