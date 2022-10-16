import cn from "classnames";
import { memo, useState } from "react";
import { useDispatch, useSelector } from "@Store/hooks";
import { startCalculation } from "@Store/thunks";

import { Button } from "@Src/styled-components";
import { Picker } from "@Components/Picker";

import OverviewChar from "./OverviewChar";
import Modifiers from "./Modifiers";
import DamageResults from "./DamageResults";
import SetupManager from "./SetupManager";

import styles from "./styles.module.scss";

function Calculator() {
  const touched = useSelector((state) => state.calculator.setupManageInfos.length !== 0);
  const dispatch = useDispatch();
  const [pickerOn, setPickerOn] = useState(false);

  return (
    <div className={cn("pb-1 flex items-center overflow-auto", styles.calculator)}>
      <div className="h-98/100 flex space-x-2">
        {/* Panel 1 */}
        <div className={cn("px-6 py-4 bg-darkblue-1", styles.card)}>
          {touched ? (
            <OverviewChar onClickCharImg={() => setPickerOn(true)} />
          ) : (
            <div className="w-full flex flex-col">
              <Button className="mx-auto" variant="positive" onClick={() => setPickerOn(true)}>
                Choose a Character
              </Button>
            </div>
          )}
        </div>

        {/* Panel 2 */}
        <div className={cn("px-6 py-4 bg-darkblue-1", styles.card)}>{touched && <Modifiers />}</div>

        {/* Panel 3 */}
        <div className={cn("p-4 relative bg-darkblue-3 overflow-hidden", styles.card)}>
          {touched && <SetupManager />}
        </div>

        {/* Panel 4 */}
        <div className={cn("px-4 pt-2 pb-6 bg-darkblue-3 relative", styles.card)}>
          {touched && <DamageResults />}
        </div>
      </div>

      <Picker.Character
        active={pickerOn}
        sourceType="mixed"
        onPickCharacter={(pickedChar) => dispatch(startCalculation(pickedChar))}
        onClose={() => setPickerOn(false)}
      />
    </div>
  );
}

export default memo(Calculator);
