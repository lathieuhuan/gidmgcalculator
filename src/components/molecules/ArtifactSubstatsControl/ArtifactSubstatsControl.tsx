import { Fragment } from "react";
import { FaChevronDown } from "react-icons/fa";
import type { AttributeStat, ArtifactSubStat, Rarity } from "@Src/types";

// Constant
import { ARTIFACT_SUBSTAT_TYPES } from "@Src/constants";
import VALID_SUBSTAT_VALUES from "./validSubstatValues";

// Hook
import { useTranslation } from "@Src/hooks";

// Util
import { percentSign } from "@Src/utils";

// Component
import { Input } from "@Components/atoms";

export interface ArtifactSubstatsControlProps {
  mutable?: boolean;
  space?: string;
  rarity: Rarity;
  mainStatType: AttributeStat;
  subStats: ArtifactSubStat[];
  onChangeSubStat?: (index: number, changes: Partial<ArtifactSubStat>) => void;
}
export const ArtifactSubstatsControl = ({
  mutable,
  mainStatType,
  subStats,
  rarity,
  space,
  onChangeSubStat,
}: ArtifactSubstatsControlProps) => {
  const { t } = useTranslation();

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
              className={
                "pt-2 pb-1 pr-2 pl-10 leading-base relative z-10 appearance-none " +
                (statTypeCount[type] === 1 ? "text-default" : "text-red-500")
              }
              value={type}
              onChange={(e) => {
                onChangeSubStat?.(i, { type: e.target.value as AttributeStat });
              }}
            >
              {ARTIFACT_SUBSTAT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {t(type)}
                </option>
              ))}
            </select>

            <span>+</span>

            <Input
              type="number"
              noDefaultStyle
              className={
                "relative ml-1 pt-2 pb-1 pr-2 w-[3.25rem] bg-transparent text-base leading-none text-right " +
                (isValid ? "text-default" : "text-red-500")
              }
              style={{ fontSize: "1.0625rem" }}
              value={value}
              onChange={(value) => onChangeSubStat?.(i, { value })}
            />
            <span className="pt-2 pb-1">{percentSign(type)}</span>
          </div>
        ) : (
          <div key={i} className={`mt-2 pt-2 pb-1 flex items-center bg-darkblue-2`}>
            <p className={space}>•</p>
            <p>
              <span
                className={"mr-1 " + (statTypeCount[type] === 1 ? "text-default" : "text-red-500")}
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
};
