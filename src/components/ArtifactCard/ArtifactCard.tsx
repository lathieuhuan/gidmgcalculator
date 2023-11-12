import clsx from "clsx";
import { FaArrowAltCircleUp, FaChevronDown } from "react-icons/fa";

// Type
import type { CalcArtifact } from "@Src/types";
import type { ArtifactSubstatsControlProps } from "./ArtifactSubstatsControl";

import { ARTIFACT_MAIN_STATS } from "@Src/constants/artifact-stats";
import { useTranslation } from "@Src/hooks";

// Util
import { percentSign, getImgSrc } from "@Src/utils";
import { appData } from "@Src/data";

// Component
import { BetaMark, Button } from "@Src/pure-components";
import { ArtifactSubstatsControl } from "./ArtifactSubstatsControl";
import { ArtifactLevelSelect } from "./ArtifactLevelSelect";

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

  const { beta, name, icon = "" } = appData.getArtifactData(artifact) || {};
  const { rarity = 5, mainStatType } = artifact;
  const possibleMainStatTypes = ARTIFACT_MAIN_STATS[artifact.type];
  const maxLevel = rarity === 5 ? 20 : 16;
  const levelUpDisabled = artifact.level === maxLevel;

  return (
    <div className="w-full" onDoubleClick={() => console.log(artifact)}>
      <div className={`px-4 pt-1 bg-rarity-${rarity}`}>
        <p className="text-xl font-bold text-black truncate">{name}</p>
      </div>
      <div className="mt-4 mx-4 flex">
        {mutable ? (
          <div className="mr-6 pr-2 grow flex justify-between">
            <div>
              <ArtifactLevelSelect
                mutable
                rarity={rarity}
                level={artifact.level}
                maxLevel={maxLevel}
                onChangeLevel={onEnhance}
              />
            </div>
            <div className="mt-1 flex flex-col items-center">
              <Button
                className="bg-black text-orange-500 text-3.5xl"
                variant="custom"
                style={{ padding: 0 }}
                icon={<FaArrowAltCircleUp />}
                disabled={levelUpDisabled}
                onClick={() => onEnhance?.(Math.min(artifact.level + 4, maxLevel))}
              />
              <Button
                variant="custom"
                shape="rounded"
                className="mt-6 text-black bg-orange-500"
                style={{
                  paddingLeft: 6,
                  paddingRight: 6,
                }}
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
