import { useEffect, useMemo } from "react";

import { UserItem, UserSetup } from "@Src/types";
import { findById, isUserWeapon } from "@Src/utils";
import { isUserSetup } from "@Src/utils/setup";

// Store
import { useDispatch, useSelector } from "@Store/hooks";
import { selectUserSetups } from "@Store/userDatabaseSlice/selectors";
import { updateUserArtifact, updateUserWeapon } from "@Store/userDatabaseSlice";

export const useItemBoundSetups = (item?: UserItem): UserSetup[] => {
  const dispatch = useDispatch();
  const userSetups = useSelector(selectUserSetups);

  const result = useMemo(() => {
    if (!item) {
      return {
        validSetups: [],
        validSetupIDs: [],
        invalidSetupIDs: [],
      };
    }

    const isWeapon = isUserWeapon(item);
    const validSetups: UserSetup[] = [];
    const validSetupIDs: number[] = [];
    const invalidSetupIDs: number[] = [];

    if (item.setupIDs?.length) {
      for (const id of item.setupIDs) {
        const containerSetup = findById(userSetups, id);

        if (containerSetup && isUserSetup(containerSetup)) {
          const isValid = isWeapon ? containerSetup.weaponID === item.ID : containerSetup.artifactIDs.includes(item.ID);

          if (isValid) {
            validSetups.push(containerSetup);
            validSetupIDs.push(containerSetup.ID);
            continue;
          }
        }
        invalidSetupIDs.push(id);
      }
    }

    return {
      isWeapon,
      validSetups,
      validSetupIDs,
      invalidSetupIDs,
    };
  }, [item?.ID]);

  useEffect(() => {
    if (item && result.invalidSetupIDs.length) {
      const changes = {
        ID: item.ID,
        setupIDs: result.validSetupIDs,
      };
      result.isWeapon ? dispatch(updateUserWeapon(changes)) : dispatch(updateUserArtifact(changes));
    }
  }, [result]);

  return result.validSetups;
};
