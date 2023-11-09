import { FaMinus } from "react-icons/fa";

import { useDispatch, useSelector } from "@Store/hooks";
import { updateUI } from "@Store/uiSlice";
import { findById } from "@Src/utils";

// Component
import { Button, CloseButton, Modal } from "@Src/pure-components";
import { TrackerContainer, type TrackerState } from "./TrackerContainer";

export const Tracker = () => {
  const dispatch = useDispatch();
  const trackerState = useSelector((state) => state.ui.trackerState);
  const activeSetupName = useSelector((state) => {
    const { activeId, setupManageInfos } = state.calculator;
    return findById(setupManageInfos, activeId)?.name || "";
  });

  const setTrackerState = (newState: TrackerState) => {
    dispatch(updateUI({ trackerState: newState }));
  };

  return (
    <Modal state={trackerState} className="p-4 flex flex-col" withDefaultStyle onClose={() => setTrackerState("close")}>
      <div className="absolute top-1 right-1 flex">
        <Button
          className="hover:text-lightgold"
          boneOnly
          icon={<FaMinus />}
          onClick={() => setTrackerState("hidden")}
        />
        <CloseButton boneOnly onClick={() => setTrackerState("close")} />
      </div>
      <p className="flex items-center md1:justify-center">
        <span className="md1:text-xl md2:text-2xl text-orange font-bold">Tracking Results</span>{" "}
        <span className="ml-2 text-lesser">({activeSetupName})</span>
      </p>

      <TrackerContainer trackerState={trackerState} />
    </Modal>
  );
};
