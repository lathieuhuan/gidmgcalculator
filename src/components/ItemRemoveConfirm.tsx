import type { UserArtifact, UserWeapon } from "@Src/types";
import { findDataArtifact, findDataWeapon } from "@Data/controllers";
import { ConfirmModal, type ModalControl } from "@Src/pure-components";

interface WeaponRemoveConfirmProps {
  itemType: "weapon";
  item: UserWeapon;
  onConfirm: () => void;
}
interface ArtifactRemoveConfirmProps {
  itemType: "artifact";
  item: UserArtifact;
  onConfirm: () => void;
}
export const ItemRemoveConfirm = ({
  active,
  item,
  itemType,
  onConfirm,
  onClose,
}: (WeaponRemoveConfirmProps | ArtifactRemoveConfirmProps) & Omit<ModalControl, "state">) => {
  const itemData = itemType === "weapon" ? findDataWeapon(item) : findDataArtifact(item);

  return (
    <ConfirmModal
      active={active}
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
