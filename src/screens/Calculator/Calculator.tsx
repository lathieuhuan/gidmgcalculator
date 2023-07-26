import clsx from "clsx";
import { memo } from "react";

import { useSelector } from "@Store/hooks";

// Component
import { Skeleton } from "@Src/pure-components";
import CharOverview from "./CharOverview";
import Modifiers from "./Modifiers";
import DamageResults from "./DamageResults";
import SetupManager from "./SetupManager";

import styles from "./styles.module.scss";

const Calculator = () => {
  const touched = useSelector((state) => state.calculator.setupManageInfos.length !== 0);
  const loadingCharacter = useSelector((state) => state.ui.loadingCharacter);

  return (
    <div className={clsx("pb-1 flex items-center overflow-auto", styles.calculator)}>
      <div className="h-98/100 flex space-x-2">
        <div className={clsx("px-6 py-4 bg-darkblue-1", styles.card)}>
          {loadingCharacter ? (
            <div className="flex flex-col">
              <CharOverview.Header {...loadingCharacter} />
              <Skeleton.Select />
              <Skeleton.Table className="mt-3" lineCount={7} />
            </div>
          ) : (
            // ========== PANEL 1 ==========
            <CharOverview touched={touched} />
          )}
        </div>

        <div className={clsx("px-6 py-4 bg-darkblue-1", styles.card)}>
          {loadingCharacter ? (
            <div>
              <Skeleton.Select />
              <div className="mt-4 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton.Title key={i} />
                ))}
              </div>
            </div>
          ) : touched ? (
            // ========== PANEL 2 ==========
            <Modifiers />
          ) : null}
        </div>

        <div className={clsx("p-4 relative bg-darkblue-3 overflow-hidden", styles.card)}>
          {loadingCharacter ? (
            <div>
              <Skeleton.Select />
              <div className="mt-4 space-y-2">
                <Skeleton className="rounded-xl" style={{ height: 100 }} />
                <Skeleton className="rounded-xl" style={{ height: 128 }} />
              </div>
            </div>
          ) : touched ? (
            // ========== PANEL 3 ==========
            <SetupManager />
          ) : null}
        </div>

        <div className={clsx("px-4 pt-2 pb-6 bg-darkblue-3 relative", styles.card)}>
          {loadingCharacter ? (
            <div className="pt-4 space-y-4">
              <div>
                <Skeleton.Title className="w-40 mx-auto mb-2" />
                <Skeleton.Table lineCount={7} />
              </div>
              <div>
                <Skeleton.Title className="w-40 mx-auto mb-2" />
                <Skeleton.Table lineCount={4} />
              </div>
              <div>
                <Skeleton.Title className="w-40 mx-auto mb-2" />
                <Skeleton.Table />
              </div>
            </div>
          ) : touched ? (
            // ========== PANEL 4 ==========
            <DamageResults />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default memo(Calculator);
