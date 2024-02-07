import clsx from "clsx";
import { useMemo, useState } from "react";

import { Artifact, ArtifactType } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { $AppData } from "@Src/services";
import { pickProps } from "@Src/utils";
import { useTypeSelect } from "@Src/hooks";
import { createArtifact } from "@Src/utils/creators";

// Component
import { Button, Modal, Star } from "@Src/pure-components";
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

  const { selectedTypes, renderTypeSelect } = useTypeSelect.Artifact("flower", {
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

  const onClickRarityStar = (num: number) => {
    if (num >= 4 && num !== artifactConfig?.rarity) {
      updateConfig((prevConfig) => {
        return {
          ...prevConfig,
          rarity: num,
          level: Math.min(prevConfig.level, num === 5 ? 20 : 16),
        };
      });
    }
  };

  return (
    <PickerTemplate
      title="Artifacts"
      data={allArtifactSets}
      renderItemConfig={(afterPickItem) => {
        return (
          <div className="h-full flex flex-col custom-scrollbar space-y-4">
            {artifactConfig ? (
              <div className="flex flex-col items-center">
                <div className="space-y-2">
                  <div className="flex space-x-4">
                    {Array.from({ length: 5 }, (_, num) => {
                      const rarity = num + 1;

                      return (
                        <button
                          key={num}
                          className={clsx(
                            "w-10 h-10 flex-center text-3xl",
                            artifactConfig.rarity >= rarity ? `text-rarity-${artifactConfig.rarity}` : "text-rarity-1"
                          )}
                          onClick={() => onClickRarityStar(rarity)}
                        >
                          <Star />
                        </button>
                      );
                    })}
                  </div>

                  <div className="w-1/2 h-0.5 mx-auto bg-dark-300" />

                  {renderTypeSelect()}
                </div>
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
