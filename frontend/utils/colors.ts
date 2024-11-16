export const colors = [
  "orange",
  "green",
  "red",
  "blue",
  "purple",
  "yellow",
  "white",
  "black",
  "gray",
];

export const colorOptions = colors.map((color) => ({
  value: color,
  label: `${color[0].toUpperCase()}${color.slice(1)}`,
}));
