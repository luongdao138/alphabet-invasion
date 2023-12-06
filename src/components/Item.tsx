import { GameConfig } from "app/app";

interface Props {
  gameConfig: GameConfig;
  className?: string;
}

const Item = ({ gameConfig, className = "" }: Props) => {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{
        width: gameConfig.widthPerElement,
        height: gameConfig.widthPerElement,
      }}
    ></div>
  );
};

export default Item;
