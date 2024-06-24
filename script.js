const canvas = document.getElementById("main");
const ctx = canvas.getContext("2d");
const _unitSize = 1;

function drawPixel(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * _unitSize, y * _unitSize, _unitSize, _unitSize);
}
