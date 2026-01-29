/*
  Snake Game
  Developed by Ashutosh Tripathi
  Year: 2026
*/

// ================== GAME STATE ==================
let isPaused = false;
let isGameOver = false;

let score = 0;
let speed = 200;
let direction = 1; // right

let snake = [42, 41, 40];
let foodIndex;

let gameInterval;

// ================== SOUNDS ==================
const eatSound = new Audio("sounds/eat.mp3");
const gameOverSound = new Audio("sounds/gameover.mp3");

// ================== DOM ==================
const board = document.getElementById("game-board");
const scoreDisplay = document.getElementById("score");
const pauseBtn = document.getElementById("pauseBtn");
pauseBtn.addEventListener("click", togglePause);
const cells = [];

// ================== CREATE GRID ==================
for (var i = 0; i < 400; i++) {
    const cell = document.createElement("div");
    board.appendChild(cell);
    cells.push(cell);
}

// ================== INITIAL DRAW ==================
snake.forEach(i => cells[i].classList.add("snake"));
generateFood();

// ================== GAME LOOP ==================
gameInterval = setInterval(moveSnake, speed);

// ================== FUNCTIONS ==================
function togglePause() {
    if (isGameOver) return;

    if (!isPaused) {
        clearInterval(gameInterval);
        isPaused = true;
    } else {
        gameInterval = setInterval(moveSnake, speed);
        isPaused = false;
    }
}

function generateFood() {
    do {
        foodIndex = Math.floor(Math.random() * 400);
    } while (snake.includes(foodIndex));

    cells[foodIndex].classList.add("food");
}

function gameOver(message) {
    clearInterval(gameInterval);
    isGameOver = true;
    gameOverSound.currentTime = 0;
    gameOverSound.play();

    setTimeout(() => {
        alert(message + "\nCreated by Ashutosh Tripathi");
    }, 100);
}

function moveSnake() {
    if (isPaused || isGameOver) return;

    // WALL COLLISION
    if (
        (snake[0] % 20 === 0 && direction === -1) ||
        (snake[0] % 20 === 19 && direction === 1) ||
        (snake[0] - 20 < 0 && direction === -20) ||
        (snake[0] + 20 >= 400 && direction === 20)
    ) {
        gameOver("Game Over 💀");
        return;
    }

    const nextHead = snake[0] + direction;

    // SELF COLLISION
    if (snake.includes(nextHead)) {
        gameOver("Game Over 💀 You hit yourself!");
        return;
    }

    snake.unshift(nextHead);

    // FOOD
    if (nextHead === foodIndex) {
        eatSound.currentTime = 0;
        eatSound.play();

        score++;
        scoreDisplay.textContent = score;

        if (speed > 60) {
            speed -= 10;
            clearInterval(gameInterval);
            gameInterval = setInterval(moveSnake, speed);
        }

        cells[foodIndex].classList.remove("food");
        generateFood();
    } else {
        snake.pop();
    }

    // REDRAW
    cells.forEach(cell => (cell.className = ""));
    snake.forEach(i => cells[i].classList.add("snake"));
    cells[foodIndex].classList.add("food");
}

// ================== CONTROLS ==================
document.addEventListener("keydown", function (e) {
    if (e.key === " ") togglePause();

    if (e.key === "ArrowRight" && direction !== -1) direction = 1;
    if (e.key === "ArrowLeft" && direction !== 1) direction = -1;
    if (e.key === "ArrowDown" && direction !== -20) direction = 20;
    if (e.key === "ArrowUp" && direction !== 20) direction = -20;
});

// ================== RESTART ==================
document.getElementById("restart").addEventListener("click", () => {
    location.reload();
});

// ================== MOBILE CONTROLS ==================
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener("touchstart", e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener("touchend", e => {
    const diffX = e.changedTouches[0].clientX - touchStartX;
    const diffY = e.changedTouches[0].clientY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0 && direction !== -1) direction = 1;
        if (diffX < 0 && direction !== 1) direction = -1;
    } else {
        if (diffY > 0 && direction !== -20) direction = 20;
        if (diffY < 0 && direction !== 20) direction = -20;
    }
});

document.addEventListener(
    "touchmove",
    e => e.preventDefault(),
    { passive: false }
);
