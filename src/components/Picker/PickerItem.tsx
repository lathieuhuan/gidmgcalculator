import artifacts from "@Data/artifacts";
import weapons from "@Data/weapons";
import { Artifact, Weapon } from "@Src/types";
import { initArtPiece, initWeapon } from "@Store/calculatorSlice/initiators";
import { PickerTemplate } from "./PickerTemplate";
import { PickerItem } from "./types";

export interface PickerWeaponProps {
  type?: string;
  weaponType: Weapon;
  needMassAdd?: boolean;
  onPickWeapon: (info: ReturnType<typeof initWeapon>) => void;
  onClose: () => void;
}
export function PickerWeapon({
  weaponType,
  needMassAdd,
  onPickWeapon,
  onClose,
}: PickerWeaponProps) {
  const data: PickerItem[] = [];

  for (const { code, name, beta, icon, rarity } of weapons[weaponType]) {
    data.push({ code, name, beta, icon, rarity });
  }

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

export interface PickerArtifactProps {
  type?: string;
  artifactType: Artifact;
  needMassAdd?: boolean;
  onPickArtifact: (info: ReturnType<typeof initArtPiece>) => void;
  onClose: () => void;
}
export function PickerArtifact({
  artifactType,
  needMassAdd,
  onPickArtifact,
  onClose,
}: PickerArtifactProps) {
  const gold = [];
  const purple = [];

  for (const set of artifacts) {
    const { code, beta, name } = set;

    for (const rarity of set.variants) {
      const { icon } = set[artifactType];

      if (rarity === 5) {
        gold.push({ code, beta, name, icon, rarity });
      } else {
        purple.push({ code, beta, name, icon, rarity });
      }
    }
  }

  return (
    <PickerTemplate
      dataType="artifact"
      needMassAdd={needMassAdd}
      data={[...gold, ...purple]}
      onPickItem={({ code, rarity }) =>
        onPickArtifact(initArtPiece({ type: artifactType, code, rarity }))
      }
      onClose={onClose}
    />
  );
}
