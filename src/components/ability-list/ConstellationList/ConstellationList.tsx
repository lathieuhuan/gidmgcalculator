import { useEffect, useState } from "react";
import { FaInfo } from "react-icons/fa";

import type { CharInfo } from "@Src/types";
import { $AppCharacter } from "@Src/services";

// Conponent
import { Button, SharedSpace } from "@Src/pure-components";
import { AbilityIcon } from "../ability-list-components";
import { ConstellationDetail } from "./ConstellationDetail";

interface ConstellationListProps {
  char: CharInfo;
  onClickIcon: (index: number) => void;
}
export const ConstellationList = ({ char, onClickIcon }: ConstellationListProps) => {
  const [consLv, setConsLv] = useState(0);
  const [atDetails, setAtDetails] = useState(false);

  const appChar = $AppCharacter.get(char.name);

  useEffect(() => {
    setAtDetails(false);
  }, [appChar.code]);

  if (!appChar.constellation.length) {
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
          {appChar.constellation.map((cons, i) => {
            return (
              <div key={i} className="flex">
                <div className="shrink-0 py-1 pr-2 flex-center">
                  <AbilityIcon
                    className="cursor-pointer"
                    img={cons.image}
                    active={char.cons >= i + 1}
                    elementType={appChar.vision}
                    onClick={() => onClickIcon(i)}
                  />
                </div>
                <div className="grow flex items-center group" onClick={() => onClickInfo(i + 1)}>
                  <p className={"px-2 text-lg font-bold" + (char.cons < i + 1 ? " opacity-50" : "")}>{cons.name}</p>
                  <Button className="ml-auto group-hover:bg-yellow-400" size="small" icon={<FaInfo />} />
                </div>
              </div>
            );
          })}
        </div>
      }
      rightPart={
        consLv ? (
          <ConstellationDetail
            appChar={appChar}
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
