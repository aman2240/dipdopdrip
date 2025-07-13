// /src/utils/colorMap.js

// Map of color names to their respective HEX codes
const colorMap = {
  White: '#FFFFFF',
  Black: '#000000',
  'Navy Blue': '#000080',
  'Grey Melange': '#B2BEB5',
  'Bottle Green': '#006A4E',
  'Royal Blue': '#4169E1',
  Red: '#FF0000',
  Maroon: '#800000',
  Purple: '#800080',
  'Petrol Blue': '#005F6A',
  'Olive Green': '#708238',
  'Mustard Yellow': '#FFDB58',
  'Light Baby Pink': '#FFB6C1',
  Lavender: '#E6E6FA',
  Coral: '#FF7F50',
  Mint: '#98FF98',
  'Baby Blue': '#89CFF0',
  'Off White': '#F8F8F8',
};

// Utility to get the hex code from a given color name (case-insensitive)
export function getHexColor(colorName) {
  if (!colorName) return '#CCCCCC'; // default fallback
  const normalized = colorName.trim().replace(/\s+/g, ' ').toLowerCase();
  const match = Object.keys(colorMap).find(
    (key) => key.toLowerCase() === normalized
  );
  return colorMap[match] || '#CCCCCC'; // fallback if not found
}

export default colorMap;
