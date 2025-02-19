// 🎨 Obtener el elemento "canvas" y su contexto
var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

// 🎯 Ajuste responsive: Canvas dinámico para PC y móviles
function ajustarCanvas() {
    const proporcionesOriginales = 512 / 288; // 🏃 Relación original alto/ancho
    const anchoPantalla = window.innerWidth;
    const altoPantalla = window.innerHeight;

    if (anchoPantalla <= 768) { // 📱 Móviles
        cvs.width = anchoPantalla * 0.95;  // 📏 95% del ancho del dispositivo
        cvs.height = cvs.width * proporcionesOriginales;  // 🔄 Mantener proporción
    } else {
        cvs.width = 288;  // 🖥️ Tamaño original para PC
        cvs.height = 512;
    }
}
ajustarCanvas();
window.addEventListener('resize', () => {
    ajustarCanvas();
    reiniciarJuego(); // 🔄 Reinicia el juego tras el cambio de tamaño
});

// 🎮 Resto del código del juego
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

var gap;
var bX;
var bY;
var gravity = 1.5;
var score = 0;
var pipe = [];
var gameOver = false;

var fly = new Audio();
var scor = new Audio();
fly.src = "sounds/fly.mp3";
scor.src = "sounds/score.mp3";

document.addEventListener("keydown", moveUp);
document.addEventListener("touchstart", moveUp);

function moveUp() {
    bY -= 25;
    fly.play();
}

function generarAlturaAleatoria() {
    let alturaDisponible = cvs.height - fg.height - gap - pipeSouth.height;
    let alturaMinima = -pipeNorth.height + 50;
    return Math.floor(Math.random() * (alturaDisponible - alturaMinima + 1)) + alturaMinima;
}

function reiniciarJuego() {
    gap = cvs.height * 0.22;
    bX = cvs.width * 0.1;
    bY = cvs.height / 2;
    score = 0;
    pipe = [{
        x: cvs.width,
        y: generarAlturaAleatoria()
    }];
    gameOver = false;
    draw();
}

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
                y: generarAlturaAleatoria()
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

reiniciarJuego();


















































