import { Coor, GameConfig } from "../app/app";
import React from "react";
import Item from "./Item";

interface Props {
  gameConfig: GameConfig;
  coor: Coor;
}

const Player = ({ gameConfig, coor }: Props) => {
  return (
    <div
      className="w-full flex flex-wrap items-center"
      style={{
        height: gameConfig.widthPerElement,
      }}
    >
      {Array(coor.x - 1)
        .fill(1)
        .map((_, index) => index + 1)
        .map((position) => {
          return (
            <Item
              key={position}
              gameConfig={gameConfig}
              className="bg-transparent"
            />
          );
        })}
      {Array(gameConfig.playerWidth)
        .fill(1)
        .map((_, index) => index + 1)
        .map((position) => {
          return (
            <Item
              key={position}
              gameConfig={gameConfig}
              className="bg-teal-500"
            />
          );
        })}
    </div>
  );
};

export default Player;
