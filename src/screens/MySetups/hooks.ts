import { useState } from "react";
import type { UserArtifacts, UserWeapon } from "@Src/types";

// Util
import { findById } from "@Src/utils";
import { isUserSetup } from "@Src/utils/setup";

// Hook
import { useSelector } from "@Store/hooks";

// Selector
import {
  selectUserArts,
  selectUserSetups,
  selectUserWps,
} from "@Store/userDatabaseSlice/selectors";

type SetupItemInfos = Record<
  string,
  {
    weapon: UserWeapon | null;
    artifacts: UserArtifacts;
  }
>;

export function useSetupItems() {
  const userSetups = useSelector(selectUserSetups);
  const userWps = useSelector(selectUserWps);
  const userArts = useSelector(selectUserArts);

  const getSetupItems = () => {
    const result: SetupItemInfos = {};

    for (const setup of userSetups) {
      if (isUserSetup(setup)) {
        result[setup.ID] = {
          weapon: findById(userWps, setup.weaponID) || null,
          artifacts: setup.artifactIDs.map((ID) => findById(userArts, ID) || null),
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
