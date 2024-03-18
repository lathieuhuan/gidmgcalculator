import type { ModifierInput } from "@Src/types";
import type { ToggleModCtrlPath } from "@Store/calculatorSlice/reducer-types";

import { useDispatch, useSelector } from "@Store/hooks";
import { changeModCtrlInput, toggleModCtrl, updateTeammateWeapon } from "@Store/calculatorSlice";
import { selectParty, selectWeapon } from "@Store/calculatorSlice/selectors";
import { deepCopy, findByIndex } from "@Src/utils";
import { WeaponBuffsView } from "@Src/components";

export const WeaponBuffs = () => {
  const dispatch = useDispatch();
  const weapon = useSelector(selectWeapon);
  const weaponBuffCtrls = useSelector((state) => {
    return state.calculator.setupsById[state.calculator.activeId].wpBuffCtrls;
  });
  const party = useSelector(selectParty);

  return (
    <WeaponBuffsView
      mutable
      {...{ party, weapon, wpBuffCtrls: weaponBuffCtrls }}
      getSelfHandlers={({ ctrl }) => {
        const path: ToggleModCtrlPath = {
          modCtrlName: "wpBuffCtrls",
          ctrlIndex: ctrl.index,
        };
        const updateBuffCtrlInput = (value: number, inputIndex: number) => {
          dispatch(changeModCtrlInput(Object.assign({ value, inputIndex }, path)));
        };
        return {
          onToggle: () => {
            dispatch(toggleModCtrl(path));
          },
          onToggleCheck: (currentInput, inputIndex) => {
            updateBuffCtrlInput(currentInput === 1 ? 0 : 1, inputIndex);
          },
          onChangeText: updateBuffCtrlInput,
          onSelectOption: updateBuffCtrlInput,
        };
      }}
      getTeammateHandlers={({ teammateIndex, ctrl, ctrls }) => {
        const updateBuffCtrl = (value: ModifierInput | "toggle", inputIndex = 0) => {
          const newBuffCtrls = deepCopy(ctrls);
          const targetCtrl = findByIndex(newBuffCtrls, ctrl.index);
          if (!targetCtrl) return;

          if (value === "toggle") {
            targetCtrl.activated = !ctrl.activated;
          } else if (targetCtrl?.inputs) {
            targetCtrl.inputs[inputIndex] = value;
          } else {
            return;
          }

          dispatch(
            updateTeammateWeapon({
              teammateIndex,
              buffCtrls: newBuffCtrls,
            })
          );
        };
        return {
          onToggle: () => {
            updateBuffCtrl("toggle");
          },
          onChangeText: updateBuffCtrl,
          onSelectOption: updateBuffCtrl,
        };
      }}
    />
  );
};
