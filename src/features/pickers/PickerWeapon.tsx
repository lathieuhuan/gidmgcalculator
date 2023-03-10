import { useMemo } from "react";
import type { WeaponType } from "@Src/types";

// Data
import weapons from "@Data/weapons";

// Util
import { pickProps } from "@Src/utils";
import { createWeapon } from "@Src/utils/creators";

// Component
import { Modal, type ModalControl } from "@Components/molecules";
import { PickerTemplate, type PickerTemplateProps } from "./PickerTemplate";

interface WeaponPickerProps {
  type?: string;
  weaponType: WeaponType;
  needMassAdd?: boolean;
  onPickWeapon: (info: ReturnType<typeof createWeapon>) => ReturnType<PickerTemplateProps["onPickItem"]>;
  onClose: () => void;
}
function WeaponPicker({ weaponType, needMassAdd, onPickWeapon, onClose }: WeaponPickerProps) {
  const data = useMemo(() => {
    return weapons[weaponType].map((weapon) => pickProps(weapon, ["code", "name", "beta", "icon", "rarity"]));
  }, []);

  return (
    <PickerTemplate
      dataType="weapon"
      needMassAdd={needMassAdd}
      data={data}
      onPickItem={({ code }) => onPickWeapon(createWeapon({ type: weaponType, code }))}
      onClose={onClose}
    />
  );
}

export const PickerWeapon = ({ active, onClose, ...rest }: WeaponPickerProps & ModalControl) => {
  return (
    <Modal active={active} withDefaultStyle onClose={onClose}>
      <WeaponPicker {...rest} onClose={onClose} />
    </Modal>
  );
};
