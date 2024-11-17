window.addEventListener('load', () => {
    resetAlertState();

    const urlParams = new URLSearchParams(window.location.search);
    const level = urlParams.get('level'); // URL에서 level 값 가져오기

    if (level) {
        // 레벨에 따른 행(row)과 열(col) 설정
        const rows = level === '1' ? 2 : level === '2' ? 3 : level === '3' ? 4 : 0;
        const cols = rows; // 행과 열이 동일한 정사각형 퍼즐

        if (rows === 0 || cols === 0) {
            console.error("잘못된 레벨 정보입니다!");
            return;
        }

        // 레벨 표시 업데이트
        const levelText = document.querySelector('.level-text');
        levelText.textContent = `Level ${level}`;

        // 동적으로 grid-container 구성
        setupGrid(level, rows, cols);

        // 퍼즐 게임 시작
        startGameWithRandomImage(rows, cols);
    } else {
        console.error("레벨 정보가 없습니다!");
    }
});

function setupGrid(level) {
    const gridContainer = document.querySelector('.grid-container');
    gridContainer.innerHTML = ''; // 기존 그리드 초기화
    gridContainer.className = `grid-container level-${level}`; // 레벨에 맞는 클래스 추가

    let layout;
    if (level === '1') {
        layout = [
            ['back', '', '', 'pause'],
            ['puzzle-slot', 'answer', 'answer', 'puzzle-slot'],
            ['puzzle-slot', 'answer', 'answer', 'puzzle-slot'],
        ];
    } else if (level === '2') {
        layout = [
            ['back', 'puzzle-slot', 'puzzle-slot', 'puzzle-slot', 'pause'],
            ['puzzle-slot', 'answer', 'answer', 'answer', 'puzzle-slot'],
            ['puzzle-slot', 'answer', 'answer', 'answer', 'puzzle-slot'],
            ['puzzle-slot', 'answer', 'answer', 'answer', 'puzzle-slot']
        ];
    } else if (level === '3') {
        layout = [
            ['back', 'puzzle-slot', 'puzzle-slot', 'puzzle-slot', 'puzzle-slot', 'pause'],
            ['puzzle-slot', 'answer', 'answer', 'answer', 'answer', 'puzzle-slot'],
            ['puzzle-slot', 'answer', 'answer', 'answer', 'answer', 'puzzle-slot'],
            ['puzzle-slot', 'answer', 'answer', 'answer', 'answer', 'puzzle-slot'],
            ['puzzle-slot', 'answer', 'answer', 'answer', 'answer', 'puzzle-slot'],
            ['', 'answer', 'answer', 'answer', 'answer', ''],
        ];
    }

    createGridItems(gridContainer, layout);
}

function createGridItems(container, layout) {
    let puzzleSlotCount = 0; // 실제 puzzle-slot 개수
    let answerSlotCount = 0; // 실제 answer 개수

    layout.forEach(row => {
        row.forEach(item => {
            const gridItem = document.createElement('div');

            if (item === '') {
                // 빈 슬롯: 디자인 없이 공간 유지
                gridItem.className = 'grid-item empty-slot';
            } else {
                gridItem.className = 'grid-item';
                if (item === 'back') {
                    const backImg = document.createElement('img');
                    backImg.src = 'images/Back.svg';
                    backImg.alt = 'Back';
                    backImg.onclick = handleBackButtonClick;
                    gridItem.appendChild(backImg);
                    gridItem.classList.add('back-button');
                } else if (item === 'pause') {
                    const pauseImg = document.createElement('img');
                    pauseImg.src = 'images/Pause.svg';
                    pauseImg.alt = 'Pause';
                    pauseImg.onclick = handlePauseButtonClick;
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

            container.appendChild(gridItem);
        });
    });

    // 총 puzzle-slot과 answer 개수 반환
    return { puzzleSlotCount, answerSlotCount };
}

function handleBackButtonClick() {
    goBack();
}

function handlePauseButtonClick() {
    togglePause();
}