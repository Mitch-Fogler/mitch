const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const boardSize = 600;
const cellSize = 20;
const cells = boardSize / cellSize;

const player = {
  x: 5,
  y: 5,
  dir: 'right',
  color: 'lime',
  trail: [],
  territory: new Set(),
};

function posKey(x, y) {
  return `${x},${y}`;
}

function drawBoard() {
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, boardSize, boardSize);

  // draw territory
  ctx.fillStyle = player.color;
  player.territory.forEach(key => {
    const [x, y] = key.split(',').map(Number);
    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  });

  // draw trail
  ctx.fillStyle = 'yellow';
  player.trail.forEach(p => {
    ctx.fillRect(p.x * cellSize, p.y * cellSize, cellSize, cellSize);
  });

  // draw player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x * cellSize, player.y * cellSize, cellSize, cellSize);
}

function movePlayer() {
  switch (player.dir) {
    case 'up':
      player.y -= 1; break;
    case 'down':
      player.y += 1; break;
    case 'left':
      player.x -= 1; break;
    case 'right':
      player.x += 1; break;
  }

  wrapPlayer();
  addTrail();
}

function wrapPlayer() {
  if (player.x < 0) player.x = cells - 1;
  if (player.x >= cells) player.x = 0;
  if (player.y < 0) player.y = cells - 1;
  if (player.y >= cells) player.y = 0;
}

function addTrail() {
  const key = posKey(player.x, player.y);
  if (!player.territory.has(key)) {
    player.trail.push({ x: player.x, y: player.y });
    if (player.trail.some(p => p.x === player.startX && p.y === player.startY)) {
      captureArea();
    }
  }
}

function captureArea() {
  player.trail.forEach(p => {
    const key = posKey(p.x, p.y);
    player.territory.add(key);
  });
  player.trail = [];
}

function handleKey(e) {
  switch (e.key) {
    case 'ArrowUp': player.dir = 'up'; break;
    case 'ArrowDown': player.dir = 'down'; break;
    case 'ArrowLeft': player.dir = 'left'; break;
    case 'ArrowRight': player.dir = 'right'; break;
  }
}

function gameLoop() {
  movePlayer();
  drawBoard();
  requestAnimationFrame(gameLoop);
}

function startGame() {
  document.addEventListener('keydown', handleKey);
  player.startX = player.x;
  player.startY = player.y;
  player.territory.add(posKey(player.x, player.y));
  gameLoop();
}

startGame();
