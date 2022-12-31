import clsx from "clsx";
import type { UserComplexSetup, UserSetup } from "@Src/types";

// Action
import { addSetupToComplex } from "@Store/userDatabaseSlice";

// Selector
import { selectMySetups } from "@Store/userDatabaseSlice/selectors";

// Util
import { findById } from "@Src/utils";
import { isUserSetup } from "@Src/utils/setup";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";
import { useCombineManager } from "./hook";

// Component
import { ButtonBar } from "@Components/molecules";

interface CombineMoreProps {
  targetSetup: UserComplexSetup;
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
  }) as UserSetup[];

  const { isError, pickedIDs, combineMenu, setIsError } = useCombineManager({
    options: setupOptions,
    limit: remainChars.length,
  });

  const tryCombine = () => {
    if (pickedIDs.length) {
      const existedNames: string[] = [];

      for (const pickedID of pickedIDs) {
        const setup = findById(mySetups, pickedID);

        if (setup && isUserSetup(setup)) {
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

      <ButtonBar
        className="mt-4"
        buttons={[
          { text: "Cancel", onClick: onClose },
          { text: "Combine", onClick: tryCombine },
        ]}
      />
    </div>
  );
}
