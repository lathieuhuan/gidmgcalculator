import { useMemo } from "react";
import type { WeaponType } from "@Src/types";

// Data
import weapons from "@Data/weapons";

// Util
import { pickProps } from "@Src/utils";
import { createWeapon } from "@Src/utils/creators";

// Component
import { Modal, type ModalControl } from "@Components/molecules";
import { PickerTemplate } from "./organisms/PickerTemplate";

interface PickerWeaponCoreProps {
  type?: string;
  weaponType: WeaponType;
  needMassAdd?: boolean;
  onPickWeapon: (info: ReturnType<typeof createWeapon>) => void;
  onClose: () => void;
}
function PickerWeaponCore({
  weaponType,
  needMassAdd,
  onPickWeapon,
  onClose,
}: PickerWeaponCoreProps) {
  const data = useMemo(() => {
    return weapons[weaponType].map((weapon) =>
      pickProps(weapon, ["code", "name", "beta", "icon", "rarity"])
    );
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

export const PickerWeapon = ({
  active,
  onClose,
  ...rest
}: PickerWeaponCoreProps & ModalControl) => {
  return (
    <Modal active={active} withDefaultStyle onClose={onClose}>
      <PickerWeaponCore {...rest} onClose={onClose} />
    </Modal>
  );
};
