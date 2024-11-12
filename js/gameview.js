let isBackAlertActive = false; // 뒤로가기 경고창 상태 플래그
let isPauseAlertActive = false; // 일시정지 경고창 상태 플래그
let running = false; // 초기 상태는 정지
let startTime;
let updatedTime;
let difference = 0; // 경과 시간
let timerId;

let selectedPiece = null;

function goBack() {
    if (isPauseAlertActive || isBackAlertActive) return; // 다른 경고창 활성화 상태면 뒤로가기 동작 방지

    setAlertState('back'); // 뒤로가기 경고창 표시
}

function togglePause() {
    if (isBackAlertActive) return; // 뒤로가기 경고창이 활성화된 상태면 일시정지 방지

    if (running) {
        setAlertState('pause'); // 일시정지 경고창 표시
    } else if (isPauseAlertActive) {
        resumeGame(); // 게임 재개
    }
}

function setAlertState(type) {
    resetAlertState(); // 기존 상태 초기화

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
            window.location.href = 'index.html';
        };

        menuButton.onclick = () => {
            resetAlertState();
            resumeGame(); // 게임 계속
        };

        isBackAlertActive = true; // 뒤로가기 경고창 활성화
    } else if (type === 'pause') {
        stopStopwatch();
        alertTitle.textContent = '게임이 일시정지되었습니다.';
        continueButton.textContent = '게임 계속';
        menuButton.textContent = '메인 메뉴';

        continueButton.onclick = () => {
            resetAlertState();
            resumeGame(); // 게임 재개
        };

        menuButton.onclick = () => {
            window.location.href = 'index.html';
        };

        isPauseAlertActive = true; // 일시정지 경고창 활성화
    }

    overlay.style.display = 'block';
    alertBox.style.display = 'flex';
}

function resetAlertState() {
    const overlay = document.getElementById('overlay');
    const alertBox = document.getElementById('alert-box');

    overlay.style.display = 'none';
    alertBox.style.display = 'none';

    // 모든 플래그 초기화
    isBackAlertActive = false;
    isPauseAlertActive = false;
}

function resumeGame() {
    startTime = new Date().getTime() - difference;
    running = true;
    timerId = setInterval(updateStopwatch, 100);

    resetAlertState();
}

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

        const timerText = document.querySelector('.timer-text');
        timerText.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
}

function initializeGame() {
    const puzzleSlots = Array.from(document.querySelectorAll('.puzzle-slot'));
    const answerSlots = Array.from(document.querySelectorAll('.answer'));

    const correctOrder = [
        'images/elephant01.png',
        'images/elephant02.png',
        'images/elephant03.png',
        'images/elephant04.png',
        'images/elephant05.png',
        'images/elephant06.png',
        'images/elephant07.png',
        'images/elephant08.png',
        'images/elephant09.png'
    ];

    const shuffledOrder = [...correctOrder].sort(() => Math.random() - 0.5);

    puzzleSlots.forEach((slot, index) => {
        if (shuffledOrder[index]) {
            slot.style.backgroundImage = `url('${shuffledOrder[index]}')`;
            slot.setAttribute('data-image', shuffledOrder[index]);
        }
    });

    answerSlots.forEach(slot => {
        slot.style.backgroundImage = '';
        slot.removeAttribute('data-image');
    });

    [...puzzleSlots, ...answerSlots].forEach(slot => {
        slot.addEventListener('click', () => handleSlotClick(slot));
    });

    answerSlots.forEach((slot, index) => {
        slot.setAttribute('data-correct', correctOrder[index]);
        slot.removeAttribute('data-image');
    });
}

function handleSlotClick(slot) {
    if (selectedPiece) {
        if (!slot.getAttribute('data-image')) {
            slot.style.backgroundImage = selectedPiece.style.backgroundImage;
            slot.setAttribute('data-image', selectedPiece.getAttribute('data-image'));
            selectedPiece.style.backgroundImage = '';
            selectedPiece.removeAttribute('data-image');

            selectedPiece.style.outline = ''; // 선택 해제 시 outline 원상복구
            selectedPiece = null;

            onPiecePlaced();
        } else {
            const tempImage = slot.style.backgroundImage;
            const tempData = slot.getAttribute('data-image');

            slot.style.backgroundImage = selectedPiece.style.backgroundImage;
            slot.setAttribute('data-image', selectedPiece.getAttribute('data-image'));

            selectedPiece.style.backgroundImage = tempImage;
            selectedPiece.setAttribute('data-image', tempData);

            selectedPiece.style.outline = ''; // 선택 해제 시 outline 원상복구
            selectedPiece = null;

            onPiecePlaced();
        }
    } else if (slot.getAttribute('data-image')) {
        if (selectedPiece) {
            selectedPiece.style.outline = ''; // 이전 선택 해제
        }
        selectedPiece = slot;
        selectedPiece.style.outline = '4px solid #FF8181'; // 외곽선 스타일 적용
    }
}

function checkAnswers() {
    const answerSlots = Array.from(document.querySelectorAll('.answer'));
    const correctOrder = [
        'images/elephant01.png',
        'images/elephant02.png',
        'images/elephant03.png',
        'images/elephant04.png',
        'images/elephant05.png',
        'images/elephant06.png',
        'images/elephant07.png',
        'images/elephant08.png',
        'images/elephant09.png'
    ];

    const isCorrect = answerSlots.every((slot, index) => {
        return slot.getAttribute('data-image') === correctOrder[index];
    });

    if (isCorrect) {
        stopStopwatch();
        setTimeout(() => {
            handleResult('success');
        }, 500);
    }
}

function onPiecePlaced() {
    checkAnswers();
}

function handleResult(result) {
    const levelText = document.querySelector('.level-text').textContent;
    const timerText = document.querySelector('.timer-text').textContent;
    window.location.href = `result.html?result=${result}&level=${encodeURIComponent(levelText)}&time=${encodeURIComponent(timerText)}`;
}

window.onload = () => {
    resetAlertState(); // 초기화
    startStopwatch();
    initializeGame();
};