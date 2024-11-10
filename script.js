// script.js

let currentPlayer = 'red'; // 'red' or 'green'
let isGameOver = false;
const board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

// Function to handle player's move
function makeMove(row, col) {
    if (isGameOver || board[row][col] !== '') {
        return;  // Ignore if the game is over or the cell is already filled
    }

    // Place the player's color in the selected cell
    board[row][col] = currentPlayer;

    // Update the cell's appearance
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    cell.classList.add(currentPlayer); // Add color class
    cell.textContent = currentPlayer === 'red' ? '🔴' : '🟢'; // Optional: add emojis

    // Check if current move wins the game
    if (checkWinner()) {
        document.getElementById('status').textContent = currentPlayer + ' WINS!';
        isGameOver = true;
    } else if (isBoardFull()) {
        document.getElementById('status').textContent = 'It\'s a draw!';
        isGameOver = true;
    } else {
        // Switch turns
        currentPlayer = currentPlayer === 'red' ? 'green' : 'red';
        document.getElementById('status').textContent = currentPlayer + '\'s turn';
    }
}

// Function to check if the board is full
function isBoardFull() {
    return board.flat().every(cell => cell !== '');
}

// Function to check if a player has won
function checkWinner() {
    const winCondition = checkRows() || checkColumns() || checkDiagonals();
    if (winCondition) {
        drawWinningLine(winCondition);
    }
    return winCondition;
}

// Function to draw a winning line
function drawWinningLine(winCondition) {
    const line = document.createElement('div');
    line.classList.add('win-line');
    document.querySelector('.container').appendChild(line);
    
    if (winCondition.type === 'row') {
        const row = winCondition.index;
        const top = row * 100 + 10; // Adjust position
        line.style.transform = `translateY(${top}px)`;
        line.style.height = '10px';
    } else if (winCondition.type === 'col') {
        const col = winCondition.index;
        const left = col * 100 + 10; // Adjust position
        line.style.transform = `translateX(${left}px)`;
        line.style.width = '10px';
    } else if (winCondition.type === 'diagonal') {
        line.style.transform = `rotate(45deg) translateY(-50%) translateX(50%)`; // Adjust for diagonal
        line.style.width = '150%'; // Cover full diagonal
        line.style.top = '10px';
    }
}

// Function to check winning conditions
function checkRows() {
    for (let row = 0; row < 3; row++) {
        if (board[row][0] === currentPlayer && board[row][1] === currentPlayer && board[row][2] === currentPlayer) {
            return { type: 'row', index: row };
        }
    }
    return false;
}

function checkColumns() {
    for (let col = 0; col < 3; col++) {
        if (board[0][col] === currentPlayer && board[1][col] === currentPlayer && board[2][col] === currentPlayer) {
            return { type: 'col', index: col };
        }
    }
    return false;
}

function checkDiagonals() {
    if (board[0][0] === currentPlayer && board[1][1] === currentPlayer && board[2][2] === currentPlayer) {
        return { type: 'diagonal' };
    }
    if (board[0][2] === currentPlayer && board[1][1] === currentPlayer && board[2][0] === currentPlayer) {
        return { type: 'diagonal' };
    }
    return false;
}

// Add event listeners for each cell
const cells = document.querySelectorAll('.cell');
cells.forEach(cell => {
    cell.addEventListener('click', function () {
        const row = this.dataset.row;
        const col = this.dataset.col;
        makeMove(row, col);
    });
});

// Reset game button
document.getElementById('reset').addEventListener('click', resetGame);

// Reset the game state
function resetGame() {
    currentPlayer = 'red';
    isGameOver = false;
    board.forEach((row, r) => row.forEach((_, c) => {
        board[r][c] = '';
        const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
        cell.classList.remove('red', 'green');
        cell.textContent = '';
    }));
    document.getElementById('status').textContent = currentPlayer + '\'s turn';
}
g