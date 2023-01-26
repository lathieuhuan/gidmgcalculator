// Hook
import { useSelector } from "@Store/hooks";

// Util
import { findById } from "@Src/utils";

// Component
import { ResultsDisplay } from "./ResultsDisplay";
import { Menu } from "./Menu";
import { TrackerModal } from "../TrackerModal";

export default function DamageResults() {
  const activeSetupName = useSelector((state) => {
    const { activeId, setupManageInfos } = state.calculator;
    return findById(setupManageInfos, activeId)?.name || "";
  });

  return (
    <div className="h-full">
      <Menu />
      <ResultsDisplay activeSetupName={activeSetupName} />
      {/* {enlarged && <EnlargedInner name={name} close={() => setEnlargedOn(false)} />} */}
      {/* {window.innerWidth < 1050 && trackerState > 0 && (
        <MobileNavBtn
          className={cn({ showing: trackerState > 0 })}
          style={{ position: "fixed", top: 0, right: 0 }}
          onClick={() => setTrackerState(1)}
        >
          <FaSearch size="1.25rem" />
        </MobileNavBtn>
      )} */}
      <TrackerModal activeSetupName={activeSetupName} />
    </div>
  );
}
