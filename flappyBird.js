// Obtener el elemento "canvas" desde el HTML y su contexto 2D para dibujar
var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

// 🎯 Ajuste responsive SOLO para móviles
function ajustarCanvas() {
    if (window.innerWidth <= 768) { // 📱 Solo para pantallas móviles
        let aspectRatio = 288 / 512;
        if (window.innerWidth / window.innerHeight > aspectRatio) {
            cvs.height = window.innerHeight;
            cvs.width = window.innerHeight * aspectRatio;
        } else {
            cvs.width = window.innerWidth;
            cvs.height = window.innerWidth / aspectRatio;
        }
    } else {
        // ⚡ Dimensiones originales en PC
        cvs.width = 288;
        cvs.height = 512;
    }
}
ajustarCanvas();
window.addEventListener('resize', () => {
    ajustarCanvas();
    reiniciarJuego(); // 🔄 Reajuste completo al redimensionar
});

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
var gap;
var bX;
var bY;
var gravity = 1.5;
var score = 0;
var pipe = [];
var gameOver = false;

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

// 🔧 💡 Generar altura aleatoria del tubo superior con límites
function generarAlturaAleatoria() {
    let alturaMaxima = cvs.height - fg.height - gap - pipeNorth.height;
    return Math.floor(Math.random() * alturaMaxima) - pipeNorth.height / 2;
}

// 🛠️ Inicializar o reiniciar el juego
function reiniciarJuego() {
    gap = cvs.height * 0.2;       // Proporcional al alto
    bX = cvs.width * 0.1;         // Posición inicial del pájaro
    bY = cvs.height / 2;          // Centro vertical
    score = 0;
    pipe = [{
        x: cvs.width,
        y: generarAlturaAleatoria() // ✅ Primer tubo corregido
    }];
    gameOver = false;
    draw();
}

// 🏃 Dibujo principal
function draw() {
    if (gameOver) return;

    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.drawImage(bg, 0, 0, cvs.width, cvs.height);

    for (var i = 0; i < pipe.length; i++) {
        let constant = pipeNorth.height + gap;

        ctx.drawImage(pipeNorth, pipe[i].x, pipe[i].y);
        ctx.drawImage(pipeSouth, pipe[i].x, pipe[i].y + constant);

        pipe[i].x--;

        if (pipe[i].x === Math.floor(cvs.width / 2)) {
            pipe.push({
                x: cvs.width,
                y: generarAlturaAleatoria() // ✅ Altura ajustada y controlada
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
            setTimeout(() => reiniciarJuego(), 1000);
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
reiniciarJuego();













































