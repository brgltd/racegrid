export const colors = [
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

export const colorOptions = colors.map((color) => ({
  value: color,
  label: `${color[0].toUpperCase()}${color.slice(1)}`,
}));
