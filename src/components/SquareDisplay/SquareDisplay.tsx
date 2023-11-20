import { FC, useCallback, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { HoverHistory, Square } from '../../interfaces/Square';
import styles from './style.module.css';

interface SquareDisplayProps {
  data: Square[];
}

const SquareDisplay: FC<SquareDisplayProps> = ({ data }) => {
  const [selectedMode, setSelectedMode] = useState<number | null>(null);
  const [gameStart, setGameStart] = useState<boolean>(false);
  const [hoveredSquares, setHoveredSquares] = useState<number[]>([]);
  const [hoverHistory, setHoverHistory] = useState<HoverHistory[]>([]);

  const handleModeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const modeValue = Number(e.target.value);
    setSelectedMode(modeValue);
    setGameStart(false);
    setHoverHistory([]);
    setHoveredSquares([]);
  };

  const handleStartGame = () => {
    setGameStart(true);
  };

  const handleSquareHover = useCallback((index: number) => {
    setHoveredSquares((prev) => {
      const wasBlue = prev.includes(index);
      const newHistory = [...prev, index];

      const newHistoryObjects = newHistory.map((index) => ({
        row: Math.floor(index / 5) + 1,
        col: (index % 5) + 1,
      }));

      setHoverHistory((prevHistory) => [
        ...prevHistory,
        ...newHistoryObjects.filter(
          (item) =>
            !prevHistory.some(
              (existingItem) =>
                existingItem.row === item.row && existingItem.col === item.col,
            ),
        ),
      ]);

      if (wasBlue) {
        return newHistory.filter((square) => square !== index);
      } else {
        return newHistory;
      }
    });
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.gameContainer}>
        <div className={styles.panel}>
          <Form.Select onChange={(e) => handleModeSelect(e)}>
            <option>Pick mode</option>
            {data.map((el) => (
              <option key={el.id} value={el.field}>
                {el.name}
              </option>
            ))}
          </Form.Select>
          <Button
            onClick={handleStartGame}
            disabled={!selectedMode || gameStart}
            className={styles.gameBtn}
            size='lg'
          >
            START
          </Button>
        </div>

        {gameStart && (
          <div className={styles.gameBoard}>
            {Array.from({ length: selectedMode ?? 0 }).map((_, col) => {
              const row = Math.floor(col / 5);
              const index = row * 5 + (col % 5);

              return (
                <div
                  key={index}
                  className={`${styles.square} ${
                    hoveredSquares.includes(index)
                      ? styles.squareBlue
                      : styles.squareWhite
                  }`}
                  onMouseEnter={() => handleSquareHover(index)}
                ></div>
              );
            })}
          </div>
        )}
      </div>
      <div className={styles.historyContainer}>
        <h2 className={styles.hoverTitle}>Hover squares:</h2>
        <div>
          {hoverHistory.length > 0 ? (
            hoverHistory.map((item, i) => (
              <span
                key={i}
                className={styles.historyElement}
              >{`row ${item.row} col ${item.col}`}</span>
            ))
          ) : (
            <h4>empty</h4>
          )}
        </div>
      </div>
    </div>
  );
};

export default SquareDisplay;
