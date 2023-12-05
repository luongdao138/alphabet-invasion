import LetterRow from "components/LetterRow";
import Logos from "components/atoms/logos";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import {
  interval,
  fromEvent,
  map,
  tap,
  combineLatest,
  startWith,
  takeUntil,
  Subject,
} from "rxjs";

function padStartStr(
  str: string | number,
  maxLength: number,
  fillStr: string = " "
) {
  return str.toString().padStart(maxLength, fillStr);
}

export interface GameConfig {
  boardWidth: number;
  withPerElement: number;
  minLetterPerRow: number;
  maxLetterPerRow: number;
  letterSpeed: number;
}

export interface Letter {
  letter: string;
  position: number;
  color: string;
}

export interface Letters {
  items: Letter[];
  id: string;
}

const randomLetter = () =>
  String.fromCharCode(
    Math.random() * ("z".charCodeAt(0) - "a".charCodeAt(0)) + "a".charCodeAt(0)
  );

function App() {
  // states
  const [letters, setSetters] = useState<Letters[]>([]);

  const currentDate = `${padStartStr(
    new Date().getDate(),
    2,
    "0"
  )}-${padStartStr(
    new Date().getMonth() + 1,
    2,
    "0"
  )}-${new Date().getFullYear()}`;

  const gameConfig: GameConfig = {
    boardWidth: 16,
    withPerElement: 32,
    minLetterPerRow: 1,
    maxLetterPerRow: 3,
    letterSpeed: 400,
  };
  const containerWidth = gameConfig.boardWidth * gameConfig.withPerElement;

  const gameOverSubject = useRef(new Subject<void>());
  const intervals$ = useRef(
    interval(gameConfig.letterSpeed).pipe(
      map<number, Letters>(() => {
        const newRowCharCnt =
          gameConfig.minLetterPerRow +
          Math.ceil(
            Math.random() *
              (gameConfig.maxLetterPerRow - gameConfig.minLetterPerRow)
          );

        const letters: Letter[] = [];

        while (letters.length < newRowCharCnt) {
          const letter = randomLetter();
          const position = Math.ceil(Math.random() * gameConfig.boardWidth);

          if (
            letters.some((l) => l.position === position || l.letter === letter)
          ) {
            continue;
          }

          letters.push({
            letter,
            position,
            color: "bg-teal-500",
          });
        }

        return {
          items: letters,
          id: new Date().getTime().toString(),
        };
      }),
      tap((letters) => {
        setSetters((prev) => [letters, ...prev]);
      })
    )
  );
  const keyBoards$ = useRef(
    fromEvent<KeyboardEvent | { key: string }>(document, "keydown").pipe(
      startWith({ key: "" }),
      map((event) => event.key),
      tap((key) => console.log(`User click ===> ${key}`)),
      tap((key) => {
        setSetters((prev) => {
          let lastRow = prev.at(-1);
          if (!lastRow) return prev;

          const cloned = JSON.parse(JSON.stringify(prev));
          cloned.pop();

          lastRow = {
            ...lastRow,
            items: lastRow.items.filter((l) => l.letter !== key),
          };

          if (lastRow.items.length) {
            cloned.push(lastRow);
          }

          return cloned;
        });
      })
    )
  );
  const games$ = useRef(
    combineLatest([intervals$.current, keyBoards$.current]).pipe(
      takeUntil(gameOverSubject.current)
    )
  );

  useEffect(() => {
    const gameSubscriber = games$.current.subscribe(console.log);

    return () => {
      gameSubscriber.unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log("letters change ===> ", letters);

    if (letters.length >= gameConfig.boardWidth) {
      gameOverSubject.current.next();
      alert("Game over");
    }
  }, [letters]);

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
                          width: gameConfig.withPerElement,
                          height: gameConfig.withPerElement,
                        }}
                        className={`${bgColor}`}
                      ></div>
                    );
                  })}
              </div>

              <div className="w-full h-full relative z-1">
                {letters.map((row) => {
                  return (
                    <LetterRow
                      gameConfig={gameConfig}
                      key={row.id}
                      letters={row.items}
                    />
                  );
                })}
              </div>
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
