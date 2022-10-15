import cn from "classnames";
import { memo, useState, useEffect } from "react";
import { FaExpandArrowsAlt, FaSearch } from "react-icons/fa";

import { selectActiveId } from "@Store/calculatorSlice/selectors";
import { useSelector } from "@Store/hooks";
import { selectComparedIndexes } from "@Store/uiSlice";
import { EStatDamageKey } from "@Src/constants";

import { IconButton, Select } from "@Src/styled-components";
import { findById } from "@Src/utils";
import { DamageDisplay } from "@Components/DamageDisplay";
import getDamage from "@Calculators/damage";
import { getPartyData } from "@Data/controllers";

export default function DamageResults() {
  const [enlargedOn, setEnlargedOn] = useState(false);
  const [trackerState, setTrackerState] = useState(0);

  return (
    <div className="h-full">
      <div>
        <IconButton
          className={cn(
            "w-7 h-7 absolute top-3 left-3",
            trackerState ? "bg-green" : "bg-default hover:bg-lightgold"
          )}
          onClick={() => setTrackerState([0, 2].includes(trackerState) ? 1 : 0)}
        >
          <FaSearch />
        </IconButton>

        <div className="absolute top-3 right-3 hidden md1:flex">
          <IconButton
            className="ml-3 w-7 h-7"
            variant="positive"
            onClick={() => setEnlargedOn(true)}
          >
            <FaExpandArrowsAlt />
          </IconButton>
        </div>
      </div>

      <MemoResults />
      {/* {enlarged && <EnlargedInner name={name} close={() => setEnlargedOn(false)} />} */}
      {/* {trackerState > 0 && (
        <Tracker trackerState={trackerState} setTrackerState={setTrackerState} />
      )} */}
      {/* {window.innerWidth < 1050 && trackerState > 0 && (
        <MobileNavBtn
          className={cn({ showing: trackerState > 0 })}
          style={{ position: "fixed", top: 0, right: 0 }}
          onClick={() => setTrackerState(1)}
        >
          <FaSearch size="1.25rem" />
        </MobileNavBtn>
      )} */}
    </div>
  );
}

const MemoResults = memo(Results);

function Results() {
  const activeId = useSelector(selectActiveId);
  const { charData, target } = useSelector((state) => state.calculator);
  const {
    char,
    party,
    elmtModCtrls,
    selfBuffCtrls,
    selfDebuffCtrls,
    subArtDebuffCtrls,
    customDebuffCtrls,
  } = useSelector((state) => state.calculator.setupsById)[activeId];

  const { totalAttrs, attPattBonus, attElmtBonus, rxnBonuses, finalInfusion } = useSelector(
    (state) => state.calculator.statsById[activeId]
  );

  const partyData = getPartyData(party);

  const activeSetupName = useSelector((state) => {
    const { activeId, setupManageInfos } = state.calculator;
    return findById(setupManageInfos, activeId)?.name || "";
  });
  const comparedIndexes = useSelector(selectComparedIndexes);

  const tracker = undefined;

  const dmgResult = getDamage(
    char,
    charData,
    selfBuffCtrls,
    selfDebuffCtrls,
    party,
    partyData,
    subArtDebuffCtrls,
    totalAttrs,
    attPattBonus,
    attElmtBonus,
    rxnBonuses,
    customDebuffCtrls,
    finalInfusion,
    elmtModCtrls,
    target,
    tracker
  );

  const [focus, setFocus] = useState<EStatDamageKey>(EStatDamageKey.AVERAGE);

  const comparing = comparedIndexes.length > 1;

  useEffect(() => {
    if (comparing) {
      setFocus(EStatDamageKey.AVERAGE);
    }
  }, [comparing]);

  return (
    <div className="h-full flex flex-col">
      {comparing ? (
        <div className="mb-4 flex">
          <p className="mr-2">Choose a focus</p>
          <Select
            className="text-center text-lightgold"
            value={focus}
            onChange={(e) => setFocus(e.target.value as EStatDamageKey)}
          >
            {Object.values(EStatDamageKey).map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </Select>
        </div>
      ) : (
        <p className="mx-4 my-2 font-bold text-center">{activeSetupName.toUpperCase()}</p>
      )}
      <div className="grow hide-scrollbar">
        <DamageDisplay
          key={char.name}
          char={char}
          party={party}
          damageResult={dmgResult}
          focus={comparing ? focus : undefined}
        />
      </div>
    </div>
  );
}
