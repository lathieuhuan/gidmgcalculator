import { useMemo, useState } from "react";

import type { AppArtifact, ArtifactType } from "@Src/types";
import type { ItemFilterState, PickerItem } from "./types";

import { EModAffect } from "@Src/constants";
import { $AppData } from "@Src/services";
import { createArtifact } from "@Src/utils/creators";

// Component
import { Modal } from "@Src/pure-components";
import { PickerTemplate, type OnPickItemReturn } from "../entity-pickers/PickerTemplate";

const initialFilter: ItemFilterState = {
  types: ["flower"],
  rarities: [5],
};

interface ArtifactPickerProps {
  forcedType?: ArtifactType;
  showMultipleMode?: boolean;
  forFeature?: "TEAMMATE_MODIFIERS";
  onPickArtifact: (info: ReturnType<typeof createArtifact>) => OnPickItemReturn;
  onClose: () => void;
}
const ArtifactPicker = ({ forcedType, forFeature, showMultipleMode, onPickArtifact, onClose }: ArtifactPickerProps) => {
  const [filter, setFilter] = useState<ItemFilterState>();

  const filteredArtifacts = useMemo(() => {
    return [];

    // switch (forFeature) {
    //   case "TEAMMATE_MODIFIERS":
    //     return artifacts.reduce<PickerItem[][]>(
    //       (accumulator, set) => {
    //         const { code, beta, name, buffs, debuffs, variants } = set;

    //         if (buffs?.some((buff) => buff.affect !== EModAffect.SELF) || debuffs?.length) {
    //           const maxRarity = variants[variants.length - 1];
    //           const { icon } = set[artifactType];
    //           const artifactData = { code, beta, name, icon, rarity: maxRarity || 5 };

    //           accumulator[maxRarity === 5 ? 0 : 1].push(artifactData);
    //         }

    //         return accumulator;
    //       },
    //       [[], []]
    //     );
    //   default:
    //     return artifacts.reduce<PickerItem[][]>(
    //       (accumulator, set) => {
    //         const { code, beta, name } = set;

    //         for (const rarity of set.variants) {
    //           const { icon } = set[artifactType];
    //           const artifactData = { code, beta, name, icon, rarity };

    //           accumulator[rarity === 5 ? 0 : 1].push(artifactData);
    //         }

    //         return accumulator;
    //       },
    //       [[], []]
    //     );
    // }
  }, [filter]);

  const onClickArtifact = async (artifact: PickerItem) => {
    const newArtifact = createArtifact({
      type: artifact.type as ArtifactType,
      code: artifact.code,
      rarity: artifact.rarity,
    });
    return onPickArtifact(newArtifact);
  };

  return (
    <PickerTemplate
      title="Artifacts"
      data={filteredArtifacts}
      initialFilterOn={!forcedType}
      // renderFilter={(toggle) => {
      //   return (
      //     <ItemFilter
      //       className="h-full"
      //       itemType="artifact"
      //       forcedType={forcedType}
      //       initialFilter={filter ?? initialFilter}
      //       onCancel={toggle}
      //       onDone={(newFilter) => {
      //         setFilter(newFilter);
      //         toggle();
      //       }}
      //     />
      //   );
      // }}
      onClose={onClose}
      onPickItem={onClickArtifact}
    />
  );
};

export const PickerArtifact = Modal.coreWrap(ArtifactPicker, { preset: "large" });
