import { findWeapon } from "@Data/controllers";
import { renderNoModifier } from "@Screens/Calculator/components";
import { findByIndex } from "@Src/utils";
import { toggleModCtrl } from "@Store/calculatorSlice";
import { selectTotalAttr, selectWeapon } from "@Store/calculatorSlice/selectors";
import { useDispatch, useSelector } from "@Store/hooks";
import { ModifierLayout } from "@Styled/DataDisplay";

export default function WeaponBuffs() {
  const totalAttr = useSelector(selectTotalAttr);
  const weapon = useSelector(selectWeapon);
  const weaponBuffCtrls = useSelector(
    (state) => state.calculator.allWpBuffCtrls[state.calculator.currentSetup]
  );
  const subWpBCs = useSelector(
    (state) => state.calculator.allSubWpComplexBuffCtrls[state.calculator.currentSetup]
  );
  const dispatch = useDispatch();

  const mainBuffs = findWeapon(weapon)!.buffs || [];
  const content: JSX.Element[] = [];

  weaponBuffCtrls.forEach(({ activated, index, inputs }, ctrlIndex) => {
    const buff = findByIndex(mainBuffs, index);
    if (!buff) return;

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
        desc={buff.desc({ refi: weapon.refi, totalAttr })}
        setters={<SetterSection buff={buff} inputs={ctrl.inputs} bcIndex={bcIndex} />}
      />
    );
  });

  return content.length ? <>{content}</> : renderNoModifier(true);
}
