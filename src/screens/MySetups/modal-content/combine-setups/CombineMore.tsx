import type { UserSetup } from "@Src/types";
import { addSetupToComplex } from "@Store/userDatabaseSlice";
import { selectUserSetups } from "@Store/userDatabaseSlice/selectors";

// Util
import { findById } from "@Src/utils";
import { isUserSetup } from "@Src/utils/setup";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";
import { useCombineManager } from "./hooks";

// Component
import { ButtonGroup } from "@Src/components";

interface CombineMoreProps {
  setupID: number;
  onClose: () => void;
}
export function CombineMore({ setupID, onClose }: CombineMoreProps) {
  const dispatch = useDispatch();
  const userSetups = useSelector(selectUserSetups);

  const targetSetup = findById(userSetups, setupID);
  if (!targetSetup || isUserSetup(targetSetup)) {
    return null;
  }

  const shownSetup = findById(userSetups, targetSetup.shownID);
  if (!shownSetup || !isUserSetup(shownSetup)) {
    return null;
  }

  const allChars = shownSetup.party.reduce(
    (result, teammate) => {
      if (teammate) {
        result.push(teammate.name);
      }
      return result;
    },
    [shownSetup.char.name]
  );

  const { name, allIDs } = targetSetup;
  const remainChars = allChars.filter((name) => !allIDs[name]);

  const setupOptions = userSetups.filter((setup) => {
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
        const setup = findById(userSetups, pickedID);

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
      <p className={"pr-4 text-center " + (isError ? "text-lightred" : "text-lightgold")}>
        {isError ? (
          "These 2 Setups feature the same Character."
        ) : (
          <>
            Choose setups to be combined into "<b>{name}</b>".
          </>
        )}
      </p>

      {combineMenu}

      <ButtonGroup
        className="mt-4"
        buttons={[
          { text: "Cancel", onClick: onClose },
          { text: "Combine", disabled: !pickedIDs.length, onClick: tryCombine },
        ]}
      />
    </div>
  );
}
