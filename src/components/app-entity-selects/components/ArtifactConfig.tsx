import clsx from "clsx";
import type { ReactNode } from "react";

import { ButtonGroup, ButtonGroupItem, Star } from "@Src/pure-components";
import { Artifact, Rarity } from "@Src/types";
import { ArtifactCard } from "../../ArtifactCard";

interface ArtifactConfigProps {
  config?: Artifact;
  typeSelect?: ReactNode;
  maxRarity?: number;
  batchConfig?: ReactNode;
  moreButtons?: ButtonGroupItem[];
  onChangeRarity?: (rarity: Rarity) => void;
  onUpdateConfig?: (properties: Partial<Artifact>) => void;
  onSelect?: (config: Artifact) => void;
}
export const ArtifactConfig = ({
  config,
  typeSelect,
  maxRarity = 5,
  batchConfig,
  moreButtons = [],
  onChangeRarity,
  onUpdateConfig,
  onSelect,
}: ArtifactConfigProps) => {
  const onClickRarityStar = (num: number) => {
    if (num !== config?.rarity) {
      onChangeRarity?.(num);
    }
  };

  return (
    <div className="h-full flex flex-col custom-scrollbar space-y-4">
      {config ? (
        <div className="px-2 space-y-4">
          <div className="flex items-start justify-between">
            <label className="h-8 flex items-center text-sm">Rarity</label>
            <div className="flex gap-4">
              {Array.from({ length: 5 }, (_, num) => {
                const rarity = num + 1;
                const disabled = rarity < 4;

                return num < maxRarity ? (
                  <button
                    key={num}
                    className={clsx(
                      "w-8 h-8 flex-center text-3xl",
                      disabled && "opacity-50",
                      config.rarity >= rarity ? `text-rarity-${config.rarity}` : "text-rarity-1"
                    )}
                    disabled={disabled}
                    onClick={() => onClickRarityStar(rarity)}
                  >
                    <Star />
                  </button>
                ) : (
                  <div className="w-8 h-8 shrink-0" />
                );
              })}
            </div>
          </div>

          {typeSelect ? (
            <div className="flex items-start justify-between">
              <label className="h-8 flex items-center text-sm">Type</label>
              {typeSelect}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="grow hide-scrollbar" style={{ width: "19.5rem" }}>
        {batchConfig ?? (
          <div className="h-full p-4 bg-dark-900 rounded-lg flex flex-col">
            <div className="grow hide-scrollbar">
              <ArtifactCard
                mutable
                artifact={config}
                onEnhance={(level) => {
                  onUpdateConfig?.({ level });
                }}
                onChangeMainStatType={(mainStatType) => {
                  onUpdateConfig?.({ mainStatType });
                }}
                onChangeSubStat={(index, changes) => {
                  if (config) {
                    const subStats = [...config.subStats];
                    subStats[index] = Object.assign(subStats[index], changes);
                    onUpdateConfig?.({ subStats });
                  }
                }}
              />
            </div>

            {config ? (
              <ButtonGroup
                className="mt-4"
                buttons={[
                  ...moreButtons,
                  {
                    text: "Forge",
                    variant: "positive",
                    onClick: () => onSelect?.(config),
                  },
                ]}
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};
