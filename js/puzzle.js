const imagePool = [
    'images/puzzles/image1.png',
    'images/puzzles/image2.jpg',
    'images/puzzles/image3.jpg'
];

let correctOrder = [];
let imagePieces = [];
let selectedPiece = null;

function getRandomImage() {
    if (imagePool.length === 0) {
        console.error('이미지 풀이 비어 있습니다.');
        return null;
    }
    const randomIndex = Math.floor(Math.random() * imagePool.length);
    return imagePool[randomIndex];
}

function startGame(imageIndex, rows, cols, callback) {
    const selectedImage = imageIndex !== null ? imagePool[imageIndex] : getRandomImage();
    if (!selectedImage) {
        console.error('선택된 이미지가 없습니다!');
        return;
    }
    sliceAndInitialize(selectedImage, rows, cols, callback);
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

function initializeGrid(rows, cols) {
    const puzzleSlots = Array.from(document.querySelectorAll('.puzzle-slot'));
    const answerSlots = Array.from(document.querySelectorAll('.answer'));

    const shuffledOrder = [...imagePieces].sort(() => Math.random() - 0.5);

    puzzleSlots.forEach((slot, index) => {
        slot.style.backgroundImage = shuffledOrder[index]
            ? `url('${shuffledOrder[index]}')`
            : '';
        slot.setAttribute('data-image', shuffledOrder[index] || '');
    });

    answerSlots.forEach((slot, index) => {
        slot.setAttribute('data-correct', correctOrder[index]);
        slot.removeAttribute('data-image');
    });
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

function checkAnswers() {
    const answerSlots = Array.from(document.querySelectorAll('.answer'));

    const isCorrect = answerSlots.every((slot, index) =>
        slot.getAttribute('data-image') === correctOrder[index]
    );

    if (isCorrect) {
        stopStopwatch();
        setTimeout(() => handleResult('success'), 500);
    }
}

function handleResult(result) {
    const levelText = document.querySelector('.level-text').textContent.split(' ')[1];
    const timerText = document.querySelector('.timer-text').textContent;

    window.location.href = `result.html?result=${result}&level=${encodeURIComponent(levelText)}&time=${encodeURIComponent(timerText)}`;
}