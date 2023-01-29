import clsx from "clsx";
import { useState, ChangeEventHandler, KeyboardEventHandler } from "react";
import type { UserSetup } from "@Src/types";

// Selector
import { selectUserSetups } from "@Store/userDatabaseSlice/selectors";

// Action
import { combineSetups } from "@Store/userDatabaseSlice";

// Util
import { findById } from "@Src/utils";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";
import { useCombineManager } from "./hook";

// Component
import { ButtonBar } from "@Components/molecules";

export function FirstCombine({ onClose }: { onClose: () => void }) {
  const dispatch = useDispatch();
  const userSetups = useSelector(selectUserSetups);

  const [input, setInput] = useState("Team Setup");

  const setupOptions = userSetups.filter((setup) => {
    return (
      setup.type === "original" &&
      setup.party.length === 3 &&
      setup.party.every((teammate) => teammate)
    );
  }) as UserSetup[];

  const { isError, pickedIDs, combineMenu, setIsError } = useCombineManager({
    options: setupOptions,
    limit: 4,
  });

  const tryCombine = () => {
    if (pickedIDs.length < 2) {
      return;
    }
    if (!input) {
      setIsError(true);
      return;
    }

    const mains: string[] = [];
    const all: string[] = [];

    for (const ID of pickedIDs) {
      const { char, party } = findById(setupOptions, ID)!;

      if (mains.includes(char.name)) {
        setIsError(true);
        return;
      } else {
        mains.push(char.name);
      }

      if (!all.includes(char.name)) {
        if (all.length === 4) {
          setIsError(true);
          return;
        } else {
          all.push(char.name);
        }
      }

      for (const teammate of party) {
        if (teammate && !all.includes(teammate.name)) {
          if (all.length === 4) {
            setIsError(true);
            return;
          } else {
            all.push(teammate.name);
          }
        }
      }
    }
    dispatch(combineSetups({ pickedIDs, name: input }));
    onClose();
  };

  const onChangeInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.value.length <= 32) {
      setInput(e.target.value);
    }
  };

  const onKeydownInput: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      tryCombine();
    }
  };

  return (
    <div className="h-full pl-2 md2:pl-6 pr-2 py-4 flex flex-col rounded-lg bg-darkblue-2 break-words shadow-white-glow">
      <p className={clsx("pr-4 text-center", isError ? "text-lightred" : "text-lightgold")}>
        {isError
          ? "You cannot combine these Setups."
          : "Choose at least 2 setups with the same party members."}
      </p>

      {combineMenu}

      <div className="mt-6 pr-4">
        <input
          type="text"
          className="px-4 py-1 w-full text-xl text-center textinput-common font-bold"
          value={input}
          onChange={onChangeInput}
          onKeyDown={onKeydownInput}
        />
        <ButtonBar
          className="mt-4"
          buttons={[
            { text: "Cancel", onClick: onClose },
            { text: "Combine", disabled: !setupOptions.length, onClick: tryCombine },
          ]}
        />
      </div>
    </div>
  );
}
