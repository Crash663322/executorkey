// Neon Runner Game

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Resize canvas to fill window
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// UI Elements
automaticBindUI();

let gameState = "menu"; // menu | playing | gameover
let obstacles = [];
let score = 0;
let highscore = +localStorage.getItem("highscore") || 0;
let lastSpawn = 0;
let spawnRate = 1500; // ms
const gravity = 0.6;
const groundY = () => canvas.height * 0.8;

class Player {
  constructor() {
    this.reset();
  }
  reset() {
    this.w = 50;
    this.h = 50;
    this.x = canvas.width * 0.1;
    this.y = groundY() - this.h;
    this.vy = 0;
    this.color = "#00eaff";
    this.jumpForce = -15;
    this.isGrounded = true;
  }
  update() {
    this.vy += gravity;
    this.y += this.vy;

    if (this.y + this.h >= groundY()) {
      this.y = groundY() - this.h;
      this.vy = 0;
      this.isGrounded = true;
    }
  }
  jump() {
    if (this.isGrounded) {
      this.vy = this.jumpForce;
      this.isGrounded = false;
    }
  }
  render() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}

class Obstacle {
  constructor() {
    this.h = 50 + Math.random() * 40;
    this.w = 20 + Math.random() * 30;
    this.x = canvas.width + this.w;
    this.y = groundY() - this.h;
    this.speed = 8;
    this.color = "#ff007a";
  }
  update() {
    this.x -= this.speed;
  }
  isOffscreen() {
    return this.x + this.w < 0;
  }
  render() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}

const player = new Player();

function automaticBindUI() {
  const $ = (id) => document.getElementById(id);
  const startBtn = $("startBtn");
  const restartBtn = $("restartBtn");
  const menu = $("menu");
  const hud = $("hud");
  const gameover = $("gameover");
  const scoreLbl = $("score");
  const highLbl = $("highscore");
  const finalScore = $("finalScore");

  highLbl.textContent = `Rekor: ${highscore}`;

  startBtn.addEventListener("click", () => beginGame());
  restartBtn.addEventListener("click", () => beginGame());
  window.addEventListener("keydown", (e) => {
    if (e.code === "Space" || e.code === "ArrowUp") {
      if (gameState === "playing") player.jump();
      else if (gameState === "gameover") beginGame();
    }
  });
  canvas.addEventListener("pointerdown", () => {
    if (gameState === "playing") player.jump();
    else if (gameState === "gameover") beginGame();
  });

  function beginGame() {
    gameState = "playing";
    menu.classList.add("hidden");
    gameover.classList.add("hidden");
    hud.classList.remove("hidden");

    obstacles = [];
    score = 0;
    lastSpawn = performance.now();
    player.reset();
  }

  function endGame() {
    gameState = "gameover";
    finalScore.textContent = score;
    hud.classList.add("hidden");
    gameover.classList.remove("hidden");
    if (score > highscore) {
      highscore = score;
      localStorage.setItem("highscore", highscore);
    }
    highLbl.textContent = `Rekor: ${highscore}`;
  }

  function gameLoop(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ground line
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.beginPath();
    ctx.moveTo(0, groundY());
    ctx.lineTo(canvas.width, groundY());
    ctx.stroke();

    if (gameState === "playing") {
      // Update player
      player.update();
      player.render();

      // Spawn obstacles
      if (timestamp - lastSpawn > spawnRate) {
        obstacles.push(new Obstacle());
        lastSpawn = timestamp;
        // Dynamic difficulty
        if (spawnRate > 700) spawnRate -= 20;
      }

      // Update obstacles
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.update();
        obs.render();
        if (obs.isOffscreen()) obstacles.splice(i, 1);

        // Collision detection
        if (
          player.x < obs.x + obs.w &&
          player.x + player.w > obs.x &&
          player.y < obs.y + obs.h &&
          player.y + player.h > obs.y
        ) {
          endGame();
        }
      }

      // Update score
      score += 1;
      scoreLbl.textContent = score;
    } else if (gameState === "gameover") {
      player.render();
      obstacles.forEach((o) => o.render());
    }

    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
}