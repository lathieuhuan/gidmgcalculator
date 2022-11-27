import { useEffect, useState } from "react";
import type { TrackerState } from "../types";
import type { Tracker } from "@Calculators/types";

import { useSelector } from "@Store/hooks";
import { selectCharData, selectDmgResult, selectTarget } from "@Store/calculatorSlice/selectors";

import calculateAll from "@Calculators/index";
import { initTracker } from "@Calculators/utils";
import { getTotalRecordValue } from "./utils";

import { CollapseList } from "@Components/collapse";
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

  useEffect(() => {
    if (trackerState === "OPEN") {
      const tracker = initTracker();

      calculateAll({ ...activeSetup, target }, charData, tracker);
      setResult(tracker);
    }
  }, [trackerState]);
  dmgResult.NAs;
  return (
    <div className="mt-2 grow custom-scrollbar cursor-default">
      <CollapseList
        headingList={[
          "Attributes",
          "Bonuses",
          "Debuffs on Target",
          "Normal Attacks",
          "Elemental Skill",
          "Elemental Burst",
        ]}
        contentList={[
          <AttributesTracker totalAttr={totalAttr} />,
          <BonusesTracker
            {...{ attPattBonus, attElmtBonus, rxnBonus }}
            em={getTotalRecordValue(totalAttr?.em || [])}
          />,
          <DebuffsTracker resistReduct={result?.resistReduct} />,
          <DamageTracker records={result?.NAs} calcDmgResult={dmgResult.NAs} />,
          <DamageTracker records={result?.ES} calcDmgResult={dmgResult.ES} />,
          <DamageTracker records={result?.EB} calcDmgResult={dmgResult.EB} />,
        ]}
      />
    </div>
  );
}
