window.addEventListener('load', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const level = urlParams.get('level');
    const imageIndex = urlParams.has('imageIndex') && urlParams.get('imageIndex') !== 'null'
        ? parseInt(urlParams.get('imageIndex'), 10)
        : null;

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
    setupGrid(level, rows, cols); // 중복된 layout 제거 후 호출

    // 퍼즐 게임 시작
    startGameWithLoading(imageIndex, rows, cols);

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

function startGameWithLoading(imageIndex, rows, cols) {
    startGame(imageIndex, rows, cols, () => {
        hideLoadingSpinner();
    });
}

function startGame(imageIndex, rows, cols) {
    const selectedImage = imageIndex !== null ? imagePool[imageIndex] : getRandomImage();
    sliceAndInitialize(selectedImage, rows, cols);
}

function sliceAndInitialize(imageUrl, rows, cols, callback) {
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
        const canvas = document.createElement('canvas');
        const pieceWidth = img.width / cols;
        const pieceHeight = img.height / rows;

        correctOrder = [];
        imagePieces = [];

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                canvas.width = pieceWidth;
                canvas.height = pieceHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(
                    img,
                    col * pieceWidth,
                    row * pieceHeight,
                    pieceWidth,
                    pieceHeight,
                    0,
                    0,
                    pieceWidth,
                    pieceHeight
                );
                const dataUrl = canvas.toDataURL();
                correctOrder.push(dataUrl);
                imagePieces.push(dataUrl);
            }
        }

        initializeGrid(rows, cols);
        setupEventListeners();

        // 로드 완료 후 콜백 호출
        if (callback) callback();
    };

    img.onerror = () => {
        console.error(`이미지 로드 실패: ${imageUrl}`);
        if (callback) callback();
    };
}

function getRandomImage() {
    if (imagePool.length === 0) {
        console.error('이미지 풀이 비어 있습니다.');
        return null;
    }
    const randomIndex = Math.floor(Math.random() * imagePool.length);
    return imagePool[randomIndex];
}

function setupGrid(level, rows, cols) {
    const gridContainer = document.querySelector('.grid-container');
    gridContainer.innerHTML = ''; // 기존 그리드 초기화
    gridContainer.className = `grid-container level-${level}`; // 레벨에 맞는 클래스 추가

    const layout = getLayoutForLevel(level); // 레이아웃 가져오기

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
                    backImg.onclick = () => goBack();
                    gridItem.appendChild(backImg);
                    gridItem.classList.add('back-button');
                } else if (item === 'pause') {
                    const pauseImg = document.createElement('img');
                    pauseImg.src = 'images/Pause.svg';
                    pauseImg.alt = 'Pause';
                    pauseImg.onclick = () => togglePause();
                    gridItem.appendChild(pauseImg);
                    gridItem.classList.add('pause-button');
                } else if (item === 'puzzle-slot') {
                    gridItem.classList.add('puzzle-slot');
                } else if (item === 'answer') {
                    gridItem.classList.add('answer');
                }
            }
            gridContainer.appendChild(gridItem);
        });
    });
}

function createGridItems(container, layout) {
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
                    backImg.onclick = () => goBack();
                    gridItem.appendChild(backImg);
                    gridItem.classList.add('back-button');
                } else if (item === 'pause') {
                    const pauseImg = document.createElement('img');
                    pauseImg.src = 'images/Pause.svg';
                    pauseImg.alt = 'Pause';
                    pauseImg.onclick = () => togglePause();
                    gridItem.appendChild(pauseImg);
                    gridItem.classList.add('pause-button');
                } else if (item === 'puzzle-slot') {
                    gridItem.classList.add('puzzle-slot');
                } else if (item === 'answer') {
                    gridItem.classList.add('answer');
                }
            }

            container.appendChild(gridItem);
        });
    });
}

function goBack() {
    stopStopwatch();
    window.location.href = 'level.html'; // 메인 메뉴로 이동
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