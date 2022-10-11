import cn from "classnames";
import { memo, useState, useEffect } from "react";
import { FaExpandArrowsAlt, FaSearch } from "react-icons/fa";

import { selectChar, selectDamageResult, selectParty } from "@Store/calculatorSlice/selectors";
import { useSelector } from "@Store/hooks";
import { selectComparedIndexes } from "@Store/uiSlice";
import { EStatDamageKey } from "@Src/constants";

import { IconButton, Select } from "@Src/styled-components";
import { DamageDisplay } from "@Components/DamageDisplay";
import { findById } from "@Src/utils";

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
  const char = useSelector(selectChar);
  const party = useSelector(selectParty);
  const activeSetupName = useSelector((state) => {
    const { activeId, setupManageInfos } = state.calculator;
    return findById(setupManageInfos, activeId)?.name || "";
  });
  const comparedIndexes = useSelector(selectComparedIndexes);
  const dmgResult = useSelector(selectDamageResult);

  const [focus, setFocus] = useState<EStatDamageKey | undefined>();

  const comparing = comparedIndexes.length > 1;

  useEffect(() => {
    setFocus(comparing ? EStatDamageKey.AVERAGE : undefined);
  }, [comparing]);

  return (
    <div className="h-full flex flex-col">
      {focus ? (
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
          focus={focus}
        />
      </div>
    </div>
  );
}
