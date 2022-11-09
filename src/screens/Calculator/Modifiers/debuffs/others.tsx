import { useEffect } from "react";
import type { ToggleModCtrlPath } from "@Store/calculatorSlice/reducer-types";

import {
  changeModCtrlInput,
  toggleModCtrl,
  updateResonance,
  updateCalcSetup,
} from "@Store/calculatorSlice";
import { selectArtInfo, selectElmtModCtrls, selectParty } from "@Store/calculatorSlice/selectors";
import { useDispatch, useSelector } from "@Store/hooks";
import { findArtifactSet } from "@Data/controllers";
import { findByIndex } from "@Src/utils";

import { renderModifiers } from "@Components/minors";
import { ModifierTemplate } from "@Components/ModifierTemplate";
import { Green } from "@Src/styled-components";

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
    const { index, activated, inputs = [] } = ctrl;
    const { name, debuffs = [] } = findArtifactSet(ctrl) || {};
    const debuff = findByIndex(debuffs, index);

    if (!debuff) return;

    const path: ToggleModCtrlPath = {
      modCtrlName: "artDebuffCtrls",
      ctrlIndex,
    };

    content.push(
      <ModifierTemplate
        key={ctrlIndex}
        checked={activated}
        onToggle={() => dispatch(toggleModCtrl(path))}
        heading={name}
        desc={debuffs?.[index]?.desc()}
        inputs={inputs}
        inputConfigs={debuff.inputConfigs}
        onSelectOption={(value, inputIndex) => {
          dispatch(
            changeModCtrlInput({
              ...path,
              inputIndex,
              value,
            })
          );
        }}
      />
    );
  });
  return renderModifiers(content, false);
}
