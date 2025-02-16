// Obtener el elemento "canvas" desde el HTML y su contexto 2D para dibujar
var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

// Establecer la relaci�n de aspecto del juego
const ASPECT_RATIO = 288 / 512; // Relaci�n original del juego

function resizeCanvas() {
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Determinar el tama�o �ptimo sin deformar el juego
    if (width / height > ASPECT_RATIO) {
        cvs.height = height * 0.9; // 90% del alto disponible
        cvs.width = cvs.height * ASPECT_RATIO;
    } else {
        cvs.width = width * 0.9; // 90% del ancho disponible
        cvs.height = cvs.width / ASPECT_RATIO;
    }

    // Asegurar que el juego se vuelva a dibujar despu�s del cambio
    draw();
}

// Ajustar el tama�o del canvas al cargar y cambiar la pantalla
window.addEventListener("load", resizeCanvas);
window.addEventListener("resize", resizeCanvas);


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

/**
 * Funci�n principal que dibuja todos los elementos en el canvas
 */
function draw() {
    ctx.clearRect(0, 0, cvs.width, cvs.height); // Limpia el canvas antes de redibujar

    // Dibujar el fondo escalado
    ctx.drawImage(bg, 0, 0, cvs.width, cvs.height);

    for (var i = 0; i < pipe.length; i++) {
        let pipeWidth = cvs.width * 0.2; // Ajustar ancho de los tubos (20% del ancho del canvas)
        let pipeHeight = pipeWidth * (pipeNorth.height / pipeNorth.width); // Mantener la proporci�n

        let gap = cvs.height * 0.2; // Espacio proporcional entre los tubos

        ctx.drawImage(pipeNorth, pipe[i].x, pipe[i].y, pipeWidth, pipeHeight);
        ctx.drawImage(pipeSouth, pipe[i].x, pipe[i].y + pipeHeight + gap, pipeWidth, pipeHeight);

        pipe[i].x -= 2; // Mover los tubos a la izquierda
    }

    // Dibujar el suelo escalado
    let groundHeight = cvs.height * 0.15;
    ctx.drawImage(fg, 0, cvs.height - groundHeight, cvs.width, groundHeight);

    // Dibujar el p�jaro escalado
    let birdSize = cvs.width * 0.1; // Ajustar tama�o del p�jaro
    ctx.drawImage(bird, bX, bY, birdSize, birdSize);

    // Aplicar gravedad al p�jaro
    bY += gravity * (cvs.height / 512); // Ajustar gravedad al tama�o del canvas

    // Mostrar la puntuaci�n
    ctx.fillStyle = "#000";
    ctx.font = (cvs.width * 0.05) + "px Verdana"; // Escalar la fuente
    ctx.fillText("Puntaje : " + score, 10, cvs.height - 20);

    requestAnimationFrame(draw);
}


// Iniciar el juego
draw();






















