import { useEffect, useState } from "react";
import { AttackPattern, Infusion, Tracker } from "@Src/types";

// Store
import { useSelector } from "@Store/hooks";
import { selectDmgResult, selectTarget } from "@Store/calculatorSlice/selectors";

// Util
import { calculateAll } from "@Src/calculation";
import { bareLv } from "@Src/utils";
import { initTracker, getTotalRecordValue } from "./utils";

// Component
import { Green, Dim, CollapseList } from "@Src/pure-components";
import { AttributesTracker } from "./AttributesTracker";
import { BonusesTracker } from "./BonusesTracker";
import { DebuffsTracker } from "./DebuffsTracker";
import { CalcItemTracker } from "./CalcItemTracker";

export type TrackerState = "open" | "close" | "hidden";

interface TrackerContainerProps {
  trackerState: TrackerState;
}
export const TrackerContainer = ({ trackerState }: TrackerContainerProps) => {
  const activeSetup = useSelector((state) => {
    const { activeId, setupsById } = state.calculator;
    return setupsById[activeId];
  });
  const target = useSelector(selectTarget);
  const dmgResult = useSelector(selectDmgResult);

  const [result, setResult] = useState<Tracker>();
  const [infusion, setInfusion] = useState<Infusion>({
    element: "phys",
  });
  const [xtraInfo, setXtraInfo] = useState<{ inHealB_?: number }>({});

  const { totalAttr, attPattBonus, attElmtBonus, rxnBonus } = result || {};
  const charLv = bareLv(activeSetup.char.level);
  const totalDefReduct = getTotalRecordValue(result?.resistReduct.def || []);

  useEffect(() => {
    if (trackerState === "open") {
      const tracker = initTracker();
      const calcResult = calculateAll(activeSetup, target, tracker);

      setResult(tracker);
      setInfusion({
        element: calcResult.infusedElement,
        range: calcResult.infusedAttacks,
      });
      setXtraInfo({ inHealB_: calcResult.totalAttr.inHealB_ });
    }
  }, [trackerState]);

  const renderDefMultiplier = (talent: AttackPattern) => {
    const talentDefIgnore = getTotalRecordValue(result?.attPattBonus[`${talent}.defIgn_`] || []);
    const allDefIgnore = getTotalRecordValue(result?.attPattBonus["all.defIgn_"] || []);
    const totalDefIgnore = talentDefIgnore + allDefIgnore;

    return (
      <div className="flex items-center">
        <p className="mr-4 text-yellow-400">DEF Mult.</p>

        <div className="flex flex-col items-center">
          <p>
            <Dim>char. Lv.</Dim> <Green>{charLv}</Green> + 100
          </p>

          <div className="my-1 w-full h-px bg-rarity-1" />

          <p className="px-2 text-center">
            {totalDefReduct ? (
              <>
                (1 - <Dim>DEF reduction</Dim> <Green>{totalDefReduct}</Green> / 100) *
              </>
            ) : null}{" "}
            {totalDefIgnore ? (
              <>
                (1 - <Dim>DEF ignore</Dim> <Green>{totalDefIgnore}</Green> / 100) *
              </>
            ) : null}{" "}
            (<Dim>target Lv.</Dim> <Green>{target.level}</Green> + 100) + <Dim>char. Lv.</Dim> <Green>{charLv}</Green> +
            100
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
              <CalcItemTracker
                records={result?.NAs}
                calcDmgResult={dmgResult.NAs}
                defMultDisplay={renderDefMultiplier("NA")}
                infusion={infusion}
                {...xtraInfo}
              />
            ),
          },
          {
            heading: "Elemental Skill",
            body: (
              <CalcItemTracker
                records={result?.ES}
                calcDmgResult={dmgResult.ES}
                defMultDisplay={renderDefMultiplier("ES")}
                {...xtraInfo}
              />
            ),
          },
          {
            heading: "Elemental Burst",
            body: (
              <CalcItemTracker
                records={result?.EB}
                calcDmgResult={dmgResult.EB}
                defMultDisplay={renderDefMultiplier("EB")}
                {...xtraInfo}
              />
            ),
          },
          {
            heading: "Reactions",
            body: <CalcItemTracker records={result?.RXN} calcDmgResult={dmgResult.RXN} />,
          },
        ]}
      />
    </div>
  );
};
