import cn from "classnames";
import { Fragment } from "react";
import { FaArrowAltCircleUp, FaChevronDown } from "react-icons/fa";
import type {
  CalcArtPiece,
  ArtPieceMainStat,
  CalcArtPieceSubStat,
  CalcArtPieceSubStatInfo,
  Rarity,
} from "@Src/types";

import { ARTIFACT_PERCENT_STAT_TYPES, CORE_STAT_TYPES } from "@Src/constants";
import { ARTIFACT_MAIN_STATS } from "@Data/artifacts/constants";
import VALID_SUBSTAT_VALUES from "./validSubstatValues";
import { percentSign, processNumInput, getImgSrc } from "@Src/utils";
import { useTranslation } from "@Hooks/useTranslation";
import { findArtifactPiece } from "@Data/controllers";

import { Button, IconButton, Select } from "@Src/styled-components";
import { BetaMark } from "@Components/minors";

interface ArtifactCardProps extends ArtifactCardCommonProps {
  artPiece?: CalcArtPiece;
  enhance?: (level: number) => void;
  changeMainStatType?: (type: string) => void;
}
export function ArtifactCard({
  artPiece,
  mutable,
  space,
  enhance,
  changeMainStatType,
  changeSubStat,
}: ArtifactCardProps) {
  const { t } = useTranslation();

  if (!artPiece) return null;

  const { beta, name, icon = "" } = findArtifactPiece(artPiece) || {};
  const { rarity = 5, mainStatType } = artPiece;
  const possibleMainStatTypes = ARTIFACT_MAIN_STATS[artPiece.type];
  const maxLevel = rarity === 5 ? 20 : 16;

  return (
    <div className="w-full" onDoubleClick={() => console.log(artPiece)}>
      <div className={`px-4 pt-2 pb-1 bg-rarity-${rarity}`}>
        <p className="text-h5 font-bold text-black truncate">{name}</p>
      </div>
      <div className="mt-4 mx-4 flex">
        {mutable ? (
          <div className="mr-6 pr-2 grow flex justify-between">
            <div>
              <div className="rounded-circle bg-darkblue-3">
                <Select
                  className={`px-2 pt-2 pb-1 text-lg text-rarity-${rarity} font-bold appearance-none cursor-pointer`}
                  value={"+" + artPiece.level}
                  onChange={(e) => enhance && enhance(+e.target.value.slice(1))}
                >
                  {[...Array(maxLevel + 1).keys()].map((_, lv) => (
                    <option key={lv} className="text-base">
                      +{lv}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="mt-1 flex flex-col items-center">
              <IconButton
                className="!bg-black !text-orange text-3.5xl"
                disabled={artPiece.level === maxLevel}
                onClick={() => enhance && enhance(Math.min(artPiece.level + 4, maxLevel))}
              >
                <FaArrowAltCircleUp />
              </IconButton>
              <Button
                className="mt-6 px-1.5 py-1 rounded font-black bg-orange"
                disabled={artPiece.level === maxLevel}
                onClick={() => enhance && enhance(maxLevel)}
              >
                MAX
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-[9.75rem]">
            <div className="px-2 pt-2 pb-1 w-12 bg-darkblue-3 rounded-full">
              <p className={`text-h6 text-rarity-${rarity} font-bold`}>{"+" + artPiece.level}</p>
            </div>
          </div>
        )}

        <div className={`bg-gradient-${rarity} relative rounded-lg shrink-0`}>
          <img className="w-28" src={getImgSrc(icon)} alt="" draggable={false} />
          {beta && <BetaMark className="absolute bottom-0 right-0" />}
        </div>
      </div>

      <div className="mt-2 ml-6">
        {["flower", "plume"].includes(artPiece.type) || !mutable ? (
          <p className={cn("pt-1 text-h6", mutable ? "pl-8" : "pl-2")}>{t(mainStatType)}</p>
        ) : (
          <div className="py-1 relative">
            <FaChevronDown className="absolute left-1 top-1" size="1.25rem" />
            <Select
              className="pl-8 text-lg text-default appearance-none relative z-10"
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
            </Select>
          </div>
        )}
        <p
          className={cn(
            `text-rarity-${rarity} text-2xl leading-7 font-bold`,
            mutable ? "pl-8" : "pl-2"
          )}
        >
          {possibleMainStatTypes[mainStatType]?.[rarity][artPiece.level]}
          {percentSign(mainStatType)}
        </p>
      </div>

      <div className={cn(mutable && "px-2")}>
        <ArtifactSubstats
          mutable={mutable}
          rarity={rarity}
          mainStatType={mainStatType}
          subStats={artPiece.subStats}
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
  changeSubStat?: (index: number, changes: Partial<CalcArtPieceSubStatInfo>) => void;
}

interface ArtifactSubstatsProps extends ArtifactCardCommonProps {
  rarity: Rarity;
  mainStatType: ArtPieceMainStat;
  subStats: CalcArtPieceSubStatInfo[];
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

            <Select
              className={cn(
                "pt-2 pb-1 pr-2 pl-10 relative z-10 appearance-none",
                statTypeCount[type] === 1 ? "text-default" : "text-red-500"
              )}
              style={{ fontSize: "1.0625rem" }}
              value={type}
              onChange={(e) =>
                changeSubStat && changeSubStat(i, { type: e.target.value as CalcArtPieceSubStat })
              }
            >
              {[...CORE_STAT_TYPES, "em", ...ARTIFACT_PERCENT_STAT_TYPES].map((type) => (
                <option key={type} value={type}>
                  {t(type)}
                </option>
              ))}
            </Select>

            <span>+</span>

            <input
              className={cn(
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
                className={cn("mr-1", statTypeCount[type] === 1 ? "text-default" : "text-red-500")}
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
