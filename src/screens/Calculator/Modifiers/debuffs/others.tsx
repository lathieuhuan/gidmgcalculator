import type { ToggleModCtrlPath } from "@Store/calculatorSlice/reducer-types";
import {
  changeModCtrlInput,
  toggleModCtrl,
  toggleResonance,
  updateCalcSetup,
} from "@Store/calculatorSlice";
import { selectElmtModCtrls } from "@Store/calculatorSlice/selectors";
import { useDispatch, useSelector } from "@Store/hooks";
import { findArtifactSet } from "@Data/controllers";

import { Setter, twInputStyles } from "@Screens/Calculator/components";
import { Green, ModifierTemplate, Select } from "@Src/styled-components";

export function ElementDebuffs() {
  const dispatch = useDispatch();
  const elmtModCtrls = useSelector(selectElmtModCtrls);

  const { resonance, superconduct } = elmtModCtrls;
  const geoResonance = resonance.find((rsn) => rsn.vision === "geo");

  return (
    <>
      <ModifierTemplate
        checked={superconduct}
        onToggle={() =>
          dispatch(
            updateCalcSetup({
              elmtModCtrls: {
                ...elmtModCtrls,
                superconduct: !superconduct,
              },
            })
          )
        }
        heading="Superconduct"
        desc={
          <>
            Reduces the <Green>Physical RES</Green> of enemies by <Green b>40%</Green> for 12
            seconds.
          </>
        }
      />
      {geoResonance && (
        <ModifierTemplate
          key="rock"
          checked={geoResonance.activated}
          onToggle={() => dispatch(toggleResonance("geo"))}
          heading="Enduring Rock"
          desc={
            <>
              Shielded characters dealing DMG to enemies will decrease their <Green>Geo RES</Green>{" "}
              by <Green b>20%</Green> for 15s.
            </>
          }
        />
      )}
    </>
  );
}

export function ArtifactDebuffs() {
  const dispatch = useDispatch();
  const subDebuffCtrls = useSelector((state) => {
    return state.calculator.setupsById[state.calculator.activeId].subArtDebuffCtrls;
  });
  const content: JSX.Element[] = [];

  subDebuffCtrls.forEach((ctrl, ctrlIndex) => {
    const { code, inputs } = ctrl;
    const artSetData = findArtifactSet({ code });
    if (!artSetData) return;

    const { name, debuffs } = artSetData;

    const path: ToggleModCtrlPath = {
      modCtrlName: "subArtDebuffCtrls",
      ctrlIndex,
    };
    let setters;

    if (ctrlIndex === 0) {
      setters = (
        <Setter
          label="Element swirled"
          inputComponent={
            <Select
              className={twInputStyles.select}
              value={inputs ? inputs[0].toString() : undefined}
              onChange={(e) =>
                dispatch(
                  changeModCtrlInput({
                    ...path,
                    inputIndex: 0,
                    value: e.target.value,
                  })
                )
              }
            >
              {["pyro", "hydro", "electro", "cryo"].map((element) => (
                <option key={element}>{element}</option>
              ))}
            </Select>
          }
        />
      );
    }
    content.push(
      <ModifierTemplate
        key={ctrlIndex}
        checked={ctrl.activated}
        onToggle={() => dispatch(toggleModCtrl(path))}
        heading={name}
        desc={debuffs?.[ctrl.index]?.desc()}
        setters={setters}
      />
    );
  });
  return <>{content}</>;
}
