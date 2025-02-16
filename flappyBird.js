// Obtener el elemento "canvas" desde el HTML y su contexto 2D para dibujar
var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

// Cargar im�genes del juego
var bird = new Image();
var bg = new Image();
var fg = new Image();
var pipeNorth = new Image();
var pipeSouth = new Image();

// Asignar la fuente de cada imagen
bird.src = "images/bird.png";      // Imagen del p�jaro
bg.src = "images/bg.png";          // Imagen del fondo  
fg.src = "images/fg.png";          // Imagen del suelo
pipeNorth.src = "images/pipeNorth.png"; // Parte superior del tubo
pipeSouth.src = "images/pipeSouth.png"; // Parte inferior del tubo

// Variables del juego
var gap = 85;  // Espacio entre los tubos
var constant;  // Variable que se usa para calcular la posici�n del tubo inferior

var bX = 10;   // Posici�n en X del p�jaro
var bY = 150;  // Posici�n en Y del p�jaro

var gravity = 1.5; // Gravedad que empuja al p�jaro hacia abajo

var score = 0; // Puntuaci�n

// Cargar efectos de sonido
var fly = new Audio();
var scor = new Audio();

fly.src = "sounds/fly.mp3";  // Sonido cuando el p�jaro salta
scor.src = "sounds/score.mp3"; // Sonido al pasar un tubo

// Evento para detectar cuando se presiona una tecla
document.addEventListener("keydown", moveUp);
document.addEventListener("touchstart", moveUp);


/**
 * Funci�n que mueve al p�jaro hacia arriba cuando se presiona una tecla
 */
function moveUp() {
    bY -= 25; // Mueve el p�jaro 25 p�xeles hacia arriba
    fly.play(); // Reproduce el sonido de vuelo
}

// Array para almacenar los tubos
var pipe = [];

// Insertar el primer tubo en la lista
pipe[0] = {
    x: cvs.width,  // Se coloca el tubo fuera de la pantalla, en la parte derecha
    y: 0           // La posici�n en Y se ajustar� din�micamente
};

// Variable para controlar si el juego ha terminado
var gameOver = false;

function draw() {
    if (gameOver) return; // Si el juego terminó, no seguir dibujando

    ctx.clearRect(0, 0, cvs.width, cvs.height); // Limpia el canvas

    // Dibujar el fondo
    ctx.drawImage(bg, 0, 0);

    for (var i = 0; i < pipe.length; i++) {
        constant = pipeNorth.height + gap;
        ctx.drawImage(pipeNorth, pipe[i].x, pipe[i].y);
        ctx.drawImage(pipeSouth, pipe[i].x, pipe[i].y + constant);

        pipe[i].x--;

        if (pipe[i].x == 125) {
            pipe.push({
                x: cvs.width,
                y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height
            });
        }

        // 🔹 **Corrección de colisión** 🔹
        if (
            bX + bird.width >= pipe[i].x &&
            bX <= pipe[i].x + pipeNorth.width &&
            (bY <= pipe[i].y + pipeNorth.height || bY + bird.height >= pipe[i].y + constant) ||
            bY + bird.height >= cvs.height - fg.height
        ) {
            gameOver = true; // Detener el juego
            setTimeout(() => {
                location.reload(); // Recargar la página después de 1 segundo
            }, 1000);
        }

        if (pipe[i].x == 5) {
            score++;
        }
    }

    // Dibujar el suelo
    ctx.drawImage(fg, 0, cvs.height - fg.height);
    ctx.drawImage(bird, bX, bY);

    // Aplicar gravedad
    bY += gravity;

    // Evitar que el pájaro siga cayendo más allá del suelo
    if (bY >= cvs.height - fg.height - bird.height) {
        bY = cvs.height - fg.height - bird.height;
    }

    // Dibujar el puntaje
    ctx.fillStyle = "#000";
    ctx.font = "20px Verdana";
    ctx.fillText("Score : " + score, 10, cvs.height - 20);

    if (!gameOver) {
        requestAnimationFrame(draw);
    }
}


// Iniciar el juego
draw();













































