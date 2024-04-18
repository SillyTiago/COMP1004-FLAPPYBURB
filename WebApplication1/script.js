let pipeSpeed = 3; // Speed at which the games pipes move from right to left on the screen
let gravity = 0.6; // gravity value
let burbVV = 0; // VV (vertical velocity) of burb, which is gonna be affected by gravity and user input

let burb = document.querySelector('.burb'); // DOM element for the burb character
let img = document.getElementById('burb-1'); // DOM element for the burb image
let message = document.querySelector('.message') // DOM element for displaying the start and restart characters

let gameState = 'Start'; // Defines the current state of the game
let pipeSeparation = 0; // This value will manage the horizontal separation from pipe to pipe

let score_val = document.querySelector('.score_val'); // defines the value for our score
let score_title = document.querySelector('.score_title'); // defines the title for our score (the text that says "score")

let gameMusic = document.getElementById('gameMusic'); // Defines our game music
let jumpSound = document.getElementById('jumpSound'); // Defines our Jump SFX
let gameOverSound = document.getElementById('gameOverSound'); // Defines our game over SFX

let volumeSlider = document.getElementById('volumeSlider'); // Defines our volume slider

document.addEventListener('keydown', handleKeyDown); // Event listener that will look for any key presses

// This below ensures our volume slider that is available on the Top right of the screen works 
document.addEventListener('DOMContentLoaded', function () {

    function updateVolume() {
        let newVolume = volumeSlider.value; 
        gameMusic.volume = newVolume; 
        gameOverSound.volume = newVolume; 
    }
    updateVolume();

    volumeSlider.addEventListener('input', updateVolume);
});

// This function handles key down events that control the games function. So this code is what lets the user start the game by pressing Enter (The game breaks if this code is removed pretty much)
function handleKeyDown(e) {
    if (e.key == 'Enter' && gameState !== 'Play') {
        startGame();
    } else if (gameState === 'Play' && (e.key == 'ArrowUp' || e.key == ' ')) {
        burbVV = -7; // New value for the burb vertical velocity will set an upward impusilve that simulates the burb jumping
        playJumpSound();
    }
}

// Function below is responsible for starting/restarting the game. It resets all necessary variables/states
function startGame() {
    document.querySelectorAll('.pipe_texture').forEach(e => e.remove());
    burb.style.top = '40vh'; 
    gameState = 'Play'; 
    message.innerHTML = '';
    score_title.innerHTML = 'Current Score (2x): ';
    score_val.innerHTML = '0';
    pipeSeparation = 0; 
    message.style.display = 'none';
    gameMusic.play();
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
        incrementScore(pipe, pipeBox);
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
    message.innerHTML = '*Game Over*<br>Press Enter To Restart';
    message.style.display = 'block'; 
    message.style.fontColor = 'black'
    gameOverSound.play(); 
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
    pipe.scoreIncremented = false;
    document.body.appendChild(pipe);
}

// Responsible for incrementing our score. It's currently bugged unfortunately (you can check the note below for more information)
function incrementScore(pipe, pipeBox) {
    let burbBox = burb.getBoundingClientRect();
    if (
        pipeBox.right < burbBox.left &&
        !pipe.scoreIncremented &&
        pipeBox.right + pipeSpeed >= burbBox.left
    ) {
        score_val.textContent = parseInt(score_val.textContent) + (0.5 * 2); // For some reason, its attributting 2 points instead of one
        pipe.scoreIncremented = true;

    }
}

// Function responsible for playing our Jump sound
function playJumpSound() {
    jumpSound.currentTime = 0; 
    jumpSound.volume = 0.5;
    jumpSound.play();
}