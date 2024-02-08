document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('game-board');
    const playButton = document.getElementById('play-button');
    const scoreDisplay = document.getElementById('score');
    const gameOver = document.getElementById('GameOver');
    // FOOTER
    const iconPlus = document.getElementById('iconPlus');
    const iconClose = document.getElementById('iconClose');
    const contact = document.getElementById('contact');
    // footer icon anim
    iconPlus.addEventListener('click', plusAnimation);
    iconClose.addEventListener('click', closeAnimation);

    function plusAnimation() {
        contact.style.visibility = "visible";
        iconPlus.style.display = "none";
        iconClose.style.display = "block";
        contact.classList.add("contact-plus");
    }
    function closeAnimation() {
        // Retirer la classe pour réinitialiser l'animation
        contact.classList.remove("contact-plus");

        // Récupérer la direction actuelle de l'animation
        var computedStyle = window.getComputedStyle(contact);
        var animationDirection = computedStyle.getPropertyValue('animation-direction');

        // Inverser la direction de l'animation
        if (animationDirection === 'normal') {
            contact.style.animationDirection = 'reverse'; // Inverser l'animation
        } else {
            contact.style.animationDirection = 'normal'; // Revenir à l'animation normale
        }

        // Ajouter la classe pour déclencher l'animation de fermeture
        // contact.classList.add("contact-close");
        contact.style.visibility = "hidden";
        iconPlus.style.display = "block";
        iconClose.style.display = "none";
    }



    // BODY
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

        const foodElement = document.createElement("div");
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
            score += 1;
            scoreDisplay.innerHTML = '<span>Score:</span>' + score;
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
        playButton.style.display = "block";
        score = 0;
        scoreDisplay.innerHTML = '<span>Score:</span>' + '0';
        gameInterval = setInterval(update, 100);
        gameOver.style.display = "none";
        pauseButton.style.display = "block";
    }

    let paused = false;

    function togglePause() {
        if (gameRunning) {
            if (paused) {
                resumeGame();
                pauseButton.innerHTML = `<span class="i-pause"><ion-icon
                name="pause" style="margin-top: 0.2em;"></ion-icon></span>`;

            } else {
                pauseGame();
                pauseButton.innerHTML = `<span class="i-play"><ion-icon
                name="play" style="margin-top: 0.2em;"></ion-icon></span>`;
            }
        }
    }

    function pauseGame() {
        clearInterval(gameInterval);
        paused = true;
    }

    function resumeGame() {
        gameInterval = setInterval(update, 100);
        paused = false;
    }

    // Ajoutez cette ligne pour écouter les événements de clic sur le bouton de pause
    const pauseButton = document.getElementById('pause-button');
    pauseButton.addEventListener('click', togglePause);

    function endGame() {
        gameRunning = false;
        clearInterval(gameInterval);
        playButton.disabled = false;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            highScoreDisplay.textContent = 'High Score: ' + highScore;
        }

        gameOver.style.display = "block";
        gameOver.innerHTML = `<section>
            <article>You are dead</article>
            <article>
                <span>Your Score :</span>
                <span>${score}</span>
            </article>
            <article>
            <button id="restart-button"><span class="i-over">&circlearrowright;</span><span>Restart</span></button>
                <button id="quit-button"><span class="i-over">&hookrightarrow;</span><span>Quitter</span></button>
            </article>
        </section>`

        // Ajouter un écouteur d'événements au bouton de redémarrage
        const restartButton = document.getElementById('restart-button');
        restartButton.addEventListener('click', startGame);
        // Ajouter un écouteur d'événements au bouton de redémarrage
        const quitButton = document.getElementById('quit-button');
        quitButton.addEventListener('click', function () {
            gameOver.style.display = "none";

        });

        pauseButton.style.display = "none";
        playButton.style.display = "block";

        setTimeout(() => {
            resetGame();
        }, 500);
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


    // for (let i = 1; i < initialSnakeSize; i++) {
    //     snake.push({ x: i * squareSize, y: 0 });
    // }

    generateFood();
    draw();
});
