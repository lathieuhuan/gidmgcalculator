import { useMemo, useState } from "react";

import { Artifact, ArtifactType, Rarity } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { $AppData } from "@Src/services";
import { pickProps } from "@Src/utils";
import { useIconSelect } from "@Src/hooks";
import { createArtifact } from "@Src/utils/creators";

// Component
import { Modal } from "@Src/pure-components";
import { AppEntitySelect, AppEntitySelectProps } from "./app-entity-selects-components/AppEntitySelect";
import { ArtifactConfig } from "./app-entity-selects-components/ArtifactConfig";

interface ArtifactForgeProps extends Pick<AppEntitySelectProps, "hasMultipleMode" | "hasConfigStep"> {
  forFeature?: "TEAMMATE_MODIFIERS";
  forcedType?: ArtifactType;
  onForgeArtifact: (info: ReturnType<typeof createArtifact>) => void;
  onClose: () => void;
}
const ArtifactSmith = ({ forFeature, forcedType, onForgeArtifact, onClose, ...templateProps }: ArtifactForgeProps) => {
  const [artifactConfig, setArtifactConfig] = useState<Artifact>();
  const [maxRarity, setMaxRarity] = useState(5);

  const updateConfig = (update: (prevConfig: Artifact) => Artifact) => {
    if (artifactConfig) {
      setArtifactConfig(update(artifactConfig));
    }
  };

  const { selectedTypes, renderTypeSelect } = useIconSelect.Artifact(forcedType || "flower", {
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
    <AppEntitySelect
      title="Artifacts"
      data={allArtifactSets}
      emptyText="No artifacts found"
      renderOptionConfig={(afterSelect) => {
        return (
          <ArtifactConfig
            config={artifactConfig}
            maxRarity={maxRarity}
            typeSelect={forcedType ? null : renderTypeSelect()}
            onChangeRarity={onChangeRarity}
            onUpdateConfig={(properties) => {
              updateConfig((prevConfig) => ({ ...prevConfig, ...properties }));
            }}
            onSelect={(config) => {
              onForgeArtifact(config);
              afterSelect(config.code);
            }}
          />
        );
      }}
      onSelect={(mold, isConfigStep) => {
        const artifact = createArtifact({
          ...mold,
          type: selectedTypes[0],
        });

        if (isConfigStep) {
          setArtifactConfig({
            ID: 0,
            ...artifact,
            ...(forcedType ? { type: forcedType } : undefined),
          });
          setMaxRarity(mold.rarity);
        } else {
          onForgeArtifact(artifact);
        }

        return true;
      }}
      onClose={onClose}
      {...templateProps}
    />
  );
};

export const ArtifactForge = Modal.coreWrap(ArtifactSmith, { preset: "large" });
