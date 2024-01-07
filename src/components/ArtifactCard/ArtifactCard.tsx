import clsx from "clsx";
import { FaArrowUp, FaChevronDown } from "react-icons/fa";

import type { CalcArtifact } from "@Src/types";
import type { ArtifactSubstatsControlProps } from "./ArtifactSubstatsControl";

import { ARTIFACT_MAIN_STATS } from "@Src/constants/artifact-stats";
import { useTranslation } from "@Src/pure-hooks";
import { $AppData } from "@Src/services";
import { getImgSrc, percentSign } from "@Src/utils";

// Component
import { BetaMark, Button } from "@Src/pure-components";
import { ArtifactLevelSelect } from "./ArtifactLevelSelect";
import { ArtifactSubstatsControl } from "./ArtifactSubstatsControl";

interface ArtifactCardProps extends Pick<ArtifactSubstatsControlProps, "mutable" | "space" | "onChangeSubStat"> {
  artifact?: CalcArtifact;
  onEnhance?: (level: number) => void;
  onChangeMainStatType?: (type: string) => void;
}
export const ArtifactCard = ({
  artifact,
  mutable,
  space,
  onEnhance,
  onChangeMainStatType,
  onChangeSubStat,
}: ArtifactCardProps) => {
  const { t } = useTranslation();
  if (!artifact) return null;

  const { beta, name, icon = "" } = $AppData.getArtifactData(artifact) || {};
  const { rarity = 5, mainStatType } = artifact;
  const possibleMainStatTypes = ARTIFACT_MAIN_STATS[artifact.type];
  const maxLevel = rarity === 5 ? 20 : 16;
  const levelUpDisabled = artifact.level === maxLevel;

  return (
    <div className="w-full" onDoubleClick={() => console.log(artifact)}>
      <div className={`px-4 pt-1 bg-rarity-${rarity}`}>
        <p className="text-xl font-bold text-black truncate">{name}</p>
      </div>
      <div className="mt-6 mx-4 flex">
        {mutable ? (
          <div className="mr-6 grow flex space-x-6">
            <div className="w-fit">
              <ArtifactLevelSelect
                mutable
                rarity={rarity}
                level={artifact.level}
                maxLevel={maxLevel}
                onChangeLevel={onEnhance}
              />
            </div>

            <div className="flex flex-col items-start space-y-4">
              <Button
                className={levelUpDisabled ? "" : "hover:bg-orange-500"}
                shape="square"
                size="small"
                icon={<FaArrowUp />}
                disabled={levelUpDisabled}
                onClick={() => onEnhance?.(Math.min(artifact.level + 4, maxLevel))}
              />
              <Button
                className={levelUpDisabled ? "" : "hover:bg-orange-500"}
                shape="square"
                size="small"
                style={{ fontWeight: 900 }}
                disabled={levelUpDisabled}
                onClick={() => onEnhance?.(maxLevel)}
              >
                MAX
              </Button>
            </div>
          </div>
        ) : (
          <div style={{ width: "9.75rem" }}>
            <ArtifactLevelSelect rarity={rarity} level={artifact.level} />
          </div>
        )}

        <div className={`bg-gradient-${rarity} relative rounded-lg shrink-0`}>
          <img className="w-28 h-28" src={getImgSrc(icon)} draggable={false} />
          {beta && <BetaMark className="absolute bottom-0 right-0" />}
        </div>
      </div>

      <div className="mt-2 ml-6">
        {["flower", "plume"].includes(artifact.type) || !mutable ? (
          <p className={"py-1 text-lg " + (mutable ? "pl-8" : "pl-2")}>{t(mainStatType)}</p>
        ) : (
          <div className="py-1 relative">
            <FaChevronDown className="absolute left-1 top-2" size="1.25rem" />
            <select
              className="pl-8 text-lg text-light-400 appearance-none relative z-10"
              value={mainStatType}
              onChange={(e) => onChangeMainStatType?.(e.target.value)}
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
        <p className={clsx(`text-rarity-${rarity} text-2xl leading-7 font-bold`, mutable ? "pl-8" : "pl-2")}>
          {possibleMainStatTypes[mainStatType]?.[rarity][artifact.level]}
          {percentSign(mainStatType)}
        </p>
      </div>

      <div className={clsx(mutable && "px-2")}>
        <ArtifactSubstatsControl
          mutable={mutable}
          rarity={rarity}
          mainStatType={mainStatType}
          subStats={artifact.subStats}
          space={space}
          onChangeSubStat={onChangeSubStat}
        />
      </div>
    </div>
  );
};
