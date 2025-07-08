const player1 = localStorage.getItem('player1') || 'Player X';
const player2 = localStorage.getItem('player2') || 'Player O';

const game = document.getElementById('game');
const message = document.getElementById('message');
let currentPlayer = 'X';
let val = [
    [[[null, null, null], [null, null, null], [null, null, null]], [[null, null, null], [null, null, null], [null, null, null]], [[null, null, null], [null, null, null], [null, null, null]]],
    [[[null, null, null], [null, null, null], [null, null, null]], [[null, null, null], [null, null, null], [null, null, null]], [[null, null, null], [null, null, null], [null, null, null]]],
    [[[null, null, null], [null, null, null], [null, null, null]], [[null, null, null], [null, null, null], [null, null, null]], [[null, null, null], [null, null, null], [null, null, null]]]
];
let mainBoard = [[null, null, null], [null, null, null], [null, null, null]];
let refreshCount = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
let lastMove = null;
let isFirstMove = true;
let isAIGame = false;
let aiPlayer = 'O';
let humanPlayer = 'X';
let gameStarted = false;
let aiDifficulty = 'easy';

function checkWin(board) {
    for (let i = 0; i < 3; i++) {
        if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) return board[i][0];
        if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i]) return board[0][i];
    }
    if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) return board[0][0];
    if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) return board[0][2];
    return null;
}

function isBoardFull(board) {
    for (let row of board) {
        for (let cell of row) {
            if (!cell) return false;
        }
    }
    return true;
}

function resetRefreshCount() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            refreshCount[i][j] = 0;
        }
    }
}

function highlightAllowedBoard(i, j) {
    document.querySelectorAll('.small-board').forEach(board => board.classList.remove('allowed'));
    if (isFirstMove || mainBoard[i][j] !== null) {
        document.querySelectorAll('.small-board').forEach(board => {
            const bigX = parseInt(board.getAttribute('data-big-x'));
            const bigY = parseInt(board.getAttribute('data-big-y'));
            if (mainBoard[bigX][bigY] === null) {
                board.classList.add('allowed');
            }
        });
    } else {
        document.querySelector(`.small-board[data-big-x="${i}"][data-big-y="${j}"]`).classList.add('allowed');
    }
}

function handleClick(event) {
    if (!event.target.classList.contains('cell')) return;
    if (isAIGame && currentPlayer !== humanPlayer) return;

    const cell = event.target;
    const smallBoard = cell.parentElement;
    const bigX = parseInt(smallBoard.getAttribute('data-big-x'));
    const bigY = parseInt(smallBoard.getAttribute('data-big-y'));
    const smallX = parseInt(cell.getAttribute('data-small-x'));
    const smallY = parseInt(cell.getAttribute('data-small-y'));

    if (cell.textContent || !smallBoard.classList.contains('allowed')) {
        message.textContent = "Invalid move!";
        return;
    }

    makeMove(bigX, bigY, smallX, smallY);

    if (isAIGame && !checkGameOver()) {
        setTimeout(() => {
            if (aiDifficulty === 'easy') {
                makeEasyAIMove();
            } else {
                makeAIMove();
            }
        }, 1000);
    }
}

function makeMove(bigX, bigY, smallX, smallY) {
    const cell = document.querySelector(`.small-board[data-big-x="${bigX}"][data-big-y="${bigY}"] .cell[data-small-x="${smallX}"][data-small-y="${smallY}"]`);
    
    cell.classList.remove('hover-x', 'hover-o');
    val[bigX][bigY][smallX][smallY] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add('occupied');

    const winner = checkWin(val[bigX][bigY]);
    if (winner) {
        mainBoard[bigX][bigY] = winner;
        const smallBoard = cell.parentElement;
        smallBoard.classList.add('completed');
        smallBoard.setAttribute('data-winner', winner);
        resetRefreshCount();
    } else if (isBoardFull(val[bigX][bigY])) {
        refreshCount[bigX][bigY]++;
        if (refreshCount[bigX][bigY] > 2) {
            mainBoard[bigX][bigY] = 'T';
            const smallBoard = cell.parentElement;
            smallBoard.classList.add('completed');
            smallBoard.setAttribute('data-winner', 'T');
        } else {
            val[bigX][bigY] = [[null, null, null], [null, null, null], [null, null, null]];
            document.querySelectorAll(`.small-board[data-big-x="${bigX}"][data-big-y="${bigY}"] .cell`).forEach(cell => cell.textContent = '');
        }
    }

    lastMove = { i: smallX, j: smallY };
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    isFirstMove = false;
    highlightAllowedBoard(smallX, smallY);

    updateGameStatus();
}

