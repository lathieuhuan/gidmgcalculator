import { useEffect } from "react";
import type { UserItem } from "@Src/types";

// Util & Hook
import { useCheckContainerSetups } from "@Src/hooks/useCheckContainerSetups";
import { appData } from "@Src/data";
import { isUserWeapon } from "@Src/utils";

// Store
import { useDispatch } from "@Store/hooks";
import { updateUserArtifact, updateUserWeapon } from "@Store/userDatabaseSlice";

// Component
import { ConfirmModalBody, withModal } from "@Src/pure-components";

interface ItemRemoveCheckProps {
  item: UserItem;
  onConfirm: () => void;
  onClose: () => void;
}
const ItemRemoveCheck = ({ item, onConfirm, onClose }: ItemRemoveCheckProps) => {
  const dispatch = useDispatch();
  const result = useCheckContainerSetups(item);
  const isWeapon = isUserWeapon(item);

  const itemData = isWeapon ? appData.getWeaponData(item.code) : appData.getArtifactData(item);

  const removeInvalidIds = () => {
    if (result.invalidIds.length) {
      const changes = {
        ID: item.ID,
        setupIDs: item.setupIDs?.filter((id) => !result.invalidIds.includes(id)),
      };

      isWeapon ? dispatch(updateUserWeapon(changes)) : dispatch(updateUserArtifact(changes));
    }
  };

  useEffect(() => removeInvalidIds, []);

  return (
    <ConfirmModalBody
      message={
        <>
          Remove "<b>{itemData?.name}</b>"?{" "}
          {item.owner ? (
            <>
              It is currently used by <b>{item.owner}</b>.
            </>
          ) : null}
        </>
      }
      buttons={[undefined, { onClick: onConfirm }]}
      onClose={onClose}
    />
  );
};

export const ItemRemoveConfirm = withModal(ItemRemoveCheck, { className: "small-modal" });
