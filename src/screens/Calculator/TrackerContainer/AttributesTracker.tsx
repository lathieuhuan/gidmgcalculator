import type { Tracker } from "@Src/types";

// Constant
import { ATTACK_ELEMENTS, CORE_STAT_TYPES, OTHER_PERCENT_STAT_TYPES } from "@Src/constants";

// Util
import { applyPercent, percentSign, round } from "@Src/utils";
import { recordListStyles, renderHeading, renderRecord } from "./utils";

// Hook
import { useSelector } from "@Store/hooks";
import { useTranslation } from "@Src/hooks";

// Selector
import { selectTotalAttr } from "@Store/calculatorSlice/selectors";

const OTHER_STATS = [
  "em",
  "er",
  "cRate",
  "cDmg",
  ...ATTACK_ELEMENTS,
  ...OTHER_PERCENT_STAT_TYPES,
] as const;

export function AttributesTracker({ totalAttr }: Partial<Pick<Tracker, "totalAttr">>) {
  const { t } = useTranslation();
  const calcTotalAttr = useSelector(selectTotalAttr);

  return (
    <div className={"pl-2 pr-4 " + recordListStyles}>
      {CORE_STAT_TYPES.map((statType) => {
        const percent = percentSign(statType);
        const records = totalAttr?.[statType] || [];
        const records_ = totalAttr?.[`${statType}_`] || [];

        return (
          <div key={statType} className="break-inside-avoid">
            {renderHeading(t(statType), Math.round(calcTotalAttr[statType]) + percent)}

            <ul className="pl-4 list-disc">
              {records.map(renderRecord((value) => round(value, 1) + percent))}

              {records_.map(
                renderRecord(
                  (value) => applyPercent(value, calcTotalAttr[`base_${statType}`]) + percent,
                  (value) => {
                    const value_ = round(value, 2);
                    const value__ = round(value_ / 100, 4);

                    return `${value_}% = ${calcTotalAttr[`base_${statType}`]} * ${value__} =`;
                  }
                )
              )}
            </ul>
          </div>
        );
      })}

      {OTHER_STATS.map((statType) => {
        const percent = percentSign(statType);

        return (
          <div key={statType} className="break-inside-avoid">
            {renderHeading(t(statType), round(calcTotalAttr[statType], 2) + percent)}

            {totalAttr?.[statType].length ? (
              <ul className="pl-4 list-disc">
                {totalAttr?.[statType].map(renderRecord((value) => round(value, 1) + percent))}
              </ul>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
