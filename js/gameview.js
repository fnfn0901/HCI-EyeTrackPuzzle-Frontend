let startTime;
let updatedTime;
let difference;
let running = false; // 초기 상태는 정지
let timerId;

let selectedPiece = null;

function goBack() {
    const overlay = document.getElementById('overlay');
    const alertBox = document.getElementById('alert-box');
    const alertTitle = document.querySelector('.alert-title');
    const continueButton = document.querySelector('.continue-button');
    const menuButton = document.querySelector('.menu-button');

    stopStopwatch();

    alertTitle.textContent = '게임을 종료하시겠습니까?';
    continueButton.textContent = '게임 종료';
    menuButton.textContent = '취소';

    continueButton.onclick = () => {
        window.location.href = 'index.html';
    };

    menuButton.onclick = () => {
        overlay.style.display = 'none';
        alertBox.style.display = 'none';
        continueGame();
    };

    overlay.style.display = 'block';
    alertBox.style.display = 'flex';
}

function togglePause() {
    const overlay = document.getElementById('overlay');
    const alertBox = document.getElementById('alert-box');

    if (running) {
        stopStopwatch();
        overlay.style.display = 'block';
        alertBox.style.display = 'flex';
    }
}

function continueGame() {
    const overlay = document.getElementById('overlay');
    const alertBox = document.getElementById('alert-box');
    overlay.style.display = 'none';
    alertBox.style.display = 'none';

    startTime = new Date().getTime() - difference;
    running = true;
    timerId = setInterval(updateStopwatch, 100);
}

function goToMenu() {
    window.location.href = 'index.html';
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

    // 이미지 배열 정의
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

    // 이미지를 랜덤으로 섞음
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
        slot.setAttribute('data-correct', correctOrder[index]); // 정답 설정
        slot.removeAttribute('data-image'); // 초기에는 비어 있음
    });
}

function handleSlotClick(slot) {
    if (selectedPiece) {
        if (!slot.getAttribute('data-image')) {
            slot.style.backgroundImage = selectedPiece.style.backgroundImage;
            slot.setAttribute('data-image', selectedPiece.getAttribute('data-image'));
            selectedPiece.style.backgroundImage = '';
            selectedPiece.removeAttribute('data-image');
            selectedPiece = null;

            onPiecePlaced();
        } else {
            const tempImage = slot.style.backgroundImage;
            const tempData = slot.getAttribute('data-image');

            slot.style.backgroundImage = selectedPiece.style.backgroundImage;
            slot.setAttribute('data-image', selectedPiece.getAttribute('data-image'));

            selectedPiece.style.backgroundImage = tempImage;
            selectedPiece.setAttribute('data-image', tempData);

            selectedPiece = null;

            onPiecePlaced();
        }
    } else if (slot.getAttribute('data-image')) {
        selectedPiece = slot;
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
        alert('퍼즐 성공!');
        endGame();
    }
}

function endGame() {
    stopStopwatch();
    const overlay = document.getElementById('overlay');
    const alertBox = document.getElementById('alert-box');

    const alertTitle = document.querySelector('.alert-title');
    const continueButton = document.querySelector('.continue-button');
    const menuButton = document.querySelector('.menu-button');

    alertTitle.textContent = '축하합니다! 게임이 완료되었습니다.';
    continueButton.textContent = '메인 메뉴로';
    menuButton.textContent = '다시 하기';

    continueButton.onclick = () => {
        window.location.href = 'index.html';
    };

    menuButton.onclick = () => {
        window.location.reload();
    };

    overlay.style.display = 'block';
    alertBox.style.display = 'flex';
}

function onPiecePlaced() {
    checkAnswers();
}

window.onload = () => {
    const overlay = document.getElementById('overlay');
    const alertBox = document.getElementById('alert-box');
    overlay.style.display = 'none';
    alertBox.style.display = 'none';

    startStopwatch();
    initializeGame();
};