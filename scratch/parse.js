const fs = require('fs');

const content = fs.readFileSync('src/assets/lotus_svg.svg', 'utf8');

let paths = [];
const regex = /<path d="([^"]+)"/g;
let match;
while ((match = regex.exec(content)) !== null) {
  paths.push(match[1]);
}

// Remove the bounding box from the first path
let firstPath = paths[0];
const bbox = "M0 6270 l0 -6270 6270 0 6270 0 0 6270 0 6270 -6270 0 -6270 0 0 -6270z ";
if (firstPath.startsWith(bbox)) {
  // SVG 'm' relative to (0,0) is equivalent to 'M'. The bounding box ends at (0,0).
  // Wait, M0 6270 l0 -6270 -> (0,0), then 6270 0 -> (6270,0), etc. Ends at z -> (0,6270).
  // If we remove the bbox, the next command is 'm6304 4883'.
  // We need to convert 'm' to 'M' and add 0, 6270 to it? No, 'm' is relative to the previous point, which is (0,6270) after 'z'.
  // So 'm6304 4883' means X = 0 + 6304 = 6304. Y = 6270 + 4883 = 11153.
  // Let's replace the bbox and 'm6304 4883' with 'M6304 11153'
  firstPath = firstPath.replace(bbox + 'm6304 4883', 'M6304 11153');
  paths[0] = firstPath;
}

// Output a React Component
const componentCode = `
import React from 'react';

export default function LotusPaths({ drawPhase, won, bloomPhase }) {
  // We will animate strokeDashoffset. We don't know the exact path length without getBBox or getTotalLength,
  // but we can use pathLength="100" in SVG!
  
  const strokeOpacity = drawPhase > 0 ? 1 - bloomPhase * 0.62 : 0;
  const isDrawing = drawPhase > 0 && drawPhase < 1;
  const strokeOffset = 100 - drawPhase * 100;
  
  return (
    <g transform="translate(100, 28) scale(0.026, -0.026)" fill="none" stroke="#38bdf8" strokeWidth={isDrawing ? 40 : 20} strokeLinecap="round" strokeLinejoin="round" opacity={won ? Math.max(0, 1 - bloomPhase * 2) : 0.85} filter="url(#cultureGlow)">
      ${paths.map((p, i) => `
        <path
          d="${p}"
          pathLength="100"
          strokeDasharray="100"
          strokeDashoffset={strokeOffset}
        />
      `).join('')}
    </g>
  );
}
`;

fs.writeFileSync('src/components/minigames/LotusPaths.jsx', componentCode);
console.log("Created LotusPaths.jsx!");
