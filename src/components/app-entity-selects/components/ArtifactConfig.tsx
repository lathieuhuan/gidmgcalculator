import clsx from "clsx";
import { Button, Star } from "@Src/pure-components";
import { Artifact, Rarity } from "@Src/types";
import { ArtifactCard } from "../../ArtifactCard";

interface ArtifactConfigProps {
  config?: Artifact;
  typeSelect?: React.ReactNode;
  maxRarity?: number;
  forSet?: boolean;
  onChangeRarity?: (rarity: Rarity) => void;
  onUpdateConfig?: (properties: Partial<Artifact>) => void;
  onSelect?: (config: Artifact) => void;
}
export const ArtifactConfig = ({
  config,
  typeSelect,
  maxRarity = 5,
  forSet,
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
        <div className="px-4 space-y-4">
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

      {forSet ? (
        <div className="p-4">
          <div className="w-70 flex items-center justify-end space-x-3">
            <Button variant="positive" onClick={() => null}>
              Forge this batch
            </Button>
          </div>
        </div>
      ) : (
        <div className="grow p-4 bg-dark-900 rounded-lg flex flex-col">
          <div className="w-70 grow hide-scrollbar">
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
            <div className="mt-4 flex justify-center">
              <Button variant="positive" onClick={() => onSelect?.(config)}>
                Forge
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
