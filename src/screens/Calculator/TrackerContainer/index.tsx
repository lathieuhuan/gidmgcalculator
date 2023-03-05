import { useEffect, useState } from "react";
import { AttackPattern, Infusion, Tracker } from "@Src/types";

// Hook
import { useSelector } from "@Store/hooks";

// Selector
import { selectCharData, selectDmgResult, selectTarget } from "@Store/calculatorSlice/selectors";

// Calculator
import calculateAll from "@Calculators/index";

// Util
import { bareLv } from "@Src/utils";
import { initTracker, getTotalRecordValue } from "./utils";

// Component
import { Green, Lesser } from "@Components/atoms";
import { CollapseList } from "@Components/molecules";
import { AttributesTracker } from "./AttributesTracker";
import { BonusesTracker } from "./BonusesTracker";
import { DebuffsTracker } from "./DebuffsTracker";
import { DamageTracker } from "./DamageTracker";

export type TrackerState = "open" | "close" | "hidden";

interface TrackerContainerProps {
  trackerState: TrackerState;
}
export const TrackerContainer = ({ trackerState }: TrackerContainerProps) => {
  const activeSetup = useSelector((state) => {
    const { activeId, setupsById } = state.calculator;
    return setupsById[activeId];
  });
  const charData = useSelector(selectCharData);
  const target = useSelector(selectTarget);
  const dmgResult = useSelector(selectDmgResult);

  const [result, setResult] = useState<Tracker>();
  const [infusion, setInfusion] = useState<Infusion>({
    element: "phys",
  });

  const { totalAttr, attPattBonus, attElmtBonus, rxnBonus } = result || {};
  const charLv = bareLv(activeSetup.char.level);
  const totalDefReduct = getTotalRecordValue(result?.resistReduct.def || []);

  useEffect(() => {
    if (trackerState === "open") {
      const tracker = initTracker();
      const calcResult = calculateAll(activeSetup, target, charData, tracker);

      setResult(tracker);
      setInfusion({
        element: calcResult.infusedElement,
        range: calcResult.infusedAttacks,
      });
    }
  }, [trackerState]);

  const renderDefMultiplier = (talent: AttackPattern) => {
    const totalDefIgnore = getTotalRecordValue(result?.attPattBonus[`${talent}.defIgn_`] || []);

    return (
      <div className="flex items-center">
        <p className="mr-4 text-lightgold">DEF Mult.</p>

        <div className="flex flex-col items-center">
          <p>
            <Lesser>char. Lv.</Lesser> <Green>{charLv}</Green> + 100
          </p>

          <div className="my-1 w-full h-px bg-rarity-1" />

          <p className="px-2 text-center">
            {totalDefReduct ? (
              <>
                (1 - <Lesser>DEF reduction</Lesser> <Green>{totalDefReduct}</Green> / 100) *
              </>
            ) : null}{" "}
            {totalDefIgnore ? (
              <>
                (1 - <Lesser>DEF ignore</Lesser> <Green>{totalDefIgnore}</Green> / 100) *
              </>
            ) : null}{" "}
            (<Lesser>target Lv.</Lesser> <Green>{target.level}</Green> + 100) + <Lesser>char. Lv.</Lesser>{" "}
            <Green>{charLv}</Green> + 100
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-2 grow custom-scrollbar cursor-default" onDoubleClick={() => console.log(result)}>
      <CollapseList
        list={[
          {
            heading: "Attributes",
            body: <AttributesTracker totalAttr={totalAttr} />,
          },
          {
            heading: "Bonuses",
            body: (
              <BonusesTracker
                {...{ attPattBonus, attElmtBonus, rxnBonus }}
                em={getTotalRecordValue(totalAttr?.em || [])}
              />
            ),
          },
          {
            heading: "Debuffs on Target",
            body: <DebuffsTracker resistReduct={result?.resistReduct} />,
          },
          {
            heading: "Normal Attacks",
            body: (
              <DamageTracker
                records={result?.NAs}
                calcDmgResult={dmgResult.NAs}
                defMultDisplay={renderDefMultiplier("NA")}
                infusion={infusion}
              />
            ),
          },
          {
            heading: "Elemental Skill",
            body: (
              <DamageTracker
                records={result?.ES}
                calcDmgResult={dmgResult.ES}
                defMultDisplay={renderDefMultiplier("ES")}
              />
            ),
          },
          {
            heading: "Elemental Burst",
            body: (
              <DamageTracker
                records={result?.EB}
                calcDmgResult={dmgResult.EB}
                defMultDisplay={renderDefMultiplier("EB")}
              />
            ),
          },
          {
            heading: "Reactions",
            body: <DamageTracker records={result?.RXN} calcDmgResult={dmgResult.RXN} />,
          },
        ]}
      />
    </div>
  );
};
