const bird = document.getElementById('bird-1');
let birdPosition = parseInt(window.getComputedStyle(bird).getPropertyValue('top'));
let birdVelocity = 0;
const GRAVITY = 0.25; // Burb Gravity
const JUMP_STRENGTH = -6; // Burb Jump Strength
let gameInterval;

function updateGame() {
    birdVelocity += GRAVITY; // Gravity increases downward velocity, so the more it falls the faster 
    birdPosition += birdVelocity; // Burbs position is based on its velocity
    bird.style.top = birdPosition + 'px';
}

function jump() {
    birdVelocity = JUMP_STRENGTH; // Applies an upward force to burb when the jump button is hit
    if (birdPosition < 0) birdPosition = 0; // Prevents burb from going above the screen, need to do the same when it reaches the bottom (or just make the game end in either cases)
}

document.addEventListener('keydown', function (event) {
    if (event.code === 'Space') {
        jump(); // Makes the Space key our jump button
    }
})

function startGame() {
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, 20); // This determines the smoothness of our game
}

startGame();

// testing github