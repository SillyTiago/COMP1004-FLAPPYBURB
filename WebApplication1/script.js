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

    if (birdPosition < 0 || birdPosition > window.innerHeight - bird.offsetHeight) {
        endGame(); // Checks for game collisions at top and bot, and calls the endGame() function to end the game
    }
}

function endGame() {
    clearInterval(gameInterval); // Once called, it will stop updating the game
    alert('Game Over!'); // Displays a simple "Game Over" alert, placeholder until I get something more fancy later on
}

function jump() {
    birdVelocity = JUMP_STRENGTH; // Applies an upward force to burb when the jump button is hit
    // if (birdPosition < 0) birdPosition = 0; // Prevents burb from going above the screen, need to do the same when it reaches the bottom (or just make the game end in either cases)
    // Line above is most likely not gonna have any use now, however im keeping it here in case I need it again
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

function createPipe() {
    const pipeGap = 200; // Gap between both pipes
    const pipeHeight = Math.floor(Math.random() * 200) + 50; // Top pipe height is randomized to add variety to the gameplay

    const pipeTop = document.createElement('div');
    pipeTop.className = 'pipe pipeTop';
    pipeTop.style.height = `${pipeHeight}px`;
    pipeTop.style.left = '100vw'; // Pipes start appearing from the right

    const pipeBottom = document.createElement('div');
    pipeBottom.className = 'pipe pipeBottom';  
    pipeBottom.style.height = `${window.innerHeight - pipeHeight - pipeGap}px`; // Bottom pipe position/height = Top Pipe height + gap
    pipeBottom.style.left = '100vw'; // Bot pipe aligns with Top Pipe

    document.body.appendChild(pipeTop);
    document.body.appendChild(pipeBottom);

    movePipe(pipeTop, pipeBottom);
}

function movePipe(pipeTop, pipeBottom) {
    let pipeCurrentPosition = 100; // Pipe start from right position 

    const moveInterval = setInterval(() => {
        pipeCurrentPosition -= 2; // Pipes move from right to left
        pipeTop.style.left = `${pipeCurrentPosition}vw`;
        pipeBottom.style.left = `${pipeCurrentPosition}vw`;

        if (pipeCurrentPosition <= -10) { // Pipes get removed once they go off screen
            clearInterval(moveInterval);
            document.body.removeChild(pipeTop);
            document.body.removeChild(pipeBottom);
        }

        // Collision detection with the burb in case it hits the pipes
        if (
            birdPosition < pipeTop.offsetHeight ||
            birdPosition > window.innerHeight - pipeBottom.offsetHeight
        ) {
            endGame(); // If burb hits, endGame() function is called
        }

    }, 300); // Value for pipe speed, might need to chance depending if too slow/fast
}


setInterval(createPipe, 3000); // Pipe generation rate value

// testing github