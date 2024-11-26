let isAlertActive = false; // 상태 관리 통합

// 뒤로가기 버튼 핸들러
function goBack(event) {
    if (isAlertActive) return;
    if (event) event.preventDefault(); // 기본 뒤로가기 동작 방지
    showAlert('back'); // 뒤로가기 Alert 호출
}

// 일시정지 버튼 핸들러
function togglePause() {
    if (isAlertActive) return;

    if (running) {
        showAlert('pause'); // 일시정지 Alert 호출
    } else {
        resumeGame(); // 게임 재개
    }
}

// Alert 창 표시
function showAlert(type) {
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

        continueButton.onclick = () => {
            resetAlertState();
            window.location.href = 'index.html'; // 메인 메뉴로 이동
        };
        menuButton.onclick = () => {
            resetAlertState(); // Alert 닫기
            resumeGame(); // 타이머 재개
        };
    } else if (type === 'pause') {
        stopStopwatch();
        alertTitle.textContent = '게임이 일시정지되었습니다.';
        continueButton.textContent = '게임 계속';
        menuButton.textContent = '메인 메뉴';

        continueButton.onclick = resumeGame; // 게임 재개
        menuButton.onclick = () => window.location.href = 'level.html'; // 메인 메뉴로 이동
    }

    overlay.style.display = 'block';
    alertBox.style.display = 'flex';
    isAlertActive = true;
}

// Alert 상태 초기화
function resetAlertState() {
    const overlay = document.getElementById('overlay');
    const alertBox = document.getElementById('alert-box');

    overlay.style.display = 'none';
    alertBox.style.display = 'none';
    isAlertActive = false;
}

// 게임 재개
function resumeGame() {
    startTime = new Date().getTime() - difference;
    running = true;
    timerId = setInterval(updateStopwatch, 100);
    resetAlertState();
}