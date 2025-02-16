// Obtener el elemento "canvas" desde el HTML y su contexto 2D para dibujar
var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

function resizeCanvas() {
    let aspectRatio = 288 / 512; // Relación de aspecto original

    if (window.innerWidth / window.innerHeight > aspectRatio) {
        cvs.height = window.innerHeight * 0.8;
        cvs.width = cvs.height * aspectRatio;
    } else {
        cvs.width = window.innerWidth * 0.8;
        cvs.height = cvs.width / aspectRatio;
    }
}

// Cargar imágenes del juego
var bird = new Image();
var bg = new Image();
var fg = new Image();
var pipeNorth = new Image();
var pipeSouth = new Image();

// Asignar la fuente de cada imagen
bird.src = "images/bird.png";      // Imagen del pájaro
bg.src = "images/bg.png";          // Imagen del fondo
fg.src = "images/fg.png";          // Imagen del suelo
pipeNorth.src = "images/pipeNorth.png"; // Parte superior del tubo
pipeSouth.src = "images/pipeSouth.png"; // Parte inferior del tubo

// Variables del juego
var gap = 85;  // Espacio entre los tubos
var constant;  // Variable que se usa para calcular la posición del tubo inferior

var bX = 10;   // Posición en X del pájaro
var bY = 150;  // Posición en Y del pájaro

var gravity = 1.5; // Gravedad que empuja al pájaro hacia abajo

var score = 0; // Puntuación

// Cargar efectos de sonido
var fly = new Audio();
var scor = new Audio();

fly.src = "sounds/fly.mp3";  // Sonido cuando el pájaro salta
scor.src = "sounds/score.mp3"; // Sonido al pasar un tubo

// Evento para detectar cuando se presiona una tecla
document.addEventListener("keydown", moveUp);

/**
 * Función que mueve al pájaro hacia arriba cuando se presiona una tecla
 */
function moveUp() {
    bY -= 25; // Mueve el pájaro 25 píxeles hacia arriba
    fly.play(); // Reproduce el sonido de vuelo
}

// Array para almacenar los tubos
var pipe = [];

// Insertar el primer tubo en la lista
pipe[0] = {
    x: cvs.width,  // Se coloca el tubo fuera de la pantalla, en la parte derecha
    y: 0           // La posición en Y se ajustará dinámicamente
};

/**
 * Función principal que dibuja todos los elementos en el canvas
 */
function draw() {
    // Dibujar el fondo
    ctx.drawImage(bg, 0, 0);

    // Dibujar los tubos
    for (var i = 0; i < pipe.length; i++) {

        // Calcular la posición del tubo inferior
        constant = pipeNorth.height + gap;

        // Dibujar el tubo superior
        ctx.drawImage(pipeNorth, pipe[i].x, pipe[i].y);

        // Dibujar el tubo inferior con un espacio entre los tubos
        ctx.drawImage(pipeSouth, pipe[i].x, pipe[i].y + constant);

        // Mover el tubo hacia la izquierda
        pipe[i].x--;

        // Cuando un tubo alcanza cierta posición, generar un nuevo tubo
        if (pipe[i].x == 125) {
            pipe.push({
                x: cvs.width,  // Se genera en la parte derecha de la pantalla
                y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height  // Posición aleatoria
            });
        }

        // Detectar colisiones con los tubos o el suelo
        if (
            (bX + bird.width >= pipe[i].x && bX <= pipe[i].x + pipeNorth.width &&
                (bY <= pipe[i].y + pipeNorth.height || bY + bird.height >= pipe[i].y + constant)) ||
            (bY + bird.height >= cvs.height - fg.height) // Colisión con el suelo
        ) {
            location.reload(); // Reiniciar el juego si hay una colisión
        }

        // Aumentar la puntuación cuando el pájaro pasa un tubo
        if (pipe[i].x == 5) {
            score++;
            scor.play(); // Sonido de puntuación
        }
    }

    // Dibujar el suelo en la parte inferior
    ctx.drawImage(fg, 0, cvs.height - fg.height);

    // Dibujar al pájaro en su posición actual
    ctx.drawImage(bird, bX, bY);

    // Aplicar la gravedad para que el pájaro caiga
    bY += gravity;

    // Mostrar la puntuación en pantalla
    ctx.fillStyle = "#000"; // Color negro
    ctx.font = "20px Verdana"; // Fuente
    ctx.fillText("Puntaje : " + score, 10, cvs.height - 20); // Posición del texto

    // Llamar la función nuevamente para actualizar la animación
    requestAnimationFrame(draw);
}

// Iniciar el juego
draw();






















