import clsx from "clsx";
import { Fragment } from "react";
import { FaArrowAltCircleUp, FaChevronDown } from "react-icons/fa";
import type {
  CalcArtifact,
  ArtifactMainStatType,
  ArtifactSubStatType,
  ArtifactSubStat,
  Rarity,
} from "@Src/types";

// Constant
import { ARTIFACT_PERCENT_STAT_TYPES, CORE_STAT_TYPES } from "@Src/constants";
import { ARTIFACT_MAIN_STATS } from "@Data/artifacts/constants";
import VALID_SUBSTAT_VALUES from "./validSubstatValues";

// Hook
import { useTranslation } from "@Hooks/useTranslation";

// Util
import { percentSign, processNumInput, getImgSrc } from "@Src/utils";
import { findArtifactPiece } from "@Data/controllers";

// Component
import { BetaMark, IconButton } from "@Components/atoms";

interface ArtifactCardProps extends ArtifactCardCommonProps {
  artifact?: CalcArtifact;
  enhance?: (level: number) => void;
  changeMainStatType?: (type: string) => void;
}
export function ArtifactCard({
  artifact,
  mutable,
  space,
  enhance,
  changeMainStatType,
  changeSubStat,
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
              <div className="rounded-circle bg-darkblue-3">
                <select
                  className={`px-2 pt-2 pb-1 styled-select bg-transparent text-lg text-rarity-${rarity} font-bold appearance-none cursor-pointer`}
                  value={"+" + artifact.level}
                  onChange={(e) => enhance && enhance(+e.target.value.slice(1))}
                >
                  {[...Array(maxLevel + 1).keys()].map((_, lv) => (
                    <option key={lv} className="text-base">
                      +{lv}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-1 flex flex-col items-center">
              <IconButton
                className="bg-black text-orange text-3.5xl"
                variant="custom"
                disabled={isDisabledLevelup}
                onClick={() => enhance && enhance(Math.min(artifact.level + 4, maxLevel))}
              >
                <FaArrowAltCircleUp />
              </IconButton>
              <button
                className={clsx(
                  "mt-6 px-1.5 py-1 rounded bg-orange text-base text-black font-bold leading-base",
                  isDisabledLevelup ? "opacity-50 cursor-default" : "glow-on-hover"
                )}
                disabled={isDisabledLevelup}
                onClick={() => enhance && enhance(maxLevel)}
              >
                MAX
              </button>
            </div>
          </div>
        ) : (
          <div className="w-[9.75rem]">
            <div className="px-2 pt-2 pb-1 w-12 bg-darkblue-3 rounded-full">
              <p className={`text-lg text-rarity-${rarity} font-bold`}>{"+" + artifact.level}</p>
            </div>
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
            <FaChevronDown className="absolute left-1 top-1" size="1.25rem" />
            <select
              className="pl-8 styled-select bg-transparent text-lg text-default appearance-none relative z-10"
              value={mainStatType}
              onChange={(e) => changeMainStatType && changeMainStatType(e.target.value)}
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
          changeSubStat={changeSubStat}
        />
      </div>
    </div>
  );
}

interface ArtifactCardCommonProps {
  mutable?: boolean;
  space?: string;
  changeSubStat?: (index: number, changes: Partial<ArtifactSubStat>) => void;
}

interface ArtifactSubstatsProps extends ArtifactCardCommonProps {
  rarity: Rarity;
  mainStatType: ArtifactMainStatType;
  subStats: ArtifactSubStat[];
}
export function ArtifactSubstats({
  mainStatType,
  subStats,
  mutable,
  rarity,
  space,
  changeSubStat,
}: ArtifactSubstatsProps) {
  const { t } = useTranslation();
  //
  const statTypeCount = { [mainStatType]: 1 };
  for (const { type } of subStats) {
    statTypeCount[type] = (statTypeCount[type] || 0) + 1;
  }

  return (
    <Fragment>
      {subStats.map(({ type, value }, i) => {
        const isValid = value === 0 || VALID_SUBSTAT_VALUES[type][rarity].includes(value);

        return mutable ? (
          <div key={i} className="mt-2 flex items-center bg-darkblue-2 relative">
            <FaChevronDown className="absolute left-3 top-2.5" />

            <select
              className={clsx(
                "pt-2 pb-1 pr-2 pl-10 styled-select bg-transparent relative z-10 appearance-none",
                statTypeCount[type] === 1 ? "text-default" : "text-red-500"
              )}
              value={type}
              onChange={(e) =>
                changeSubStat && changeSubStat(i, { type: e.target.value as ArtifactSubStatType })
              }
            >
              {[...CORE_STAT_TYPES, "em", ...ARTIFACT_PERCENT_STAT_TYPES].map((type) => (
                <option key={type} value={type}>
                  {t(type)}
                </option>
              ))}
            </select>

            <span>+</span>

            <input
              className={clsx(
                "relative ml-1 pt-2 pb-1 pr-2 w-[3.25rem] bg-transparent text-base leading-none text-right text-last-right",
                isValid ? "text-default" : "text-red-500"
              )}
              style={{ fontSize: "1.0625rem" }}
              value={value}
              onChange={(e) =>
                changeSubStat && changeSubStat(i, { value: processNumInput(e.target.value, value) })
              }
            />
            <span className="pt-2 pb-1">{percentSign(type)}</span>
          </div>
        ) : (
          <div key={i} className={`mt-2 pt-2 pb-1 flex items-center bg-darkblue-2`}>
            <p className={space}>•</p>
            <p>
              <span
                className={clsx(
                  "mr-1",
                  statTypeCount[type] === 1 ? "text-default" : "text-red-500"
                )}
              >
                {t(type)}
              </span>
              <span className={isValid ? "text-green" : "text-red-500"}>
                +{value}
                {percentSign(type)}
              </span>
            </p>
          </div>
        );
      })}
    </Fragment>
  );
}
