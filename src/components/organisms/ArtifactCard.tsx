import clsx from "clsx";
import { FaArrowAltCircleUp, FaChevronDown } from "react-icons/fa";
import type { CalcArtifact } from "@Src/types";

// Constant
import { ARTIFACT_MAIN_STATS } from "@Data/artifacts/constants";

// Hook
import { useTranslation } from "@Src/hooks";

// Util
import { percentSign, getImgSrc } from "@Src/utils";
import { findArtifactPiece } from "@Data/controllers";

// Component
import { BetaMark, IconButton, ArtifactLevelSelect } from "@Components/atoms";
import { ArtifactSubstats, type ArtifactSubstatsProps } from "@Components/molecules";

interface ArtifactCardProps
  extends Pick<ArtifactSubstatsProps, "mutable" | "space" | "onChangeSubStat"> {
  artifact?: CalcArtifact;
  onEnhance?: (level: number) => void;
  onChangeMainStatType?: (type: string) => void;
}
export function ArtifactCard({
  artifact,
  mutable,
  space,
  onEnhance,
  onChangeMainStatType,
  onChangeSubStat,
}: ArtifactCardProps) {
  const { t } = useTranslation();
  if (!artifact) return null;

  const { beta, name, icon = "" } = findArtifactPiece(artifact) || {};
  const { rarity = 5, mainStatType } = artifact;
  const possibleMainStatTypes = ARTIFACT_MAIN_STATS[artifact.type];
  const maxLevel = rarity === 5 ? 20 : 16;
  const isDisabledLevelup = artifact.level === maxLevel;

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
              <IconButton
                className="bg-black text-orange text-3.5xl"
                variant="custom"
                disabled={isDisabledLevelup}
                onClick={() => onEnhance?.(Math.min(artifact.level + 4, maxLevel))}
              >
                <FaArrowAltCircleUp />
              </IconButton>
              <button
                className={clsx(
                  "mt-6 px-1.5 py-1 rounded bg-orange text-base text-black font-bold leading-base",
                  isDisabledLevelup ? "opacity-50 cursor-default" : "glow-on-hover"
                )}
                disabled={isDisabledLevelup}
                onClick={() => onEnhance?.(maxLevel)}
              >
                MAX
              </button>
            </div>
          </div>
        ) : (
          <div style={{ width: "9.75rem" }}>
            <ArtifactLevelSelect rarity={rarity} level={artifact.level} />
          </div>
        )}

        <div className={`bg-gradient-${rarity} relative rounded-lg shrink-0`}>
          <img className="w-28" src={getImgSrc(icon)} alt="" draggable={false} />
          {beta && <BetaMark className="absolute bottom-0 right-0" />}
        </div>
      </div>

      <div className="mt-2 ml-6">
        {["flower", "plume"].includes(artifact.type) || !mutable ? (
          <p className={clsx("pt-1 text-lg", mutable ? "pl-8" : "pl-2")}>{t(mainStatType)}</p>
        ) : (
          <div className="py-1 relative">
            <FaChevronDown className="absolute left-1 top-2" size="1.25rem" />
            <select
              className="pl-8 text-lg text-default appearance-none relative z-10"
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
        <p
          className={clsx(
            `text-rarity-${rarity} text-2xl leading-7 font-bold`,
            mutable ? "pl-8" : "pl-2"
          )}
        >
          {possibleMainStatTypes[mainStatType]?.[rarity][artifact.level]}
          {percentSign(mainStatType)}
        </p>
      </div>

      <div className={clsx(mutable && "px-2")}>
        <ArtifactSubstats
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
}
