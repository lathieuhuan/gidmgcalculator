import type { ModifierInput } from "@Src/types";
import { useDispatch, useSelector } from "@Store/hooks";
import { changeModCtrlInput, toggleModCtrl, updateTeammateWeapon } from "@Store/calculatorSlice";
import { selectParty, selectTotalAttr, selectWeapon } from "@Store/calculatorSlice/selectors";
import { findWeapon } from "@Data/controllers";
import { deepCopy, findByIndex, genNumberSequence, processNumInput } from "@Src/utils";

import { renderModifiers } from "@Components/minors";
import { ModifierTemplate, Checkbox, Select } from "@Src/styled-components";
import { Setter, twInputStyles } from "@Screens/Calculator/components";

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

  weaponBuffCtrls.forEach(({ activated, index, inputs }, ctrlIndex) => {
    const buff = findByIndex(mainBuffs, index);

    if (!buff) return;
    let setters = null;

    if (buff.inputConfig) {
      setters = [];
      const { labels, renderTypes, initialValues, maxValues } = buff.inputConfig;

      labels.forEach((label, i) => {
        let inputCpn = null;

        switch (renderTypes[i]) {
          case "check":
            inputCpn = (
              <Checkbox
                key={i}
                className="mr-1"
                checked={!!inputs?.[i]}
                onChange={() => {
                  dispatch(
                    changeModCtrlInput({
                      modCtrlName: "wpBuffCtrls",
                      ctrlIndex,
                      inputIndex: i,
                      value: !inputs?.[i],
                    })
                  );
                }}
              />
            );
            break;
          case "stacks":
            const options = genNumberSequence(maxValues?.[i], initialValues[i] === 0);
            inputCpn = (
              <Select
                key={i}
                className={twInputStyles.select}
                value={inputs?.[i].toString()}
                onChange={(e) => {
                  if (inputs) {
                    dispatch(
                      changeModCtrlInput({
                        modCtrlName: "wpBuffCtrls",
                        ctrlIndex,
                        inputIndex: i,
                        value: +e.target.value,
                      })
                    );
                  }
                }}
              >
                {options.map((opt, i) => (
                  <option key={i}>{opt}</option>
                ))}
              </Select>
            );
            break;
        }
        if (inputCpn) {
          setters.push(<Setter key={index} label={label} inputComponent={inputCpn} />);
        }
      });
    }

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
        heading={name + " (self)"}
        desc={buff.desc({ refi: weapon.refi, totalAttr })}
        setters={setters}
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
      let setters = null;

      if (buff.inputConfig) {
        setters = [];
        const { labels, renderTypes, maxValues } = buff.inputConfig;

        labels.forEach((label, inputIndex) => {
          let inputComponent = null;

          switch (renderTypes[inputIndex]) {
            // Hakushin Ring
            case "choices":
              inputComponent = (
                <Select
                  className={twInputStyles.select}
                  value={inputs[inputIndex] as string}
                  onChange={(e) => {
                    updateWeaponInputs(ctrlIndex, inputIndex, e.target.value);
                  }}
                >
                  {["pyro", "hydro", "cryo", "anemo"].map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </Select>
              );
              break;
            case "text":
              inputComponent = (
                <input
                  type="text"
                  className="w-16 p-2 text-right textinput-common"
                  value={inputs[inputIndex] as string}
                  onChange={(e) => {
                    const value = processNumInput(
                      e.target.value,
                      +inputs[inputIndex],
                      maxValues?.[inputIndex]
                    );
                    updateWeaponInputs(ctrlIndex, inputIndex, value);
                  }}
                />
              );
              break;
          }
          setters.push(<Setter key={inputIndex} label={label} inputComponent={inputComponent} />);
        });
      }

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
          heading={name}
          desc={buff.desc({ refi, totalAttr })}
          setters={setters}
        />
      );
    });
  });

  return renderModifiers(content, true);
}
