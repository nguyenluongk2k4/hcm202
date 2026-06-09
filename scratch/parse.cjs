const fs = require('fs');

const content = fs.readFileSync('src/assets/lotus_svg.svg', 'utf8');

let paths = [];
const regex = /<path d="([^"]+)"/g;
let match;
while ((match = regex.exec(content)) !== null) {
  paths.push(match[1]);
}

let firstPath = paths[0];
firstPath = firstPath.replace(/M0 6270 l0 -6270 6270 0 6270 0 0 6270 0 6270 -6270 0 -6270 0 0[\r\n\s]*-6270z m6304 4883/, 'M6304 11153');
paths[0] = firstPath;

const componentCode = `
import React from 'react';

export default function LotusPaths({ drawPhase, won, bloomPhase }) {
  const isDrawing = drawPhase > 0 && drawPhase < 1;
  const strokeOffset = 100 - Math.min(1, Math.max(0, drawPhase)) * 100;
  
  const colors = [
    '#38bdf8', '#34d399', '#fde047', '#f472b6', '#c084fc', 
    '#fb923c', '#a7f3d0', '#93c5fd', '#fcd34d', '#fda4af'
  ];

  return (
    <g transform="translate(103, 376) scale(0.025, -0.025)" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={won ? Math.max(0, 1 - bloomPhase * 2) : 0.85}>
      
      {/* Lớp nền phát sáng mạnh (Outer Glow) */}
      <g strokeWidth={isDrawing ? 150 : 80} filter="url(#cultureUltraGlow)" opacity={0.75}>
        ${paths.map((p, i) => `
        <path
          d="${p}"
          stroke={colors[${i} % colors.length]}
          pathLength="100"
          strokeDasharray="100"
          strokeDashoffset={strokeOffset}
          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
        />`).join('')}
      </g>
      
      {/* Lớp lõi ánh sáng trắng (Inner Core) */}
      <g strokeWidth={isDrawing ? 35 : 18} stroke="#ffffff" filter="url(#cultureGlow)" opacity={0.85}>
        ${paths.map((p, i) => `
        <path
          d="${p}"
          pathLength="100"
          strokeDasharray="100"
          strokeDashoffset={strokeOffset}
          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
        />`).join('')}
      </g>

    </g>
  );
}
`;

fs.writeFileSync('src/components/minigames/LotusPaths.jsx', componentCode);
console.log("Updated LotusPaths.jsx to reduce brightness!");
