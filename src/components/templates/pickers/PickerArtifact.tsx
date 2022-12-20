import { useMemo } from "react";
import type { ArtifactType } from "@Src/types";
import type { PickerItem } from "./types";

// Constant
import { EModAffect } from "@Src/constants";

// Util
import { initArtPiece } from "@Store/calculatorSlice/initiators";

// Data
import artifacts from "@Data/artifacts";

// Component
import { Modal, type ModalControl } from "@Components/molecules";
import { PickerTemplate } from "./organisms/PickerTemplate";

interface PickerArtifactCoreProps {
  type?: string;
  artifactType: ArtifactType;
  needMassAdd?: boolean;
  forFeature?: "TEAMMATE_MODIFIERS";
  onPickArtifact: (info: ReturnType<typeof initArtPiece>) => void;
  onClose: () => void;
}
function PickerArtifactCore({
  artifactType,
  needMassAdd,
  forFeature,
  onPickArtifact,
  onClose,
}: PickerArtifactCoreProps) {
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

export const PickerArtifact = ({
  active,
  onClose,
  ...rest
}: PickerArtifactCoreProps & ModalControl) => {
  return (
    <Modal active={active} withDefaultStyle onClose={onClose}>
      <PickerArtifactCore {...rest} onClose={onClose} />
    </Modal>
  );
};
