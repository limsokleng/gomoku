import { useState, useEffect, useCallback } from "react";
import './App.css';
import gomokuImage from './gomoku.png'; // Ensure the image is in the src folder
import { checkWinner } from './utils/checkWinner';
import { expandBoardIfNeeded } from './utils/expandBoardIfNeeded';
import { makeBotMove } from './utils/makeBotMove';

function Modal({ winner, onPlayAgain }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Congratulations!</h2>
        <h5>Player {winner} wins!</h5>
        <button onClick={onPlayAgain} className="play-again-btn">Play Again</button>
      </div>
    </div>
  );
}

function GameModeModal({ onSelectMode }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Select Game Mode</h2>
        <div className="">
          <button onClick={() => onSelectMode('player')} className="game-mode">PvP</button>
          <button onClick={() => onSelectMode('bot')} className="game-mode">PvE</button>
        </div>
      </div>
    </div>
  );
}

export default function Gomoku() {
  const initialSize = 15;
  const maxExpansions = 5;
  const [size, setSize] = useState(initialSize);
  const [board, setBoard] = useState(Array(initialSize * initialSize).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningTiles, setWinningTiles] = useState([]);
  const [expansions, setExpansions] = useState(0);
  const [isBotEnabled, setIsBotEnabled] = useState(false);
  const [showGameModeModal, setShowGameModeModal] = useState(true);

  const handleClick = useCallback((index) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = isXTurn ? "X" : "O";
    setBoard(newBoard);
    setIsXTurn(!isXTurn);
    const result = checkWinner(newBoard, index, size);
    if (result) {
      setWinner(result.winner);
      setWinningTiles(result.winningTiles);
    }
    // expandBoardIfNeeded(newBoard, index, size, expansions, maxExpansions, setSize, setBoard, setExpansions);
  }, [board, isXTurn, winner, size, expansions, maxExpansions]);

  useEffect(() => {
    if (isBotEnabled && !isXTurn && !winner) {
      makeBotMove(board, handleClick);
    }
  }, [isXTurn, winner, board, handleClick, isBotEnabled]);

  const resetGame = () => {
    setSize(initialSize);
    setBoard(Array(initialSize * initialSize).fill(null));
    setIsXTurn(true);
    setWinner(null);
    setWinningTiles([]);
    setExpansions(0);
    setShowGameModeModal(true);
  };

  const handleSelectMode = (mode) => {
    setIsBotEnabled(mode === 'bot');
    setShowGameModeModal(false);
  };

  return (
    <div className="container">
      {showGameModeModal && <GameModeModal onSelectMode={handleSelectMode} />}
      <div className="flex flex-col items-center p-4">
        <img src={gomokuImage} alt="gomoku" className="" style={{ width: "400px", height: "auto" }} />
        <p className="text-lg">Player's Turn: {isXTurn ? "X" : "O"}</p>
        <div className="game-container"> {/* Container for the board */}
          <div className="grid" style={{ gridTemplateColumns: `repeat(${size}, 32px)`, gridTemplateRows: `repeat(${size}, 32px)` }}>
            {board.map((cell, index) => (
              <div
                key={index}
                className={`cell ${cell ? (cell === 'X' ? 'text-white' : 'text-black') : ''} ${winningTiles.includes(index) ? 'winning-cell' : ''}`}
                onClick={() => handleClick(index)}
              >
                {cell}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between w-full mt-4">
          <button onClick={resetGame}>Reset Board</button>
        </div>
        {winner && <Modal winner={winner} onPlayAgain={resetGame} />}
        <footer className="footer">
          <p>Developed by Steve Lim</p>
        </footer>
      </div>
    </div>
  );
}