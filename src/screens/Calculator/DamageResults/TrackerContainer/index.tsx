import { useEffect, useState } from "react";
import type { AttackPattern, Tracker } from "@Src/types";
import type { TrackerState } from "../types";

// Hook
import { useSelector } from "@Store/hooks";

// Selector
import { selectCharData, selectDmgResult, selectTarget } from "@Store/calculatorSlice/selectors";

// Calculator
import calculateAll from "@Calculators/index";

// Util
import { initTracker } from "@Calculators/utils";
import { bareLv } from "@Src/utils";
import { getTotalRecordValue } from "./utils";

// Component
import { Green, Lesser } from "@Components/atoms";
import { CollapseList } from "@Components/molecules";
import { AttributesTracker } from "./AttributesTracker";
import { BonusesTracker } from "./BonusesTracker";
import { DebuffsTracker } from "./DebuffsTracker";
import { DamageTracker } from "./DamageTracker";

interface ITrackerContainerProps {
  trackerState: TrackerState;
}
export default function TrackerContainer({ trackerState }: ITrackerContainerProps) {
  const activeSetup = useSelector((state) => {
    const { activeId, setupsById } = state.calculator;
    return setupsById[activeId];
  });
  const charData = useSelector(selectCharData);
  const target = useSelector(selectTarget);
  const dmgResult = useSelector(selectDmgResult);

  const [result, setResult] = useState<Tracker>();

  const { totalAttr, attPattBonus, attElmtBonus, rxnBonus } = result || {};
  const charLv = bareLv(activeSetup.char.level);
  const totalDefReduct = getTotalRecordValue(result?.resistReduct.def || []);

  useEffect(() => {
    if (trackerState === "OPEN") {
      const tracker = initTracker();

      calculateAll(activeSetup, target, charData, tracker);
      setResult(tracker);
    }
  }, [trackerState]);

  const renderDefMultiplier = (talent: AttackPattern) => {
    const totalDefIgnore = getTotalRecordValue(result?.attPattBonus[`${talent}.defIgnore`] || []);

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
            (<Lesser>target Lv.</Lesser> <Green>{target.level}</Green> + 100) +{" "}
            <Lesser>char. Lv.</Lesser> <Green>{charLv}</Green> + 100
          </p>
        </div>
      </div>
    );
  };

  return (
    <div
      className="mt-2 grow custom-scrollbar cursor-default"
      onDoubleClick={() => console.log(result)}
    >
      <CollapseList
        headingList={[
          "Attributes",
          "Bonuses",
          "Debuffs on Target",
          "Normal Attacks",
          "Elemental Skill",
          "Elemental Burst",
          "Reactions",
        ]}
        contentList={[
          <AttributesTracker totalAttr={totalAttr} />,
          <BonusesTracker
            {...{ attPattBonus, attElmtBonus, rxnBonus }}
            em={getTotalRecordValue(totalAttr?.em || [])}
          />,
          <DebuffsTracker resistReduct={result?.resistReduct} />,
          <DamageTracker
            records={result?.NAs}
            calcDmgResult={dmgResult.NAs}
            defMultDisplay={renderDefMultiplier("NA")}
          />,
          <DamageTracker
            records={result?.ES}
            calcDmgResult={dmgResult.ES}
            defMultDisplay={renderDefMultiplier("ES")}
          />,
          <DamageTracker
            records={result?.EB}
            calcDmgResult={dmgResult.EB}
            defMultDisplay={renderDefMultiplier("EB")}
          />,
          <DamageTracker records={result?.RXN} calcDmgResult={dmgResult.RXN} />,
        ]}
      />
    </div>
  );
}
