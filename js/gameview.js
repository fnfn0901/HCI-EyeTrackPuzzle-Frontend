window.addEventListener('load', () => {
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
    setupGrid(level, rows, cols);

    // 퍼즐 게임 시작
    startGame(imageIndex, rows, cols);

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
    // 이미지가 로드된 이후 스피너를 숨기도록 콜백 연결
    startGame(imageIndex, rows, cols, () => {
        hideLoadingSpinner();
    });
}

function setupGrid(level, rows, cols) {
    const gridContainer = document.querySelector('.grid-container');
    gridContainer.innerHTML = ''; // 기존 그리드 초기화
    gridContainer.className = `grid-container level-${level}`; // 레벨에 맞는 클래스 추가

    // 레벨별 레이아웃 정의
    const layout = level === '1'
        ? [
            ['back', '', '', 'pause'],
            ['puzzle-slot', 'answer', 'answer', 'puzzle-slot'],
            ['puzzle-slot', 'answer', 'answer', 'puzzle-slot'],
        ]
        : level === '2'
        ? [
            ['back', 'puzzle-slot', 'puzzle-slot', 'puzzle-slot', 'pause'],
            ['puzzle-slot', 'answer', 'answer', 'answer', 'puzzle-slot'],
            ['puzzle-slot', 'answer', 'answer', 'answer', 'puzzle-slot'],
            ['puzzle-slot', 'answer', 'answer', 'answer', 'puzzle-slot'],
        ]
        : [
            ['back', 'puzzle-slot', 'puzzle-slot', 'puzzle-slot', 'puzzle-slot', 'pause'],
            ['puzzle-slot', 'answer', 'answer', 'answer', 'answer', 'puzzle-slot'],
            ['puzzle-slot', 'answer', 'answer', 'answer', 'answer', 'puzzle-slot'],
            ['puzzle-slot', 'answer', 'answer', 'answer', 'answer', 'puzzle-slot'],
            ['puzzle-slot', 'answer', 'answer', 'answer', 'answer', 'puzzle-slot'],
            ['', 'puzzle-slot', 'puzzle-slot', 'puzzle-slot', 'puzzle-slot', ''],
        ];

    createGridItems(gridContainer, layout);
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