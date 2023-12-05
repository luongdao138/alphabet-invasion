import { GameConfig } from "app/app";

interface Props {
  letter: string;
  color: string;
  gameConfig: GameConfig;
}

const LetterCol = ({ gameConfig, letter, color }: Props) => {
  return (
    <div
      className={`flex items-center justify-center ${color}`}
      style={{
        width: gameConfig.withPerElement,
        height: gameConfig.withPerElement,
      }}
    >
      <span className={`text-white font-semibold text-lg`}>{letter}</span>
    </div>
  );
};

export default LetterCol;
