import type { ModifierInput } from "@Src/types";
import type { ToggleModCtrlPath } from "@Store/calculatorSlice/reducer-types";

// Store
import { useDispatch, useSelector } from "@Store/hooks";
import { changeModCtrlInput, toggleModCtrl, updateTeammateWeapon } from "@Store/calculatorSlice";
import { selectParty, selectWeapon } from "@Store/calculatorSlice/selectors";

// Util
import { deepCopy, findByIndex } from "@Src/utils";

// Component
import { renderModifiers, renderWeaponModifiers } from "@Src/components";

export const WeaponBuffs = () => {
  const dispatch = useDispatch();
  const weapon = useSelector(selectWeapon);
  const weaponBuffCtrls = useSelector((state) => {
    return state.calculator.setupsById[state.calculator.activeId].wpBuffCtrls;
  });
  const party = useSelector(selectParty);

  const content: (JSX.Element | null)[] = [];

  content.push(
    ...renderWeaponModifiers({
      fromSelf: true,
      keyPrefix: "main",
      weapon,
      ctrls: weaponBuffCtrls,
      renderProps: (ctrl) => {
        const path: ToggleModCtrlPath = {
          modCtrlName: "wpBuffCtrls",
          ctrlIndex: ctrl.index,
        };
        return {
          checked: ctrl.activated,
          onToggle: () => dispatch(toggleModCtrl(path)),
          onChangeText: (value, inputIndex) => {
            dispatch(
              changeModCtrlInput({
                ...path,
                inputIndex,
                value,
              })
            );
          },
          onToggleCheck: (currentInput, inputIndex) => {
            dispatch(
              changeModCtrlInput({
                ...path,
                inputIndex,
                value: currentInput === 1 ? 0 : 1,
              })
            );
          },
          onSelectOption: (value, inputIndex) => {
            dispatch(
              changeModCtrlInput({
                ...path,
                inputIndex,
                value,
              })
            );
          },
        };
      },
    })
  );

  party.forEach((teammate, teammateIndex) => {
    if (teammate) {
      const { buffCtrls } = teammate.weapon;

      content.push(
        ...renderWeaponModifiers({
          keyPrefix: teammate.name,
          weapon: teammate.weapon,
          ctrls: teammate.weapon.buffCtrls,
          renderProps: (ctrl) => {
            const updateWeaponInputs = (value: ModifierInput, inputIndex: number) => {
              const newBuffCtrls = deepCopy(buffCtrls);
              const targetCtrl = findByIndex(newBuffCtrls, ctrl.index);

              if (targetCtrl?.inputs) {
                targetCtrl.inputs[inputIndex] = value;
                dispatch(
                  updateTeammateWeapon({
                    teammateIndex,
                    buffCtrls: newBuffCtrls,
                  })
                );
              }
            };

            return {
              checked: ctrl.activated,
              onToggle: () => {
                const newBuffCtrls = deepCopy(buffCtrls);
                const targetCtrl = findByIndex(newBuffCtrls, ctrl.index);

                if (targetCtrl) {
                  targetCtrl.activated = !ctrl.activated;

                  dispatch(
                    updateTeammateWeapon({
                      teammateIndex,
                      buffCtrls: newBuffCtrls,
                    })
                  );
                }
              },
              onChangeText: updateWeaponInputs,
              onSelectOption: updateWeaponInputs,
            };
          },
        })
      );
    }
  });

  return renderModifiers(content, "buffs", true);
};
