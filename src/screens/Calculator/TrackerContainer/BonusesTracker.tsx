import type { Tracker } from "@Src/types";

// Constant
import {
  ATTACK_ELEMENTS,
  ATTACK_ELEMENT_INFO_KEYS,
  ATTACK_PATTERNS,
  ATTACK_PATTERN_INFO_KEYS,
  REACTIONS,
} from "@Src/constants";

// Util
import { round, percentSign } from "@Src/utils";
import { getRxnBonusesFromEM } from "@Src/utils/calculation";
import { getTotalRecordValue, recordListStyles, renderHeading, renderRecord } from "./utils";

// Hook
import { useTranslation } from "@Src/hooks";

interface BonusesTrackerProps extends Partial<Pick<Tracker, "attPattBonus" | "attElmtBonus" | "rxnBonus">> {
  em?: number;
}

export function BonusesTracker({ attPattBonus, attElmtBonus, rxnBonus, em }: BonusesTrackerProps) {
  const { t } = useTranslation();

  const hasAttPattBonus = attPattBonus && Object.values(attPattBonus).some((records) => records.length);
  const hasAttElmtBonus = attElmtBonus && Object.values(attElmtBonus).some((records) => records.length);
  const hasRxnBonus = rxnBonus && Object.values(rxnBonus).some((records) => records.length);

  if (!hasAttPattBonus && !hasAttElmtBonus && !hasRxnBonus && !em) {
    return (
      <div className="h-16 flex-center text-lesser">
        <p>No bonuses</p>
      </div>
    );
  }

  const ATTACK_PATTERN_BONUS__KEYS = ["all", ...ATTACK_PATTERNS] as const;
  const bonusesFromEM = getRxnBonusesFromEM(em);

  return (
    <div className="pl-2 space-y-3 divide-y divide-rarity-1">
      {hasAttPattBonus ? (
        <div className={"pl-2 " + recordListStyles}>
          {ATTACK_PATTERN_BONUS__KEYS.map((attPatt) => {
            const noRecord = ATTACK_PATTERN_INFO_KEYS.every((infoKey) => {
              return attPattBonus[`${attPatt}.${infoKey}`].length === 0;
            });

            if (noRecord) return null;

            return (
              <div key={attPatt} className="break-inside-avoid">
                <p className="text-orange capitalize">{t(attPatt)}</p>

                {ATTACK_PATTERN_INFO_KEYS.map((infoKey) => {
                  const records = attPattBonus[`${attPatt}.${infoKey}`];
                  const percent = percentSign(infoKey);

                  return records.length ? (
                    <div key={infoKey} className="pl-2">
                      {renderHeading(t(infoKey), getTotalRecordValue(records) + percent)}

                      <ul className="pl-4 list-disc">
                        {records.map(renderRecord((value) => round(value, 1) + percent))}
                      </ul>
                    </div>
                  ) : null;
                })}
              </div>
            );
          })}
        </div>
      ) : null}

      {hasAttElmtBonus ? (
        <div className={"pl-2 " + recordListStyles + (hasAttPattBonus ? " pt-3" : "")}>
          {ATTACK_ELEMENTS.map((attElmt) => {
            const noRecord = ATTACK_ELEMENT_INFO_KEYS.every((infoKey) => {
              return attElmtBonus[`${attElmt}.${infoKey}`].length === 0;
            });

            if (noRecord) return null;

            return (
              <div key={attElmt} className="break-inside-avoid">
                <p className="text-orange capitalize">{attElmt} DMG</p>

                {ATTACK_ELEMENT_INFO_KEYS.map((infoKey) => {
                  const records = attElmtBonus[`${attElmt}.${infoKey}`];
                  const percent = percentSign(infoKey);

                  return records.length ? (
                    <div key={infoKey} className="mt-1 pl-2">
                      {renderHeading(t(infoKey), getTotalRecordValue(records) + percent)}

                      <ul className="pl-4 list-disc">
                        {records.map(renderRecord((value) => round(value, 1) + percent))}
                      </ul>
                    </div>
                  ) : null;
                })}
              </div>
            );
          })}
        </div>
      ) : null}

      {hasRxnBonus || em ? (
        <div className={recordListStyles + (hasAttPattBonus || hasAttElmtBonus ? " pt-3" : "")}>
          {REACTIONS.map((reaction) => {
            const records = rxnBonus?.[`${reaction}.pct_`] || [];
            let bonusFromEM = 0;

            if (reaction === "melt" || reaction === "vaporize") {
              bonusFromEM = bonusesFromEM.amplifying;
            } else if (reaction === "aggravate" || reaction === "spread") {
              bonusFromEM = bonusesFromEM.quicken;
            } else {
              bonusFromEM = bonusesFromEM.transformative;
            }

            return records.length || em ? (
              <div key={reaction} className="pl-2 break-inside-avoid">
                {renderHeading(t(reaction), round(getTotalRecordValue(records) + bonusFromEM, 1) + "%")}

                <ul className="pl-4 list-disc">
                  {renderRecord((value) => value + "%")(
                    {
                      desc: "From Elemental Mastery",
                      value: bonusFromEM,
                    },
                    -1
                  )}

                  {records.map(renderRecord((value) => round(value, 1) + "%"))}
                </ul>
              </div>
            ) : null;
          })}
        </div>
      ) : null}
    </div>
  );
}
