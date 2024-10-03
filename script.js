let currentPlayer = 'X';
let board = Array(9).fill(null);
let gameActive = true;
let difficulty = "impossible";

function updateBoard() {
    const squares = document.querySelectorAll('#gameBoard div');
    squares.forEach((square, index) => {
        square.innerText = board[index]; // Atualiza o texto de cada quadrado com o valor correspondente no array do tabuleiro
    });
}

function displayMessage(message) {
    const messageElement = document.getElementById('message');
    messageElement.innerText = message;
    messageElement.style.display = 'block'; // Torna o elemento visível
}


function startGame(againstCPU) {
    cpuGame = againstCPU;
    currentPlayer = 'X';
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

function setDifficulty(level) {
    difficulty = level;
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

function cpuMove() {
    let bestMove = findBestMove(board, currentPlayer, difficulty);
    makeMove(bestMove);
}

function findBestMove(board, player, difficulty) {
    let opponent = player === 'O' ? 'X' : 'O';
    let bestVal = -Infinity;
    let bestMove = -1;
    board.forEach((cell, index) => {
        if (cell === null) {
            board[index] = player;
            let moveVal = minimax(board, 0, false, player, difficulty);
            board[index] = null;
            if (moveVal > bestVal) {
                bestVal = moveVal;
                bestMove = index;
            }
        }
    });
    return bestMove;
}

function minimax(board, depth, isMax, player, difficulty) {
    let opponent = player === 'O' ? 'X' : 'O';
    let maxDepth = getMaxDepth(difficulty);
    let winner = null;
    if (checkWin(player)) winner = player;
    else if (checkWin(opponent)) winner = opponent;

    if (winner === player) return 10 - depth;
    else if (winner === opponent) return depth - 10;
    else if (!board.includes(null) || depth >= maxDepth) return 0;

    if (isMax) {
        let best = -Infinity;
        board.forEach((cell, index) => {
            if (cell === null) {
                board[index] = player;
                best = Math.max(best, minimax(board, depth + 1, !isMax, player, difficulty));
                board[index] = null;
            }
        });
        return best;
    } else {
        let best = Infinity;
        board.forEach((cell, index) => {
            if (cell === null) {
                board[index] = opponent;
                best = Math.min(best, minimax(board, depth + 1, !isMax, player, difficulty));
                board[index] = null;
            }
        });
        return best;
    }
}

function getMaxDepth(difficulty) {
    if (difficulty === "easy") return 2;
    if (difficulty === "medium") return 4;
    return Infinity;  // Impossível é a máxima profundidade
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
