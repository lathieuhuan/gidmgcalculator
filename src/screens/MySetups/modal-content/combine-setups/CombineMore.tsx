import { FormEvent } from "react";
import type { UserSetup } from "@Src/types";

// Store
import { useDispatch } from "@Store/hooks";
import { addSetupToComplex } from "@Store/userDatabaseSlice";
import { selectUserSetups } from "@Store/userDatabaseSlice/selectors";
import { useStoreSnapshot } from "@Store/store-snapshot";

import { findById } from "@Src/utils";
import { isUserSetup } from "@Src/utils/setup";
import { useCombineManager } from "./hooks";

interface CombineMoreProps {
  setupID: number;
  onClose: () => void;
}
export function CombineMore({ setupID, onClose }: CombineMoreProps) {
  const dispatch = useDispatch();
  const userSetups = useStoreSnapshot(selectUserSetups);

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

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    tryCombine();
  };

  return (
    <form id="setup-combine-more" className="h-full flex flex-col break-words" onSubmit={onSubmit}>
      <p className={"px-2 " + (isError ? "text-red-100" : "text-light-800")}>
        {isError ? (
          "These 2 Setups feature the same Character."
        ) : (
          <>
            Choose setups to be combined into "<b>{name}</b>".
          </>
        )}
      </p>

      <div className="mt-2 px-2 grow custom-scrollbar">{combineMenu}</div>
    </form>
  );
}
