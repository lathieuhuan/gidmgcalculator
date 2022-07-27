import type { Weapon } from "@Src/types";
import type { ToggleSubWpModCtrlPath } from "@Store/calculatorSlice/reducer-types";
import { useDispatch, useSelector } from "@Store/hooks";
import {
  changeModCtrlInput,
  changeSubWpModCtrlInput,
  refineSubWeapon,
  toggleModCtrl,
  toggleSubWpModCtrl,
} from "@Store/calculatorSlice";
import { selectWeapon } from "@Store/calculatorSlice/selectors";
import { findWeapon } from "@Data/controllers";
import { findByIndex, genNumberSequence } from "@Src/utils";

import { ModifierLayout, Checkbox, Select } from "@Src/styled-components";
import { renderNoModifier, Setter, twInputStyles } from "@Screens/Calculator/components";

export default function WeaponBuffs() {
  const weapon = useSelector(selectWeapon);
  const weaponBuffCtrls = useSelector(
    (state) => state.calculator.allWpBuffCtrls[state.calculator.currentIndex]
  );
  const subWpComplexBuffCtrls = useSelector(
    (state) => state.calculator.allSubWpComplexBuffCtrls[state.calculator.currentIndex]
  );
  const dispatch = useDispatch();

  const mainBuffs = findWeapon(weapon)!.buffs || [];
  const content: JSX.Element[] = [];

  weaponBuffCtrls.forEach(({ activated, index, inputs }, ctrlIndex) => {
    const buff = findByIndex(mainBuffs, index);
    if (!buff) return;
    let setters = null;

    if (buff.inputConfig) {
      setters = [];
      const { labels, renderTypes, maxValues } = buff.inputConfig;

      labels.forEach((label, i) => {
        let input = null;

        switch (renderTypes[i]) {
          case "check":
            input = (
              <Checkbox
                className="mr-1"
                checked={!!inputs?.[i]}
                onChange={() =>
                  dispatch(
                    changeModCtrlInput({
                      modCtrlName: "allWpBuffCtrls",
                      ctrlIndex,
                      inputIndex: i,
                      value: !inputs?.[i],
                    })
                  )
                }
              />
            );
            break;
          case "stacks":
            const options = genNumberSequence(maxValues?.[i], maxValues?.[i] === 0);
            input = (
              <Select
                className={twInputStyles.select}
                value={inputs?.[index].toString()}
                onChange={() => {
                  if (inputs) {
                    dispatch(
                      changeModCtrlInput({
                        modCtrlName: "allWpBuffCtrls",
                        ctrlIndex,
                        inputIndex: i,
                        value: +inputs[i],
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
        if (input) {
          setters.push(<Setter label={label} inputComponent={input} />);
        }
      });
    }
    content.push(
      <ModifierLayout
        key={weapon.code.toString() + ctrlIndex}
        checked={activated}
        onToggle={() =>
          dispatch(
            toggleModCtrl({
              modCtrlName: "allWpBuffCtrls",
              ctrlIndex,
            })
          )
        }
        heading={name + " (self)"}
        desc={buff.desc({ refi: weapon.refi })}
        setters={setters}
      />
    );
  });

  Object.entries(subWpComplexBuffCtrls).forEach(([weapon, subWpBuffCtrls], i) => {
    const weaponType = weapon as Weapon;

    subWpBuffCtrls.forEach((ctrl, ctrlIndex) => {
      const { activated, code, inputs } = ctrl;
      const { name, buffs = [] } = findWeapon({ type: weaponType, code })!;
      const buff = findByIndex(buffs, ctrl.index);
      if (!buff) return;

      const path: ToggleSubWpModCtrlPath = {
        weaponType,
        ctrlIndex,
      };
      let setters = null;

      if (buff.inputConfig) {
        // Hakushin Ring
        setters = (
          <Setter
            label={buff.inputConfig.labels[0]}
            inputComponent={
              <Select
                className={twInputStyles.select}
                value={inputs![0] as string}
                onChange={(e) =>
                  dispatch(
                    changeSubWpModCtrlInput({ ...path, inputIndex: 0, value: e.target.value })
                  )
                }
              >
                {["pyro", "hydro", "cryo", "anemo"].map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </Select>
            }
          />
        );
      }
      content.push(
        <ModifierLayout
          key={code.toString() + ctrlIndex}
          checked={activated}
          onToggle={() => dispatch(toggleSubWpModCtrl(path))}
          heading={name}
          desc={buff.desc({ refi: ctrl.refi })}
          setters={
            <>
              <Setter
                label="Refinement"
                inputComponent={
                  <Select
                    className={twInputStyles.select}
                    value={ctrl.refi}
                    onChange={(e) => dispatch(refineSubWeapon({ ...path, value: +e.target.value }))}
                  >
                    {[1, 2, 3, 4, 5].map((opt, i) => (
                      <option key={i}>{opt}</option>
                    ))}
                  </Select>
                }
              />
              {setters}
            </>
          }
        />
      );
    });
  });
  return content.length ? <>{content}</> : renderNoModifier(true);
}
