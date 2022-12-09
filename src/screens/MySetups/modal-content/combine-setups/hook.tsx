import clsx from "clsx";
import { useState } from "react";

import { CharacterPortrait } from "@Components/minors";

import type { UsersSetup } from "@Src/types";
export type SetupOptions = Array<Pick<UsersSetup, "ID" | "type" | "name" | "char" | "party">>;

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
    <div className="mt-2 pr-4 grow custom-scrollbar">
      <div>
        {!options.length && (
          <div className="h-40 flex-center">
            <p className="text-h6 font-bold">No Setups available for choosing...</p>
          </div>
        )}
        {options.map((setup) => {
          const { ID } = setup;
          const picked = pickedIDs.includes(ID);

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
                <p className="text-h6 font-bold text-orange cursor-default">{setup.name}</p>
              </div>
              <div className="mt-2 md1:mt-0 flex space-x-4">
                <div className="w-16 rounded-circle shadow-3px-2px shadow-orange">
                  <CharacterPortrait name={setup.char.name} />
                </div>
                {setup.party.map((teammate, j) => {
                  if (teammate) {
                    return (
                      <div key={j} className="w-16 rounded-circle">
                        <CharacterPortrait name={teammate.name} />
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
