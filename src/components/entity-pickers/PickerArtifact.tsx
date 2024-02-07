import { useMemo, useState } from "react";

import { Artifact, ArtifactType, Rarity } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { $AppData } from "@Src/services";
import { pickProps } from "@Src/utils";
import { useIconSelect } from "@Src/hooks";
import { createArtifact } from "@Src/utils/creators";

// Component
import { Modal } from "@Src/pure-components";
import { OnPickItemReturn, PickerTemplate, PickerTemplateProps } from "./components/PickerTemplate";
import { ArtifactConfig } from "./components/ArtifactConfig";

interface ArtifactPickerProps extends Pick<PickerTemplateProps, "hasMultipleMode" | "hasConfigStep"> {
  forFeature?: "TEAMMATE_MODIFIERS";
  forcedType?: ArtifactType;
  onPickArtifact: (info: ReturnType<typeof createArtifact>) => OnPickItemReturn;
  onClose: () => void;
}
const ArtifactPicker = ({ forFeature, forcedType, onPickArtifact, onClose, ...templateProps }: ArtifactPickerProps) => {
  const [artifactConfig, setArtifactConfig] = useState<Artifact>();

  const updateConfig = (update: (prevConfig: Artifact) => Artifact) => {
    if (artifactConfig) {
      setArtifactConfig(update(artifactConfig));
    }
  };

  const { selectedTypes, renderTypeSelect } = useIconSelect.Artifact("flower", {
    onChange: (types) => {
      updateConfig((prevConfig) => {
        const newConfig = createArtifact({ ...prevConfig, type: types[0] as ArtifactType });
        return Object.assign(newConfig, pickProps(prevConfig, ["ID", "level", "subStats"]));
      });
    },
  });

  const allArtifactSets = useMemo(() => {
    const artifacts =
      forFeature === "TEAMMATE_MODIFIERS"
        ? $AppData
            .getAllArtifacts()
            .filter((set) => set.buffs?.some((buff) => buff.affect !== EModAffect.SELF) || set.debuffs?.length)
        : $AppData.getAllArtifacts();

    return artifacts.map((artifact) => {
      const { code, beta, name, variants, flower } = artifact;
      return {
        code,
        beta,
        name,
        rarity: variants[variants.length - 1],
        icon: flower.icon,
      };
    });
  }, []);

  const onChangeRarity = (rarity: Rarity) => {
    updateConfig((prevConfig) => {
      return {
        ...prevConfig,
        rarity,
        level: Math.min(prevConfig.level, rarity === 5 ? 20 : 16),
      };
    });
  };

  return (
    <PickerTemplate
      title="Artifacts"
      data={allArtifactSets}
      renderItemConfig={(afterPickItem) => {
        return (
          <ArtifactConfig
            config={artifactConfig}
            typeSelect={renderTypeSelect()}
            onChangeRarity={onChangeRarity}
            onUpdateConfig={(properties) => {
              updateConfig((prevConfig) => ({ ...prevConfig, ...properties }));
            }}
            onSelect={(config) => {
              onPickArtifact(config);
              afterPickItem(config.code);
            }}
          />
        );
      }}
      onPickItem={(mold, isConfigStep) => {
        const artifact = createArtifact({
          ...mold,
          type: selectedTypes[0] as ArtifactType,
        });

        if (isConfigStep) {
          setArtifactConfig({
            ID: 0,
            ...artifact,
          });
          return true;
        }

        return onPickArtifact(artifact);
      }}
      onClose={onClose}
      {...templateProps}
    />
  );
};

export const PickerArtifact = Modal.coreWrap(ArtifactPicker, { preset: "large" });
