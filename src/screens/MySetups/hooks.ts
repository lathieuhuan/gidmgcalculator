import { useState } from "react";
import type { UserArtifacts, UserWeapon } from "@Src/types";

// Util
import { findById } from "@Src/utils";
import { isUserSetup } from "@Store/userDatabaseSlice/utils";

// Hook
import { useSelector } from "@Store/hooks";

// Selector
import { selectMyArts, selectMySetups, selectMyWps } from "@Store/userDatabaseSlice/selectors";

type SetupItemInfos = Record<
  string,
  {
    weapon: UserWeapon | null;
    artifacts: UserArtifacts;
  }
>;

export function useSetupItems() {
  const mySetups = useSelector(selectMySetups);
  const myWps = useSelector(selectMyWps);
  const myArts = useSelector(selectMyArts);

  const getSetupItems = () => {
    const result: SetupItemInfos = {};

    for (const setup of mySetups) {
      if (isUserSetup(setup)) {
        result[setup.ID] = {
          weapon: findById(myWps, setup.weaponID) || null,
          artifacts: setup.artifactIDs.map((ID) => findById(myArts, ID) || null),
        };
      }
    }

    return result;
  };

  const [record, setRecord] = useState<SetupItemInfos>(getSetupItems());

  return {
    itemsBySetupID: record,
    getSetupItems: () => setRecord(getSetupItems()),
  };
}
