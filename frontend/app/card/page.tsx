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
      <div>Cost: 0.001 ETH</div>
      <button>mint</button>
    </div>
  );
}
