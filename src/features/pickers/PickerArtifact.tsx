import { useMemo } from "react";
import type { ArtifactType } from "@Src/types";
import type { ModalControl } from "@Src/components";
import type { PickerItem } from "./types";

// Constant
import { EModAffect } from "@Src/constants";

// Util
import { createArtifact } from "@Src/utils/creators";

// Data
import artifacts from "@Data/artifacts";

// Component
import { Modal } from "@Src/components";
import { PickerTemplate, type PickerTemplateProps } from "./PickerTemplate";

interface ArtifactPickerProps {
  type?: string;
  artifactType: ArtifactType;
  needMassAdd?: boolean;
  forFeature?: "TEAMMATE_MODIFIERS";
  onPickArtifact: (info: ReturnType<typeof createArtifact>) => ReturnType<PickerTemplateProps["onPickItem"]>;
  onClose: () => void;
}
const ArtifactPicker = ({ artifactType, needMassAdd, forFeature, onPickArtifact, onClose }: ArtifactPickerProps) => {
  const [gold, purple] = useMemo(() => {
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
      data={gold.concat(purple)}
      onPickItem={({ code, rarity }) => onPickArtifact(createArtifact({ type: artifactType, code, rarity }))}
      onClose={onClose}
    />
  );
};

export const PickerArtifact = ({ active, onClose, ...rest }: ArtifactPickerProps & ModalControl) => {
  return (
    <Modal active={active} withDefaultStyle onClose={onClose}>
      <ArtifactPicker {...rest} onClose={onClose} />
    </Modal>
  );
};
