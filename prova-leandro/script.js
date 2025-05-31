const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const background = new Image();
background.src = './assets/background.png';

const paddle = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 30,
    width: 100,
    height: 20,
    speed: 7,
    dx: 0
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 15,
    speed: 5,
    dx: 5,
    dy: -5
};

let bgX = 0;
const bgSpeed = 0.5;

let score = 0;
const maxScore = 3;
let gameOver = false;

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

function keyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'd') {
        paddle.dx = paddle.speed;
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        paddle.dx = -paddle.speed;
    }
}

function keyUp(e) {
    if (
        e.key === 'ArrowRight' ||
        e.key === 'ArrowLeft' ||
        e.key === 'd' ||
        e.key === 'a'
    ) {
        paddle.dx = 0;
    }
}

function movePaddle() {
    paddle.x += paddle.dx;

    if (paddle.x < 0) {
        paddle.x = 0;
    } else if (paddle.x + paddle.width > canvas.width) {
        paddle.x = canvas.width - paddle.width;
    }
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
        ball.dx *= -1;
    }

    if (ball.y - ball.size < 0) {
        ball.dy *= -1;
    }

    if (
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width &&
        ball.y + ball.size > paddle.y &&
        ball.y - ball.size < paddle.y + paddle.height
    ) {
        ball.dy *= -1;
    }

    if (ball.y + ball.size > canvas.height) {
        score++;
        if (score >= maxScore) {
            endGame();
        } else {
            resetBall();
        }
    }
}

function drawBackground() {
    bgX -= bgSpeed;
    if (bgX <= -canvas.width) {
        bgX = 0;
    }
    ctx.drawImage(background, bgX, 0, canvas.width, canvas.height);
    ctx.drawImage(background, bgX + canvas.width, 0, canvas.width, canvas.height);
}


function drawPaddle() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText(`Placar: ${score}`, 10, 20);
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = 5 * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = -5;
}

function endGame() {
    gameOver = true;
    document.getElementById('gameOver').classList.remove('hidden');
    document.getElementById('scoreFinal').innerText = score;
}

function restartGame() {
    score = 0;
    gameOver = false;
    resetBall();
    document.getElementById('gameOver').classList.add('hidden');
    requestAnimationFrame(update);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawPaddle();
    drawBall();
    drawScore();
}

function update() {
    if (!gameOver) {
        movePaddle();
        moveBall();
        draw();
        requestAnimationFrame(update);
    }
}

update();
