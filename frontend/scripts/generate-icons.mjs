// Script to generate PNG icons from a canvas drawing using node-canvas
// Run: node scripts/generate-icons.mjs
import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';

function drawIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const radius = size * 0.15;

  // Background
  ctx.fillStyle = '#0F5C3A';
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.arcTo(size, 0, size, size, radius);
  ctx.arcTo(size, size, 0, size, radius);
  ctx.arcTo(0, size, 0, 0, radius);
  ctx.arcTo(0, 0, size, 0, radius);
  ctx.closePath();
  ctx.fill();

  // Text
  ctx.fillStyle = 'white';
  ctx.font = `bold ${Math.floor(size * 0.45)}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SC', size / 2, size / 2 + size * 0.03);

  return canvas.toBuffer('image/png');
}

writeFileSync('public/icons/icon-192.png', drawIcon(192));
writeFileSync('public/icons/icon-512.png', drawIcon(512));
console.log('Icons generated successfully.');
