let running = false;
let startTime, updatedTime, difference = 0, timerId;

function startStopwatch() {
    if (!running) {
        startTime = new Date().getTime();
        running = true;
        timerId = setInterval(updateStopwatch, 100);
    }
}

function stopStopwatch() {
    clearInterval(timerId);
    running = false;
}

function updateStopwatch() {
    if (running) {
        updatedTime = new Date().getTime();
        difference = updatedTime - startTime;

        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        document.querySelector('.timer-text').textContent = 
            `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
}