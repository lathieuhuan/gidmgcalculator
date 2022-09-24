import cn from "classnames";
import { useState, useEffect, ChangeEventHandler, KeyboardEventHandler } from "react";

import type { UsersSetup } from "@Src/types";
import { findById } from "@Src/utils";
import { useDispatch, useSelector } from "@Store/hooks";
import { combineSetups } from "@Store/usersDatabaseSlice";
import { selectMySetups } from "@Store/usersDatabaseSlice/selectors";
import { isUsersSetup } from "@Store/usersDatabaseSlice/utils";

import { ButtonBar } from "@Components/minors";
import { CombineMenu } from "../components";

export function CombineManager({ onClose }: { onClose: () => void }) {
  const dispatch = useDispatch();
  const mySetups = useSelector(selectMySetups);

  const [pickedIDs, setPickedIDs] = useState<number[]>([]);
  const [input, setInput] = useState("Team Setup");
  const [isError, setIsError] = useState(false);

  useEffect(() => setIsError(false), [pickedIDs]);

  const setupOptions = mySetups.filter((setup) => {
    return (
      isUsersSetup(setup) && setup.party.length === 3 && setup.party.every((teammate) => teammate)
    );
  }) as UsersSetup[];

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
        return;
      } else {
        mains.push(char.name);
      }

      if (!all.includes(char.name)) {
        if (all.length === 4) {
          return;
        } else {
          all.push(char.name);
        }
      }

      for (const teammate of party) {
        if (teammate && !all.includes(teammate.name)) {
          if (all.length === 4) {
            console.log(all);
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

  const onClickOption = (ID: number) => {
    if (pickedIDs.includes(ID)) {
      setPickedIDs((prev) => {
        const IDs = [...prev];
        IDs.splice(IDs.indexOf(ID), 1);
        return IDs;
      });
    } else if (pickedIDs.length < 4) {
      setPickedIDs((prev) => [...prev, ID]);
    }
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
    <div className="h-full pl-6 pr-2 py-4 flex flex-col rounded-lg bg-darkblue-2 break-words shadow-white-glow">
      <p className={cn("pr-4 text-center", isError ? "text-lightred" : "text-lightgold")}>
        {isError
          ? "You cannot combine these Setups."
          : "Choose at least 2 setups with the same party members."}
      </p>

      <CombineMenu
        options={setupOptions}
        notFull={pickedIDs.length < 4}
        pickedIDs={pickedIDs}
        onClickOption={onClickOption}
      />

      <div className="mt-6 pr-4">
        <input
          type="text"
          className="px-4 py-2 w-full text-xl text-center text-black rounded outline-none focus:bg-green"
          value={input}
          onChange={onChangeInput}
          onKeyDown={onKeydownInput}
        />
        <ButtonBar
          className="mt-4"
          texts={["Cancel", "Combine"]}
          handlers={[onClose, tryCombine]}
        />
      </div>
    </div>
  );
}
