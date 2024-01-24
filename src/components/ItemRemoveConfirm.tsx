import type { UserItem } from "@Src/types";
import { ConfirmModalBody, Modal } from "@Src/pure-components";
import { $AppData } from "@Src/services";
import { isUserWeapon } from "@Src/utils";

interface ItemRemoveCheckProps {
  item: UserItem;
  onConfirm: () => void;
  onClose: () => void;
}
const ItemRemoveConfirmCore = ({ item, onConfirm, onClose }: ItemRemoveCheckProps) => {
  const itemName = isUserWeapon(item)
    ? $AppData.getWeaponData(item.code).name
    : `${$AppData.getArtifactSetData(item.code)?.name} (${item.type})`;

  return (
    <ConfirmModalBody
      message={
        <>
          Remove "<b>{itemName}</b>"?{" "}
          {item.owner ? (
            <>
              It is currently used by <b>{item.owner}</b>.
            </>
          ) : null}
        </>
      }
      focusConfirm
      onConfirm={onConfirm}
      onClose={onClose}
    />
  );
};

export const ItemRemoveConfirm = Modal.wrap(ItemRemoveConfirmCore, { preset: "small" });
