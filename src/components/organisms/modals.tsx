import type { UserArtifact, UserWeapon } from "@Src/types";
import { findDataArtifact, findDataWeapon } from "@Data/controllers";

// Component
import { CloseButton } from "@Components/atoms";
import {
  ConfirmModalBody,
  Modal,
  type ConfirmModalBodyProps,
  type ModalControl,
} from "@Components/molecules";

export function ConfirmModal({ active, onClose, ...rest }: ModalControl & ConfirmModalBodyProps) {
  return (
    <Modal active={active} className="small-modal" onClose={onClose}>
      <ConfirmModalBody {...rest} onClose={onClose} />
    </Modal>
  );
}

interface TipsModalProps extends ModalControl {
  children: JSX.Element;
}
export function TipsModal({ active, children, onClose }: TipsModalProps) {
  return (
    <Modal active={active} className="p-4" withDefaultStyle onClose={onClose}>
      <CloseButton className="absolute top-3 right-3" onClick={onClose} />
      <p className="mb-2 text-1.5xl text-orange font-bold">Tips</p>
      {children}
    </Modal>
  );
}

const isWeapon = (
  item: UserWeapon | UserArtifact,
  itemType: "weapon" | "artifact"
): item is UserWeapon => {
  return itemType === "weapon";
};

interface ItemRemoveConfirmProps extends ModalControl {
  itemType: "weapon" | "artifact";
  item: UserWeapon | UserArtifact;
  filteredIds: number[];
  removeItem: (args: { ID: number; owner: string | null; type: string }) => void;
  updateChosenID: (newID: number) => void;
}
export function ItemRemoveConfirm({
  active,
  item,
  itemType,
  filteredIds,
  removeItem,
  updateChosenID,
  onClose,
}: ItemRemoveConfirmProps) {
  const { ID, owner, type } = item;
  const itemData = isWeapon(item, itemType) ? findDataWeapon(item) : findDataArtifact(item);

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
