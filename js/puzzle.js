const imagePool = []; // 이미지 URL을 저장하는 전역 배열

async function fetchImages() {
    try {
        const response = await fetch('https://focuspuzzles3bucket.s3.ap-northeast-2.amazonaws.com/?list-type=2&prefix=images/puzzles/');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");

        const keys = Array.from(xmlDoc.getElementsByTagName("Key")).map(node => node.textContent);
        const baseUrl = 'https://focuspuzzles3bucket.s3.ap-northeast-2.amazonaws.com/';
        imagePool.push(...keys.map(key => baseUrl + key));

        if (imagePool.length === 0) {
            console.error('S3에서 가져온 이미지 목록이 비어 있습니다.');
        }
    } catch (error) {
        console.error('이미지 목록을 가져오는 중 오류 발생:', error);
    }
}

window.addEventListener('load', async () => {
    // 이미지 목록 가져오기
    await fetchImages();

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
    const gridSetup = setupGrid(level, rows, cols);
    if (!gridSetup || gridSetup.puzzleSlotCount === undefined || gridSetup.answerSlotCount === undefined) {
        console.error('setupGrid 함수의 반환값이 유효하지 않습니다.');
        return;
    }
    const { puzzleSlotCount, answerSlotCount } = gridSetup;

    if (puzzleSlotCount !== answerSlotCount) {
        console.error('퍼즐 슬롯과 정답 슬롯의 개수가 일치하지 않습니다!');
        return;
    }

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

function handleResult(result) {
    const levelText = document.querySelector('.level-text').textContent.split(' ')[1];
    const timerText = document.querySelector('.timer-text').textContent;
    const imageIndex = new URLSearchParams(window.location.search).get('imageIndex');

    // imagePool을 sessionStorage에 저장
    sessionStorage.setItem('imagePool', JSON.stringify(imagePool));

    window.location.href = `result.html?result=${result}&level=${encodeURIComponent(levelText)}&time=${encodeURIComponent(timerText)}&imageIndex=${imageIndex}`;
}