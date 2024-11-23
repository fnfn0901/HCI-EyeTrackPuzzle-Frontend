const imagePool = [];

// S3 이미지 목록 가져오기
async function fetchImages() {
    try {
        const response = await fetch('/api/images');
        const images = await response.json();
        imagePool.push(...images);
    } catch (error) {
        console.error('이미지 목록을 가져오는 중 오류 발생:', error);
    }
}

window.addEventListener('load', async () => {
    await fetchImages(); // 이미지 목록 가져오기

    const urlParams = new URLSearchParams(window.location.search);
    const level = urlParams.get('level');
    const imageIndex = urlParams.get('imageIndex') !== null && urlParams.get('imageIndex') !== "null" 
        ? parseInt(urlParams.get('imageIndex')) 
        : Math.floor(Math.random() * imagePool.length); // 랜덤 기본값

    if (!level) {
        console.error("레벨 정보가 없습니다!");
        return;
    }

    const rows = level === '1' ? 2 : level === '2' ? 3 : level === '3' ? 4 : 0;
    const cols = rows;

    if (rows === 0 || cols === 0) {
        console.error("잘못된 레벨 정보입니다!");
        return;
    }

    // 레벨 표시 업데이트
    document.querySelector('.level-text').textContent = `Level ${level}`;

    // 로딩 스피너 표시
    showLoadingSpinner();

    // 동적으로 grid-container 구성
    const { puzzleSlotCount, answerSlotCount } = setupGrid(level, rows, cols);

    // 퍼즐 슬롯과 정답 슬롯이 일치하지 않으면 중단
    if (puzzleSlotCount !== answerSlotCount) {
        console.error("퍼즐 슬롯과 정답 슬롯의 개수가 일치하지 않습니다!");
        return;
    }

    // 선택된 이미지로 게임 시작
    startGameWithSelectedImage(imageIndex, rows, cols);

    // 스톱워치 시작
    startStopwatch();
});

function showLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.style.display = 'block';
    }
}

function hideLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner && spinner.style.display !== 'none') {
        spinner.style.display = 'none';
    }
}

function startGameWithSelectedImage(imageIndex, rows, cols) {
    const selectedImage = imagePool[imageIndex];
    sliceImage(selectedImage, rows, cols, () => hideLoadingSpinner());
}

function setupGrid(level, rows, cols) {
    const gridContainer = document.querySelector('.grid-container');
    gridContainer.innerHTML = ''; // 기존 그리드 초기화
    gridContainer.className = `grid-container level-${level}`; // 레벨에 맞는 클래스 추가

    const layout = getLayoutForLevel(level);

    let puzzleSlotCount = 0;
    let answerSlotCount = 0;

    layout.forEach(row => {
        row.forEach(item => {
            const gridItem = document.createElement('div');
            if (item === '') {
                gridItem.className = 'grid-item empty-slot';
            } else {
                gridItem.className = 'grid-item';
                if (item === 'back') {
                    const backImg = document.createElement('img');
                    backImg.src = 'images/Back.svg';
                    backImg.alt = 'Back';
                    backImg.onclick = goBack;
                    gridItem.appendChild(backImg);
                    gridItem.classList.add('back-button');
                } else if (item === 'pause') {
                    const pauseImg = document.createElement('img');
                    pauseImg.src = 'images/Pause.svg';
                    pauseImg.alt = 'Pause';
                    pauseImg.onclick = togglePause;
                    gridItem.appendChild(pauseImg);
                    gridItem.classList.add('pause-button');
                } else if (item === 'puzzle-slot') {
                    gridItem.classList.add('puzzle-slot');
                    puzzleSlotCount++;
                } else if (item === 'answer') {
                    gridItem.classList.add('answer');
                    answerSlotCount++;
                }
            }
            gridContainer.appendChild(gridItem);
        });
    });

    return { puzzleSlotCount, answerSlotCount };
}

function getLayoutForLevel(level) {
    if (level === '1') {
        return [
            ['back', '', '', 'pause'],
            ['puzzle-slot', 'answer', 'answer', 'puzzle-slot'],
            ['puzzle-slot', 'answer', 'answer', 'puzzle-slot'],
        ];
    } else if (level === '2') {
        return [
            ['back', 'puzzle-slot', 'puzzle-slot', 'puzzle-slot', 'pause'],
            ['puzzle-slot', 'answer', 'answer', 'answer', 'puzzle-slot'],
            ['puzzle-slot', 'answer', 'answer', 'answer', 'puzzle-slot'],
            ['puzzle-slot', 'answer', 'answer', 'answer', 'puzzle-slot'],
        ];
    } else if (level === '3') {
        return [
            ['back', 'puzzle-slot', 'puzzle-slot', 'puzzle-slot', 'puzzle-slot', 'pause'],
            ['puzzle-slot', 'answer', 'answer', 'answer', 'answer', 'puzzle-slot'],
            ['puzzle-slot', 'answer', 'answer', 'answer', 'answer', 'puzzle-slot'],
            ['puzzle-slot', 'answer', 'answer', 'answer', 'answer', 'puzzle-slot'],
            ['puzzle-slot', 'answer', 'answer', 'answer', 'answer', 'puzzle-slot'],
            ['', 'puzzle-slot', 'puzzle-slot', 'puzzle-slot', 'puzzle-slot', ''],
        ];
    }
    return [];
}

function goBack() {
    stopStopwatch();
    window.location.href = 'menu.html'; // 메인 메뉴로 이동
}

function togglePause() {
    const overlay = document.getElementById('overlay');
    const alertBox = document.getElementById('alert-box');
    const isPaused = overlay.style.display === 'block';

    if (isPaused) {
        overlay.style.display = 'none';
        alertBox.style.display = 'none';
        startStopwatch();
    } else {
        overlay.style.display = 'block';
        alertBox.style.display = 'flex';
        stopStopwatch();
    }
}

function handleResult(result) {
    const levelText = document.querySelector('.level-text').textContent.split(' ')[1];
    const timerText = document.querySelector('.timer-text').textContent;
    const imageIndex = new URLSearchParams(window.location.search).get('imageIndex');

    window.location.href = `result.html?result=${result}&level=${encodeURIComponent(levelText)}&time=${encodeURIComponent(timerText)}&imageIndex=${imageIndex}`;
}