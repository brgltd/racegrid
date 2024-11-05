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
  return (
    <div>
      <div>Choose the color for your car</div>
      <select>
        {colors.map((color) => (
          <option key={color} value={color}>
            {color}
          </option>
        ))}
      </select>
      {/* 0.01 ETH ~30usd */}
      {/* profit for winnint a track will be 0.002eth =  */}
      <div>Cost: 0.01 ETH</div>
      <button>mint</button>
    </div>
  );
}
