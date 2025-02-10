export const makeBotMove = (board, handleClick) => {
    const availableMoves = board
        .map((cell, index) => (cell === null ? index : null))
        .filter(index => index !== null);

    if (availableMoves.length === 0) return;

    const botSymbol = "O";
    const playerSymbol = "X";

    const size = Math.sqrt(board.length);

    const getWinningMove = (symbol) => {
        for (let move of availableMoves) {
            const tempBoard = [...board];
            tempBoard[move] = symbol;
            if (checkWinner(tempBoard, move, size)) {
                return move;
            }
        }
        return null;
    };

    const evaluateMove = (board, move, symbol, size) => {
        let score = 0;
        const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];

        for (const [dx, dy] of directions) {
            let count = 0;
            let openEnds = 0;
            for (let i = -4; i <= 4; i++) {
                const x = (move % size) + dx * i;
                const y = Math.floor(move / size) + dy * i;
                const index = y * size + x;

                if (x >= 0 && x < size && y >= 0 && y < size) {
                    if (board[index] === symbol) {
                        count++;
                    } else if (board[index] === null) {
                        openEnds++;
                    } else {
                        score += calculateScore(count, openEnds);
                        count = 0;
                        openEnds = 0;
                    }
                }
            }
            score += calculateScore(count, openEnds);
        }
        return score;
    };

    const calculateScore = (count, openEnds) => {
        if (count >= 5) return 10000;
        switch (count) {
            case 4: return openEnds === 2 ? 5000 : (openEnds === 1 ? 100 : 10);
            case 3: return openEnds >= 1 ? 50 : 5;
            case 2: return openEnds >= 1 ? 10 : 2;
            default: return 0;
        }
    };

    // 1. Check if the bot can win
    let botWinMove = getWinningMove(botSymbol);
    if (botWinMove !== null) {
        handleClick(botWinMove);
        return;
    }

    // 2. Prioritize blocking the player on EVERY move
    let bestBlockMove = null;
    let bestBlockScore = -Infinity;

    const shuffledMovesForBlock = [...availableMoves].sort(() => Math.random() - 0.5); // Shuffle for block choices too

    for (const move of shuffledMovesForBlock) {
        const tempBoard = [...board];
        tempBoard[move] = botSymbol;
        const playerScore = evaluateMove(tempBoard, move, playerSymbol, size); // Evaluate from player's perspective

        if (playerScore > bestBlockScore) {
            bestBlockScore = playerScore;
            bestBlockMove = move;
        }
    }

    if (bestBlockMove !== null) {
        handleClick(bestBlockMove);
        return;
    }

    // 3. If no immediate block is the absolute best, evaluate other moves (shuffle for randomness)
    let bestMove = null;
    let bestScore = -Infinity;
    const shuffledMoves = [...availableMoves].sort(() => Math.random() - 0.5);

    for (const move of shuffledMoves) {
        const tempBoard = [...board];
        tempBoard[move] = botSymbol;
        const score = evaluateMove(tempBoard, move, botSymbol, size);
        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }

    if (bestMove !== null) {
        handleClick(bestMove);
        return;
    }

    // 4. If no strategic move, choose a random one (least likely now)
    handleClick(availableMoves[Math.floor(Math.random() * availableMoves.length)]);
};

const checkWinner = (board, lastMove, size) => {
    if (lastMove === null) return false;

    const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];

    const checkDirection = (dx, dy) => {
        let count = 1;
        for (let dir of [-1, 1]) {
            let step = 1;
            while (true) {
                const x = (lastMove % size) + dx * step * dir;
                const y = Math.floor(lastMove / size) + dy * step * dir;
                const index = y * size + x;
                if (x < 0 || x >= size || y < 0 || y >= size || board[index] !== board[lastMove]) {
                    break;
                }
                count++;
                step++;
            }
        }
        return count >= 5;
    };

    return directions.some(([dx, dy]) => checkDirection(dx, dy));
};