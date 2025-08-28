import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RequireAuth from "../../components/RequireAuth.jsx";
import { storage, users, scores } from "../../lib/api.js";

const generateGrid = (size) => {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => "empty")
  );
};

// ✅ Now accepts size and boxesToSelect so we can control difficulty
const getRandomPattern = (size, boxesToSelect) => {
  const pattern = new Set();
  while (pattern.size < boxesToSelect) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    pattern.add(`${x},${y}`);
  }
  return Array.from(pattern).map((str) => str.split(",").map(Number));
};

export default function MemoryMatrix() {
  const navigate = useNavigate();
  const [level, setLevel] = useState(3); // starts from 3x3
  const [grid, setGrid] = useState(generateGrid(3));
  const [pattern, setPattern] = useState([]);
  const [userPattern, setUserPattern] = useState([]);
  const [showPattern, setShowPattern] = useState(true);
  const [showRules, setShowRules] = useState(false);
  const [bestLevel, setBestLevel] = useState(null);

  useEffect(() => {
    const u = storage.getUsername();
    if (!u) return;
    users.get(u).then((d) => setBestLevel(d.data?.memoryMatrixHighScore || null)).catch(() => {});
  }, []);

  const maxLevel = 15;
  const gridSize = level < 8 ? level : 8; // ✅ After level 8 grid size stays 8x8
  const boxesToSelect = Math.min(level + 1, gridSize * gridSize); // ✅ Boxes increase each level

  useEffect(() => {
    startNewLevel();
  }, [level]);

  const startNewLevel = () => {
    const newPattern = getRandomPattern(gridSize, boxesToSelect);
    setPattern(newPattern);
    setUserPattern([]);
    setGrid(generateGrid(gridSize));

    // Show highlighted pattern
    const tempGrid = generateGrid(gridSize);
    newPattern.forEach(([x, y]) => {
      tempGrid[x][y] = "blue";
    });
    setGrid(tempGrid);

    setShowPattern(true);
    setTimeout(() => {
      setShowPattern(false);
      setGrid(generateGrid(gridSize));
    }, Math.max(1000, level * 800)); // Slightly faster levels but always at least 1 sec
  };

  const pushHighLevelIfAny = (achieved) => {
    const u = storage.getUsername();
    if (!u) return;
    const prev = bestLevel ?? 0;
    if (achieved > prev) {
      setBestLevel(achieved);
      scores.update(u, 'memorymatrix', achieved).catch(() => {});
    }
  };

  const handleClick = (x, y) => {
    if (showPattern) return;
    if (userPattern.some(([ux, uy]) => ux === x && uy === y)) return;

    const isCorrect = pattern.some(([px, py]) => px === x && py === y);
    const newGrid = grid.map((row) => [...row]);

    if (isCorrect) {
      newGrid[x][y] = "blue";
      const newUserPattern = [...userPattern, [x, y]];
      setUserPattern(newUserPattern);
      setGrid(newGrid);

      if (newUserPattern.length === pattern.length) {
        // Level completed – update high level immediately
        const achieved = level - 2;
        pushHighLevelIfAny(achieved);

        if (level >= maxLevel) {
          navigate("/memory-matrix/result", {
            state: { isWin: true, flips: achieved },
          });
        } else {
          setLevel((prev) => prev + 1);
        }
      }
    } else {
      newGrid[x][y] = "red";
      setGrid(newGrid);
      setTimeout(() => {
        navigate("/memory-matrix/result", {
          state: { isWin: false, flips: level - 2 },
        });
      }, 1000);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center px-3 py-4 sm:px-6 sm:py-6">
      <RequireAuth />
      {/* Header Row */}
      <div className="w-full flex justify-between items-center mb-4 sm:mb-6">
        <button
          onClick={() => navigate("/")}
          className="text-xs sm:text-sm md:text-base flex items-center gap-1 hover:text-blue-400"
        >
          ← Back
        </button>
        <div className="flex items-center gap-4">
          <span className="text-sm">Best: {bestLevel ?? '-'} lvl</span>
          <button
            onClick={() => setShowRules(true)}
            className="border border-gray-400 px-2 sm:px-3 py-1 text-xs sm:text-sm md:text-base rounded-lg hover:bg-gray-700 transition"
          >
            Rules
          </button>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-xl sm:text-2xl md:text-4xl font-bold mb-1 sm:mb-2">
        Memory Matrix
      </h1>
      <p className="mb-4 sm:mb-6 text-xs sm:text-sm md:text-lg">
        Level - {level - 2}
      </p>

      {/* Grid */}
      <div
        className="grid gap-1 sm:gap-2 md:gap-3"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          width: "90vw",
          maxWidth: "500px", // ✅ Grid always fits in screen
        }}
      >
        {grid.map((row, x) =>
          row.map((cell, y) => (
            <div
              key={`${x}-${y}`}
              onClick={() => handleClick(x, y)}
              className={`aspect-square rounded-md cursor-pointer transition 
                ${
                  cell === "blue"
                    ? "bg-blue-500"
                    : cell === "red"
                    ? "bg-red-500"
                    : "bg-gray-300 hover:bg-gray-500"
                }`}
            />
          ))
        )}
      </div>

      {/* Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white text-black rounded-xl shadow-xl p-6 w-11/12 max-w-md relative">
            <h2 className="text-2xl font-bold mb-4 text-center">Game Rules</h2>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base">
              <li>Each level starts with a Grid (N x N), beginning from 3x3.</li>
              <li>The game highlights <b>boxes</b> in <b>blue</b> to memorize.</li>
              <li>They remain visible for some seconds — memorize them!</li>
              <li>After that, the grid resets. Now click the cells.</li>
              <li>Correct cells turn <b>blue</b>. Wrong clicks turn <b>red</b> and end the game.</li>
              <li>Guess all correctly to advance to the next level.</li>
              <li>Reach the final level to win 🎉.</li>
            </ul>
            <button
              onClick={() => setShowRules(false)}
              className="absolute top-3 right-3 text-xl font-bold text-gray-700 hover:text-red-500"
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
