import { useEffect, useState } from "react";

import type { CharInfo } from "@Src/types";
import { findDataCharacter } from "@Data/controllers";

// Conponent
import { InfoSign, SharedSpace } from "@Src/pure-components";
import { AbilityIcon } from "../components";
import { ConsDetail } from "./ConsDetail";

interface ConsListProps {
  char: CharInfo;
  onClickIcon: (index: number) => void;
}
export const ConsList = ({ char, onClickIcon }: ConsListProps) => {
  const [consLv, setConsLv] = useState(0);
  const [atDetails, setAtDetails] = useState(false);

  const dataChar = findDataCharacter(char)!;

  useEffect(() => {
    setAtDetails(false);
  }, [dataChar.code]);

  if (!dataChar.constellation.length) {
    return (
      <p className="pt-4 px-4 text-xl text-center">
        The time has not yet come for this person's corner of the night sky to light up.
      </p>
    );
  }

  const onClickInfo = (level: number) => {
    setAtDetails(true);
    setConsLv(level);
  };

  return (
    <SharedSpace
      atLeft={!atDetails}
      leftPart={
        <div className="h-full hide-scrollbar flex flex-col space-y-4">
          {dataChar.constellation.map((cons, i) => {
            return (
              <div key={i} className="flex">
                <div className="flex-center">
                  <AbilityIcon
                    className="my-1 mr-2 cursor-pointer"
                    img={cons.image}
                    active={char.cons >= i + 1}
                    vision={dataChar.vision}
                    onClick={() => onClickIcon(i)}
                  />
                </div>
                <div className="grow flex items-center group" onClick={() => onClickInfo(i + 1)}>
                  <p className={"px-2 text-lg font-bold" + (char.cons < i + 1 ? " opacity-50" : "")}>{cons.name}</p>
                  <InfoSign className="ml-auto" />
                </div>
              </div>
            );
          })}
        </div>
      }
      rightPart={
        consLv ? (
          <ConsDetail
            dataChar={dataChar}
            consLv={consLv}
            onChangeConsLv={setConsLv}
            onClose={() => {
              setAtDetails(false);
              setTimeout(() => setConsLv(0), 200);
            }}
          />
        ) : null
      }
    />
  );
};
