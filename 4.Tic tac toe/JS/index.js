// Game state variables
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let gameMode = 'pvp'; // 'pvp' or 'ai'
let scores = { X: 0, O: 0, tie: 0 };

// Winning combinations
const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
];

// Initialize the game
function initGame() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('button');
        cell.className = 'cell';
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', () => handleCellClick(i));
        gameBoard.appendChild(cell);
    }

    updateCurrentPlayerDisplay();
    updateScoreDisplay();
}

// Handle cell click
function handleCellClick(index) {
    if (!gameActive || board[index] !== '') return;

    makeMove(index, currentPlayer);

    if (gameMode === 'ai' && gameActive && currentPlayer === 'O') {
        setTimeout(() => {
            makeAIMove();
        }, 500);
    }
}

// Make a move
function makeMove(index, player) {
    board[index] = player;
    const cell = document.querySelector(`[data-index="${index}"]`);
    cell.textContent = player;
    cell.classList.add('taken', player.toLowerCase());

    if (checkWinner()) {
        endGame(player);
    } else if (board.every(cell => cell !== '')) {
        endGame('tie');
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateCurrentPlayerDisplay();
    }
}

// AI move using minimax algorithm
function makeAIMove() {
    const bestMove = minimax(board, 'O').index;
    makeMove(bestMove, 'O');
}

// Minimax algorithm for AI
function minimax(newBoard, player) {
    const availableSpots = newBoard.map((spot, index) => spot === '' ? index : null).filter(val => val !== null);

    if (checkWinnerForBoard(newBoard, 'X')) {
        return { score: -10 };
    } else if (checkWinnerForBoard(newBoard, 'O')) {
        return { score: 10 };
    } else if (availableSpots.length === 0) {
        return { score: 0 };
    }

    const moves = [];

    for (let i = 0; i < availableSpots.length; i++) {
        const move = {};
        move.index = availableSpots[i];

        newBoard[availableSpots[i]] = player;

        if (player === 'O') {
            const result = minimax(newBoard, 'X');
            move.score = result.score;
        } else {
            const result = minimax(newBoard, 'O');
            move.score = result.score;
        }

        newBoard[availableSpots[i]] = '';
        moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

// Check winner for a given board state
function checkWinnerForBoard(boardState, player) {
    return winningCombinations.some(combination =>
        combination.every(index => boardState[index] === player)
    );
}

// Check for winner
function checkWinner() {
    for (let combination of winningCombinations) {
        if (combination.every(index => board[index] === currentPlayer)) {
            // Highlight winning cells
            combination.forEach(index => {
                document.querySelector(`[data-index="${index}"]`).classList.add('winning-cell');
            });
            return true;
        }
    }
    return false;
}

// End the game
function endGame(winner) {
    gameActive = false;
    const winnerMessage = document.getElementById('winnerMessage');

    if (winner === 'tie') {
        winnerMessage.textContent = "It's a Tie!";
        winnerMessage.className = 'winner-message show tie';
        scores.tie++;
    } else {
        if (gameMode === 'ai') {
            if (winner === 'X') {
                winnerMessage.textContent = "Human Wins!";
                winnerMessage.className = 'winner-message show win';
            } else {
                winnerMessage.textContent = "Computer Wins!";
                winnerMessage.className = 'winner-message show lose';
            }
        } else {
            winnerMessage.textContent = `Player ${winner} Wins!`;
            winnerMessage.className = 'winner-message show win';
        }
        scores[winner]++;
    }

    updateScoreDisplay();
}

// Set game mode
function setGameMode(mode) {
    gameMode = mode;
    const buttons = document.querySelectorAll('.mode-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    if (mode === 'pvp') {
        buttons[0].classList.add('active');
        document.getElementById('playerOLabel').textContent = 'Player O';
    } else {
        buttons[1].classList.add('active');
        document.getElementById('playerOLabel').textContent = 'Computer';
    }

    resetGame();
}

// Reset the game
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;

    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.className = 'cell';
    });

    const winnerMessage = document.getElementById('winnerMessage');
    winnerMessage.className = 'winner-message';

    updateCurrentPlayerDisplay();
}

// Update current player display
function updateCurrentPlayerDisplay() {
    const currentPlayerElement = document.getElementById('currentPlayer');
    if (gameMode === 'ai') {
        currentPlayerElement.textContent = currentPlayer === 'X' ? 'Human Turn (X)' : 'Computer Turn (O)';
    } else {
        currentPlayerElement.textContent = `Current Player: ${currentPlayer}`;
    }
}

// Update score display
function updateScoreDisplay() {
    document.getElementById('scoreX').textContent = scores.X;
    document.getElementById('scoreO').textContent = scores.O;
    document.getElementById('scoreTie').textContent = scores.tie;
}

// Initialize the game when the page loads
initGame();