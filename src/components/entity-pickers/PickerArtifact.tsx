import { useMemo } from "react";

import type { ArtifactType } from "@Src/types";
import type { PickerItem } from "./types";

import { EModAffect } from "@Src/constants";
import { $AppData } from "@Src/services";
import { createArtifact } from "@Src/utils/creators";

// Component
import { Modal } from "@Src/pure-components";
import { PickerTemplate, type OnPickItemReturn } from "../entity-pickers/PickerTemplate";

interface ArtifactPickerProps {
  type?: string;
  artifactType: ArtifactType;
  needMassAdd?: boolean;
  forFeature?: "TEAMMATE_MODIFIERS";
  onPickArtifact: (info: ReturnType<typeof createArtifact>) => OnPickItemReturn;
  onClose: () => void;
}
const ArtifactPicker = ({ artifactType, needMassAdd, forFeature, onPickArtifact, onClose }: ArtifactPickerProps) => {
  const [gold, purple] = useMemo(() => {
    const artifacts = $AppData.getAllArtifacts();

    switch (forFeature) {
      case "TEAMMATE_MODIFIERS":
        return artifacts.reduce<PickerItem[][]>(
          (accumulator, set) => {
            const { code, beta, name, buffs, debuffs, variants } = set;

            if (buffs?.some((buff) => buff.affect !== EModAffect.SELF) || debuffs?.length) {
              const maxRarity = variants[variants.length - 1];
              const { icon } = set[artifactType];
              const artifactData = { code, beta, name, icon, rarity: maxRarity || 5 };

              accumulator[maxRarity === 5 ? 0 : 1].push(artifactData);
            }

            return accumulator;
          },
          [[], []]
        );
      default:
        return artifacts.reduce<PickerItem[][]>(
          (accumulator, set) => {
            const { code, beta, name } = set;

            for (const rarity of set.variants) {
              const { icon } = set[artifactType];
              const artifactData = { code, beta, name, icon, rarity };

              accumulator[rarity === 5 ? 0 : 1].push(artifactData);
            }

            return accumulator;
          },
          [[], []]
        );
    }
  }, []);

  return (
    <PickerTemplate
      dataType="artifact"
      needMassAdd={needMassAdd}
      data={gold.concat(purple)}
      onPickItem={({ code, rarity }) => onPickArtifact(createArtifact({ type: artifactType, code, rarity }))}
      onClose={onClose}
    />
  );
};

export const PickerArtifact = Modal.wrap(ArtifactPicker, { preset: "large" });
