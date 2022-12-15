import { useMemo } from "react";
import type { PickerItem } from "./types";
import type { Artifact, WeaponType } from "@Src/types";

import artifacts from "@Data/artifacts";
import weapons from "@Data/weapons";
import { pickProps } from "@Src/utils";
import { initArtPiece, initWeapon } from "@Store/calculatorSlice/initiators";
import { PickerTemplate } from "./PickerTemplate";
import { EModAffect } from "@Src/constants";

export interface PickerWeaponProps {
  type?: string;
  weaponType: WeaponType;
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

export interface PickerArtifactProps {
  type?: string;
  artifactType: Artifact;
  needMassAdd?: boolean;
  forFeature?: "TEAMMATE_MODIFIERS";
  onPickArtifact: (info: ReturnType<typeof initArtPiece>) => void;
  onClose: () => void;
}
export function PickerArtifact({
  artifactType,
  needMassAdd,
  forFeature,
  onPickArtifact,
  onClose,
}: PickerArtifactProps) {
  const [gold, purple] = useMemo(() => {
    switch (forFeature) {
      case "TEAMMATE_MODIFIERS":
        return artifacts.reduce(
          (accumulator, set) => {
            const { code, beta, name, buffs, debuffs } = set;

            if (buffs?.some((buff) => buff.affect !== EModAffect.SELF) || debuffs?.length) {
              const { icon } = set[artifactType];
              const artifactData = { code, beta, name, icon, rarity: 5 as const };

              accumulator[0].push(artifactData);
            }

            return accumulator;
          },
          [[], []] as [PickerItem[], PickerItem[]]
        );
      default:
        return artifacts.reduce(
          (accumulator, set) => {
            const { code, beta, name } = set;

            for (const rarity of set.variants) {
              const { icon } = set[artifactType];
              const artifactData = { code, beta, name, icon, rarity };

              accumulator[rarity === 5 ? 0 : 1].push(artifactData);
            }

            return accumulator;
          },
          [[], []] as [PickerItem[], PickerItem[]]
        );
    }
  }, []);

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
