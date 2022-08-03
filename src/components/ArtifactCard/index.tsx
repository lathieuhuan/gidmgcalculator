import cn from "classnames";
import { FaArrowAltCircleUp, FaChevronDown } from "react-icons/fa";
import type {
  CalcArtPiece,
  CalcArtPieceMainStat,
  CalcArtPieceSubStat,
  CalcArtPieceSubStatInfo,
  Rarity,
} from "@Src/types";

import { ARTIFACT_PERCENT_STAT_TYPES, CORE_STAT_TYPES } from "@Src/constants";
import { ARTIFACT_MAIN_STATS } from "@Data/artifacts/constants";
import VALID_SUBSTAT_VALUES from "./validSubstatValues";
import { percentSign, processNumInput, wikiImg } from "@Src/utils";
import { findArtifactPiece } from "@Data/controllers";

import { Button, IconButton, Select } from "@Src/styled-components";
import { BetaMark } from "@Components/minors";
import { Fragment } from "react";

interface ArtifactCardProps extends ArtifactCardCommonProps {
  artPiece?: CalcArtPiece;
  enhance?: (level: number) => void;
  changeMainStatType?: (type: string) => void;
}
export default function ArtifactCard({
  artPiece,
  mutable,
  space,
  enhance,
  changeMainStatType,
  changeSubStatType,
  changeSubStatValue,
}: ArtifactCardProps) {
  if (!artPiece) return null;

  const { beta, name, icon } = findArtifactPiece(artPiece)!;
  const { rarity = 5, mainStatType } = artPiece;
  const possibleMainStatTypes = ARTIFACT_MAIN_STATS[artPiece.type];
  const maxLevel = rarity === 5 ? 20 : 16;

  return (
    <div className="w-full" onDoubleClick={() => console.log(artPiece)}>
      <div className={`px-4 pt-1 bg-rarity-${rarity}`}>
        <p className="text-h5 font-bold text-black truncate">{name}</p>
      </div>
      <div className="mt-4 mx-4 flex">
        {mutable ? (
          <div className="mr-6 pr-2 grow flex justify-between">
            <div className="rounded-full bg-darkblue-3">
              <Select
                className={`px-2 pt-2 pb-1 text-lg text-rarity-${rarity} font-bold appearance-none cursor-pointer`}
                value={"+" + artPiece.level}
                onChange={(e) => enhance && enhance(+e.target.value.slice(1))}
              >
                {[...Array(maxLevel + 1).keys()].map((_, lv) => (
                  <option key={lv}>+{lv}</option>
                ))}
              </Select>
            </div>
            <div className="mt-1 flex-col items-center">
              <IconButton
                className="!bg-black !text-orange text-3.5xl"
                disabled={artPiece.level === maxLevel}
                onClick={() => enhance && enhance(Math.min(artPiece.level + 4, maxLevel))}
              >
                <FaArrowAltCircleUp />
              </IconButton>
              <Button
                className={`mt-6 px-1.5 py-1 bg-rarity-${rarity} rounded font-black`}
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

        <div className={`bg-gradient-${rarity} relative rounded-lg`}>
          <img className="w-28" src={beta ? icon : wikiImg(icon)} alt="" draggable={false} />
          {beta && <BetaMark className="absolute bottom-0 right-0" />}
        </div>
      </div>

      <div className="mt-2 ml-6">
        {["flower", "plume"].includes(mainStatType) || !mutable ? (
          <p className={cn("pt-1 text-h6", mutable ? "pl-8" : "pl-2")}>{mainStatType}</p>
        ) : (
          <div className="py-1">
            <Select
              className="pl-8 text-lg text-white appearance-none bg-contain bg-no-repeat bg-white-arrow"
              value={mainStatType}
              onChange={(e) => changeMainStatType && changeMainStatType(e.target.value)}
            >
              {Object.keys(possibleMainStatTypes).map((type) => (
                <option key={type}>{type}</option>
              ))}
            </Select>
          </div>
        )}
        <p className={cn(`text-rarity-${rarity} text-h3`, mutable ? "pl-8" : "pl-2")}>
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
          changeSubStatType={changeSubStatType}
          changeSubStatValue={changeSubStatValue}
        />
      </div>
    </div>
  );
}

interface ArtifactCardCommonProps {
  mutable?: boolean;
  space?: number;
  changeSubStatType?: (type: CalcArtPieceSubStat, index: number) => void;
  changeSubStatValue?: (value: number, index: number) => void;
}

interface ArtifactSubstatsProps extends ArtifactCardCommonProps {
  rarity: Rarity;
  mainStatType: CalcArtPieceMainStat;
  subStats: CalcArtPieceSubStatInfo[];
}
export function ArtifactSubstats({
  mainStatType,
  subStats,
  mutable,
  rarity,
  space,
  changeSubStatType,
  changeSubStatValue,
}: ArtifactSubstatsProps) {
  //
  const statTypeCount = { [mainStatType]: 1 };
  for (let { type } of subStats) {
    statTypeCount[type] = (statTypeCount[type] || 0) + 1;
  }

  return (
    <Fragment>
      {subStats.map(({ type, value }, i) => {
        const isValid = value === 0 || VALID_SUBSTAT_VALUES[type][rarity].includes(value);

        return mutable ? (
          <div key={i} className="mt-2 pt-1 flex items-center bg-darkblue-2 relative">
            <FaChevronDown className="absolute left-3 top-3" />
            <Select
              className={cn(
                "pr-2 pl-10 relative z-10 appearance-none",
                statTypeCount[type] === 1 ? "text-white" : "text-darkred"
              )}
              value={type}
              onChange={(e) =>
                changeSubStatType && changeSubStatType(e.target.value as CalcArtPieceSubStat, i)
              }
            >
              {[...CORE_STAT_TYPES, "em", ...ARTIFACT_PERCENT_STAT_TYPES].map((type) => (
                <option key={type}>{type}</option>
              ))}
            </Select>
            <span>+</span>
            <input
              className={cn(
                "relative ml-1 pr-2 py-1 w-[3.25rem] bg-transparent text-base leading-snug text-right text-last-right",
                isValid ? "text-white" : "text-darkred"
              )}
              value={value}
              onChange={(e) =>
                changeSubStatValue && changeSubStatValue(processNumInput(e.target.value, value), i)
              }
            />
            <span>{percentSign(type)}</span>
          </div>
        ) : (
          <div key={i} className={`mt-2 pl-${space} pt-1 flex items-center bg-darkblue-2`}>
            <p className={"mr-" + space}>•</p>
            <p>
              <span
                className={cn("mr-1", statTypeCount[type] === 1 ? "text-white" : "text-darkred")}
              >
                {type}
              </span>
              <span className={isValid ? "text-green" : "text-darkred"}>
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
