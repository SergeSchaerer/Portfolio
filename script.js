const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;

const boxSize = 20;
let snake = [{ x: 200, y: 200 }];
let direction = "RIGHT";
let food = spawnFood();
let score = 0;

// Bewegt die Schlange
function moveSnake() {
    let head = { ...snake[0] };

    if (direction === "UP") head.y -= boxSize;
    if (direction === "DOWN") head.y += boxSize;
    if (direction === "LEFT") head.x -= boxSize;
    if (direction === "RIGHT") head.x += boxSize;

    // Kollision mit Essen
    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById("score").textContent = score;
        food = spawnFood();
    } else {
        snake.pop();
    }

    // Kollision mit Wand oder sich selbst -> Spiel zurücksetzen (ohne Pop-up)
    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height || snakeCollision(head)) {
        resetGame();
        return;
    }

    snake.unshift(head);
}

// Zeichnet das Spielfeld
function drawGame() {
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, boxSize, boxSize);

    ctx.fillStyle = "black";
    snake.forEach(part => ctx.fillRect(part.x, part.y, boxSize, boxSize));
}

// Prüft Kollision mit der eigenen Schlange
function snakeCollision(head) {
    return snake.some(part => part.x === head.x && part.y === head.y);
}

// Generiert zufälliges Essen
function spawnFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
        y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize
    };
}

// Setzt das Spiel zurück (ohne Pop-up)
function resetGame() {
    snake = [{ x: 200, y: 200 }];
    direction = "RIGHT";
    score = 0;
    document.getElementById("score").textContent = score;
    food = spawnFood();
}

// Tastensteuerung
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// Spiel-Loop
function gameLoop() {
    moveSnake();
    drawGame();
    setTimeout(gameLoop, 100);
}

gameLoop();
