import { initAuth, login, saveScore, fetchHighScores } from "./App.js";

// Selección de elementos del DOM
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

let score = 0;
let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
let highScoresFetched = false;

// Inicializa el juego y la autenticación al cargar
window.onload = () => {
  initAuth();
  fetchHighScores();
  setInterval(() => {
    if (direction.x !== 0 || direction.y !== 0) {
      update();
      draw();
    }
  }, 100);
};

// Dibuja el estado actual del juego
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  snake.forEach(segment => {
    ctx.fillStyle = 'green';
    ctx.fillRect(segment.x * 20, segment.y * 20, 20, 20);
  });
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * 20, food.y * 20, 20, 20);
}

// Actualiza la lógica del juego
function update() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreDisplay.innerText = score;
    food = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
  } else {
    snake.pop();
  }
  if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 || snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
    showGameOverScreen();
  }
}

// Muestra la pantalla de Game Over y guarda automáticamente el puntaje
function showGameOverScreen() {
  if (highScoresFetched) return;
  highScoresFetched = true;

  const gameOverScreen = document.createElement("div");
  gameOverScreen.id = "gameOverScreen";
  gameOverScreen.className = "overlay text-center bg-dark text-white p-5";
  gameOverScreen.innerHTML = `
    <h2>Game Over</h2>
    <button class="btn btn-primary" onclick="resetGame()">Jugar de Nuevo</button>
    <h3>High Scores</h3>
    <ul id="highScoresList" class="list-group mb-4"></ul>
  `;
  document.body.appendChild(gameOverScreen);

  saveScore(score); // Guarda automáticamente el puntaje al finalizar
  fetchHighScores(); // Muestra los high scores actualizados
}

// Reinicia el juego
function resetGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  score = 0;
  scoreDisplay.innerText = score;
  document.getElementById("gameOverScreen")?.remove();
  highScoresFetched = false;
}

// Control de dirección
document.addEventListener('keydown', event => {
  switch (event.key) {
    case 'ArrowUp': direction = { x: 0, y: -1 }; break;
    case 'ArrowDown': direction = { x: 0, y: 1 }; break;
    case 'ArrowLeft': direction = { x: -1, y: 0 }; break;
    case 'ArrowRight': direction = { x: 1, y: 0 }; break;
  }
});
