let isBackAlertActive = false;
let isPauseAlertActive = false;

function goBack() {
    if (isPauseAlertActive || isBackAlertActive) return;
    setAlertState('back');
}

function togglePause() {
    if (isBackAlertActive) return;

    if (running) {
        setAlertState('pause');
    } else if (isPauseAlertActive) {
        resumeGame();
    }
}

function setAlertState(type) {
    resetAlertState();

    const overlay = document.getElementById('overlay');
    const alertBox = document.getElementById('alert-box');
    const alertTitle = document.querySelector('.alert-title');
    const continueButton = document.querySelector('.continue-button');
    const menuButton = document.querySelector('.menu-button');

    if (type === 'back') {
        stopStopwatch();
        alertTitle.textContent = '게임을 종료하시겠습니까?';
        continueButton.textContent = '게임 종료';
        menuButton.textContent = '취소';

        continueButton.onclick = () => window.location.href = 'index.html';
        menuButton.onclick = () => {
            resetAlertState();
            resumeGame();
        };

        isBackAlertActive = true;
    } else if (type === 'pause') {
        stopStopwatch();
        alertTitle.textContent = '게임이 일시정지되었습니다.';
        continueButton.textContent = '게임 계속';
        menuButton.textContent = '메인 메뉴';

        continueButton.onclick = () => {
            resetAlertState();
            resumeGame();
        };
        menuButton.onclick = () => window.location.href = 'index.html';

        isPauseAlertActive = true;
    }

    overlay.style.display = 'block';
    alertBox.style.display = 'flex';
}

function resetAlertState() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('alert-box').style.display = 'none';
    isBackAlertActive = false;
    isPauseAlertActive = false;
}

function resumeGame() {
    startTime = new Date().getTime() - difference;
    running = true;
    timerId = setInterval(updateStopwatch, 100);
    resetAlertState();
}