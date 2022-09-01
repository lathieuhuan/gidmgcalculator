import { ConfirmModal } from "@Components/minors";
import { ModalControl } from "@Components/modals";
import { findArtifactPiece, findWeapon } from "@Data/controllers";
import { UsersArtifact, UsersWeapon } from "@Src/types";

export function renderEquippedChar(owner: string) {
  return (
    <div className="mt-4 px-6 py-1 flex bg-[#ffe7bb]">
      <p className="font-bold text-black">Equipped: {owner}</p>
    </div>
  );
}

const isWeapon = (
  item: UsersWeapon | UsersArtifact,
  itemType: "weapon" | "artifact"
): item is UsersWeapon => {
  return itemType === "weapon";
};

interface ItemConfirmRemoveProps extends ModalControl {
  itemType: "weapon" | "artifact";
  item: UsersWeapon | UsersArtifact;
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
  const { ID, owner, code, type } = item;
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
      right={{
        onClick: () => {
          const index = filteredIds.indexOf(ID);
          removeItem({ ID, owner, type });

          if (index !== -1 && filteredIds.length > 1) {
            const move = index < filteredIds.length - 1 ? 1 : -1;
            updateChosenID(filteredIds[index + move]);
          }
        },
      }}
      onClose={onClose}
    />
  );
}
