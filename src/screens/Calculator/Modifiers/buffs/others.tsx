import type { AmplifyingReaction, ModifierInput, ModInputConfig, Vision } from "@Src/types";
import type { ToggleModCtrlPath } from "@Store/calculatorSlice/reducer-types";
import { useDispatch, useSelector } from "@Store/hooks";
import {
  changeModCtrlInput,
  toggleModCtrl,
  updateCalcSetup,
  updateResonance,
  updateTeammateArtifact,
} from "@Store/calculatorSlice";
import {
  selectArtInfo,
  selectChar,
  selectCharData,
  selectElmtModCtrls,
  selectParty,
  selectRxnBonus,
  selectTotalAttr,
} from "@Store/calculatorSlice/selectors";

import { findArtifactSet } from "@Data/controllers";
import { deepCopy, findByIndex } from "@Src/utils";
import { resonanceRenderInfo } from "@Src/constants";
import { getQuickenBuffDamage } from "@Calculators/utils";

import { renderAmpReactionDesc, renderModifiers } from "@Components/minors";
import { ModifierTemplate } from "@Components/ModifierTemplate";
import { Green } from "@Src/styled-components";

export function ElementBuffs() {
  const dispatch = useDispatch();

  const { vision } = useSelector(selectCharData);
  const elmtModCtrls = useSelector(selectElmtModCtrls);
  const rxnBonus = useSelector(selectRxnBonus);
  const infusion = useSelector((state) => {
    return state.calculator.statsById[state.calculator.activeId].finalInfusion?.NA;
  });

  const content: JSX.Element[] = [];

  elmtModCtrls.resonances.forEach((resonance) => {
    const { name, desc } = resonanceRenderInfo[resonance.vision];

    const inputConfigs: ModInputConfig[] =
      resonance.vision === "dendro"
        ? [
            { label: "Trigger Aggravate, Spread, Hyperbloom, Burgeon", type: "check" },
            { label: "Trigger Burning, Quicken, Bloom", type: "check" },
          ]
        : [];

    content.push(
      <ModifierTemplate
        key={resonance.vision}
        checked={resonance.activated}
        onToggle={() => {
          dispatch(
            updateResonance({
              ...resonance,
              activated: !resonance.activated,
            })
          );
        }}
        heading={name}
        desc={desc}
        inputs={resonance.inputs}
        inputConfigs={inputConfigs}
        onToggleCheck={(currentInput, inputIndex) => {
          if (resonance.inputs) {
            const newInputs = [...resonance.inputs];
            newInputs[inputIndex] = currentInput === 1 ? 0 : 1;

            dispatch(updateResonance({ ...resonance, inputs: newInputs }));
          }
        }}
      />
    );
  });

  function addAmpReactionBuff(element: Vision, field: "ampRxn" | "infusion_ampRxn") {
    const renderBuff = (reaction: AmplifyingReaction) => {
      const activated = elmtModCtrls[field] === reaction;

      return (
        <ModifierTemplate
          key={reaction + (field === "infusion_ampRxn" ? "-external" : "")}
          checked={activated}
          onToggle={() => {
            dispatch(
              updateCalcSetup({
                elmtModCtrls: {
                  ...elmtModCtrls,
                  [field]: activated ? null : reaction,
                },
              })
            );
          }}
          heading={
            <>
              <span className="capitalize">{reaction}</span>{" "}
              {field === "infusion_ampRxn" ? " (external infusion)" : ""}
            </>
          }
          desc={renderAmpReactionDesc(element, rxnBonus[reaction])}
        />
      );
    };

    if (element === "pyro" || element === "cryo") {
      content.push(renderBuff("melt"));
    }
    if (element === "pyro" || element === "hydro") {
      content.push(renderBuff("vaporize"));
    }
  }

  addAmpReactionBuff(vision, "ampRxn");

  if (infusion !== vision && infusion !== "phys") {
    addAmpReactionBuff(infusion, "infusion_ampRxn");
  }

  if (["electro", "dendro"].includes(vision)) {
    content.push(<QuickenBuff key="quicken" vision={vision} />);
  }

  return renderModifiers(content, true);
}

function QuickenBuff({ vision }: { vision: Vision }) {
  const reaction = vision === "electro" ? "aggravate" : "spread";
  const dispatch = useDispatch();

  const char = useSelector(selectChar);
  const totalAttr = useSelector(selectTotalAttr);
  const rxnBonus = useSelector(selectRxnBonus);
  const elmtModCtrls = useSelector(selectElmtModCtrls);

  const buffValue = getQuickenBuffDamage(char.level, totalAttr.em, rxnBonus)[reaction];

  const heading =
    reaction === "spread" ? "Spread (Dendro on Quicken)" : "Aggravate (Electro on Quicken)";

  return (
    <ModifierTemplate
      heading={heading}
      checked={elmtModCtrls[reaction]}
      onToggle={() => {
        dispatch(
          updateCalcSetup({
            elmtModCtrls: {
              ...elmtModCtrls,
              [reaction]: !elmtModCtrls[reaction],
            },
          })
        );
      }}
      desc={
        <>
          Increase base <span className={`text-${vision} capitalize`}>{vision} DMG</span> by{" "}
          <Green b>{buffValue}</Green>.
        </>
      }
    />
  );
}

export function ArtifactBuffs() {
  const dispatch = useDispatch();
  const { sets } = useSelector(selectArtInfo);
  const artBuffCtrls = useSelector((state) => {
    return state.calculator.setupsById[state.calculator.activeId].artBuffCtrls;
  });
  const party = useSelector(selectParty);

  const content: JSX.Element[] = [];
  const mainCode = sets[0]?.code;

  artBuffCtrls.forEach((ctrl, ctrlIndex) => {
    const { name, buffs } = findArtifactSet({ code: mainCode })!;
    const buff = findByIndex(buffs!, ctrl.index);
    if (!buff) return;

    const path: ToggleModCtrlPath = {
      modCtrlName: "artBuffCtrls",
      ctrlIndex,
    };
    content.push(
      <ModifierTemplate
        key={mainCode.toString() + ctrlIndex}
        checked={ctrl.activated}
        onToggle={() => dispatch(toggleModCtrl(path))}
        heading={name + " (self)"}
        desc={buff.desc()}
        inputs={ctrl.inputs}
        inputConfigs={buff.inputConfigs}
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

  party.forEach((teammate, teammateIndex) => {
    if (!teammate) return;
    const { code, buffCtrls } = teammate.artifact;
    const { name, buffs = [] } = findArtifactSet(teammate.artifact) || {};
    if (!name) return;

    const updateArtifactInputs = (ctrlIndex: number, inputIndex: number, value: ModifierInput) => {
      const newBuffCtrls = deepCopy(buffCtrls);
      const { inputs } = newBuffCtrls[ctrlIndex];

      if (inputs) {
        inputs[inputIndex] = value;
        dispatch(
          updateTeammateArtifact({
            teammateIndex,
            buffCtrls: newBuffCtrls,
          })
        );
      }
    };

    buffCtrls.forEach(({ index, activated, inputs = [] }, ctrlIndex) => {
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
              updateTeammateArtifact({
                teammateIndex,
                buffCtrls: newBuffCtrls,
              })
            );
          }}
          heading={name}
          desc={buff.desc()}
          inputs={inputs}
          inputConfigs={buff.inputConfigs}
          onSelectOption={(value, inputIndex) => updateArtifactInputs(ctrlIndex, inputIndex, value)}
        />
      );
    });
  });

  return renderModifiers(content, true);
}
