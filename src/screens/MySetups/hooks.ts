import { useState } from "react";
import type { CalcArtPieces, UserWeapon } from "@Src/types";

import { findById } from "@Src/utils";
import { useSelector } from "@Store/hooks";
import { selectMyArts, selectMySetups, selectMyWps } from "@Store/userDatabaseSlice/selectors";
import { isUserSetup } from "@Store/userDatabaseSlice/utils";

type SetupItemInfos = Record<
  string,
  {
    weapon: UserWeapon | null;
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
      if (isUserSetup(setup)) {
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
