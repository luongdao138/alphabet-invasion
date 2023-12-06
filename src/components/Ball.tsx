import { Coor, GameConfig } from "app/app";
import { useState, useEffect, useRef } from "react";
import { interval } from "rxjs";

interface Props {
  gameConfig: GameConfig;
  initialCoors: Coor;
  playerCoors: Coor;
}

const Ball = ({ gameConfig, initialCoors, playerCoors }: Props) => {
  const [ballCoors, setBallCoors] = useState<Coor>(initialCoors);

  const playerCoorsRef = useRef<Coor>(playerCoors);

  const left = gameConfig.widthPerElement * (ballCoors.x - 1);
  const bottom = gameConfig.widthPerElement * (ballCoors.y - 1);

  const ballInvervals$ = useRef(interval(1000));
  const lastCoors = useRef<Coor | null>(null);

  console.log("sksdkvfdkvmdfkm");

  const subscribeBallEvents = () => {
    return ballInvervals$.current.subscribe({
      next() {
        if (!lastCoors.current) {
          // first time
        }

        setBallCoors((prev) => {
          const isXAxis = prev.y === 1;
          console.log(
            "🚀 ~ file: Ball.tsx:33 ~ setBallCoors ~ isXAxis:",
            isXAxis
          );
          const isXAxisOpposite = prev.y === gameConfig.boardWidth;
          console.log(
            "🚀 ~ file: Ball.tsx:35 ~ setBallCoors ~ isXAxisOpposite:",
            isXAxisOpposite
          );
          const isYAxis = prev.x === 1;
          console.log(
            "🚀 ~ file: Ball.tsx:37 ~ setBallCoors ~ isYAxis:",
            isYAxis
          );
          const isYAxisOpposite = prev.x === gameConfig.boardWidth;
          console.log(
            "🚀 ~ file: Ball.tsx:39 ~ setBallCoors ~ isYAxisOpposite:",
            isYAxisOpposite
          );

          const isOnPlayer =
            prev.y === 2 &&
            prev.x >= playerCoorsRef.current.x &&
            prev.y <= playerCoorsRef.current.x + gameConfig.playerWidth - 1;
          console.log(
            "🚀 ~ file: Ball.tsx:57 ~ setBallCoors ~ playerCoorsRef:",
            playerCoorsRef
          );
          console.log(
            "🚀 ~ file: Ball.tsx:54 ~ setBallCoors ~ isOnPlayer:",
            isOnPlayer
          );

          return prev;
        });
      },
    });
  };

  useEffect(() => {
    const ballEventsSubscriber = subscribeBallEvents();

    return () => {
      ballEventsSubscriber.unsubscribe();
    };
  }, []);

  useEffect(() => {
    playerCoorsRef.current = playerCoors;
  }, [playerCoors]);

  return (
    <div
      className={`rounded-full shadow bg-purple-600 absolute z-10`}
      style={{
        width: gameConfig.widthPerElement,
        height: gameConfig.widthPerElement,
        bottom,
        left,
      }}
    ></div>
  );
};

export default Ball;
