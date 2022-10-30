import { useEffect } from "react";
import type { ToggleModCtrlPath } from "@Store/calculatorSlice/reducer-types";
import { ANEMOABLE_OPTIONS } from "../constants";

import {
  changeModCtrlInput,
  toggleModCtrl,
  updateResonance,
  updateCalcSetup,
} from "@Store/calculatorSlice";
import { selectArtInfo, selectElmtModCtrls, selectParty } from "@Store/calculatorSlice/selectors";
import { useDispatch, useSelector } from "@Store/hooks";
import { findArtifactSet } from "@Data/controllers";

import { Green, ModifierTemplate, Select } from "@Src/styled-components";
import { renderModifiers } from "@Components/minors";
import { Setter, twInputStyles } from "@Screens/Calculator/components";

export function ElementDebuffs() {
  const dispatch = useDispatch();
  const elmtModCtrls = useSelector(selectElmtModCtrls);

  const { resonances, superconduct } = elmtModCtrls;
  const geoResonance = resonances.find(({ vision }) => vision === "geo");

  return (
    <div className="pt-2 space-y-3">
      <ModifierTemplate
        checked={superconduct}
        onToggle={() => {
          dispatch(
            updateCalcSetup({
              elmtModCtrls: {
                ...elmtModCtrls,
                superconduct: !superconduct,
              },
            })
          );
        }}
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
          onToggle={() => {
            dispatch(updateResonance({ ...geoResonance, activated: !geoResonance.activated }));
          }}
          heading="Enduring Rock"
          desc={
            <>
              Shielded characters dealing DMG to enemies will decrease their <Green>Geo RES</Green>{" "}
              by <Green b>20%</Green> for 15s.
            </>
          }
        />
      )}
    </div>
  );
}

export function ArtifactDebuffs() {
  const dispatch = useDispatch();
  const artDebuffCtrls = useSelector((state) => {
    return state.calculator.setupsById[state.calculator.activeId].artDebuffCtrls;
  });
  const { code, bonusLv } = useSelector(selectArtInfo).sets[0] || {};
  const party = useSelector(selectParty);

  const usedArtCodes = party.reduce(
    (accumulator, teammate) => {
      if (teammate && teammate.artifact.code) {
        accumulator.push(teammate.artifact.code);
      }
      return accumulator;
    },
    [code && bonusLv === 1 ? code : 0]
  );

  useEffect(() => {
    artDebuffCtrls.forEach((ctrl, ctrlIndex) => {
      if (ctrl.activated && !usedArtCodes.includes(ctrl.code)) {
        dispatch(
          toggleModCtrl({
            modCtrlName: "artDebuffCtrls",
            ctrlIndex,
          })
        );
      }
    });
  }, [JSON.stringify(usedArtCodes)]);

  const content: JSX.Element[] = [];

  artDebuffCtrls.forEach((ctrl, ctrlIndex) => {
    if (!usedArtCodes.includes(ctrl.code)) return;
    const { index, activated, inputs } = ctrl;
    const { name, debuffs } = findArtifactSet(ctrl) || {};
    if (!name) return;

    const path: ToggleModCtrlPath = {
      modCtrlName: "artDebuffCtrls",
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
              onChange={(e) => {
                dispatch(
                  changeModCtrlInput({
                    ...path,
                    inputIndex: 0,
                    value: +e.target.value,
                  })
                );
              }}
            >
              {ANEMOABLE_OPTIONS.map((opt, i) => (
                <option key={i} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          }
        />
      );
    }
    content.push(
      <ModifierTemplate
        key={ctrlIndex}
        checked={activated}
        onToggle={() => dispatch(toggleModCtrl(path))}
        heading={name}
        desc={debuffs?.[index]?.desc()}
        setters={setters}
      />
    );
  });
  return renderModifiers(content, false);
}
