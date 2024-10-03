let currentPlayer = 'X';
let board = Array(9).fill(null);
let gameActive = true;

function startGame(againstCPU) {
    cpuGame = againstCPU;
    currentPlayer = 'X';  // O jogador 'X' sempre começa
    board.fill(null);
    gameActive = true;
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    document.getElementById('message').style.display = 'none';
    for (let i = 0; i < 9; i++) {
        let square = document.createElement('div');
        square.addEventListener('click', function() { makeMove(i); });
        gameBoard.appendChild(square);
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
    // Implementação do algoritmo minimax aqui para encontrar a melhor jogada
    let bestMove = findBestMove();
    makeMove(bestMove);
}

function findBestMove() {
    // Código para escolher a melhor jogada usando Minimax
    for (let i = 0; i < board.length; i++) {
        if (!board[i]) return i;  // Placeholder para o índice da melhor jogada
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
