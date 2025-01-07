import React, { useEffect, useState } from "react";

interface ProceduralBackgroundProps {
  type: "paint" | "gradient" | "none";
}

const ProceduralBackground: React.FC<ProceduralBackgroundProps> = ({ type }) => {
  const colors = ["#ff6347", "#4682b4", "#ffd700", "#6a5acd"];
  const [seed, setSeed] = useState(Math.random());

  useEffect(() => {
    setSeed(Math.random());
  }, []);

  const seededRandom = (seed: number) => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  if (type === "paint") {
    return (
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      >
        {Array.from({ length: 50 }).map((_, i) => (
          <circle
            key={i}
            cx={`${seededRandom(seed + i) * 100}%`}
            cy={`${seededRandom(seed + i + 50) * 100}%`}
            r={seededRandom(seed + i + 100) * 50}
            fill={colors[Math.floor(seededRandom(seed + i + 150) * colors.length)]}
            opacity={0.5}
          />
        ))}
      </svg>
    );
  }

  if (type === "gradient") {
    return (
      <div className="w-full h-full absolute" style={{
        background: `linear-gradient(45deg, ${colors[Math.floor(seededRandom(seed + 300) * colors.length)]}, ${colors[Math.floor(seededRandom(seed + 301) * colors.length)]})`
      }}></div>
    );
  }

  return null;
};

export default ProceduralBackground;
