let startTime;
let updatedTime;
let difference;
let running = false; // 초기 상태는 정지
let timerId;

// 현재 선택된 퍼즐 조각
let selectedPiece = null;

function goBack() {
    const overlay = document.getElementById('overlay');
    const alertBox = document.getElementById('alert-box');
    const alertTitle = document.querySelector('.alert-title');
    const continueButton = document.querySelector('.continue-button');
    const menuButton = document.querySelector('.menu-button');

    // 타이머 멈춤
    stopStopwatch();

    // 경고창 텍스트와 버튼 기능 변경
    alertTitle.textContent = '게임을 종료하시겠습니까?';
    continueButton.textContent = '게임 종료';
    menuButton.textContent = '취소';

    // 게임 종료 버튼 클릭 시 index.html로 이동
    continueButton.onclick = () => {
        window.location.href = 'index.html';
    };

    // 취소 버튼 클릭 시 게임을 이어서 진행
    menuButton.onclick = () => {
        overlay.style.display = 'none';
        alertBox.style.display = 'none';
        continueGame(); // 기존 continueGame 함수 호출하여 게임 이어서 진행
    };

    // 경고창 표시
    overlay.style.display = 'block';
    alertBox.style.display = 'flex';
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

    // 일시정지 시점의 경과 시간에 따라 startTime 재설정
    startTime = new Date().getTime() - difference;
    running = true;
    timerId = setInterval(updateStopwatch, 100); // 타이머 재개
}

function goToMenu() {
    // index.html로 이동
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

// 퍼즐 게임 로직
function initializeGame() {
    const puzzleSlots = Array.from(document.querySelectorAll('.puzzle-slot'));
    const gridItems = Array.from(document.querySelectorAll('.grid-item'));

    const images = [
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

    const shuffledImages = images.sort(() => Math.random() - 0.5); // 이미지 랜덤 섞기

    // 퍼즐 슬롯에 이미지 할당
    puzzleSlots.forEach((slot, index) => {
        if (shuffledImages[index]) {
            slot.style.backgroundImage = `url('${shuffledImages[index]}')`;
            slot.setAttribute('data-image', shuffledImages[index]); // 이미지 데이터 저장
        }
    });

    // 클릭 이벤트 등록
    gridItems.forEach(item => {
        item.addEventListener('click', () => {
            // back-button 또는 pause-button은 동작하지 않음
            if (item.classList.contains('back-button') || item.classList.contains('pause-button')) {
                return;
            }

            if (selectedPiece) {
                if (!item.getAttribute('data-image')) {
                    // 빈 슬롯에 퍼즐 옮기기
                    item.style.backgroundImage = selectedPiece.style.backgroundImage;
                    item.setAttribute('data-image', selectedPiece.getAttribute('data-image'));
                    selectedPiece.style.backgroundImage = '';
                    selectedPiece.removeAttribute('data-image');
                    selectedPiece = null;
                } else {
                    // 선택된 퍼즐과 클릭한 슬롯의 퍼즐 교환
                    const tempImage = item.style.backgroundImage;
                    const tempData = item.getAttribute('data-image');

                    item.style.backgroundImage = selectedPiece.style.backgroundImage;
                    item.setAttribute('data-image', selectedPiece.getAttribute('data-image'));

                    selectedPiece.style.backgroundImage = tempImage;
                    selectedPiece.setAttribute('data-image', tempData);

                    selectedPiece = null; // 선택 상태 초기화
                }
            } else if (item.getAttribute('data-image')) {
                // 퍼즐 선택
                selectedPiece = item;
            }
        });
    });
}

// 성공 조건 확인
function handleResult(result) {
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

    const gridItems = Array.from(document.querySelectorAll('.grid-item'));
    let isCorrect = true;

    correctOrder.forEach((expectedImage, index) => {
        const item = gridItems[index];
        const actualImage = item.getAttribute('data-image');

        if (expectedImage !== actualImage) {
            isCorrect = false;
        }
    });

    if (isCorrect) {
        alert('퍼즐 성공!');
    } else {
        alert('퍼즐 실패!');
    }
}

window.onload = () => {
    const overlay = document.getElementById('overlay');
    const alertBox = document.getElementById('alert-box');
    overlay.style.display = 'none';
    alertBox.style.display = 'none';
    startStopwatch(); // 페이지 로드 시 타이머 시작

    initializeGame(); // 게임 초기화
};