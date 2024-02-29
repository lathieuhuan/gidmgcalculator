import { Modal } from "../modal";
import { LoadingIcon } from "./LoadingIcon";

export const LoadingMask = ({ active }: { active: boolean }) => {
  return (
    <Modal.Core active={active} closeOnMaskClick={false} onClose={() => {}}>
      <LoadingIcon size="large" />
    </Modal.Core>
  );
};
