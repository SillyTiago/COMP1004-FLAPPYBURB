let pipeSpeed = 3; // Speed at which the games pipes move from right to left on the screen
let gravity = 0.6; // gravity value
let burbVV = 0; // VV (vertical velocity) of burb, which is gonna be affected by gravity and user input

let burb = document.querySelector('.burb'); // DOM element for the burb character
let img = document.getElementById('burb-1'); // DOM element for the burb image
let message = document.querySelector('.message') // DOM element for displaying the start and restart characters

let gameState = 'Start'; // Defines the current state of the game
let pipeSeparation = 0; // This value will manage the horizontal separation from pipe to pipe

document.addEventListener('keydown', handleKeyDown); // Event listener that will look for any key presses

// This function handles key down events that control the games function. So this code is what lets the user start the game by pressing Enter (The game breaks if this code is removed pretty much)
function handleKeyDown(e) {
    if (e.key == 'Enter' && gameState !== 'Play') {
        startGame();
    } else if (gameState === 'Play' && (e.key == 'ArrowUp' || e.key == ' ')) {
        burbVV = -7; // New value for the burb vertical velocity will set an upward impusilve that simulates the burb jumping
    }
}

// Function below is responsible for starting/restarting the game. It resets all necessary variables/states
function startGame() {
    document.querySelectorAll('.pipe_texture').forEach(e => e.remove());
    burb.style.top = '40vh'; 
    gameState = 'Play'; 
    message.innerHTML = '';
    pipeSeparation = 0; 
    play();
}

// Main game loop. Manages pipe movements, gravity, and pipe generation bits.
function play() {
    Gravity();
    movePipes();
    generatePipes();
}

// Function responsible for moving the pipes from right to left and checks collisions. It also removes pipes that pass the left screen limit
function movePipes() {
    let pipes = document.querySelectorAll('.pipe_texture');
    pipes.forEach(pipe => {
        let pipeBox = pipe.getBoundingClientRect();
        if (pipeBox.right <= 0) {
            pipe.remove();
        } else {
            updatePipePosition(pipe, pipeBox);
        }
    });
    if (gameState === 'Play') requestAnimationFrame(movePipes);
}

// Function that updates the pipes collisions and is responsible for ending the game if burb collides with pipe. Its used in movePipes()
function updatePipePosition(pipe, pipeBox) {
    if (checkCollision(pipeBox)) {
        gameOver();
    } else {
        pipe.style.left = pipeBox.left - pipeSpeed + 'px';
    }
}

// Function that checks and detects collision between burb and pipe. It's used in updatePipePosition() which in used in movePipes()
function checkCollision(pipeBox) {
    let burbBox = burb.getBoundingClientRect();
    return (
        burbBox.left < pipeBox.left + pipeBox.width &&
        burbBox.left + burbBox.width > pipeBox.left &&
        burbBox.top < pipeBox.top + pipeBox.height &&
        burbBox.top + burbBox.height > pipeBox.top
    );
}

// Function that is responsible for ending the game and displaying the Game Over Screen
function gameOver() {
    gameState = 'End';
    message.innerHTML = '*Game Over*<br>Press Enter To Restart'.fontcolor('black');
}

// Function responsible for applying gravity to our burb. It also calls for gameOver() in case it hits the Top or Bottom of screen
function Gravity() {
    if (gameState !== 'Play') return;
    burbVV += gravity;
    let burbBox = burb.getBoundingClientRect();
    if (burbBox.top <= 0 || burbBox.bottom >= window.innerHeight) {
        gameOver();
    } else {
        burb.style.top = burbBox.top + burbVV + 'px';
    }
    if (gameState === 'Play') requestAnimationFrame(Gravity);
}

// Function responsible for generating new pipes at defined intervals
function generatePipes() {
    if (gameState !== 'Play') return;
    if (++pipeSeparation > 120) {
        createPipe();
        pipeSeparation = 0;
    }
    requestAnimationFrame(generatePipes);
}

// Function responsible for creating the Pipes. It first creates a bottom pipe, and then a mirrored (Top) pipe. It's used in generatePipes()
function createPipe() {
    let pipePosition = Math.floor(Math.random() * 43) + 8;
    let pipeMirrored = document.createElement('div');
    pipeMirrored.className = 'pipe_texture';
    pipeMirrored.style.top = pipePosition - 70 + 'vh';
    pipeMirrored.style.left = '100vw';
    document.body.appendChild(pipeMirrored);

    let pipe = document.createElement('div');
    pipe.className = 'pipe_texture';
    pipe.style.top = pipePosition + 37 + 'vh';
    pipe.style.left = '100vw';
    document.body.appendChild(pipe);
}