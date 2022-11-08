import type { ModifierInput } from "@Src/types";

import { useDispatch, useSelector } from "@Store/hooks";
import { changeModCtrlInput, toggleModCtrl, updateTeammateWeapon } from "@Store/calculatorSlice";
import { selectParty, selectTotalAttr, selectWeapon } from "@Store/calculatorSlice/selectors";
import { ToggleModCtrlPath } from "@Store/calculatorSlice/reducer-types";

import { findWeapon } from "@Data/controllers";
import { deepCopy, findByIndex } from "@Src/utils";

import { renderModifiers } from "@Components/minors";
import { NewModifierTemplate } from "../components";

export default function WeaponBuffs() {
  const dispatch = useDispatch();
  const weapon = useSelector(selectWeapon);
  const totalAttr = useSelector(selectTotalAttr);
  const weaponBuffCtrls = useSelector((state) => {
    return state.calculator.setupsById[state.calculator.activeId].wpBuffCtrls;
  });
  const party = useSelector(selectParty);

  const { name, buffs: mainBuffs = [] } = findWeapon(weapon)!;
  const content: JSX.Element[] = [];

  weaponBuffCtrls.forEach(({ activated, index, inputs = [] }, ctrlIndex) => {
    const buff = findByIndex(mainBuffs, index);
    if (!buff) return;

    const path: ToggleModCtrlPath = {
      modCtrlName: "wpBuffCtrls",
      ctrlIndex,
    };

    content.push(
      <NewModifierTemplate
        key={weapon.code.toString() + ctrlIndex}
        checked={activated}
        onToggle={() => dispatch(toggleModCtrl(path))}
        heading={name + ` R${weapon.refi} (self)`}
        desc={buff.desc({ refi: weapon.refi, totalAttr })}
        inputs={inputs}
        inputConfigs={buff.inputConfigs}
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
    const { name, buffs = [] } = findWeapon(weapon) || {};

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
        <NewModifierTemplate
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
          desc={buff.desc({ refi, totalAttr })}
          inputs={inputs}
          inputConfigs={buff.inputConfigs}
          onChangeText={(text, inputIndex) => updateWeaponInputs(ctrlIndex, inputIndex, text)}
          onSelectOption={(value, inputIndex) => updateWeaponInputs(ctrlIndex, inputIndex, value)}
        />
      );
    });
  });

  return renderModifiers(content, true);
}
