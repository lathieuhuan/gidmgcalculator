import { useState } from "react";
import type { UserArtifacts, UserWeapon } from "@Src/types";

import { findById } from "@Src/utils";
import { useSelector } from "@Store/hooks";
import { selectMyArts, selectMySetups, selectMyWps } from "@Store/userDatabaseSlice/selectors";
import { isUserSetup } from "@Store/userDatabaseSlice/utils";

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
