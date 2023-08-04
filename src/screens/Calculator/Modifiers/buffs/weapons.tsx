import type { ModifierInput } from "@Src/types";
import type { ToggleModCtrlPath } from "@Store/calculatorSlice/reducer-types";

import { useDispatch, useSelector } from "@Store/hooks";
import { changeModCtrlInput, toggleModCtrl, updateTeammateWeapon } from "@Store/calculatorSlice";
import { selectParty, selectWeapon } from "@Store/calculatorSlice/selectors";

// Util
import { deepCopy, findByIndex } from "@Src/utils";
import { findDataWeapon } from "@Data/controllers";

// Component
import { ModifierTemplate, renderModifiers } from "@Src/components";

export default function WeaponBuffs() {
  const dispatch = useDispatch();
  const weapon = useSelector(selectWeapon);
  const weaponBuffCtrls = useSelector((state) => {
    return state.calculator.setupsById[state.calculator.activeId].wpBuffCtrls;
  });
  const party = useSelector(selectParty);

  const { name, buffs: mainBuffs = [], description } = findDataWeapon(weapon)!;
  const content: JSX.Element[] = [];

  weaponBuffCtrls.forEach(({ activated, index, inputs = [] }, ctrlIndex) => {
    const buff = findByIndex(mainBuffs, index);
    if (!buff) return;

    const path: ToggleModCtrlPath = {
      modCtrlName: "wpBuffCtrls",
      ctrlIndex,
    };

    content.push(
      <ModifierTemplate
        key={weapon.code.toString() + ctrlIndex}
        checked={activated}
        onToggle={() => dispatch(toggleModCtrl(path))}
        heading={name + ` R${weapon.refi} (self)`}
        desc={ModifierTemplate.getWeaponDescription(description, buff, weapon.refi)}
        inputs={inputs}
        inputConfigs={buff.inputConfigs}
        onChangeText={(value, i) => {
          dispatch(
            changeModCtrlInput({
              ...path,
              inputIndex: i,
              value,
            })
          );
        }}
        onToggleCheck={(currentInput, i) => {
          dispatch(
            changeModCtrlInput({
              ...path,
              inputIndex: i,
              value: currentInput === 1 ? 0 : 1,
            })
          );
        }}
        onSelectOption={(value, i) => {
          dispatch(
            changeModCtrlInput({
              ...path,
              inputIndex: i,
              value,
            })
          );
        }}
      />
    );
  });

  party.forEach((teammate, teammateIndex) => {
    if (!teammate) return null;

    const { weapon } = teammate;
    const { code, refi, buffCtrls } = weapon;
    const { name, buffs = [], description } = findDataWeapon(weapon) || {};

    const updateWeaponInputs = (ctrlIndex: number, inputIndex: number, value: ModifierInput) => {
      const newBuffCtrls = deepCopy(buffCtrls);
      const { inputs } = newBuffCtrls[ctrlIndex];

      if (inputs) {
        inputs[inputIndex] = value;
        dispatch(
          updateTeammateWeapon({
            teammateIndex,
            buffCtrls: newBuffCtrls,
          })
        );
      }
    };

    buffCtrls.forEach((buffCtrl, ctrlIndex) => {
      const { activated, inputs = [], index } = buffCtrl;
      const buff = findByIndex(buffs, index);
      if (!buff) return;

      content.push(
        <ModifierTemplate
          key={teammateIndex.toString() + code + ctrlIndex}
          checked={activated}
          onToggle={() => {
            const newBuffCtrls = deepCopy(buffCtrls);
            newBuffCtrls[ctrlIndex].activated = !activated;

            dispatch(
              updateTeammateWeapon({
                teammateIndex,
                buffCtrls: newBuffCtrls,
              })
            );
          }}
          heading={name + ` R${refi}`}
          desc={ModifierTemplate.getWeaponDescription(description, buff, refi)}
          inputs={inputs}
          inputConfigs={buff.inputConfigs}
          onChangeText={(text, inputIndex) => updateWeaponInputs(ctrlIndex, inputIndex, text)}
          onSelectOption={(value, inputIndex) => updateWeaponInputs(ctrlIndex, inputIndex, value)}
        />
      );
    });
  });

  return renderModifiers(content, "buffs", true);
}
