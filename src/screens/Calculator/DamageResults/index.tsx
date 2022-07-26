import DamageDisplay, { EStatDamageKey } from "@Components/DamageDisplay";
import { selectCharData } from "@Store/calculatorSlice/selectors";
import { useSelector } from "@Store/hooks";
import { selectComparedSetups } from "@Store/uiSlice";
import { IconButton, Select } from "@Src/styled-components";
import cn from "classnames";
import { useState } from "react";
import { FaExpandArrowsAlt, FaSearch } from "react-icons/fa";
import styles from "../styles.module.scss";

export default function DmgResults() {
  const { name } = useSelector(selectCharData);
  const [enlargedOn, setEnlargedOn] = useState(false);
  const [trackerState, setTrackerState] = useState(0);

  return (
    <div className={cn("px-4 pt-2 pb-6 flex-col relative bg-darkblue-3", styles.card)}>
      {window.innerWidth >= 610 && (
        <IconButton
          className="w-7 h-7 absolute top-3 left-3 hidden md1:block"
          variant="positive"
          onClick={() => setEnlargedOn(true)}
        >
          <FaExpandArrowsAlt />
        </IconButton>
      )}
      <IconButton
        className={cn(
          "w-7 h-7 absolute top-3 right-3 hover:text-lightgold",
          trackerState ? "text-green" : "text-default"
        )}
        onClick={() => setTrackerState([0, 2].includes(trackerState) ? 1 : 0)}
      >
        <FaSearch />
      </IconButton>
      {/* <MemoInner name={name} />
      {enlarged && <EnlargedInner name={name} close={() => setEnlargedOn(false)} />}
      {trackerState > 0 && (
        <Tracker trackerState={trackerState} setTrackerState={setTrackerState} />
      )}
      {window.innerWidth < 1050 && trackerState > 0 && (
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

function Results({ name }: { name: string }) {
  const setups = useSelector((state) => state.calculator.setups);
  const comparedSetups = useSelector(selectComparedSetups);
  const currentSetup = useSelector((state) => state.calculator.currentSetup);
  const dmgResult = useSelector((state) => state.calculator.allDmgResult[currentSetup]);

  const [focus, setFocus] = useState<EStatDamageKey>(EStatDamageKey.AVERAGE);

  return (
    <>
      {comparedSetups.length > 1 ? (
        <div className="mb-4 flex justify-center">
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
        <p className="mx-4 my-2 font-bold text-center">{setups[currentSetup].name.toUpperCase()}</p>
      )}
      <div className="grow-1 hide-sb">
        <DamageDisplay
          key={name}
          charName={name}
          damageResult={dmgResult}
          focus={comparedSetups.length > 1 ? focus : undefined}
        />
      </div>
    </>
  );
}
