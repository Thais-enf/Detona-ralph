const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        lives: document.querySelector("#lives"),
    },

    values: {
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        curretTime: 60,
        lives: 3,
        loseLifeCooldown: false,
    },

    actions: {
        timerId: setInterval(randomSquare, 1000),
        countDownTimerId: setInterval(countDown, 1000),
    },
};

function countDown() {
    state.values.curretTime--;
    state.view.timeLeft.textContent = state.values.curretTime;

    if (state.values.curretTime < 0) {
        clearInterval(state.actions.countDownTimerId);
        clearInterval(state.actions.timerId);
        alert("Game over! O seu resultado: " + state.values.result);
    }
}

function playSound(audioName) {
    let audio = new Audio(`./src/audio/${audioName}.m4a`);
    audio.volume = 0.2;
    audio.play();
}

function randomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy", "power-up");
    });

    let randomNumber = Math.floor(Math.random() * 9);
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;

    // Chance de aparecer um power-up
    randomPowerUp();
}

function randomPowerUp() {
    if (Math.random() > 0.8) { // 20% de chance
        let randomPowerUpSquare = state.view.squares[Math.floor(Math.random() * 9)];
        randomPowerUpSquare.classList.add("power-up");

        // Remover power-up após 3 segundos
        setTimeout(() => {
            randomPowerUpSquare.classList.remove("power-up");
        }, 3000);
    }
}

function loseLife() {
    if (!state.values.loseLifeCooldown) { 
        state.values.loseLifeCooldown = true;
        state.values.lives--;
        state.view.lives.textContent = `x${state.values.lives}`;
        

        if (state.values.lives === 0) {
            clearInterval(state.actions.timerId);
            clearInterval(state.actions.countDownTimerId); 
            alert("Você perdeu todas as vidas! Fim de jogo :(");
        }
        
        setTimeout(() => {
            state.values.loseLifeCooldown = false;
        }, 10000); 
    }
}

function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            if (square.id === state.values.hitPosition) {
                state.values.result++;
                state.view.score.textContent = state.values.result;
                state.values.hitPosition = null;
                playSound("hit"); 
            } else {
                
                loseLife();
            }
        });
    });
}

function initialize() {
    addListenerHitBox();
}


function restartGame(){

    state.values.result =0;
    state.values.curretTime = 60;
    state.values.lives = 3;
    state.view.timeLeft.textContent = state.values.curretTime;
    state.view.score.textContent = state.values.result;
    state.view.lives.textContent = `x${state.values.lives}`;
    
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy", "power-up");
    });

    clearInterval(state.actions.timerId);
    clearInterval(state.actions.countDownTimerId);

    state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);
    state.actions.countDownTimerId = setInterval(countDown, 1000);

    alert("Jogo reiniciado!");
}

// Adiciona o evento de clique no botão de reiniciar
document.getElementById("restart-button").addEventListener("click", restartGame);

initialize();
