import { useEffect, useState } from "react";
import type { TrackerState } from "../types";

import { useSelector } from "@Store/hooks";
import { selectCharData, selectTarget } from "@Store/calculatorSlice/selectors";

import calculateAll from "@Calculators/index";
import { Tracker } from "@Calculators/types";
import { initTracker } from "@Calculators/utils";

import { CollapseList } from "@Components/collapse";
import { Attributes } from "./Attributes";
import { Bonuses } from "./Bonuses";

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

  const [result, setResult] = useState<Tracker>();
  const { totalAttr } = result || {};

  useEffect(() => {
    if (trackerState === "OPEN") {
      const tracker = initTracker();

      calculateAll({ ...activeSetup, target }, charData, tracker);
      setResult(tracker);
    }
  }, [trackerState]);

  return (
    <div className="mt-2 grow custom-scrollbar cursor-default">
      <CollapseList
        headingList={["Attributes", "Bonuses"]}
        contentList={[<Attributes totalAttr={totalAttr} />, <Bonuses {...result} />]}
      />
    </div>
  );
}
