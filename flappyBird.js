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

/**
 * Funci�n principal que dibuja todos los elementos en el canvas
 */
function draw() {
    // Dibujar el fondo
    ctx.drawImage(bg, 0, 0);

    // Dibujar los tubos
    for (var i = 0; i < pipe.length; i++) {

        // Calcular la posici�n del tubo inferior
        constant = pipeNorth.height + gap;

        // Dibujar el tubo superior
        ctx.drawImage(pipeNorth, pipe[i].x, pipe[i].y);

        // Dibujar el tubo inferior con un espacio entre los tubos
        ctx.drawImage(pipeSouth, pipe[i].x, pipe[i].y + constant);

        // Mover el tubo hacia la izquierda
        pipe[i].x--;

        // Cuando un tubo alcanza cierta posici�n, generar un nuevo tubo
        if (pipe[i].x == 125) {
            pipe.push({
                x: cvs.width,  // Se genera en la parte derecha de la pantalla
                y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height  // Posici�n aleatoria
            });
        }

        // Detectar colisiones con los tubos o el suelo
        if (
            (bX + bird.width >= pipe[i].x && bX <= pipe[i].x + pipeNorth.width &&
                (bY <= pipe[i].y + pipeNorth.height || bY + bird.height >= pipe[i].y + constant)) ||
            (bY + bird.height >= cvs.height - fg.height) // Colisi�n con el suelo
        ) {
            location.reload(); // Reiniciar el juego si hay una colisi�n
        }

        // Aumentar la puntuaci�n cuando el p�jaro pasa un tubo
        if (pipe[i].x == 5) {
            score++;
            scor.play(); // Sonido de puntuaci�n
        }
    }

    // Dibujar el suelo en la parte inferior
    ctx.drawImage(fg, 0, cvs.height - fg.height);

    // Dibujar al p�jaro en su posici�n actual
    ctx.drawImage(bird, bX, bY);

    // Aplicar la gravedad para que el p�jaro caiga
    bY += gravity;

    // Mostrar la puntuaci�n en pantalla
    ctx.fillStyle = "#000"; // Color negro
    ctx.font = "20px Verdana"; // Fuente
    ctx.fillText("Puntaje : " + score, 10, cvs.height - 20); // Posici�n del texto

    // Llamar la funci�n nuevamente para actualizar la animaci�n
    requestAnimationFrame(draw);
}

// Iniciar el juego
draw();













































