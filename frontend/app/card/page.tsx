"use client";

import { useState } from "react";

const colors = [
  "red",
  "green",
  "blue",
  "yellow",
  "orange",
  "purple",
  "white",
  "black",
  "gray",
];

export default function Card() {
  const [color, setColor] = useState("");
  return (
    <div>
      <div>Choose the color for your car</div>
      <select
        value={color}
        onChange={(e) => {
          setColor(e.target.value);
        }}
      >
        {colors.map((colorItem) => (
          <option key={colorItem} value={colorItem}>
            {colorItem}
          </option>
        ))}
      </select>
      {/* 0.01 ETH ~30usd */}
      {/* profit for winning a track will be 0.002eth = ~6usd */}
      <div>Cost: 0.01 ETH</div>
      <button>mint</button>
    </div>
  );
}
