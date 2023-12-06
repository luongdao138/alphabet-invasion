import Ball from "components/Ball";
import Player from "components/Player";
import Logos from "components/atoms/logos";
import { KeyboardEvent, useEffect, useState } from "react";
import { fromEvent, map } from "rxjs";

function padStartStr(
  str: string | number,
  maxLength: number,
  fillStr: string = " "
) {
  return str.toString().padStart(maxLength, fillStr);
}

export interface GameConfig {
  boardWidth: number;
  widthPerElement: number;
  playerWidth: number;
}

export interface Coor {
  x: number;
  y: number;
}

const gameConfig: GameConfig = {
  boardWidth: 20,
  widthPerElement: 24,
  playerWidth: 3,
};

function App() {
  // states
  const [playerCoors, setPlayerCoors] = useState<Coor>({
    x: Math.floor((gameConfig.boardWidth - gameConfig.playerWidth) / 2) + 1,
    y: 1,
  });

  // observables
  const keyboardEvents$ = fromEvent<KeyboardEvent>(document, "keydown").pipe(
    map((event) => event.key)
  );

  // subjects

  // subscribe events
  const subscribeKeyboardEvents = () => {
    return keyboardEvents$.subscribe({
      next(key) {
        switch (key) {
          case "ArrowLeft":
            setPlayerCoors((prev) => {
              if (prev.x <= 1) {
                return prev;
              }

              return { ...prev, x: prev.x - 1 };
            });
            break;
          case "ArrowRight":
            setPlayerCoors((prev) => {
              if (
                prev.x >=
                gameConfig.boardWidth - gameConfig.playerWidth + 1
              ) {
                return prev;
              }

              return { ...prev, x: prev.x + 1 };
            });
            break;

          default:
            break;
        }
      },
    });
  };

  // use effects
  useEffect(() => {
    const keyboardSubscriber = subscribeKeyboardEvents();

    return () => {
      keyboardSubscriber.unsubscribe();
    };
  }, []);

  const currentDate = `${padStartStr(
    new Date().getDate(),
    2,
    "0"
  )}-${padStartStr(
    new Date().getMonth() + 1,
    2,
    "0"
  )}-${new Date().getFullYear()}`;

  const containerWidth = gameConfig.boardWidth * gameConfig.widthPerElement;
  const initBallCoors = {
    x: Math.floor(gameConfig.boardWidth / 2),
    y: 2,
  };

  return (
    <main>
      <header className="pt-16 z-10 relative max-w-screen-lg xl:max-w-screen-xl mx-auto">
        <h3 className="text-2xl sm:text-4xl leading-none font-bold tracking-tight text-purple-200">
          <span className="text-[gold] opacity-75">Alphabet Invasion</span> @
          Vite Template
        </h3>
        <h1 className="text-6xl lg:text-7xl leading-none font-extrabold tracking-tight mb-8 sm:mb-10 text-purple-400">
          React + Tailwind + Rxjs
        </h1>

        <section className="my-8 w-full">
          <div
            style={{ maxWidth: containerWidth + 32 }}
            className={`mx-auto bg-slate-100 rounded-md shadow p-4`}
          >
            <div
              style={{ width: containerWidth }}
              className={`mx-auto relative aspect-square`}
            >
              <div className="absolute inset-0 bg-green-100 flex flex-wrap">
                {new Array(gameConfig.boardWidth * gameConfig.boardWidth)
                  .fill(1)
                  .map((_, index) => {
                    // 20 * 20
                    // 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 => row 1 => Math.ceil((index + 1) / 20) = 1
                    // 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 => row 2
                    const rowNumber = Math.ceil(
                      (index + 1) / gameConfig.boardWidth
                    );
                    const bgColor =
                      rowNumber % 2
                        ? index % 2
                          ? "bg-slate-500"
                          : "bg-slate-300"
                        : index % 2
                        ? "bg-slate-300"
                        : "bg-slate-500";

                    return (
                      <div
                        key={index}
                        style={{
                          width: gameConfig.widthPerElement,
                          height: gameConfig.widthPerElement,
                        }}
                        className={`${bgColor}`}
                      ></div>
                    );
                  })}
              </div>

              <div className="w-full h-full relative z-10 flex flex-col justify-between">
                <div>Bricks</div>
                <Player coor={playerCoors} gameConfig={gameConfig} />
              </div>

              <Ball
                gameConfig={gameConfig}
                initialCoors={initBallCoors}
                playerCoors={playerCoors}
              />
              {/* <div className="w-full h-full relative z-1">
                {letters.map((row) => {
                  return (
                    <LetterRow
                      gameConfig={gameConfig}
                      key={row.id}
                      letters={row.items}
                    />
                  );
                })}
              </div> */}
            </div>
          </div>
        </section>

        <div className="absolute top-12 right-12 opacity-10 lg:opacity-50">
          <Logos.Vite className="w-56 h-56" />
        </div>
      </header>

      <footer className="pb-16 max-w-screen-lg xl:max-w-screen-xl mx-auto text-center sm:text-right text-gray-400 font-bold">
        <a href="https://github.com/jvidalv">Dao Van Luong @ {currentDate}</a>
      </footer>
    </main>
  );
}

export default App;
