import clsx from "clsx";
import type { UsersComplexSetup, UsersSetup } from "@Src/types";

import { findById } from "@Src/utils";
import { useDispatch, useSelector } from "@Store/hooks";
import { addSetupToComplex } from "@Store/usersDatabaseSlice";
import { selectMySetups } from "@Store/usersDatabaseSlice/selectors";
import { isUsersSetup } from "@Store/usersDatabaseSlice/utils";
import { useCombineManager } from "./hook";

import { ButtonBar } from "@Components/minors";

interface CombineMoreProps {
  targetSetup: UsersComplexSetup;
  allChars: string[];
  onClose: () => void;
}
export function CombineMore({ targetSetup, allChars, onClose }: CombineMoreProps) {
  const dispatch = useDispatch();
  const mySetups = useSelector(selectMySetups);

  const { name, allIDs } = targetSetup;
  const remainChars = allChars.filter((name) => !allIDs[name]);

  const setupOptions = mySetups.filter((setup) => {
    return (
      setup.type === "original" &&
      setup.party.length === 3 &&
      setup.party.every((teammate) => teammate && allChars.includes(teammate.name)) &&
      remainChars.includes(setup.char.name)
    );
  }) as UsersSetup[];

  const { isError, pickedIDs, combineMenu, setIsError } = useCombineManager({
    options: setupOptions,
    limit: remainChars.length,
  });

  const tryCombine = () => {
    if (pickedIDs.length) {
      const existedNames: string[] = [];

      for (const pickedID of pickedIDs) {
        const setup = findById(mySetups, pickedID);

        if (setup && isUsersSetup(setup)) {
          const { name } = setup.char;

          if (existedNames.includes(name)) {
            setIsError(true);
            return;
          } else {
            existedNames.push(name);
          }
        }
      }
      dispatch(addSetupToComplex({ complexID: targetSetup.ID, pickedIDs }));
      onClose();
    }
  };

  return (
    <div className="h-full pl-6 pr-2 py-4 flex flex-col rounded-lg bg-darkblue-2 break-words shadow-white-glow">
      <p className={clsx("pr-4 text-center", isError ? "text-lightred" : "text-lightgold")}>
        {isError ? (
          "These 2 Setups feature the same Character."
        ) : (
          <>
            Choose setups to be combined into "<b>{name}</b>".
          </>
        )}
      </p>

      {combineMenu}

      <ButtonBar className="mt-4" texts={["Cancel", "Combine"]} handlers={[onClose, tryCombine]} />
    </div>
  );
}
