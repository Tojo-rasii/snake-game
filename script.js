document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('game-board');
    const playButton = document.getElementById('play-button');
    const scoreDisplay = document.getElementById('score');
    const highScoreDisplay = document.getElementById('high-score');
    const gridSize = 20;
    const squareSize = 15;
    const initialSnakeSize = 5;

    let snake = [{ x: 0, y: 0 }];
    let food = { x: 0, y: 0 };
    let direction = 'right';
    let gameRunning = false;
    let gameInterval;
    let score = 0;
    let highScore = localStorage.getItem('highScore') || 0;

    function createSquare(element, className, size, position) {
        element.style.width = size + 'px';
        element.style.height = size + 'px';
        element.style.position = 'absolute';
        element.className = className;
        element.style.left = position.x + 'px';
        element.style.top = position.y + 'px';
        board.appendChild(element);
    }

    function draw() {
        board.innerHTML = '';
        snake.forEach(segment => {
            const snakeSegment = document.createElement('div');
            createSquare(snakeSegment, 'snake', squareSize, segment);
        });

        const foodElement = document.createElement('div');
        createSquare(foodElement, 'food', squareSize, food);
    }

    function update() {
        const head = Object.assign({}, snake[0]);

        switch (direction) {
            case 'up':
                head.y -= squareSize;
                break;
            case 'down':
                head.y += squareSize;
                break;
            case 'left':
                head.x -= squareSize;
                break;
            case 'right':
                head.x += squareSize;
                break;
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreDisplay.textContent = 'Score: ' + score;
            generateFood();
        } else {
            snake.pop();
        }

        if (checkCollision()) {
            endGame();
        }

        draw();
    }

    function generateFood() {
        const maxX = (board.clientWidth / squareSize) - 1;
        const maxY = (board.clientHeight / squareSize) - 1;

        food.x = Math.floor(Math.random() * maxX) * squareSize;
        food.y = Math.floor(Math.random() * maxY) * squareSize;

        // Make sure food is not generated on the snake
        if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
            generateFood();
        }
    }

    function checkCollision() {
        const head = snake[0];
        return (
            head.x < 0 ||
            head.x >= board.clientWidth ||
            head.y < 0 ||
            head.y >= board.clientHeight ||
            snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
        );
    }

    function startGame() {
        gameRunning = true;
        playButton.disabled = true;
        score = 0;
        scoreDisplay.textContent = 'Score: 0';
        gameInterval = setInterval(update, 100);
    }

    function endGame() {
        gameRunning = false;
        clearInterval(gameInterval);
        playButton.disabled = false;
         if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        highScoreDisplay.textContent = 'High Score: ' + highScore;
    }
        alert('Game Over! Your Score: ' + score);
        resetGame();
    }

    function resetGame() {
        snake = [{ x: 0, y: 0 }];
        direction = 'right';
        generateFood();
        draw();
    }

    function handleKeyPress(event) {
        if (!gameRunning) {
            return;
        }

        switch (event.key) {
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
        }
    }

    document.addEventListener('keydown', handleKeyPress);
    playButton.addEventListener('click', startGame);

    for (let i = 1; i < initialSnakeSize; i++) {
        snake.push({ x: i * squareSize, y: 0 });
    }

    generateFood();
    draw();
});
