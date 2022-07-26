import cn from "classnames";
import { memo, useState } from "react";
import { useDispatch, useSelector } from "@Store/hooks";
import { startCalculation } from "@Store/thunks";
import characters from "@Data/characters";
import { findByName } from "@Src/utils";

import { Button } from "@Src/styled-components";
import Picker from "@Components/Picker";
import OverviewChar from "./OverviewChar";

import styles from "./styles.module.scss";
import Modifiers from "./Modifiers";
import DamageResults from "./DamageResults";

function Calculator() {
  const touched = useSelector((state) => state.calculator.touched);
  const [pickerOn, setPickerOn] = useState(false);

  return (
    <div className={cn("pb-2 flex items-center overflow-auto", styles.calculator)}>
      <div className="h-[98%] flex gap-2">
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

        {/* Panel 4 */}
        <div className={cn("px-4 pt-2 pb-6 flex-col relative bg-darkblue-3", styles.card)}>
          {touched && <DamageResults />}
        </div>
      </div>
      {pickerOn && <MainCharPicker onClose={() => setPickerOn(false)} />}
    </div>
  );
}

function MainCharPicker({ onClose }: { onClose: () => void }) {
  const myChars = useSelector((state) => state.database.myChars);
  const dispatch = useDispatch();

  const mixedList = [];
  for (const { name, code, beta, icon, rarity, vision, weapon } of characters) {
    const char = { code, beta, icon, rarity, vision, weapon };
    const existedChar = findByName(myChars, name);

    if (existedChar) {
      mixedList.push({ ...existedChar, ...char });
    } else {
      mixedList.push({ name, ...char });
    }
  }
  return (
    <Picker
      data={mixedList}
      dataType="character"
      onClose={onClose}
      onPickItem={(pickedChar) => {
        dispatch(startCalculation(pickedChar));
        onClose();
      }}
    />
  );
}

export default memo(Calculator);
