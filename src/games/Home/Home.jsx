import React, { useEffect, useRef, useState } from "react";
import homeList from "../../components/Homelist.jsx";
import { useNavigate } from "react-router-dom";
import { BackgroundBeamsWithCollision } from "../../components/ui/background-beams-with-collision.jsx";
import TargetCursor from "../../components/targetcursor/Targetcursor.jsx";
import RequireAuth from "../../components/RequireAuth.jsx";
import { leaderboard } from "../../lib/api.js";
import UserMenu from "../../components/UserMenu.jsx";

const scoreKeyFor = {
  emojigame: "emojiGameHighScore",
  memorymatrix: "memoryMatrixHighScore",
  cardflipgame: "cardFlipGameHighScore",
  rockpaperscissor: "rockPaperScissorHighScore",
};

const lowerIsBetterGames = new Set(["emojigame", "cardflipgame"]); // time-based (lower better)

const badgeUrls = [
  "https://res.cloudinary.com/dje6kfwo1/image/upload/v1756444933/ChatGPT_Image_Aug_29_2025_10_51_48_AM_wcyb69.png",
  "https://res.cloudinary.com/dje6kfwo1/image/upload/v1756444932/ChatGPT_Image_Aug_29_2025_10_51_27_AM_en6qsf.png",
  "https://res.cloudinary.com/dje6kfwo1/image/upload/v1756445156/ChatGPT_Image_Aug_29_2025_10_55_44_AM_e74vrh.png",
];

const parseValue = (v) => {
  // Return numeric value (seconds for mm:ss), or null if not parsable
  if (v === null || v === undefined || v === "") return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "string") {
    const s = v.trim();
    // mm:ss pattern
    if (/^\d+:\d{1,2}$/.test(s)) {
      const [min, sec] = s.split(":").map(Number);
      if (!Number.isNaN(min) && !Number.isNaN(sec)) return min * 60 + sec;
    }
    // remove non-numeric except dot and minus (handles "25", "25.0", "0", "1,234")
    const cleaned = s.replace(/[^0-9.\-]/g, "");
    if (cleaned === "" || cleaned === "-" || cleaned === ".") return null;
    const n = Number(cleaned);
    return Number.isNaN(n) ? null : n;
  }
  return null;
};

