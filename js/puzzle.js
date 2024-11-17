const imagePool = [
    'images/puzzles/image1.png',
    'images/puzzles/image2.jpg',
    'images/puzzles/image3.jpg'
];

let correctOrder = [];
let imagePieces = [];
let selectedPiece = null;

function startGameWithRandomImage(rows, cols) {
    const randomIndex = Math.floor(Math.random() * imagePool.length);
    const selectedImage = imagePool[randomIndex];
    sliceImage(selectedImage, rows, cols);
}

function sliceImage(imageUrl, rows, cols) {
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
        initializeGame(rows, cols);
    };
}

function initializeGame(rows, cols) {
    const totalPieces = rows * cols;
    const puzzleSlots = Array.from(document.querySelectorAll('.puzzle-slot'));
    const answerSlots = Array.from(document.querySelectorAll('.answer'));
    const totalSlots = puzzleSlots.length;

    if (totalSlots !== totalPieces) {
        console.error(`그리드(${totalSlots})와 퍼즐 조각(${totalPieces})의 수가 일치하지 않습니다!`);
        return;
    }

    const shuffledOrder = [...imagePieces].sort(() => Math.random() - 0.5);

    // 퍼즐 슬롯에 섞인 조각 배치
    puzzleSlots.forEach((slot, index) => {
        if (shuffledOrder[index]) {
            slot.style.backgroundImage = `url('${shuffledOrder[index]}')`;
            slot.setAttribute('data-image', shuffledOrder[index]);
        }
    });

    // 답 슬롯에 정답 데이터 설정
    answerSlots.forEach((slot, index) => {
        slot.setAttribute('data-correct', correctOrder[index]);
        slot.removeAttribute('data-image'); // 초기 상태에서는 이미지 없음
    });

    // 이벤트 리스너 등록
    [...puzzleSlots, ...answerSlots].forEach(slot => {
        slot.addEventListener('click', () => handleSlotClick(slot));
    });
}

function handleSlotClick(slot) {
    if (selectedPiece) {
        if (!slot.getAttribute('data-image')) {
            // 빈 슬롯으로 이동
            slot.style.backgroundImage = selectedPiece.style.backgroundImage;
            slot.setAttribute('data-image', selectedPiece.getAttribute('data-image'));
            selectedPiece.style.backgroundImage = '';
            selectedPiece.removeAttribute('data-image');
            selectedPiece.style.outline = '';
            selectedPiece = null;

            checkAnswers(); // 정답 체크
        } else {
            // 슬롯 간 교환
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
        // 조각 선택
        if (selectedPiece) {
            selectedPiece.style.outline = '';
        }
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
        setTimeout(() => {
            handleResult('success');
        }, 500);
    }
}

function handleResult(result) {
    const levelText = document.querySelector('.level-text').textContent;
    const timerText = document.querySelector('.timer-text').textContent;
    window.location.href = `result.html?result=${result}&level=${encodeURIComponent(levelText)}&time=${encodeURIComponent(timerText)}`;
}