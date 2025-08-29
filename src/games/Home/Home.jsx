import React, { useEffect, useState } from "react";
import homeList from "../../components/Homelist.jsx";
import { useNavigate } from "react-router-dom";
import { BackgroundBeamsWithCollision } from "../../components/ui/background-beams-with-collision.jsx";
import TargetCursor from "../../components/targetcursor/Targetcursor.jsx";
import RequireAuth from "../../components/RequireAuth.jsx";
import { leaderboard } from "../../lib/api.js";
import UserMenu from "../../components/UserMenu.jsx";

/* --- minimal helpers --- */
const scoreKeyFor = {
  emojigame: "emojiGameHighScore",
  memorymatrix: "memoryMatrixHighScore",
  cardflipgame: "cardFlipGameHighScore",
  rockpaperscissor: "rockPaperScissorHighScore",
};

const badgeUrls = [
  "https://res.cloudinary.com/dje6kfwo1/image/upload/v1756444933/ChatGPT_Image_Aug_29_2025_10_51_48_AM_wcyb69.png",
  "https://res.cloudinary.com/dje6kfwo1/image/upload/v1756444932/ChatGPT_Image_Aug_29_2025_10_51_27_AM_en6qsf.png",
  "https://res.cloudinary.com/dje6kfwo1/image/upload/v1756445156/ChatGPT_Image_Aug_29_2025_10_55_44_AM_e74vrh.png",
];

const parseScore = (v) => {
  // returns numeric value (seconds for mm:ss) or null if not numeric
  if (v === null || v === undefined || v === "") return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  const s = String(v).trim();
  // mm:ss -> seconds
  if (/^\d+:\d{1,2}$/.test(s)) {
    const [m, sec] = s.split(":").map(Number);
    if (!Number.isNaN(m) && !Number.isNaN(sec)) return m * 60 + sec;
  }
  // remove non-numeric except dot and minus
  const cleaned = s.replace(/[^0-9.\-]/g, "");
  if (cleaned === "" || cleaned === "-" || cleaned === ".") return null;
  const n = Number(cleaned);
  return Number.isNaN(n) ? null : n;
};

const getScoreValue = (row, game) => {
  const key = scoreKeyFor[game];
  // prefer the canonical key, then 'score', then any numeric-like field
  if (row == null) return null;
  if (row[key] !== undefined) return parseScore(row[key]);
  if (row.score !== undefined) return parseScore(row.score);
  // fallback: find first numeric-like field
  for (const v of Object.values(row)) {
    const p = parseScore(v);
    if (p !== null) return p;
  }
  return null;
};

const sortDesc = (rows = [], game) =>
  [...rows].sort((a, b) => {
    const A = getScoreValue(a, game);
    const B = getScoreValue(b, game);
    // both missing -> keep original order (or by username)
    if (A === null && B === null) return 0;
    if (A === null) return 1; // push missing to bottom
    if (B === null) return -1;
    return B - A; // descending
  });

/* --- component --- */
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

  useEffect(() => {
    // fetch global once when leaderboard tab opens
    if (tab !== "leaderboard") return;
    let cancelled = false;
    leaderboard
      .all()
      .then((d) => {
        if (!cancelled) setGlobalBoard(d?.data ?? []);
      })
      .catch(() => {});
    return () => (cancelled = true);
  }, [tab]);

  useEffect(() => {
    // fetch per-game rows when leaderboard tab opens or game changes
    if (tab !== "leaderboard") return;
    let cancelled = false;
    const g = gameBoard.game || "emojigame";
    leaderboard
      .game(g, 100)
      .then((d) => {
        if (cancelled) return;
        const rows = d?.data ?? [];
        setGameBoard({ game: g, rows: sortDesc(rows, g) });
      })
      .catch(() => {
        if (!cancelled) setGameBoard((p) => ({ ...p, rows: [] }));
      });
    return () => (cancelled = true);
  }, [tab, gameBoard.game]);

  const changeGame = (g) => setGameBoard((p) => ({ ...p, game: g, rows: [] }));

  const displayScore = (row, game) => {
    const key = scoreKeyFor[game];
    if (row?.[key] !== undefined && row[key] !== null && row[key] !== "") return row[key];
    const v = getScoreValue(row, game);
    return v === null ? "-" : v;
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <RequireAuth />
      <BackgroundBeamsWithCollision className="fixed inset-0 -z-10" />
      <TargetCursor spinDuration={2} hideDefaultCursor={true} />

      <div className="absolute top-4 right-4 z-10 bg-white/90 rounded-full px-4 py-2 shadow hover:shadow-xl transition">
        <UserMenu />
      </div>

      <div className="min-h-screen flex flex-col items-center py-10 px-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 text-center drop-shadow-lg">
          Mini Games
        </h1>

        <div className="mb-8 flex gap-4">
          {["games", "leaderboard"].map((t) => (
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
                <p className="mt-4 text-lg font-semibold text-gray-800 text-center">{name}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full max-w-5xl grid gap-8">
            {/* Top Players */}
            <section className="bg-white/90 rounded-2xl p-4 shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Top Players</h2>
                <select value={gameBoard.game} onChange={(e) => changeGame(e.target.value)} className="border rounded px-3 py-1">
                  {games.map((g) => (
                    <option key={g.key} value={g.key}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm rounded-lg overflow-hidden">
                  <thead className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                    <tr>
                      <th className="py-3 px-4">Rank</th>
                      <th className="py-3 px-4">Username</th>
                      <th className="py-3 px-4">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gameBoard.rows.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-6 px-4 text-center">No data</td>
                      </tr>
                    ) : (
                      gameBoard.rows.map((u, i) => (
                        <tr key={u._id ?? `${u.username}-${i}`} className="border-b hover:bg-gray-100">
                          <td className="py-3 px-4 flex items-center gap-2">
                            {i < 3 && <img src={badgeUrls[i]} alt={`badge-${i}`} className="w-6 h-6" />}
                            {i + 1}
                          </td>
                          <td className="py-3 px-4 font-semibold">{u.username}</td>
                          <td className="py-3 px-4">{displayScore(u, gameBoard.game)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
            <h2 class="text-center text-2xl font-bold mt-4 mb-6 text-white bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-3 rounded-lg shadow-lg">
  🚀 Play Hard, Rank Higher – Your Spot Awaits on the Leaderboard! 🏅
</h2>


            {/* All Players */}
            <section className="bg-white/90 rounded-2xl p-4 shadow">
              <h2 className="text-xl font-bold mb-3">All Players</h2>
              <div className="overflow-x-auto">
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
                    {globalBoard.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 px-4 text-center">No players yet</td>
                      </tr>
                    ) : (
                      globalBoard.map((u) => (
                        <tr key={u._id} className="border-b last:border-0">
                          <td className="py-2 px-2">{u.username}</td>
                          <td className="py-2 px-2">{u.emojiGameHighScore ?? "-"}</td>
                          <td className="py-2 px-2">{u.memoryMatrixHighScore ?? "-"}</td>
                          <td className="py-2 px-2">{u.cardFlipGameHighScore ?? "-"}</td>
                          <td className="py-2 px-2">{u.rockPaperScissorHighScore ?? "-"}</td>
                        </tr>
                      ))
                    )}
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
