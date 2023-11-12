import { useEffect, useMemo } from "react";
import { UserItem, UserSetup } from "@Src/types";

// Util
import { findById, isUserWeapon } from "@Src/utils";
import { isUserSetup } from "@Src/utils/setup";

// Store
import { useDispatch, useSelector } from "@Store/hooks";
import { selectUserSetups } from "@Store/userDatabaseSlice/selectors";
import { updateUserArtifact, updateUserWeapon } from "@Store/userDatabaseSlice";

type UseCheckContainerSetupsOptions = {
  // Default to true
  correctOnUnmounted?: boolean;
};
export const useCheckContainerSetups = (item: UserItem, options: UseCheckContainerSetupsOptions = {}) => {
  const dispatch = useDispatch();
  const userSetups = useSelector(selectUserSetups);
  const isWeapon = isUserWeapon(item);

  const { correctOnUnmounted = true } = options;

  const result = useMemo(() => {
    const foundSetups: UserSetup[] = [];
    const invalidIds: number[] = [];

    if (item.setupIDs?.length) {
      for (const id of item.setupIDs) {
        const containerSetup = findById(userSetups, id);

        if (containerSetup && isUserSetup(containerSetup)) {
          const isFound = isWeapon ? containerSetup.weaponID === item.ID : containerSetup.artifactIDs.includes(item.ID);

          if (isFound) {
            foundSetups.push(containerSetup);
            continue;
          }
        }
        invalidIds.push(id);
      }
    }

    return {
      foundSetups,
      invalidIds,
      isWeapon,
    };
  }, [item.ID]);

  useEffect(() => {
    return () => {
      if (correctOnUnmounted && result.invalidIds.length) {
        const changes = {
          ID: item.ID,
          setupIDs: item.setupIDs?.filter((id) => !result.invalidIds.includes(id)),
        };

        isWeapon ? dispatch(updateUserWeapon(changes)) : dispatch(updateUserArtifact(changes));
      }
    };
  }, []);

  return result;
};
