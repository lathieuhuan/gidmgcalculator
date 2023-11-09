import type { ResistanceReduction, Tracker } from "@Src/types";
import { ATTACK_ELEMENTS } from "@Src/constants";
import { useTranslation } from "@Src/hooks";
import { getTotalRecordValue, recordListStyles, renderHeading, renderRecord } from "./utils";

function getResMultEquation(value: number) {
  const RES = value / 100;
  return `${RES < 0 ? `1 - (${RES} / 2)` : RES >= 0.75 ? `1 / (4 * ${RES} + 1)` : `1 - ${RES}`}`;
}

export function DebuffsTracker({ resistReduct }: Partial<Pick<Tracker, "resistReduct">>) {
  const { t } = useTranslation();
  const hasRecord = resistReduct && Object.values(resistReduct).some((record) => record.length);
  const totalResistReduct = {} as ResistanceReduction;

  for (const attElmt of ["def", ...ATTACK_ELEMENTS] as const) {
    totalResistReduct[attElmt] = getTotalRecordValue(resistReduct?.[attElmt] || []);
  }

  return (
    <div className="pl-2 space-y-3 divide-y divide-rarity-1">
      {hasRecord && (
        <div className={recordListStyles}>
          {(["def", ...ATTACK_ELEMENTS] as const).map((attElmt) => {
            const records = resistReduct?.[attElmt] || [];

            return records.length ? (
              <div key={attElmt} className="break-inside-avoid">
                {renderHeading(t(attElmt, { ns: "resistance" }) + " reduction", totalResistReduct[attElmt] + "%")}

                <ul className="pl-4 list-disc">{records.map(renderRecord((value) => value + "%"))}</ul>
              </div>
            ) : null;
          })}
        </div>
      )}
      <div>
        <p className={"text-lg text-orange" + (hasRecord ? " pt-3" : "")}>Resistance Multipliers</p>
        <div className={recordListStyles}>
          {ATTACK_ELEMENTS.map((attElmt) => {
            const actualResistance = 10 - totalResistReduct[attElmt];

            return (
              <div key={attElmt} className="pl-2 break-inside-avoid">
                {renderHeading(
                  <span className="capitalize">{attElmt}</span>,
                  eval(`${getResMultEquation(actualResistance)}`)
                )}

                <ul className="pl-4 list-disc">
                  {renderRecord()(
                    {
                      desc: `RES base 10% - Reduction ${totalResistReduct[attElmt]}% = ${actualResistance}% or`,
                      value: actualResistance / 100,
                    },
                    0
                  )}

                  {renderRecord(getResMultEquation)({ desc: "Equation", value: actualResistance }, 1)}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
