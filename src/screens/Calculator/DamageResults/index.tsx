import { Results } from "./Results";
import { Header } from "./Header";
import { useSelector } from "@Store/hooks";
import { findById } from "@Src/utils";

export default function DamageResults() {
  const activeSetupName = useSelector((state) => {
    const { activeId, setupManageInfos } = state.calculator;
    return findById(setupManageInfos, activeId)?.name || "";
  });

  return (
    <div className="h-full">
      <Header activeSetupName={activeSetupName} />
      <Results activeSetupName={activeSetupName} />
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
