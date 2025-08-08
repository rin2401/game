const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Paddle settings
const PADDLE_WIDTH = 16;
const PADDLE_HEIGHT = 100;
const PADDLE_MARGIN = 24;
const PADDLE_SPEED = 6;

// Ball settings
const BALL_SIZE = 16;
const BALL_SPEED = 6;

// Score
let playerScore = 0;
let aiScore = 0;

// Paddle positions
let playerY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
let aiY = HEIGHT / 2 - PADDLE_HEIGHT / 2;

// Ball position and velocity
let ballX = WIDTH / 2 - BALL_SIZE / 2;
let ballY = HEIGHT / 2 - BALL_SIZE / 2;
let ballVX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
let ballVY = BALL_SPEED * (Math.random() * 2 - 1);

// Mouse control for player paddle
canvas.addEventListener('mousemove', function (evt) {
  const rect = canvas.getBoundingClientRect();
  let mouseY = evt.clientY - rect.top;
  playerY = mouseY - PADDLE_HEIGHT / 2;

  // Clamp paddle within canvas
  playerY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, playerY));
});

// Game loop
function update() {
  // Move ball
  ballX += ballVX;
  ballY += ballVY;

  // Ball collision with top/bottom
  if (ballY <= 0) {
    ballY = 0;
    ballVY = -ballVY;
  }
  if (ballY + BALL_SIZE >= HEIGHT) {
    ballY = HEIGHT - BALL_SIZE;
    ballVY = -ballVY;
  }

  // Ball collision with player paddle
  if (
    ballX <= PADDLE_MARGIN + PADDLE_WIDTH &&
    ballY + BALL_SIZE > playerY &&
    ballY < playerY + PADDLE_HEIGHT
  ) {
    ballX = PADDLE_MARGIN + PADDLE_WIDTH;
    ballVX = -ballVX;
    // Add some randomness
    ballVY += (Math.random() - 0.5) * 2;
  }

  // Ball collision with AI paddle
  if (
    ballX + BALL_SIZE >= WIDTH - PADDLE_MARGIN - PADDLE_WIDTH &&
    ballY + BALL_SIZE > aiY &&
    ballY < aiY + PADDLE_HEIGHT
  ) {
    ballX = WIDTH - PADDLE_MARGIN - PADDLE_WIDTH - BALL_SIZE;
    ballVX = -ballVX;
    // Add some randomness
    ballVY += (Math.random() - 0.5) * 2;
  }

  // Score for AI
  if (ballX < 0) {
    aiScore++;
    resetBall(-1);
  }

  // Score for player
  if (ballX + BALL_SIZE > WIDTH) {
    playerScore++;
    resetBall(1);
  }

  // Simple AI: move paddle towards ball
  if (aiY + PADDLE_HEIGHT / 2 < ballY + BALL_SIZE / 2) {
    aiY += PADDLE_SPEED;
  } else {
    aiY -= PADDLE_SPEED;
  }
  // Clamp AI paddle
  aiY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, aiY));
}

function resetBall(direction) {
  ballX = WIDTH / 2 - BALL_SIZE / 2;
  ballY = HEIGHT / 2 - BALL_SIZE / 2;
  ballVX = BALL_SPEED * direction;
  ballVY = BALL_SPEED * (Math.random() * 2 - 1);
}

function draw() {
  // Clear
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Draw middle line
  ctx.strokeStyle = "#444";
  ctx.setLineDash([16, 16]);
  ctx.beginPath();
  ctx.moveTo(WIDTH / 2, 0);
  ctx.lineTo(WIDTH / 2, HEIGHT);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw paddles
  ctx.fillStyle = "#fff";
  ctx.fillRect(PADDLE_MARGIN, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
  ctx.fillRect(WIDTH - PADDLE_MARGIN - PADDLE_WIDTH, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

  // Draw ball
  ctx.beginPath();
  ctx.arc(ballX + BALL_SIZE / 2, ballY + BALL_SIZE / 2, BALL_SIZE / 2, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();

  // Draw scores (handled by HTML)
  document.getElementById('player-score').textContent = playerScore;
  document.getElementById('ai-score').textContent = aiScore;
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();