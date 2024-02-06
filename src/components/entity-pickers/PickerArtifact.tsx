import { useMemo, useState } from "react";

import { Artifact, ArtifactType } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { $AppData } from "@Src/services";
import { createArtifact } from "@Src/utils/creators";

// Component
import { Button, Modal } from "@Src/pure-components";
import { PickerTemplate, PickerTemplateProps, OnPickItemReturn } from "./PickerTemplate";
import { ArtifactCard } from "../ArtifactCard";

interface ArtifactPickerProps extends Pick<PickerTemplateProps, "hasMultipleMode" | "hasConfigStep"> {
  forFeature?: "TEAMMATE_MODIFIERS";
  forcedType?: ArtifactType;
  onPickArtifact: (info: ReturnType<typeof createArtifact>) => OnPickItemReturn;
  onClose: () => void;
}
const ArtifactPicker = ({ forFeature, forcedType, onPickArtifact, onClose, ...templateProps }: ArtifactPickerProps) => {
  const [artifactConfig, setArtifactConfig] = useState<Artifact>();

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

  return (
    <PickerTemplate
      title="Artifacts"
      data={allArtifactSets}
      renderItemConfig={(afterPickItem) => {
        return (
          <div className="h-full p-4 bg-dark-900 rounded-lg flex flex-col">
            <div className="w-70 grow hide-scrollbar">
              <ArtifactCard
                mutable
                artifact={artifactConfig}
                onEnhance={(level) => {
                  if (artifactConfig) {
                    setArtifactConfig({
                      ...artifactConfig,
                      level,
                    });
                  }
                }}
                onChangeMainStatType={(type) => {
                  if (artifactConfig) {
                    setArtifactConfig({
                      ...artifactConfig,
                      mainStatType: type,
                    });
                  }
                }}
                onChangeSubStat={(index, changes) => {
                  if (artifactConfig) {
                    const newSubstats = [...artifactConfig.subStats];
                    newSubstats[index] = Object.assign(newSubstats[index], changes);

                    setArtifactConfig({
                      ...artifactConfig,
                      subStats: newSubstats,
                    });
                  }
                }}
              />
            </div>

            {artifactConfig ? (
              <div className="mt-4 flex justify-center">
                <Button
                  variant="positive"
                  onClick={() => {
                    if (artifactConfig) {
                      onPickArtifact(artifactConfig);
                      afterPickItem(artifactConfig.code);
                    }
                  }}
                >
                  Select
                </Button>
              </div>
            ) : null}
          </div>
        );
      }}
      onPickItem={(mold, isConfigStep) => {
        const artifact = createArtifact({
          ...mold,
          type: "flower",
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
