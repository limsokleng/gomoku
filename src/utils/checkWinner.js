export const checkWinner = (newBoard, lastMove, size) => {
    if (lastMove === null) return;
    const directions = [
        [1, 0], // Horizontal
        [0, 1], // Vertical
        [1, 1], // Diagonal \
        [1, -1], // Diagonal /
    ];

    const checkDirection = (dx, dy) => {
        let count = 1;
        let tiles = [lastMove];
        for (let dir of [-1, 1]) {
            let step = 1;
            while (true) {
                const x = (lastMove % size) + dx * step * dir;
                const y = Math.floor(lastMove / size) + dy * step * dir;
                const index = y * size + x;
                if (x < 0 || x >= size || y < 0 || y >= size || newBoard[index] !== newBoard[lastMove]) {
                    break;
                }
                count++;
                tiles.push(index);
                step++;
            }
        }
        return count >= 5 ? tiles : null;
    };

    for (const [dx, dy] of directions) {
        const tiles = checkDirection(dx, dy);
        if (tiles) {
            return { winner: newBoard[lastMove], winningTiles: tiles };
        }
    }
    return null;
};