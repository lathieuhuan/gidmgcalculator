import type { ReactNode } from "react";
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

interface StandardModalProps extends ModalControl {
  title: ReactNode;
  bodyClassName?: string;
  children: ReactNode;
}
export function StandardModal({
  bodyClassName = "",
  active,
  title,
  children,
  onClose,
}: StandardModalProps) {
  return (
    <Modal className="px-2 py-4 md1:px-4 flex flex-col" withDefaultStyle {...{ active, onClose }}>
      <CloseButton className="absolute top-1 right-1" boneOnly onClick={onClose} />
      {title}
      <div className={"grow custom-scrollbar " + bodyClassName}>{children}</div>
    </Modal>
  );
}

const isWeapon = (
  item: UserWeapon | UserArtifact,
  itemType: "weapon" | "artifact"
): item is UserWeapon => {
  return itemType === "weapon";
};

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
export function ItemRemoveConfirm({
  active,
  item,
  itemType,
  onConfirm,
  onClose,
}: (WeaponRemoveConfirmProps | ArtifactRemoveConfirmProps) & Omit<ModalControl, "state">) {
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
}

interface UnderConstructNoticeProps {
  active: boolean;
  onClose: () => void;
}
export const UnderConstructNotice = (props: UnderConstructNoticeProps) => {
  return (
    <ConfirmModal
      message="This feature is under construction. Please come back later."
      buttons={[undefined]}
      {...props}
    />
  );
};
