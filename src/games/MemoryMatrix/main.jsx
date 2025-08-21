import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const generateGrid = (size) => {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => "empty"));
};

const getRandomPattern = (size, level, maxLevelBoxes) => {
  const pattern = new Set();
  // Increase boxes with level, cap at maxLevelBoxes
  const boxesToSelect = Math.min(level + 2, maxLevelBoxes);

  while (pattern.size < boxesToSelect) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    pattern.add(`${x}-${y}`);
  }

  return pattern;
};

export default function MemoryGame() {
  const [level, setLevel] = useState(1);
  const [gridSize, setGridSize] = useState(3);
  const [pattern, setPattern] = useState(new Set());
  const [grid, setGrid] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [gameActive, setGameActive] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Increase grid size till level 7, then fix size
    const size = level < 8 ? Math.min(3 + level, 8) : 8;
    setGridSize(size);

    // Max 10 boxes per level or less if grid too small
    const maxBoxes = Math.min(size * size, 10);
    const newPattern = getRandomPattern(size, level, maxBoxes);

    setGrid(generateGrid(size));
    setPattern(newPattern);
    setSelected(new Set());
  }, [level]);

  const handleClick = (x, y) => {
    if (!gameActive) return;

    const cellId = `${x}-${y}`;
    if (!pattern.has(cellId)) {
      // Wrong click → Lose page
      setGameActive(false);
      navigate("/memory-game/lose", { state: { level } });
      return;
    }

    const newSelected = new Set(selected);
    newSelected.add(cellId);
    setSelected(newSelected);

    if (newSelected.size === pattern.size) {
      // Win this level
      if (level === 15) {
        setGameActive(false);
        navigate("/memory-game/win", { state: { level } });
      } else {
        setLevel(level + 1);
      }
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{
        gap: "10px",
        padding: "20px",
      }}
    >
      <h1 className="text-white text-2xl mb-4">Level {level}</h1>

      {/* Responsive grid */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          gap: "8px",
          width: "90vw",
          maxWidth: "600px",
        }}
      >
        {Array.from({ length: gridSize }).map((_, row) =>
          Array.from({ length: gridSize }).map((_, col) => {
            const cellId = `${row}-${col}`;
            const isSelected = selected.has(cellId);
            const isPattern = pattern.has(cellId);

            return (
              <div
                key={cellId}
                onClick={() => handleClick(row, col)}
                className={`cursor-pointer border rounded-lg ${
                  isSelected ? "bg-green-500" : "bg-gray-700"
                }`}
                style={{
                  aspectRatio: "1 / 1", 
                  transition: "0.3s",
                  opacity: isPattern && !isSelected ? 0.7 : 1,
                }}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
``