import { useEffect } from "react";
import type { ToggleModCtrlPath } from "@Store/calculatorSlice/reducer-types";

// Action
import {
  changeModCtrlInput,
  toggleModCtrl,
  updateResonance,
  updateCalcSetup,
} from "@Store/calculatorSlice";

// Selector
import { selectArtifacts, selectElmtModCtrls, selectParty } from "@Store/calculatorSlice/selectors";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";

// Util
import { findArtifactSet } from "@Data/controllers";
import { findByIndex, getArtifactSetBonuses } from "@Src/utils";

// Component
import { Green } from "@Components/atoms";
import { ModifierTemplate, renderModifiers } from "@Components/molecules";

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
  const artifacts = useSelector(selectArtifacts);
  const { code, bonusLv } = getArtifactSetBonuses(artifacts || [])[0] || {};
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
  return renderModifiers(content, "debuffs", true);
}
