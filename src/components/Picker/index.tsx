import { Modal, ModalControl } from "@Components/modals";
import { PickerCharacter, PickerCharacterProps } from "./PickerCharacter";
import { PickerArtifact, PickerArtifactProps, PickerWeapon, PickerWeaponProps } from "./PickerItem";
export * from "./PrePicker";

const Picker = {
  Character: ({ active, onClose, ...rest }: PickerCharacterProps & ModalControl) => {
    return (
      <Modal active={active} withDefaultStyle onClose={onClose}>
        <PickerCharacter {...rest} onClose={onClose} />
      </Modal>
    );
  },
  Weapon: ({ active, onClose, ...rest }: PickerWeaponProps & ModalControl) => {
    return (
      <Modal active={active} withDefaultStyle onClose={onClose}>
        <PickerWeapon {...rest} onClose={onClose} />
      </Modal>
    );
  },
  Artifact: ({ active, onClose, ...rest }: PickerArtifactProps & ModalControl) => {
    return (
      <Modal active={active} withDefaultStyle onClose={onClose}>
        <PickerArtifact {...rest} onClose={onClose} />
      </Modal>
    );
  },
};

export { Picker };
