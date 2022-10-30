import type { ModifierInput } from "@Src/types";
import { useDispatch, useSelector } from "@Store/hooks";
import { changeModCtrlInput, toggleModCtrl, updateTeammateWeapon } from "@Store/calculatorSlice";
import { selectParty, selectTotalAttr, selectWeapon } from "@Store/calculatorSlice/selectors";
import { findWeapon } from "@Data/controllers";
import { deepCopy, findByIndex, processNumInput } from "@Src/utils";

import { renderModifiers } from "@Components/minors";
import { ModifierTemplate } from "@Src/styled-components";
import { WeaponModSetters } from "../components";

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

    content.push(
      <ModifierTemplate
        key={weapon.code.toString() + ctrlIndex}
        checked={activated}
        onToggle={() => {
          dispatch(
            toggleModCtrl({
              modCtrlName: "wpBuffCtrls",
              ctrlIndex,
            })
          );
        }}
        heading={name + ` R${weapon.refi} (self)`}
        desc={buff.desc({ refi: weapon.refi, totalAttr })}
        setters={
          buff.inputConfig ? (
            <WeaponModSetters
              {...buff.inputConfig}
              inputs={inputs}
              onToggleCheck={(currentInput, i) => {
                dispatch(
                  changeModCtrlInput({
                    modCtrlName: "wpBuffCtrls",
                    ctrlIndex,
                    inputIndex: i,
                    value: currentInput === 1 ? 0 : 1,
                  })
                );
              }}
              onSelect={(value, i) => {
                dispatch(
                  changeModCtrlInput({
                    modCtrlName: "wpBuffCtrls",
                    ctrlIndex,
                    inputIndex: i,
                    value,
                  })
                );
              }}
            />
          ) : null
        }
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
      const { maxValues } = buff.inputConfig || {};

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
          desc={buff.desc({ refi, totalAttr })}
          setters={
            buff.inputConfig ? (
              <WeaponModSetters
                {...buff.inputConfig}
                inputs={inputs}
                onTextChange={(text, inputIndex) => {
                  const value = processNumInput(text, +inputs[inputIndex], maxValues?.[inputIndex]);
                  updateWeaponInputs(ctrlIndex, inputIndex, value);
                }}
                onSelect={(value, i) => {
                  updateWeaponInputs(ctrlIndex, i, value);
                }}
              />
            ) : null
          }
        />
      );
    });
  });

  return renderModifiers(content, true);
}
