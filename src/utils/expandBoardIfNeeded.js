export const expandBoardIfNeeded = (newBoard, index, size, expansions, maxExpansions, setSize, setBoard, setExpansions) => {
    if (expansions >= maxExpansions) return;

    const row = Math.floor(index / size);
    const col = index % size;
    const threshold = 2; // Number of cells from the edge to trigger expansion

    if (row < threshold || row >= size - threshold || col < threshold || col >= size - threshold) {
        const newSize = size + 2;
        const expandedBoard = Array(newSize * newSize).fill(null);

        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                expandedBoard[(r + 1) * newSize + (c + 1)] = newBoard[r * size + c];
            }
        }

        setSize(newSize);
        setBoard(expandedBoard);
        setExpansions(expansions + 1);
    }
};