function updateGameStatus() {
    if (checkFullBoardTie()) {
        message.textContent = 'Game is tied!';
        game.removeEventListener('click', handleClick);
        return;
    }

    const mainWinner = checkWin(mainBoard);
    if (mainWinner) {
        message.textContent = `${mainWinner === 'T' ? 'Game is tied!' : mainWinner + ' wins the game!'}`;
        game.removeEventListener('click', handleClick);
    } else {
        message.textContent = `${currentPlayer === 'X' ? player1 : player2}'s turn.`;

    }
}

function checkGameOver() {
    return checkWin(mainBoard) || checkFullBoardTie();
}

function checkFullBoardTie() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (mainBoard[i][j] === null) return false;
        }
    }
    return checkWin(mainBoard) === null;
}

function resetGame() {
    currentPlayer = 'X';
    val = [
        [[[null, null, null], [null, null, null], [null, null, null]], [[null, null, null], [null, null, null], [null, null, null]], [[null, null, null], [null, null, null], [null, null, null]]],
        [[[null, null, null], [null, null, null], [null, null, null]], [[null, null, null], [null, null, null], [null, null, null]], [[null, null, null], [null, null, null], [null, null, null]]],
        [[[null, null, null], [null, null, null], [null, null, null]], [[null, null, null], [null, null, null], [null, null, null]], [[null, null, null], [null, null, null], [null, null, null]]]
    ];
    mainBoard = [[null, null, null], [null, null, null], [null, null, null]];
    refreshCount = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    lastMove = null;
    isFirstMove = true;
    gameStarted = false;
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('occupied');
    });
    document.querySelectorAll('.small-board').forEach(board => {
        board.classList.remove('completed');
        board.removeAttribute('data-winner');
    });
    highlightAllowedBoard(0, 0);
    message.textContent = `${currentPlayer === 'X' ? player1 : player2}'s turn.`;

    game.addEventListener('click', handleClick);
}

function addHoverEffect() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.addEventListener('mouseenter', () => {
            const smallBoard = cell.parentElement;
            if (smallBoard.classList.contains('allowed') && !cell.textContent) {
                cell.classList.add(currentPlayer === 'X' ? 'hover-x' : 'hover-o');
            }
        });

        cell.addEventListener('mouseleave', () => {
            cell.classList.remove('hover-x', 'hover-o');
        });
    });
}

function startAIGame(aiStarts) {
    isAIGame = true;
    aiPlayer = aiStarts ? 'X' : 'O';
    humanPlayer = aiStarts ? 'O' : 'X';
    resetGame();
    gameStarted = true;
    if (aiStarts) {
        currentPlayer = 'X'; // Ensure it's set to X for AI's first move
        if (aiDifficulty === 'easy') {
            makeEasyAIMove();
        } else {
            makeAIMove();
        }
    }
}

function makeEasyAIMove() {
    const availableMoves = getAvailableMoves();
    if (availableMoves.length === 0) return;

    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    makeMove(randomMove.bigX, randomMove.bigY, randomMove.smallX, randomMove.smallY);
}

// Initialize game
game.addEventListener('click', handleClick);
document.getElementById('reset').addEventListener('click', resetGame);
highlightAllowedBoard(0, 0);
addHoverEffect();

// Initialize AI game if coming from AI start choice
window.addEventListener('load', () => {
    const aiStarts = localStorage.getItem('aiStarts');
    aiDifficulty = localStorage.getItem('aiDifficulty') || 'easy';
    if (aiStarts !== null) {
        startAIGame(aiStarts === 'true');
        localStorage.removeItem('aiStarts');
    }
});

document.getElementById('back-button').addEventListener('click', function(event) {
    if (gameStarted) {
        event.preventDefault();
        if (confirm('Are you sure you want to go back? Your game progress will be lost.')) {
            window.location.href = 'index.html';
        }
    } else {
        window.location.href = 'index.html';
    }
});






// Set gameStarted to true when the first move is made
game.addEventListener('click', function() {
    if (!gameStarted) {
        gameStarted = true;
    }
}, { once: true });