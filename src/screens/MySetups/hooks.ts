import { useState } from "react";
import type { CalcArtPieces, UsersWeapon } from "@Src/types";

import { findById } from "@Src/utils";
import { useSelector } from "@Store/hooks";
import { selectMyArts, selectMySetups, selectMyWps } from "@Store/usersDatabaseSlice/selectors";
import { isUsersSetup } from "@Store/usersDatabaseSlice/utils";

type SetupItemInfos = Record<
  string,
  {
    weapon: UsersWeapon | null;
    artPieces: CalcArtPieces;
  }
>;

export function useSetupItemInfos() {
  const mySetups = useSelector(selectMySetups);
  const myWps = useSelector(selectMyWps);
  const myArts = useSelector(selectMyArts);

  const getSetupItemInfos = () => {
    const result: SetupItemInfos = {};

    for (const setup of mySetups) {
      if (isUsersSetup(setup)) {
        result[setup.ID] = {
          weapon: findById(myWps, setup.weaponID) || null,
          artPieces: setup.artifactIDs.map((ID) => findById(myArts, ID) || null),
        };
      }
    }

    return result;
  };

  const [infos, setInfos] = useState<SetupItemInfos>(getSetupItemInfos());

  return {
    infos,
    getSetupItemInfos: () => setInfos(getSetupItemInfos()),
  };
}
