
let timer;
let isRunning = false;
let secondsElapsed = 0;

const daysElement = document.getElementById('days');
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('mins');
const secondsElement = document.getElementById('secs');

const start = document.getElementById('startBtn');
const pause = document.getElementById('pauseBtn');
const reset = document.getElementById('resetBtn');

//Time formatting with zeros
let formatTime = (value) => {
    return value < 10 ? `0${value}` : `${value}`
}

//update display
let updateDisplay = () => {
    const days = Math.floor(secondsElapsed / 86400);
    const hours = Math.floor((secondsElapsed % 86400) / 3600);
    const minutes = Math.floor((secondsElapsed % 3600) / 60);
    const seconds = secondsElapsed % 60;

    daysElement.textContent = formatTime(days);
    hoursElement.textContent = formatTime(hours);
    minutesElement.textContent = formatTime(minutes);
    secondsElement.textContent = formatTime(seconds);
}

//Timer

//start
let startTimer = () => {
    if (!isRunning) {
        isRunning = true;
        timer = setInterval(() => {
            secondsElapsed++;
            updateDisplay();
        }, 100);
    }
}

//pause
let pauseTimer = () => {
    if (isRunning) {
        isRunning = false;
        clearInterval(timer);
    }
}


//Reset
let resetTimer = () => {
    pauseTimer();
    secondsElapsed = 0;
    updateDisplay();
}

// Attach event listeners
start.addEventListener('click', startTimer);
pause.addEventListener('click', pauseTimer);
reset.addEventListener('click', resetTimer);

//Intialize display
updateDisplay();