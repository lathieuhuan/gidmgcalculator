import type { UserArtifact, UserWeapon } from "@Src/types";
import type { ModalControl } from "@Components/molecules";

// Util
import { findArtifactPiece, findWeapon } from "@Data/controllers";

// Component
import { ConfirmModal } from "@Components/organisms";

export function renderEquippedChar(owner: string) {
  return (
    <div className="mt-4 px-6 py-1 flex bg-[#ffe7bb]">
      <p className="font-bold text-black">Equipped: {owner}</p>
    </div>
  );
}

const isWeapon = (
  item: UserWeapon | UserArtifact,
  itemType: "weapon" | "artifact"
): item is UserWeapon => {
  return itemType === "weapon";
};

interface ItemConfirmRemoveProps extends ModalControl {
  itemType: "weapon" | "artifact";
  item: UserWeapon | UserArtifact;
  filteredIds: number[];
  removeItem: (args: { ID: number; owner: string | null; type: string }) => void;
  updateChosenID: (newID: number) => void;
}
export function ItemConfirmRemove({
  active,
  item,
  itemType,
  filteredIds,
  removeItem,
  updateChosenID,
  onClose,
}: ItemConfirmRemoveProps) {
  const { ID, owner, type } = item;
  const itemData = isWeapon(item, itemType) ? findWeapon(item) : findArtifactPiece(item);

  return (
    <ConfirmModal
      active={active}
      message={
        <>
          Remove "<b>{itemData?.name}</b>"?{" "}
          {owner ? (
            <>
              It is currently used by <b>{owner}</b>.
            </>
          ) : null}
        </>
      }
      buttons={[
        undefined,
        {
          onClick: () => {
            const index = filteredIds.indexOf(ID);
            removeItem({ ID, owner, type });

            if (index !== -1 && filteredIds.length > 1) {
              const move = index < filteredIds.length - 1 ? 1 : -1;
              updateChosenID(filteredIds[index + move]);
            }
          },
        },
      ]}
      onClose={onClose}
    />
  );
}
