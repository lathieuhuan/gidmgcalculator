import clsx from "clsx";
import { Button, Star } from "@Src/pure-components";
import { Artifact, Rarity } from "@Src/types";
import { ArtifactCard } from "../../ArtifactCard";

interface ArtifactConfigProps {
  config?: Artifact;
  typeSelect?: React.ReactNode;
  onChangeRarity?: (rarity: Rarity) => void;
  onUpdateConfig?: (props: Partial<Artifact>) => void;
  onSelect?: (config: Artifact) => void;
}
export const ArtifactConfig = ({
  config,
  typeSelect,
  onChangeRarity,
  onUpdateConfig,
  onSelect,
}: ArtifactConfigProps) => {
  const onClickRarityStar = (num: number) => {
    if (num >= 4 && num !== config?.rarity) {
      onChangeRarity?.(num);
    }
  };

  return (
    <div className="h-full flex flex-col custom-scrollbar space-y-4">
      {config ? (
        <div className="px-4 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm">Rarity</label>
            <div className="flex gap-4">
              {Array.from({ length: 5 }, (_, num) => {
                const rarity = num + 1;

                return (
                  <button
                    key={num}
                    className={clsx(
                      "w-8 h-8 flex-center text-3xl",
                      config.rarity >= rarity ? `text-rarity-${config.rarity}` : "text-rarity-1"
                    )}
                    onClick={() => onClickRarityStar(rarity)}
                  >
                    <Star />
                  </button>
                );
              })}
            </div>
          </div>

          {typeSelect ? (
            <div className="flex items-center justify-between">
              <label className="text-sm">Type</label>
              {typeSelect}
            </div>
          ) : null}
        </div>
      ) : null}

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
              Select
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
