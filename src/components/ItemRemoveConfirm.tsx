import type { UserItem } from "@Src/types";
import { useCheckContainerSetups } from "@Src/hooks";
import { ConfirmModalBody, withModal } from "@Src/pure-components";
import { $AppData } from "@Src/services";

interface ItemRemoveCheckProps {
  item: UserItem;
  onConfirm: () => void;
  onClose: () => void;
}
const ItemRemoveCheck = ({ item, onConfirm, onClose }: ItemRemoveCheckProps) => {
  const result = useCheckContainerSetups(item, { correctOnUnmounted: false });
  const itemName = result.isWeapon
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

export const ItemRemoveConfirm = withModal(ItemRemoveCheck, { className: "small-modal" });
