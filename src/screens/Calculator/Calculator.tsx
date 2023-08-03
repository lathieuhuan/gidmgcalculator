import clsx from "clsx";
import { memo } from "react";

import { useSelector } from "@Store/hooks";

// Component
import CharOverview from "./CharOverview";
import Modifiers from "./Modifiers";
import DamageResults from "./DamageResults";
import SetupManager from "./SetupManager";

import styles from "./styles.module.scss";

const Calculator = () => {
  const touched = useSelector((state) => state.calculator.setupManageInfos.length !== 0);

  return (
    <div className={clsx("pb-1 flex items-center overflow-auto", styles.calculator)}>
      <div className="h-98/100 flex space-x-2">
        <div className={clsx("px-6 py-4 bg-darkblue-1", styles.card)}>
          {/* // ========== PANEL 1 ========== */}
          <CharOverview touched={touched} />
        </div>

        <div className={clsx("px-6 py-4 bg-darkblue-1", styles.card)}>
          {touched ? (
            // ========== PANEL 2 ==========
            <Modifiers />
          ) : null}
        </div>

        <div className={clsx("p-4 relative bg-darkblue-3 overflow-hidden", styles.card)}>
          {touched ? (
            // ========== PANEL 3 ==========
            <SetupManager />
          ) : null}
        </div>

        <div className={clsx("px-4 pt-2 pb-6 bg-darkblue-3 relative", styles.card)}>
          {touched ? (
            // ========== PANEL 4 ==========
            <DamageResults />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default memo(Calculator);
