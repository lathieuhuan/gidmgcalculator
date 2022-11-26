import { Tracker } from "@Calculators/types";
import { useTranslation } from "@Hooks/useTranslation";
import {
  ATTACK_ELEMENTS,
  ATTACK_ELEMENT_INFO_KEYS,
  ATTACK_PATTERNS,
  ATTACK_PATTERN_INFO_KEYS,
  REACTIONS,
} from "@Src/constants";
import { AttacklementInfoKey, AttackPatternInfoKey } from "@Src/types";
import { round1, percentSign } from "@Src/utils";
import { selectRxnBonus } from "@Store/calculatorSlice/selectors";
import { useSelector } from "@Store/hooks";
import { renderHeading, renderRecord } from "./utils";

const infoKeyMap: Record<AttackPatternInfoKey | AttacklementInfoKey, string> = {
  pct: "Percent",
  flat: "Flat",
  cDmg: "CRIT DMG",
  cRate: "CRIT Rate",
  defIgnore: "DEF ignore",
  mult: "Multiplier",
  specialMult: "Special Multiplier",
};

export function Bonuses({
  attPattBonus,
  attElmtBonus,
  rxnBonus,
}: Partial<Pick<Tracker, "attPattBonus" | "attElmtBonus" | "rxnBonus">>) {
  const { t } = useTranslation();
  const calcRxnBonus = useSelector(selectRxnBonus);

  const hasAttPattBonus =
    attPattBonus && Object.values(attPattBonus).some((records) => records.length);
  const hasAttElmtBonus =
    attElmtBonus && Object.values(attElmtBonus).some((records) => records.length);
  const hasRxnBonus = rxnBonus && Object.values(rxnBonus).some((records) => records.length);

  if (!hasAttPattBonus && !hasAttElmtBonus && !hasRxnBonus) {
    return (
      <div className="h-16 flex-center text-rarity-1">
        <p className="text-xl">No bonuses</p>
      </div>
    );
  }

  const ATTACK_PATTERN_BONUS__KEYS = ["all", ...ATTACK_PATTERNS] as const;

  return (
    <div className="pl-2 pr-4 flex flex-col space-y-3 divide-y divide-rarity-1">
      {hasAttPattBonus ? (
        <div className="pl-2 columns-1 md2:columns-2 space-y-1">
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
                      {renderHeading(
                        infoKeyMap[infoKey],
                        records.reduce((accumulator, record) => accumulator + record.value, 0) +
                          percent
                      )}

                      <div className="pl-2">
                        {records.map(renderRecord((value) => round1(value) + percent))}
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            );
          })}
        </div>
      ) : null}

      {hasAttElmtBonus ? (
        <div
          className={"pl-2 columns-1 md2:columns-2 space-y-1" + (hasAttPattBonus ? " pt-3" : "")}
        >
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
                      {renderHeading(
                        infoKeyMap[infoKey],
                        records.reduce((accumulator, record) => accumulator + record.value, 0) +
                          percent
                      )}

                      <div className="pl-2">
                        {records.map(renderRecord((value) => round1(value) + percent))}
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            );
          })}
        </div>
      ) : null}

      {hasRxnBonus ? (
        <div
          className={
            "columns-1 md2:columns-2 space-y-1" +
            (hasAttPattBonus || hasAttElmtBonus ? " pt-3" : "")
          }
        >
          {REACTIONS.map((reaction) => {
            const records = rxnBonus[reaction];
            const percent = reaction === "melt" || reaction === "vaporize" ? "" : "%";

            return records.length ? (
              <div key={reaction} className="pl-2 break-inside-avoid">
                {renderHeading(t(reaction), calcRxnBonus[reaction] + percent)}

                {records.map(renderRecord((value) => round1(value) + percent))}
              </div>
            ) : null;
          })}
        </div>
      ) : null}
    </div>
  );
}
