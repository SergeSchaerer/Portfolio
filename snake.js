const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const resetButton = document.getElementById("resetButton");

canvas.width = 400;
canvas.height = 400;

const boxSize = 20;
let snake = [{ x: 200, y: 200 }];
let direction = "RIGHT";
let food = spawnFood();
let score = 0;
let gameRunning = true;

function moveSnake() {
    if (!gameRunning) return;

    let head = { ...snake[0] };

    if (direction === "UP") head.y -= boxSize;
    if (direction === "DOWN") head.y += boxSize;
    if (direction === "LEFT") head.x -= boxSize;
    if (direction === "RIGHT") head.x += boxSize;

    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height || snakeCollision(head)) {
        gameRunning = false; 
        return;
    }

    if (head.x === food.x && head.y === food.y) {
        score++;
        updateScore();
        food = spawnFood();
    } else {
        snake.pop();
    }

    snake.unshift(head);
}

function resetGame() {
    snake = [{ x: 200, y: 200 }];
    direction = "RIGHT";
    score = 0;
    updateScore();
    food = spawnFood();
    gameRunning = true; 
    gameLoop(); 
}

function updateScore() {
    scoreElement.textContent = score;
}

function drawGame() {
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, boxSize, boxSize);

    ctx.fillStyle = "black";
    snake.forEach(part => ctx.fillRect(part.x, part.y, boxSize, boxSize));
}

function snakeCollision(head) {
    return snake.slice(1).some(part => part.x === head.x && part.y === head.y);
}

function spawnFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
            y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize
        };
    } while (snake.some(part => part.x === newFood.x && part.y === newFood.y)); 

    return newFood;
}

document.addEventListener("keydown", (event) => {
    if (!gameRunning) return; 

    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

function gameLoop() {
    if (!gameRunning) return; 
    moveSnake();
    drawGame();
    setTimeout(gameLoop, 100);
}


resetButton.addEventListener("click", resetGame);

gameLoop();
