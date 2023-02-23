import clsx from "clsx";
import { memo } from "react";

// Hook
import { useSelector } from "@Store/hooks";

// Component
import CharOverview from "./CharOverview";
import Modifiers from "./Modifiers";
import DamageResults from "./DamageResults";
import SetupManager from "./SetupManager";

import styles from "./styles.module.scss";

function Calculator() {
  const touched = useSelector((state) => state.calculator.setupManageInfos.length !== 0);

  return (
    <div className={clsx("pb-1 flex items-center overflow-auto", styles.calculator)}>
      <div className="h-98/100 flex space-x-2">
        {/* Panel 1 */}
        <div className={clsx("px-6 py-4 bg-darkblue-1", styles.card)}>
          <CharOverview touched={touched} />
        </div>

        {/* Panel 2 */}
        <div className={clsx("px-6 py-4 bg-darkblue-1", styles.card)}>
          {touched && <Modifiers />}
        </div>

        {/* Panel 3 */}
        <div className={clsx("p-4 relative bg-darkblue-3 overflow-hidden", styles.card)}>
          {touched && <SetupManager />}
        </div>

        {/* Panel 4 */}
        <div className={clsx("px-4 pt-2 pb-6 bg-darkblue-3 relative", styles.card)}>
          {touched && <DamageResults />}
        </div>
      </div>
    </div>
  );
}

export default memo(Calculator);
