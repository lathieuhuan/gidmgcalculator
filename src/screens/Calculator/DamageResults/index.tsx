// Hook
import { useDispatch, useSelector } from "@Store/hooks";

// Util
import { findById } from "@Src/utils";

// Action
import { updateUI } from "@Store/uiSlice";

// Component
import { Modal } from "@Components/molecules";
import { Menu } from "./Menu";
import { ResultsDisplay } from "./ResultsDisplay";

export default function DamageResults() {
  const activeSetupName = useSelector((state) => {
    const { activeId, setupManageInfos } = state.calculator;
    return findById(setupManageInfos, activeId)?.name || "";
  });

  return (
    <div className="h-full">
      <Menu activeSetupName={activeSetupName} />
      <ResultsDisplay activeSetupName={activeSetupName} />
    </div>
  );
}
