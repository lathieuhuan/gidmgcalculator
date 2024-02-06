import { useMemo, useState } from "react";

import { Artifact, ArtifactType } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { $AppData } from "@Src/services";
import { pickProps } from "@Src/utils";
import { useTypeFilter } from "@Src/hooks";
import { createArtifact } from "@Src/utils/creators";

// Component
import { Button, Modal } from "@Src/pure-components";
import { ArtifactCard } from "../ArtifactCard";
import { OnPickItemReturn, PickerTemplate, PickerTemplateProps } from "./components/PickerTemplate";

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

  const { filteredTypes, renderTypeFilter } = useTypeFilter("artifact", ["flower"], {
    mode: "single",
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

  return (
    <PickerTemplate
      title="Artifacts"
      data={allArtifactSets}
      renderItemConfig={(afterPickItem) => {
        return (
          <div className="h-full flex flex-col">
            {artifactConfig ? (
              <div>
                {renderTypeFilter()}
                <div></div>
              </div>
            ) : null}

            <div className="grow p-4 bg-dark-900 rounded-lg flex flex-col">
              <div className="w-70 grow hide-scrollbar">
                <ArtifactCard
                  mutable
                  artifact={artifactConfig}
                  onEnhance={(level) => {
                    updateConfig((prevConfig) => ({ ...prevConfig, level }));
                  }}
                  onChangeMainStatType={(mainStatType) => {
                    updateConfig((prevConfig) => ({ ...prevConfig, mainStatType }));
                  }}
                  onChangeSubStat={(index, changes) => {
                    updateConfig((prevConfig) => {
                      const subStats = [...prevConfig.subStats];
                      subStats[index] = Object.assign(subStats[index], changes);

                      return { ...prevConfig, subStats };
                    });
                  }}
                />
              </div>

              {artifactConfig ? (
                <div className="mt-4 flex justify-center">
                  <Button
                    variant="positive"
                    onClick={() => {
                      onPickArtifact(artifactConfig);
                      afterPickItem(artifactConfig.code);
                    }}
                  >
                    Select
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        );
      }}
      onPickItem={(mold, isConfigStep) => {
        const artifact = createArtifact({
          ...mold,
          type: filteredTypes[0] as ArtifactType,
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
