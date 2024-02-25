import { useMemo, useState } from "react";
import { RiArrowGoBackLine } from "react-icons/ri";
import { FaInfoCircle } from "react-icons/fa";

import type { AppArtifact, Artifact, ArtifactType } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { $AppData } from "@Src/services";
import { pickProps } from "@Src/utils";
import { useArtifactTypeSelect } from "@Src/hooks";
import { createArtifact } from "@Src/utils/creators";

// Component
import { ButtonGroup, Modal } from "@Src/pure-components";
import { AppEntitySelect, AppEntitySelectProps, AfterSelectAppEntity } from "./components/AppEntitySelect";
import { ArtifactConfig } from "./components/ArtifactConfig";

export interface ArtifactForgeProps extends Pick<AppEntitySelectProps, "hasMultipleMode" | "hasConfigStep"> {
  allowBatchForging?: boolean;
  forFeature?: "TEAMMATE_MODIFIERS";
  forcedType?: ArtifactType;
  /** Default to 'flower' */
  initialTypes?: ArtifactType | ArtifactType[];
  onForgeArtifact: (info: ReturnType<typeof createArtifact>) => void;
  onForgeArtifactBatch?: (code: AppArtifact["code"], types: ArtifactType[], rarity: number) => void;
  onClose: () => void;
}
const ArtifactSmith = ({
  allowBatchForging,
  forFeature,
  forcedType,
  initialTypes = "flower",
  onForgeArtifact,
  onForgeArtifactBatch,
  onClose,
  ...templateProps
}: ArtifactForgeProps) => {
  const [artifactConfig, setArtifactConfig] = useState<Artifact>();
  const [maxRarity, setMaxRarity] = useState(5);
  const [batchForging, setBatchForging] = useState(false);

  const updateConfig = (update: (prevConfig: Artifact) => Artifact) => {
    if (artifactConfig) {
      setArtifactConfig(update(artifactConfig));
    }
  };

  const { artifactTypes, updateArtifactTypes, renderArtifactTypeSelect } = useArtifactTypeSelect(
    forcedType || initialTypes,
    {
      multiple: batchForging,
      required: batchForging,
      onChange: (types) => {
        updateConfig((prevConfig) => {
          const newConfig = createArtifact({ ...prevConfig, type: types[0] as ArtifactType });
          return Object.assign(newConfig, pickProps(prevConfig, ["ID", "level", "subStats"]));
        });
      },
    }
  );

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

  const onChangeRarity = (rarity: number) => {
    updateConfig((prevConfig) => {
      return {
        ...prevConfig,
        rarity,
        level: Math.min(prevConfig.level, rarity === 5 ? 20 : 16),
      };
    });
  };

  const renderBatchConfigNode = (afterSelect: AfterSelectAppEntity) => {
    if (!batchForging || !artifactConfig) return;
    const { name } = $AppData.getArtifactSet(artifactConfig.code) || {};

    const onStopBatchForging = () => {
      const newArtifactType = artifactTypes[0] ?? "flower";
      setBatchForging(false);
      updateArtifactTypes([newArtifactType]);
    };

    const onBatchForge = () => {
      onForgeArtifactBatch?.(artifactConfig.code, artifactTypes, artifactConfig.rarity);
      afterSelect(artifactConfig.code, artifactTypes.length);
    };

    return (
      <div className="pt-4 px-2 border-t border-light-900">
        <div className="flex items-start">
          <FaInfoCircle className="mr-1.5 text-blue-400 text-lg" />

          <div>
            <h5 className="text-blue-400 text-sm font-semibold">Batch Forging</h5>
            <p className="text-sm">You now can select multiple Artifact types.</p>
          </div>
        </div>

        <div className="mt-2 ">
          <p className={`text-rarity-${artifactConfig.rarity} text-lg font-semibold`}>{name}</p>
          <p className="capitalize">{artifactTypes.join(", ")}</p>
        </div>

        <ButtonGroup
          className="mt-4"
          buttons={[
            {
              icon: <RiArrowGoBackLine className="text-lg" />,
              onClick: onStopBatchForging,
            },
            {
              text: "Forge",
              variant: "positive",
              onClick: onBatchForge,
            },
          ]}
        />
      </div>
    );
  };

  return (
    <AppEntitySelect
      title="Artifact Forge"
      data={allArtifactSets}
      emptyText="No artifacts found"
      renderOptionConfig={(afterSelect) => {
        return (
          <ArtifactConfig
            config={artifactConfig}
            maxRarity={maxRarity}
            typeSelect={forcedType ? null : renderArtifactTypeSelect()}
            batchConfigNode={renderBatchConfigNode(afterSelect)}
            moreButtons={
              allowBatchForging
                ? [
                    {
                      text: "Batch Forging",
                      onClick: () => setBatchForging(true),
                    },
                  ]
                : undefined
            }
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
          type: artifactTypes[0],
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
