import { useMemo } from "react";
import { UserItem, UserSetup } from "@Src/types";
import { findById, isUserWeapon } from "@Src/utils";
import { isUserSetup } from "@Src/utils/setup";
import { useSelector } from "@Store/hooks";
import { selectUserSetups } from "@Store/userDatabaseSlice/selectors";

export const useCheckContainerSetups = (item: UserItem) => {
  const userSetups = useSelector(selectUserSetups);

  const result = useMemo(() => {
    const foundSetups: UserSetup[] = [];
    const invalidIds: number[] = [];
    const isWeapon = isUserWeapon(item);

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
    };
  }, [item.ID]);

  return result;
};
