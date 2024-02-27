import clsx from "clsx";
import { FaChevronDown } from "react-icons/fa";

import type { ArtifactSubStat, AttributeStat, CalcArtifact, UserArtifact } from "@Src/types";

import { ARTIFACT_MAIN_STATS } from "@Src/constants/artifact-stats";
import { useTranslation } from "@Src/pure-hooks";
import { $AppData } from "@Src/services";
import { percentSign } from "@Src/utils";

// Component
import { BetaMark, Image } from "@Src/pure-components";
import { ArtifactLevelSelect } from "./ArtifactLevelSelect";
import { ArtifactSubstatsControl } from "./ArtifactSubstatsControl";

export interface ArtifactViewProps<T extends CalcArtifact | UserArtifact> {
  mutable?: boolean;
  className?: string;
  artifact?: T;
  onEnhance?: (level: number, artifact: T) => void;
  onChangeMainStatType?: (type: AttributeStat, artifact: T) => void;
  onChangeSubStat?: (index: number, changes: Partial<ArtifactSubStat>, artifact: T) => void;
}
export function ArtifactView<T extends CalcArtifact | UserArtifact>({
  className,
  artifact,
  mutable,
  onEnhance,
  onChangeMainStatType,
  onChangeSubStat,
}: ArtifactViewProps<T>) {
  const { t } = useTranslation();
  if (!artifact) return null;

  const appArtifact = $AppData.getArtifact(artifact);
  const { rarity = 5, mainStatType } = artifact;
  const possibleMainStatTypes = ARTIFACT_MAIN_STATS[artifact.type];

  return (
    <div className={className}>
      <div className={`px-4 pt-1 bg-rarity-${rarity}`} onDoubleClick={() => console.log(artifact)}>
        <p className="text-lg font-semibold text-black truncate">{appArtifact?.name}</p>
      </div>

      <div className="mt-4 px-4 flex justify-between items-start">
        <ArtifactLevelSelect
          mutable={mutable}
          rarity={rarity}
          level={artifact.level}
          maxLevel={rarity === 5 ? 20 : 16}
          onChangeLevel={(level) => onEnhance?.(level, artifact)}
        />

        <div className={`bg-gradient-${rarity} relative rounded-lg shrink-0`}>
          <Image
            src={appArtifact?.icon}
            alt={appArtifact?.name}
            imgType="artifact"
            style={{ width: 104, height: 104 }}
          />
          <BetaMark active={appArtifact?.beta} className="absolute bottom-0 right-0" />
        </div>
      </div>

      <div className="mt-2 ml-6">
        {["flower", "plume"].includes(artifact.type) || !mutable ? (
          <p className={"py-1 text-lg " + (mutable ? "pl-6" : "pl-2")}>{t(mainStatType)}</p>
        ) : (
          <div className="py-1 relative">
            <FaChevronDown className="absolute top-1/2 -translate-y-1/2 left-0" />
            <select
              className="pl-6 text-lg text-light-400 appearance-none relative z-10"
              value={mainStatType}
              onChange={(e) => onChangeMainStatType?.(e.target.value as AttributeStat, artifact)}
            >
              {Object.keys(possibleMainStatTypes).map((type) => {
                return (
                  <option key={type} value={type}>
                    {t(type)}
                  </option>
                );
              })}
            </select>
          </div>
        )}
        <p className={clsx(`text-rarity-${rarity} text-2xl leading-7 font-bold`, mutable ? "pl-6" : "pl-2")}>
          {possibleMainStatTypes[mainStatType]?.[rarity]?.[artifact.level]}
          {percentSign(mainStatType)}
        </p>
      </div>

      <ArtifactSubstatsControl
        className="mt-2"
        mutable={mutable}
        rarity={rarity}
        mainStatType={mainStatType}
        subStats={artifact.subStats}
        onChangeSubStat={(...args) => onChangeSubStat?.(...args, artifact)}
      />
    </div>
  );
}
