import { GameConfig, Letter } from "app/app";
import LetterCol from "./LetterCol";

interface Props {
  gameConfig: GameConfig;
  letters: Letter[];
}

const LetterRow = ({ gameConfig, letters }: Props) => {
  return (
    <div
      className="w-full flex flex-wrap items-center"
      style={{
        height: gameConfig.withPerElement,
      }}
    >
      {Array(gameConfig.boardWidth)
        .fill(1)
        .map((_, index) => index + 1)
        .map((position) => {
          const letter = letters.find((l) => l.position === position);

          return (
            <LetterCol
              key={position}
              letter={letter?.letter ?? ""}
              color={letter?.color ?? ""}
              gameConfig={gameConfig}
            />
          );
        })}
    </div>
  );
};

export default LetterRow;
