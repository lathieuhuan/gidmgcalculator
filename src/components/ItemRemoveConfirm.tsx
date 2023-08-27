import type { UserArtifact, UserWeapon } from "@Src/types";
import { appData } from "@Data/index";
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
  const itemData = itemType === "weapon" ? appData.getWeaponData(item.code) : appData.getArtifactData(item);

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
