import React, { useEffect, useState } from "react";
import homeList from "../../components/Homelist.jsx";
import { useNavigate } from "react-router-dom";
import { BackgroundBeamsWithCollision } from "../../components/ui/background-beams-with-collision.jsx";
import TargetCursor from "../../components/targetcursor/Targetcursor.jsx";
import RequireAuth from "../../components/RequireAuth.jsx";
import { leaderboard } from "../../lib/api.js";
import UserMenu from "../../components/UserMenu.jsx";

const Home = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("games");
  const [globalBoard, setGlobalBoard] = useState([]);
  const [gameBoard, setGameBoard] = useState({ game: "emojigame", rows: [] });

  const games = [
    { key: "emojigame", label: "Emoji Game" },
    { key: "memorymatrix", label: "Memory Matrix" },
    { key: "cardflipgame", label: "Card Flip" },
    { key: "rockpaperscissor", label: "Rock Paper Scissor" },
  ];

  const badgeUrls = [
    "https://res.cloudinary.com/dje6kfwo1/image/upload/v1756444933/ChatGPT_Image_Aug_29_2025_10_51_48_AM_wcyb69.png", // gold
    "https://res.cloudinary.com/dje6kfwo1/image/upload/v1756444932/ChatGPT_Image_Aug_29_2025_10_51_27_AM_en6qsf.png", // silver
    "https://res.cloudinary.com/dje6kfwo1/image/upload/v1756445156/ChatGPT_Image_Aug_29_2025_10_55_44_AM_e74vrh.png", // bronze
  ];

  const refetchBoards = () => {
    leaderboard.all().then(d => setGlobalBoard(d.data || []));
    leaderboard.game(gameBoard.game, 10).then(d =>
      setGameBoard(prev => ({ ...prev, rows: d.data || [] }))
    );
  };

  useEffect(() => {
    if (tab === "leaderboard") refetchBoards();
  }, [tab, gameBoard.game]);

  useEffect(() => {
    const handler = () => tab === "leaderboard" && refetchBoards();
    window.addEventListener("mg-leaderboard-updated", handler);
    return () => window.removeEventListener("mg-leaderboard-updated", handler);
  }, [tab, gameBoard.game]);

  // --- Sorting helpers (simple + safe) ---
  const scoreFor = (u, game) => {
    const num = (v) => (v === null || v === undefined || v === "" ? null : Number(v));
    switch (game) {
      case "emojigame": return num(u.emojiGameHighScore);            // lower is better
      case "cardflipgame": return num(u.cardFlipGameHighScore);      // lower is better
      case "memorymatrix": return num(u.memoryMatrixHighScore);      // higher is better
      case "rockpaperscissor": return num(u.rockPaperScissorHighScore); // higher is better
      default: return null;
    }
  };
  const lowerIsBetter = ["emojigame", "cardflipgame"].includes(gameBoard.game);
  const sortedRows = [...(gameBoard.rows || [])].sort((a, b) => {
    const aS = scoreFor(a, gameBoard.game);
    const bS = scoreFor(b, gameBoard.game);

    // Push empty scores to the bottom
    if (aS === null && bS === null) return 0;
    if (aS === null) return 1;
    if (bS === null) return -1;

    // Time games: ascending (lower is better). Others: descending (higher is better).
    return lowerIsBetter ? aS - bS : bS - aS;
  });

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <RequireAuth />
      <BackgroundBeamsWithCollision className="absolute inset-0 -z-10" />
      <TargetCursor spinDuration={2} hideDefaultCursor />

      {/* User Menu (polished but simple) */}
      <div className="absolute top-4 right-4 z-10 bg-white/90 rounded-full px-4 py-2 shadow hover:shadow-xl transition">
        <UserMenu />
      </div>

      <div className="min-h-screen flex flex-col items-center py-10 px-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 text-center drop-shadow-lg animate-[glow_3s_ease-in-out_infinite_alternate]">
          Mini Games
        </h1>

        {/* Tabs */}
        <div className="mb-8 flex gap-4">
          {["games", "leaderboard"].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg ${tab === t ? "bg-white text-black shadow" : "bg-white/30 text-white"}`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === "games" ? (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl px-2 sm:px-4">
            {homeList.map(({ id, name, image, path }) => (
              <div
                key={id}
                onClick={() => navigate(path)}
                className="bg-white/90 rounded-2xl shadow p-6 flex flex-col items-center cursor-pointer hover:scale-105 transition"
              >
                <img src={image} alt={name} className="w-28 h-28 object-contain" />
                <p className="mt-4 text-lg font-semibold text-gray-800">{name}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full max-w-5xl grid gap-8">
            {/* Top Players */}
            <section className="bg-white/90 rounded-2xl p-4 shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Top Players</h2>
                <select
                  value={gameBoard.game}
                  onChange={e => setGameBoard({ game: e.target.value, rows: [] })}
                  className="border rounded px-3 py-1"
                >
                  {games.map(g => (
                    <option key={g.key} value={g.key}>{g.label}</option>
                  ))}
                </select>
              </div>

              <table className="w-full text-left text-sm rounded-lg overflow-hidden">
                <thead className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                  <tr>
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Username</th>
                    <th className="py-3 px-4">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRows.map((u, i) => {
                    const displayScore =
                      scoreFor(u, gameBoard.game) ??
                      u.emojiGameHighScore ??
                      u.memoryMatrixHighScore ??
                      u.cardFlipGameHighScore ??
                      u.rockPaperScissorHighScore;
                    return (
                      <tr key={u._id} className="border-b hover:bg-gray-100">
                        <td className="py-3 px-4 flex items-center gap-2">
                          {i < 3 && <img src={badgeUrls[i]} alt="" className="w-6 h-6" />}
                          {i + 1}
                        </td>
                        <td className="py-3 px-4 font-semibold">{u.username}</td>
                        <td className="py-3 px-4">{displayScore}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>

            {/* All Players */}
            <section className="bg-white/90 rounded-2xl p-4 shadow">
              <h2 className="text-xl font-bold mb-3">All Players</h2>
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-2">Username</th>
                    <th className="py-2 px-2">Emoji Best Time (s)</th>
                    <th className="py-2 px-2">Memory Max Level</th>
                    <th className="py-2 px-2">CardFlip Best Time (s)</th>
                    <th className="py-2 px-2">RPS Max Score</th>
                  </tr>
                </thead>
                <tbody>
                  {globalBoard.map(u => (
                    <tr key={u._id} className="border-b last:border-0">
                      <td className="py-2 px-2">{u.username}</td>
                      <td className="py-2 px-2">{u.emojiGameHighScore ?? "-"}</td>
                      <td className="py-2 px-2">{u.memoryMatrixHighScore ?? "-"}</td>
                      <td className="py-2 px-2">{u.cardFlipGameHighScore ?? "-"}</td>
                      <td className="py-2 px-2">{u.rockPaperScissorHighScore ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