const formatSeconds = (s) => {
  const total = Math.round(s);
  const m = Math.floor(total / 60);
  const sec = total % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

const sortRows = (rows = [], game) => {
  const key = scoreKeyFor[game];
  const lowerIsBetter = lowerIsBetterGames.has(game);
  return [...rows].sort((a, b) => {
    const aS = parseValue(a?.[key]);
    const bS = parseValue(b?.[key]);

    // both missing
    if (aS === null && bS === null) {
      return (a?.username || "").localeCompare(b?.username || "");
    }
    // push nulls to bottom
    if (aS === null) return 1;
    if (bS === null) return -1;

    // numeric compare (lower is better for time-based games)
    if (aS === bS) return (a?.username || "").localeCompare(b?.username || "");
    return lowerIsBetter ? aS - bS : bS - aS;
  });
};

const Home = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("games");
  const [globalBoard, setGlobalBoard] = useState([]);
  const [gameBoard, setGameBoard] = useState({ game: "emojigame", rows: [] });
  const [loadingGlobal, setLoadingGlobal] = useState(false);
  const [loadingGame, setLoadingGame] = useState(false);

  // use ref to avoid race conditions when multiple fetches happen
  const fetchCounterRef = useRef(0);

  const games = [
    { key: "emojigame", label: "Emoji Game" },
    { key: "memorymatrix", label: "Memory Matrix" },
    { key: "cardflipgame", label: "Card Flip" },
    { key: "rockpaperscissor", label: "Rock Paper Scissor" },
  ];

  const fetchGlobalBoard = async () => {
    setLoadingGlobal(true);
    try {
      const d = await leaderboard.all();
      if (d && d.data) setGlobalBoard(d.data);
    } catch (e) {
      // ignore, keep previous data
      // console.error("global fetch failed", e);
    } finally {
      setLoadingGlobal(false);
    }
  };

  const fetchGameBoard = async (game) => {
    // marked id for this fetch
    fetchCounterRef.current += 1;
    const myId = fetchCounterRef.current;

    setLoadingGame(true);
    // clear rows while loading so UI resets quickly
    setGameBoard((prev) => ({ ...prev, rows: [] }));

    try {
      const d = await leaderboard.game(game, 10);
      // if a newer fetch started, discard this result
      if (myId !== fetchCounterRef.current) return;
      const rows = (d && d.data) ? sortRows(d.data, game) : [];
      setGameBoard({ game, rows });
    } catch (e) {
      // keep previous, but ensure game value updated
      if (myId === fetchCounterRef.current) {
        setGameBoard((prev) => ({ ...prev, rows: [] }));
      }
      // console.error("game fetch failed", e);
    } finally {
      if (myId === fetchCounterRef.current) setLoadingGame(false);
    }
  };

  const refetchBoards = async () => {
    await Promise.all([fetchGlobalBoard(), fetchGameBoard(gameBoard.game)]);
  };

  useEffect(() => {
    if (tab === "leaderboard") {
      // fetch when leaderboard tab opens
      refetchBoards();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // fetch when game selection changes (only if leaderboard open)
  useEffect(() => {
    if (tab === "leaderboard") fetchGameBoard(gameBoard.game);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameBoard.game]);

  // event listener to allow server-push refresh
  useEffect(() => {
    const handler = () => tab === "leaderboard" && refetchBoards();
    window.addEventListener("mg-leaderboard-updated", handler);
    return () => window.removeEventListener("mg-leaderboard-updated", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const onChangeGame = (e) => {
    const newGame = e.target.value;
    // update game selection immediately and fetch new board
    setGameBoard((prev) => ({ ...prev, game: newGame, rows: [] }));
    fetchGameBoard(newGame);
  };

  const getDisplayScore = (u, game) => {
    const key = scoreKeyFor[game];
    const raw = u?.[key];
    const parsed = parseValue(raw);

    // If raw is present (even "0"), prefer showing it as-is
    if (raw !== null && raw !== undefined && raw !== "") return raw;

    if (parsed === null) return "-";

    // For time-based games, show mm:ss for readability; otherwise numeric
    if (lowerIsBetterGames.has(game)) return formatSeconds(parsed);
    return parsed;
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <RequireAuth />
      <BackgroundBeamsWithCollision className="absolute inset-0 -z-10" />
      <TargetCursor spinDuration={2} hideDefaultCursor={true} />

      {/* User Menu */}
      <div className="absolute top-4 right-4 z-10 bg-white/90 rounded-full px-4 py-2 shadow hover:shadow-xl transition">
        <UserMenu />
      </div>

      <div className="min-h-screen flex flex-col items-center py-10 px-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 text-center drop-shadow-lg animate-[glow_3s_ease-in-out_infinite_alternate]">
          Mini Games
        </h1>

        {/* Tabs */}
        <div className="mb-8 flex gap-4">
          {["games", "leaderboard"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg ${
                tab === t ? "bg-white text-black shadow" : "bg-white/30 text-white"
              }`}
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
                <select
                  value={gameBoard.game}
                  onChange={onChangeGame}
                  className="border rounded px-3 py-1"
                >
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
                    {loadingGame ? (
                      <tr>
                        <td colSpan={3} className="py-6 px-4 text-center">
                          Loading...
                        </td>
                      </tr>
                    ) : gameBoard.rows.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-6 px-4 text-center">
                          No data
                        </td>
                      </tr>
                    ) : (
                      gameBoard.rows.map((u, i) => (
                        <tr key={u._id || `${u.username}-${i}`} className="border-b hover:bg-gray-100">
                          <td className="py-3 px-4 flex items-center gap-2">
                            {i < 3 && <img src={badgeUrls[i]} alt={`badge-${i}`} className="w-6 h-6" />}
                            {i + 1}
                          </td>
                          <td className="py-3 px-4 font-semibold">{u.username}</td>
                          <td className="py-3 px-4">{getDisplayScore(u, gameBoard.game)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* All Players */}
            <section className="bg-white/90 rounded-2xl p-4 shadow">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold">All Players</h2>
                {loadingGlobal ? <div className="text-sm text-gray-600">Loading...</div> : null}
              </div>

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
                        <td colSpan={5} className="py-6 px-4 text-center">
                          No players yet
                        </td>
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
