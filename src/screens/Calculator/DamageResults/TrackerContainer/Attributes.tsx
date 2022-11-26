import type { Tracker } from "@Calculators/types";
import { useTranslation } from "@Hooks/useTranslation";
import { useSelector } from "@Store/hooks";
import { selectTotalAttr } from "@Store/calculatorSlice/selectors";
import { ATTACK_ELEMENTS, CORE_STAT_TYPES, OTHER_PERCENT_STAT_TYPES } from "@Src/constants";
import { applyPercent, percentSign, round1 } from "@Src/utils";
import { renderHeading, renderRecord } from "./utils";

const OTHER_STATS = [
  "em",
  "cRate",
  "cDmg",
  ...ATTACK_ELEMENTS,
  ...OTHER_PERCENT_STAT_TYPES,
] as const;

export function Attributes({ totalAttr }: Partial<Pick<Tracker, "totalAttr">>) {
  const { t } = useTranslation();
  const calcTotalAttr = useSelector(selectTotalAttr);

  return (
    <div className="pl-2 pr-4 columns-1 md2:columns-2 space-y-1">
      {CORE_STAT_TYPES.map((statType) => {
        const percent = percentSign(statType);
        const records = totalAttr?.[statType] || [];
        const records_ = totalAttr?.[`${statType}_`] || [];

        return (
          <div key={statType} className="break-inside-avoid">
            {renderHeading(t(statType), Math.round(calcTotalAttr[statType]) + percent)}

            <div className="pl-2">
              {records.map(renderRecord((value) => round1(value) + percent))}

              {records_.map(
                renderRecord(
                  (value) => applyPercent(value, calcTotalAttr[`base_${statType}`]) + percent,
                  (value) => `${value}% = ${calcTotalAttr[`base_${statType}`]} * ${value / 100} =`
                )
              )}
            </div>
          </div>
        );
      })}

      {OTHER_STATS.map((statType) => {
        const percent = percentSign(statType);

        return (
          <div key={statType} className="break-inside-avoid">
            {renderHeading(t(statType), Math.round(calcTotalAttr[statType]) + percent)}

            {totalAttr?.[statType].length ? (
              <div className="pl-2">
                {totalAttr?.[statType].map(renderRecord((value) => round1(value) + percent))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
