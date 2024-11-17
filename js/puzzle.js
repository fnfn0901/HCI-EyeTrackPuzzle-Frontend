let correctOrder = [];
let imagePieces = [];
let selectedPiece = null;

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
        initializeGame();
    };
}

function initializeGame() {
    const puzzleSlots = Array.from(document.querySelectorAll('.puzzle-slot'));
    const answerSlots = Array.from(document.querySelectorAll('.answer'));
    const shuffledOrder = [...imagePieces].sort(() => Math.random() - 0.5);

    puzzleSlots.forEach((slot, index) => {
        if (shuffledOrder[index]) {
            slot.style.backgroundImage = `url('${shuffledOrder[index]}')`;
            slot.setAttribute('data-image', shuffledOrder[index]);
        }
    });

    answerSlots.forEach((slot, index) => {
        slot.setAttribute('data-correct', correctOrder[index]);
        slot.removeAttribute('data-image');
    });

    [...puzzleSlots, ...answerSlots].forEach(slot => {
        slot.addEventListener('click', () => handleSlotClick(slot));
    });
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
        }
        else {
            const tempImage = slot.style.backgroundImage;
            const tempData = slot.getAttribute('data-image');

            slot.style.backgroundImage = selectedPiece.style.backgroundImage;
            slot.setAttribute('data-image', selectedPiece.getAttribute('data-image'));

            selectedPiece.style.backgroundImage = tempImage;
            selectedPiece.setAttribute('data-image', tempData);

            selectedPiece.style.outline = '';
            selectedPiece = null;
        }
    }
    else if (slot.getAttribute('data-image')) {
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