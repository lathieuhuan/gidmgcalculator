import { useMemo } from "react";
import type { PickerItem } from "./types";
import type { ArtifactType, WeaponType } from "@Src/types";

// Data
import artifacts from "@Data/artifacts";
import weapons from "@Data/weapons";

// Util
import { pickProps } from "@Src/utils";
import { initArtPiece, initWeapon } from "@Store/calculatorSlice/initiators";

// Constant
import { EModAffect } from "@Src/constants";

// Component
import { Modal, type ModalControl } from "@Components/molecules";
import { PickerTemplate } from "./organisms/PickerTemplate";

interface PickerWeaponCoreProps {
  type?: string;
  weaponType: WeaponType;
  needMassAdd?: boolean;
  onPickWeapon: (info: ReturnType<typeof initWeapon>) => void;
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
      onPickItem={({ code }) => onPickWeapon(initWeapon({ type: weaponType, code }))}
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
