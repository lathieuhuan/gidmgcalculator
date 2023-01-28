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
      <EnlargedDisplay activeSetupName={activeSetupName} />
    </div>
  );
}

interface EnlargedDisplayProps {
  activeSetupName: string;
}
function EnlargedDisplay({ activeSetupName }: EnlargedDisplayProps) {
  const dispatch = useDispatch();
  const resultsEnlarged = useSelector((state) => state.ui.resultsEnlarged);

  return (
    <Modal
      active={resultsEnlarged}
      className="p-4 pt-2 rounded-lg shadow-white-glow bg-darkblue-3 custom-scrollbar max-w-95"
      style={{
        height: "80vh",
      }}
      onClose={() => dispatch(updateUI({ resultsEnlarged: false }))}
    >
      <ResultsDisplay activeSetupName={activeSetupName} />
    </Modal>
  );
}
