let startTime;
let updatedTime;
let difference;
let running = false; // 초기 상태는 정지
let timerId;

function goBack() {
    window.history.back();
}

function togglePause() {
    const overlay = document.getElementById('overlay');
    const alertBox = document.getElementById('alert-box');

    // 타이머가 실행 중일 때만 경고창을 표시
    if (running) {
        stopStopwatch(); // 타이머 정지
        overlay.style.display = 'block'; // 어두운 배경 표시
        alertBox.style.display = 'flex'; // 경고창 표시
    }
}

function continueGame() {
    const overlay = document.getElementById('overlay');
    const alertBox = document.getElementById('alert-box');
    overlay.style.display = 'none'; // 어두운 배경 숨김
    alertBox.style.display = 'none'; // 경고창 숨김
    startStopwatch(); // 타이머 재개
}

function goToMenu() {
    // 메인 메뉴로 이동하는 로직을 구현할 수 있습니다.
}

function startStopwatch() {
    if (!running) {
        startTime = new Date().getTime();
        running = true;
        timerId = setInterval(updateStopwatch, 100);
    }
}

function stopStopwatch() {
    clearInterval(timerId); // 타이머 중지
    running = false; // 상태 업데이트
}

function updateStopwatch() {
    if (running) {
        updatedTime = new Date().getTime();
        difference = updatedTime - startTime;

        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

        const timerText = document.querySelector('.timer-text');
        timerText.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
}

window.onload = () => {
    const overlay = document.getElementById('overlay');
    const alertBox = document.getElementById('alert-box');
    overlay.style.display = 'none';
    alertBox.style.display = 'none';
    startStopwatch(); // 페이지 로드 시 타이머 시작
};