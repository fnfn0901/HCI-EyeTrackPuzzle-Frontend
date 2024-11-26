let selectedPiece = null;

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
    } else {
        console.error('로딩 스피너 엘리먼트가 존재하지 않습니다.');
    }
}

function hideLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner && spinner.style.display !== 'none') {
        spinner.style.display = 'none';
    } else {
        console.error('로딩 스피너 엘리먼트가 존재하지 않습니다.');
    }
}

function startGameWithLoading(imageIndex, rows, cols) {
    startGame(imageIndex, rows, cols, () => {
        hideLoadingSpinner();
    });
}

function startGame(imageIndex, rows, cols) {
    const selectedImage = imageIndex !== null && imageIndex >= 0 && imageIndex < imagePool.length
        ? imagePool[imageIndex]
        : getRandomImage();

    if (!selectedImage) {
        hideLoadingSpinner(); // 로딩 스피너 숨김
        return;
    }
    sliceAndInitialize(selectedImage, rows, cols);
}

function sliceAndInitialize(imageUrl, rows, cols) {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const aspectRatioImage = img.width / img.height;
        const aspectRatioGrid = cols / rows;

        // 이미지와 그리드의 비율 차이에 따라 확대/축소 결정
        let sx, sy, sWidth, sHeight;
        if (aspectRatioImage > aspectRatioGrid) {
            // 이미지가 더 넓은 경우: 세로를 기준으로 확대
            sHeight = img.height;
            sWidth = sHeight * aspectRatioGrid;
            sx = (img.width - sWidth) / 2;
            sy = 0;
        } else {
            // 이미지가 더 높은 경우: 가로를 기준으로 확대
            sWidth = img.width;
            sHeight = sWidth / aspectRatioGrid;
            sx = 0;
            sy = (img.height - sHeight) / 2;
        }

        const pieceWidth = sWidth / cols;
        const pieceHeight = sHeight / rows;

        correctOrder = [];
        imagePieces = [];

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                canvas.width = pieceWidth;
                canvas.height = pieceHeight;

                ctx.drawImage(
                    img,
                    sx + col * pieceWidth,
                    sy + row * pieceHeight,
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

        // 로딩 스피너 숨기기
        hideLoadingSpinner();
    };

    img.onerror = () => {
        console.error(`이미지 로드 실패: ${imageUrl}`);
        // 로딩 스피너 숨기기
        hideLoadingSpinner();
    };
}

function setupEventListeners() {
    const slots = document.querySelectorAll('.puzzle-slot, .answer');
    slots.forEach(slot => slot.addEventListener('click', () => handleSlotClick(slot)));
}

function handleSlotClick(slot) {
    if (selectedPiece) {
        if (!slot.getAttribute('data-image')) {
            slot.style.backgroundImage = selectedPiece.style.backgroundImage;
            slot.setAttribute('data-image', selectedPiece.getAttribute('data-image'));
            selectedPiece.style.backgroundImage = '';
            selectedPiece.removeAttribute('data-image');
            selectedPiece.style.outline = '';
            selectedPiece = null;

            checkAnswers();
        } else {
            const tempImage = slot.style.backgroundImage;
            const tempData = slot.getAttribute('data-image');

            slot.style.backgroundImage = selectedPiece.style.backgroundImage;
            slot.setAttribute('data-image', selectedPiece.getAttribute('data-image'));

            selectedPiece.style.backgroundImage = tempImage;
            selectedPiece.setAttribute('data-image', tempData);

            selectedPiece.style.outline = '';
            selectedPiece = null;
        }
    } else if (slot.getAttribute('data-image')) {
        if (selectedPiece) selectedPiece.style.outline = '';
        selectedPiece = slot;
        selectedPiece.style.outline = '4px solid #FF8181';
    }
}

function initializeGrid(rows, cols) {
    const puzzleSlots = Array.from(document.querySelectorAll('.puzzle-slot'));
    const answerSlots = Array.from(document.querySelectorAll('.answer'));

    // 정답 슬롯에 정답 이미지 배치
    answerSlots.forEach((slot, index) => {
        if (correctOrder[index]) {
            slot.style.backgroundImage = `url('${correctOrder[index]}')`;
            slot.style.backgroundSize = 'cover';
            slot.setAttribute('data-image', correctOrder[index]);
            slot.setAttribute('data-correct', correctOrder[index]);
        }
    });

    setTimeout(() => {

        answerSlots.forEach(slot => {
            slot.style.backgroundImage = '';
            slot.removeAttribute('data-image');
        });

        const shuffledOrder = [...imagePieces].sort(() => Math.random() - 0.5);
        puzzleSlots.forEach((slot, index) => {
            if (shuffledOrder[index]) {
                slot.style.backgroundImage = `url('${shuffledOrder[index]}')`;
                slot.style.backgroundSize = 'cover';
                slot.setAttribute('data-image', shuffledOrder[index]);
            } else {
                slot.style.backgroundImage = '';
                slot.removeAttribute('data-image');
            }
        });

        startStopwatch();
    }, 1000);
}

function checkAnswers() {
    const answerSlots = Array.from(document.querySelectorAll('.answer'));

    const isCorrect = answerSlots.every((slot, index) =>
        slot.getAttribute('data-image') === correctOrder[index]
    );

    if (isCorrect) {
        stopStopwatch();
        setTimeout(() => {
            handleResult('success');
        }, 500);
    }
}

function getRandomImage() {
    const randomIndex = Math.floor(Math.random() * imagePool.length);
    return imagePool[randomIndex];
}

function setupGrid(level, rows, cols) {
    const gridContainer = document.querySelector('.grid-container');
    gridContainer.innerHTML = ''; // 기존 그리드 초기화
    gridContainer.className = `grid-container level-${level}`; // 레벨에 맞는 클래스 추가

    const layout = getLayoutForLevel(level); // 레이아웃 가져오기

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

    console.log("Grid 슬롯 상태:", { puzzleSlotCount, answerSlotCount }); // 디버깅용
    return { puzzleSlotCount, answerSlotCount }; // 항상 반환
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