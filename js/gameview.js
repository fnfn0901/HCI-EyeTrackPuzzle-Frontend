window.onload = () => {
    resetAlertState(); // alert.js
    startStopwatch(); // stopwatch.js
    const imageUrl = 'images/elephant_full.png';
    sliceImage(imageUrl, 3, 3); // puzzle.js
};