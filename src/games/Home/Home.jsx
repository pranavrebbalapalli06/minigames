import React, { useEffect, useState } from "react";
import homeList from "../../components/Homelist.jsx";
import { useNavigate } from "react-router-dom";
import { BackgroundBeamsWithCollision } from "../../components/ui/background-beams-with-collision.jsx";
import TargetCursor from "../../components/targetcursor/Targetcursor.jsx"; // ✅ Default export, so no {}
import RequireAuth from "../../components/RequireAuth.jsx";
import { leaderboard } from "../../lib/api.js";
import UserMenu from "../../components/UserMenu.jsx";

const Home = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('games'); // 'games' | 'leaderboard'
  const [globalBoard, setGlobalBoard] = useState([]);
  const [gameBoard, setGameBoard] = useState({ game: 'emojigame', rows: [] });
  const games = [
    { key: 'emojigame', label: 'Emoji Game' },
    { key: 'memorymatrix', label: 'Memory Matrix' },
    { key: 'cardflipgame', label: 'Card Flip' },
    { key: 'rockpaperscissor', label: 'Rock Paper Scissor' }
  ];

  const refetchBoards = () => {
    leaderboard.all().then((d) => setGlobalBoard(d.data || [])).catch(() => {});
    leaderboard.game(gameBoard.game, 10)
      .then((d) => setGameBoard((prev) => ({ ...prev, rows: d.data || [] })))
      .catch(() => {});
  };

  useEffect(() => {
    if (tab !== 'leaderboard') return;
    refetchBoards();
  }, [tab, gameBoard.game]);

  useEffect(() => {
    const handler = () => { if (tab === 'leaderboard') refetchBoards(); };
    window.addEventListener('mg-leaderboard-updated', handler);
    return () => window.removeEventListener('mg-leaderboard-updated', handler);
  }, [tab, gameBoard.game]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Require authentication */}
      <RequireAuth />

      {/* Background animation */}
      <BackgroundBeamsWithCollision className="absolute inset-0 -z-10" />

      {/* Target Cursor */}
      <TargetCursor spinDuration={2} hideDefaultCursor={true} />  {/* ✅ Add here */}

      {/* User menu */}
      <div className="absolute top-4 right-4 z-10">
        <UserMenu />
      </div>

      {/* Main content */}
      <div className="min-h-screen flex flex-col items-center py-10 px-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 text-center drop-shadow-lg animate-[glow_3s_ease-in-out_infinite_alternate]">
          Mini Games
        </h1>

        {/* Tabs */}
        <div className="mb-8 flex gap-4">
          <button onClick={() => setTab('games')} className={`px-4 py-2 rounded-lg ${tab==='games'?'bg-white text-black':'bg-white/30 text-white'}`}>Games</button>
          <button onClick={() => setTab('leaderboard')} className={`px-4 py-2 rounded-lg ${tab==='leaderboard'?'bg-white text-black':'bg-white/30 text-white'}`}>Leaderboard</button>
        </div>

        {tab === 'games' ? (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 w-full max-w-5xl px-2 sm:px-4">
            {homeList.map(({ id, name, image, path }) => (
              <div
                key={id}
                onClick={() => navigate(path)}
                className="cursor-target bg-white/90 backdrop-blur-md rounded-2xl shadow-xl flex flex-col items-center p-6 hover:scale-105 transform transition-transform duration-300 cursor-pointer w-full hover:shadow-2xl"
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
        ) : (
          <div className="w-full max-w-5xl grid gap-8">
            {/* Global leaderboard */}
            <section className="bg-white/90 rounded-2xl p-4">
              <h2 className="text-xl font-bold mb-3">All Players</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-2">Username</th>
                      <th className="py-2 px-2">Emoji Best Time (s)</th>
                      <th className="py-2 px-2">Memory Max Level</th>
                      <th className="py-2 px-2">CardFlip Best Time (s)</th>
                      <th className="py-2 px-2">RPS Max Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {globalBoard.map((u) => (
                      <tr key={u._id} className="border-b last:border-0">
                        <td className="py-2 px-2">{u.username}</td>
                        <td className="py-2 px-2">{u.emojiGameHighScore ?? '-'}</td>
                        <td className="py-2 px-2">{u.memoryMatrixHighScore ?? '-'}</td>
                        <td className="py-2 px-2">{u.cardFlipGameHighScore ?? '-'}</td>
                        <td className="py-2 px-2">{u.rockPaperScissorHighScore ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Per-game leaderboard */}
            <section className="bg-white/90 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold">Top Players</h2>
                <select
                  value={gameBoard.game}
                  onChange={(e) => setGameBoard({ game: e.target.value, rows: [] })}
                  className="border rounded-lg px-3 py-1"
                >
                  {games.map((g) => (
                    <option key={g.key} value={g.key}>{g.label}</option>
                  ))}
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-2">Username</th>
                      <th className="py-2 px-2">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gameBoard.rows.map((u) => (
                      <tr key={u._id} className="border-b last:border-0">
                        <td className="py-2 px-2">{u.username}</td>
                        <td className="py-2 px-2">{u.emojiGameHighScore ?? u.memoryMatrixHighScore ?? u.cardFlipGameHighScore ?? u.rockPaperScissorHighScore}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
