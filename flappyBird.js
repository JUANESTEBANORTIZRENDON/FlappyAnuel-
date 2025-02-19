// Obtener el elemento "canvas" desde el HTML y su contexto 2D para dibujar
var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

// 🎯 Ajuste responsive SOLO para móviles
function ajustarCanvas() {
    if (window.innerWidth <= 768) { // 📱 Solo para pantallas móviles
        cvs.width = window.innerWidth;
        cvs.height = window.innerHeight;
    } else {
        // ⚡ Dimensiones originales en PC
        cvs.width = 288;
        cvs.height = 512;
    }
}
ajustarCanvas();
window.addEventListener('resize', ajustarCanvas);

// Cargar imágenes del juego
var bird = new Image();
var bg = new Image();
var fg = new Image();
var pipeNorth = new Image();
var pipeSouth = new Image();

bird.src = "images/bird.png";
bg.src = "images/bg.png";
fg.src = "images/fg.png";
pipeNorth.src = "images/pipeNorth.png";
pipeSouth.src = "images/pipeSouth.png";

// Variables del juego
var gap = 85;
var constant;

var bX = 10;
var bY = 150;
var gravity = 1.5;
var score = 0;

// Cargar sonidos
var fly = new Audio();
var scor = new Audio();

fly.src = "sounds/fly.mp3";
scor.src = "sounds/score.mp3";

// 🎮 Eventos para salto
document.addEventListener("keydown", moveUp);
document.addEventListener("touchstart", moveUp);

function moveUp() {
    bY -= 25;
    fly.play();
}

// Array para tubos
var pipe = [];
pipe[0] = {
    x: cvs.width,
    y: 0
};

var gameOver = false;

// 🏃 Dibujo principal
function draw() {
    if (gameOver) return;

    ctx.clearRect(0, 0, cvs.width, cvs.height);

    ctx.drawImage(bg, 0, 0, cvs.width, cvs.height);

    for (var i = 0; i < pipe.length; i++) {
        constant = pipeNorth.height + gap;
        ctx.drawImage(pipeNorth, pipe[i].x, pipe[i].y);
        ctx.drawImage(pipeSouth, pipe[i].x, pipe[i].y + constant);

        pipe[i].x--;

        if (pipe[i].x === 125) {
            pipe.push({
                x: cvs.width,
                y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height
            });
        }

        if (
            bX + bird.width >= pipe[i].x &&
            bX <= pipe[i].x + pipeNorth.width &&
            (bY <= pipe[i].y + pipeNorth.height ||
                bY + bird.height >= pipe[i].y + constant) ||
            bY + bird.height >= cvs.height - fg.height
        ) {
            gameOver = true;
            setTimeout(() => location.reload(), 1000);
        }

        if (pipe[i].x === 5) {
            score++;
            scor.play();
        }
    }

    ctx.drawImage(fg, 0, cvs.height - fg.height, cvs.width, fg.height);
    ctx.drawImage(bird, bX, bY);

    bY += gravity;

    if (bY >= cvs.height - fg.height - bird.height) {
        bY = cvs.height - fg.height - bird.height;
    }

    ctx.fillStyle = "#000";
    ctx.font = "20px Verdana";
    ctx.fillText("Score : " + score, 10, cvs.height - 20);

    if (!gameOver) requestAnimationFrame(draw);
}

// 🚀 Iniciar el juego
draw();














































