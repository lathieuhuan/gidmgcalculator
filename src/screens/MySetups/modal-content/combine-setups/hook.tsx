import clsx from "clsx";
import { useState } from "react";
import type { UserSetup } from "@Src/types";
import { CharacterPortrait } from "@Components/atoms";
import { findDataCharacter } from "@Data/controllers";

export type SetupOptions = Array<Pick<UserSetup, "ID" | "type" | "name" | "char" | "party">>;

interface UseCombineManagerArgs {
  options: SetupOptions;
  limit: number;
}

export function useCombineManager({ options, limit }: UseCombineManagerArgs) {
  const [pickedIDs, setPickedIDs] = useState<number[]>([]);
  const [isError, setIsError] = useState(false);

  const notFull = pickedIDs.length < limit;

  const onClickOption = (ID: number, picked: boolean) => {
    if (picked) {
      setPickedIDs((prev) => {
        const IDs = [...prev];
        IDs.splice(IDs.indexOf(ID), 1);
        return IDs;
      });
      setIsError(false);
    } else if (notFull) {
      setPickedIDs((prev) => [...prev, ID]);
      setIsError(false);
    }
  };

  const combineMenu = (
    <div className="mt-2 md2:pr-4 grow custom-scrollbar">
      <div>
        {!options.length && (
          <div className="h-40 flex-center">
            <p className="text-lg font-bold">No Setups available for choosing...</p>
          </div>
        )}
        {options.map((setup) => {
          const { ID } = setup;
          const picked = pickedIDs.includes(ID);
          const { code = 0, icon = "" } = findDataCharacter(setup.char) || {};

          return (
            <div
              key={ID}
              className={clsx(
                "mb-2 p-4 rounded-lg bg-darkblue-1 flex flex-col md1:flex-row md1:items-center",
                !picked && !notFull && "opacity-50",
                picked && "shadow-green"
              )}
              style={{ boxShadow: picked ? "0 0 5px 1px var(--tw-shadow-color) inset" : undefined }}
              onClick={() => onClickOption(ID, picked)}
            >
              <div className="md1:w-40 md1:mr-4">
                <p className="text-lg font-bold text-orange cursor-default">{setup.name}</p>
              </div>
              <div className="mt-2 md1:mt-0 flex space-x-4">
                <div className="w-16 rounded-circle shadow-3px-2px shadow-orange">
                  <CharacterPortrait {...{ code, icon }} />
                </div>
                {setup.party.map((teammate, j) => {
                  if (teammate) {
                    const { code = 0, icon = "" } = findDataCharacter(teammate) || {};

                    return (
                      <div key={j} className="w-16 rounded-circle">
                        <CharacterPortrait {...{ code, icon }} />
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return {
    isError,
    pickedIDs,
    combineMenu,
    setIsError,
  };
}
