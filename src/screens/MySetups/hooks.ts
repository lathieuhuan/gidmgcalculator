import { useEffect, useState } from "react";
import type { UserArtifacts, UserWeapon } from "@Src/types";

// Util
import { findById } from "@Src/utils";
import { isUserSetup } from "@Src/utils/setup";

// Store
import { useSelector } from "@Store/hooks";
import { selectUserArts, selectUserSetups, selectUserWps } from "@Store/userDatabaseSlice/selectors";

type SetupItemInfos = Record<
  string,
  {
    weapon: UserWeapon | null;
    artifacts: UserArtifacts;
  }
>;

export function useSetupItems(userSetups: ReturnType<typeof selectUserSetups>) {
  const userWps = useSelector(selectUserWps);
  const userArts = useSelector(selectUserArts);

  const [record, setRecord] = useState<SetupItemInfos>({});

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

  useEffect(() => setRecord(getSetupItems()), [userSetups]);

  return {
    itemsBySetupID: record,
  };
}
