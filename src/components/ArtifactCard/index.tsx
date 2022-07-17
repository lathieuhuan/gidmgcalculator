import cn from "classnames";
import { FaArrowAltCircleUp } from "react-icons/fa";
import type { CalcArtPiece } from "@Src/types";
import { percentSign, processNumInput, wikiImg } from "@Src/utils";
import { ARTIFACT_MAIN_STATS } from "@Data/artifacts/constants";
import { findArtifactPiece } from "@Data/controllers";
import { rarityBgColors, rarityColors, rarityGradients } from "@Styled/tw-compounds";
import { Button, IconButton, Select } from "@Styled/Inputs";
import { BetaMark } from "@Components/minors";
import validSubstatValues from "./validSubstatValues";
import { ARTIFACT_PERCENT_STAT_TYPES, CORE_STAT_TYPES } from "@Src/constants";

interface ArtifactCardProps {
  artPiece?: CalcArtPiece;
  mutable?: boolean;
  space: 2 | 4;
  enhance: (level: number) => void;
  changeMainStatType: (type: string) => void;
  changeSubStatType: (type: string, index: number) => void;
  changeSubStatValue: (value: number, index: number) => void;
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

  const statTypeCount = { [mainStatType]: 1 };
  for (let { type } of artPiece.subStats) {
    statTypeCount[type] = (statTypeCount[type] || 0) + 1;
  }

  return (
    <div className="w-full" onDoubleClick={() => console.log(artPiece)}>
      <div className={cn("px-4 pt-1", rarityBgColors[rarity])}>
        <p className="text-h5 font-bold text-black truncate">{name}</p>
      </div>
      <div className="mt-4 mx-4 flex">
        {mutable ? (
          <div className="mr-6 pr-2 grow flex justify-between">
            <div className="rounded-full bg-darkblue-3">
              <Select
                className={cn(
                  "px-2 pt-2 pb-1 text-lg font-bold appearance-none cursor-pointer",
                  rarityColors[rarity]
                )}
                value={"+" + artPiece.level}
                onChange={(e) => enhance(+e.target.value.slice(1))}
              >
                {[...Array(maxLevel + 1).keys()].map((_, lv) => (
                  <option key={lv}>+{lv}</option>
                ))}
              </Select>
            </div>
            <div className="mt-1 flex-col align-center">
              <IconButton
                className="!bg-black !text-orange text-3.5xl"
                disabled={artPiece.level === maxLevel}
                onClick={() => enhance(Math.min(artPiece.level + 4, maxLevel))}
              >
                <FaArrowAltCircleUp />
              </IconButton>
              <Button
                className={cn("mt-6 px-1.5 py-1 rounded font-black", rarityBgColors[rarity])}
                disabled={artPiece.level === maxLevel}
                onClick={() => enhance(maxLevel)}
              >
                MAX
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-[9.75rem]">
            <div className="px-2 pt-2 pb-1 w-12 bg-darkblue-3 rounded-full">
              <p className={cn("text-h6 font-bold", rarityColors[rarity])}>
                {"+" + artPiece.level}
              </p>
            </div>
          </div>
        )}

        <div className={cn("relative rounded-lg", rarityGradients[rarity])}>
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
              onChange={(e) => changeMainStatType(e.target.value)}
            >
              {Object.keys(possibleMainStatTypes).map((type) => (
                <option key={type}>{type}</option>
              ))}
            </Select>
          </div>
        )}
        <p className={cn("text-h3", mutable ? "pl-8" : "pl-2", rarityColors[rarity])}>
          {possibleMainStatTypes[mainStatType]?.[rarity][artPiece.level]}
          {percentSign(mainStatType)}
        </p>
      </div>

      <div className={cn(mutable && "px-2")}>
        {artPiece.subStats.map(({ type, value }, i) => {
          const isValid = value === 0 || validSubstatValues[type][rarity].includes(value);

          return mutable ? (
            <div key={i} className="mt-2 pt-1 flex items-center bg-darkblue-2">
              <Select
                className={cn(
                  "pr-2 pl-10 appearance-none bg-contain bg-no-repeat bg-white-arrow bg-[position:0.5rem]",
                  statTypeCount[type] === 1 ? "text-white" : "text-darkred"
                )}
                value={type}
                onChange={(e) => changeSubStatType(e.target.value, i)}
              >
                {[...CORE_STAT_TYPES, "em", ...ARTIFACT_PERCENT_STAT_TYPES].map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </Select>
              <span>+</span>
              <input
                className={cn(
                  "relative ml-4px pr-2 py-4px w-[3.25rem]",
                  isValid ? "text-white" : "text-darkred"
                )}
                value={value}
                onChange={(e) => changeSubStatValue(processNumInput(e.target.value, value), i)}
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
      </div>
    </div>
  );
}
