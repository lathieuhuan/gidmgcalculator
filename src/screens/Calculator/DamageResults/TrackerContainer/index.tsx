import { useEffect, useState } from "react";
import type { TrackerState } from "../types";

import { useSelector } from "@Store/hooks";
import { selectCharData, selectTarget } from "@Store/calculatorSlice/selectors";

import calculateAll from "@Calculators/index";
import { Tracker } from "@Calculators/types";
import { initTracker } from "@Calculators/utils";

import { CollapseList } from "@Components/collapse";
import { Attributes } from "./Attributes";

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

  useEffect(() => {
    if (trackerState === "OPEN") {
      const tracker = initTracker();

      calculateAll({ ...activeSetup, target }, charData, tracker);
      setResult(tracker);
    }
  }, [trackerState]);

  return (
    <div className="mt-2 grow custom-scrollbar">
      <CollapseList
        headingList={["Attributes"]}
        contentList={[<Attributes totalAttr={result?.totalAttr} />]}
      />
    </div>
  );
}
