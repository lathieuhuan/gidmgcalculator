import calculateAll from "@Calculators/index";
import { initTracker } from "@Calculators/utils";
import { selectCharData, selectTarget } from "@Store/calculatorSlice/selectors";
import { useSelector } from "@Store/hooks";
import { useEffect, useState } from "react";
import { TrackerState } from "../types";

interface ITrackerContainerProps {
  trackerState: TrackerState;
}
export default function Tracker({ trackerState }: ITrackerContainerProps) {
  const activeSetup = useSelector((state) => {
    const { activeId, setupsById } = state.calculator;
    return setupsById[activeId];
  });
  const charData = useSelector(selectCharData);
  const target = useSelector(selectTarget);

  const [result, setResult] = useState();

  useEffect(() => {
    if (trackerState === "OPEN") {
      const tracker = initTracker();

      const {} = calculateAll({ ...activeSetup, target }, charData, tracker);
      console.log(JSON.stringify(tracker));

      setResult(undefined);
    }
  }, [trackerState]);

  return <></>;
}
