// Function to check if a move results in a win on a small board
function checkWinOnSmallBoard(board, player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (let pattern of winPatterns) {
        if (board[pattern[0]] === player &&
            board[pattern[1]] === player &&
            board[pattern[2]] === player) {
            return true;
        }
    }
    return false;
}

// Function to get the state of a small board
function getSmallBoardState(bigX, bigY) {
    const boardState = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            boardState.push(val[bigX][bigY][i][j]);
        }
    }
    return boardState;
}

// Function to check if a move is winning
function isWinningMove(move, player) {
    const { bigX, bigY, smallX, smallY } = move;
    const boardState = getSmallBoardState(bigX, bigY);
    boardState[smallX * 3 + smallY] = player;
    return checkWinOnSmallBoard(boardState, player);
}

// Function to check if a move blocks the opponent from winning
function isBlockingMove(move, player) {
    const opponent = player === 'X' ? 'O' : 'X';
    return isWinningMove(move, opponent);
}

// Function to check if a move sends the opponent to a winning board
function sendsToWinningBoard(move) {
    const { smallX, smallY } = move;
    const boardState = getSmallBoardState(smallX, smallY);
    return checkWinOnSmallBoard(boardState, currentPlayer === 'X' ? 'O' : 'X');
}

function getAvailableMoves() {
    const moves = [];
    const allowedBoards = document.querySelectorAll('.small-board.allowed');
    
    allowedBoards.forEach(board => {
        const bigX = parseInt(board.getAttribute('data-big-x'));
        const bigY = parseInt(board.getAttribute('data-big-y'));
        
        board.querySelectorAll('.cell:not(.occupied)').forEach(cell => {
            const smallX = parseInt(cell.getAttribute('data-small-x'));
            const smallY = parseInt(cell.getAttribute('data-small-y'));
            moves.push({ bigX, bigY, smallX, smallY });
        });
    });
    
    return moves;
}

function makeAIMove() {
    const availableMoves = getAvailableMoves();
    if (availableMoves.length === 0) return;

    // Check for winning moves
    for (let move of availableMoves) {
        if (isWinningMove(move, aiPlayer)) {
            return makeMove(move.bigX, move.bigY, move.smallX, move.smallY);
        }
    }

    // Check for blocking moves
    for (let move of availableMoves) {
        if (isBlockingMove(move, aiPlayer)) {
            return makeMove(move.bigX, move.bigY, move.smallX, move.smallY);
        }
    }

    // Filter out moves that send the opponent to a winning board
    const safeMoves = availableMoves.filter(move => !sendsToWinningBoard(move));

    // If there are safe moves, choose randomly from them
    if (safeMoves.length > 0) {
        const randomMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];
        return makeMove(randomMove.bigX, randomMove.bigY, randomMove.smallX, randomMove.smallY);
    }

    // If no safe moves, choose randomly from all available moves
    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    return makeMove(randomMove.bigX, randomMove.bigY, randomMove.smallX, randomMove.smallY);
}