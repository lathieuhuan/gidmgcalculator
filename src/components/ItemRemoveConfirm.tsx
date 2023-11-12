import type { UserItem } from "@Src/types";

// Util & Hook
import { useCheckContainerSetups } from "@Src/hooks/useCheckContainerSetups";
import { appData } from "@Src/data";

// Component
import { ConfirmModalBody, withModal } from "@Src/pure-components";

interface ItemRemoveCheckProps {
  item: UserItem;
  onConfirm: () => void;
  onClose: () => void;
}
const ItemRemoveCheck = ({ item, onConfirm, onClose }: ItemRemoveCheckProps) => {
  const result = useCheckContainerSetups(item, { correctOnUnmounted: false });
  const itemName = result.isWeapon
    ? appData.getWeaponData(item.code).name
    : `${appData.getArtifactSetData(item.code)?.name} (${item.type})`;

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
      buttons={[undefined, { onClick: onConfirm }]}
      onClose={onClose}
    />
  );
};

export const ItemRemoveConfirm = withModal(ItemRemoveCheck, { className: "small-modal" });
