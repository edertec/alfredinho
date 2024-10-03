let currentPlayer = 'X';
let board = Array(9).fill(null);
let gameActive = true;

function startGame(againstCPU) {
    cpuGame = againstCPU;
    currentPlayer = 'X';  // O jogador 'X' sempre começa
    board.fill(null);
    gameActive = true;
    document.getElementById('gameBoard').innerHTML = '';
    document.getElementById('message').style.display = 'none';
    for (let i = 0; i < 9; i++) {
        let square = document.createElement('div');
        square.addEventListener('click', function() { makeMove(i); });
        document.getElementById('gameBoard').appendChild(square);
    }
}

function makeMove(index) {
    if (!board[index] && gameActive) {
        board[index] = currentPlayer;
        updateBoard();
        if (checkWin(currentPlayer)) {
            displayMessage(`${currentPlayer} venceu!`);
            gameActive = false;
            return;
        }
        if (!board.includes(null)) {
            displayMessage("Empate!");
            gameActive = false;
            return;
        }
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (cpuGame && currentPlayer === 'O') {
            setTimeout(cpuMove, 300);
        }
    }
}

function updateBoard() {
    const squares = document.querySelectorAll('#gameBoard div');
    squares.forEach((square, index) => {
        square.innerText = board[index];
    });
}

function displayMessage(message) {
    const messageElement = document.getElementById('message');
    messageElement.innerText = message;
    messageElement.style.display = 'block';
}

function cpuMove() {
    let bestMove = findBestMove(board, currentPlayer);
    makeMove(bestMove);
}

function findBestMove(board, player) {
    let opponent = player === 'O' ? 'X' : 'O';
    let bestVal = -Infinity;
    let bestMove = -1;
    board.forEach((cell, index) => {
        if (cell === null) {
            board[index] = player;
            let moveVal = minimax(board, false, player);
            board[index] = null;
            if (moveVal > bestVal) {
                bestVal = moveVal;
                bestMove = index;
            }
        }
    });
    return bestMove;
}

function minimax(board, isMax, player) {
    let opponent = player === 'O' ? 'X' : 'O';
    let winner = null;
    if (checkWin(player)) winner = player;
    else if (checkWin(opponent)) winner = opponent;

    if (winner === player) return 10;
    else if (winner === opponent) return -10;
    else if (!board.includes(null)) return 0;  // Empate

    if (isMax) {
        let best = -Infinity;
        board.forEach((cell, index) => {
            if (cell === null) {
                board[index] = player;
                best = Math.max(best, minimax(board, !isMax, player));
                board[index] = null;
            }
        });
        return best;
    } else {
        let best = Infinity;
        board.forEach((cell, index) => {
            if (cell === null) {
                board[index] = opponent;
                best = Math.min(best, minimax(board, !isMax, player));
                board[index] = null;
            }
        });
        return best;
    }
}

function checkWin(player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Linhas
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Colunas
        [0, 4, 8], [2, 4, 6]              // Diagonais
    ];
    return winPatterns.some(pattern => {
        return pattern.every(index => board[index] === player);
    });
}
