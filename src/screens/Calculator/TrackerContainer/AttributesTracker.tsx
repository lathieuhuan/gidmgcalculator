import type { Tracker } from "@Src/types";
import { ATTRIBUTE_STAT_TYPES, CORE_STAT_TYPES } from "@Src/constants";
import { useTranslation } from "@Src/hooks";

// Util
import { applyPercent, percentSign, round } from "@Src/utils";
import { recordListStyles, renderHeading, renderRecord } from "./utils";

// Store
import { useSelector } from "@Store/hooks";
import { selectTotalAttr } from "@Store/calculatorSlice/selectors";

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

      {ATTRIBUTE_STAT_TYPES.slice(6).map((statType) => {
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
