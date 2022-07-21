import type { AmplifyingReaction, ArtifactBuff, ModifierInput, Vision } from "@Src/types";
import type { ToggleModCtrlPath } from "@Store/calculatorSlice/reducer-types";
import { useDispatch, useSelector } from "@Store/hooks";
import {
  changeElementModCtrl,
  changeModCtrlInput,
  toggleModCtrl,
  toggleResonance,
} from "@Store/calculatorSlice";
import {
  selectArtInfo,
  selectCharData,
  selectElmtModCtrls,
  selectFinalInfusion,
  selectRxnBonus,
} from "@Store/calculatorSlice/selectors";
import { RESONANCE_BUFF_INFO } from "./constants";

import { renderAmpReactionDesc } from "@Components/minors";
import { ModifierLayout } from "@Styled/DataDisplay";
import { Select } from "@Styled/Inputs";
import { renderNoModifier, Setter, twInputStyles } from "@Screens/Calculator/components";

import { findArtifactSet } from "@Data/controllers";
import { findByIndex, genNumberSequence } from "@Src/utils";

export function ElememtBuffs() {
  const { vision } = useSelector(selectCharData);
  const elmtModCtrls = useSelector(selectElmtModCtrls);
  const infusion = useSelector(selectFinalInfusion).NA;
  const dispatch = useDispatch();
  const content: JSX.Element[] = [];

  elmtModCtrls.resonance.forEach((rsn) => {
    const { name, desc } = RESONANCE_BUFF_INFO[rsn.vision];

    content.push(
      <ModifierLayout
        key={rsn.vision}
        checked={rsn.activated}
        onToggle={() => dispatch(toggleResonance(rsn.vision))}
        heading={name}
        desc={desc}
      />
    );
  });

  content.push(...useAmplifyingBuff(vision, false));

  if (infusion !== vision && infusion !== "phys") {
    content.push(...useAmplifyingBuff(infusion, true));
  }
  return content.length ? <>{content}</> : renderNoModifier(true);
}

function useAmplifyingBuff(element: Vision, byInfusion: boolean) {
  const field = byInfusion ? "infusion_ampRxn" : "ampRxn";
  const rxnBonus = useSelector(selectRxnBonus);
  const ampReaction = useSelector(selectElmtModCtrls)[field];
  const dispatch = useDispatch();

  const renderBuff = (reaction: AmplifyingReaction) => {
    const activated = ampReaction === reaction;
    return (
      <ModifierLayout
        key={reaction}
        checked={activated}
        onToggle={() =>
          dispatch(changeElementModCtrl({ field, value: activated ? null : reaction }))
        }
        heading={reaction}
        desc={renderAmpReactionDesc(element, rxnBonus[reaction])}
      />
    );
  };
  switch (element) {
    case "pyro":
      return (["melt", "vaporize"] as const).map((reaction) => {
        return renderBuff(reaction);
      });
    case "hydro":
      return [renderBuff("vaporize")];
    case "cryo":
      return [renderBuff("melt")];
    default:
      return [];
  }
}

export function ArtifactBuffs() {
  const { sets } = useSelector(selectArtInfo);
  const buffCtrls = useSelector(
    (state) => state.calculator.allArtBuffCtrls[state.calculator.currentSetup]
  );
  const subBuffCtrls = useSelector(
    (state) => state.calculator.allSubArtBuffCtrls[state.calculator.currentSetup]
  );
  const dispatch = useDispatch();

  const content: JSX.Element[] = [];
  const mainCode = sets[0]?.code;

  buffCtrls.forEach((ctrl, ctrlIndex) => {
    const { activated } = ctrl;
    const { name, buffs } = findArtifactSet({ code: mainCode })!;
    const buff = findByIndex(buffs!, ctrl.index);
    if (!buff) return;

    const path: ToggleModCtrlPath = {
      modCtrlName: "allArtBuffCtrls",
      ctrlIndex,
    };
    content.push(
      <ModifierLayout
        key={mainCode.toString() + ctrlIndex}
        checked={activated}
        onToggle={() => dispatch(toggleModCtrl(path))}
        heading={name + " (self)"}
        desc={buff.desc()}
        setters={<SetterSection buff={buff} inputs={ctrl.inputs} path={path} />}
      />
    );
  });

  subBuffCtrls.forEach((ctrl, ctrlIndex) => {
    const { code, activated } = ctrl;
    const { name, buffs } = findArtifactSet({ code })!;
    const buff = findByIndex(buffs!, ctrl.index);
    if (!buff) return;

    const path: ToggleModCtrlPath = {
      modCtrlName: "allSubArtBuffCtrls",
      ctrlIndex,
    };
    content.push(
      <ModifierLayout
        key={code.toString() + ctrlIndex}
        checked={activated}
        onToggle={() => dispatch(toggleModCtrl(path))}
        heading={name}
        desc={buff.desc()}
        setters={<SetterSection buff={buff} inputs={ctrl.inputs} path={path} />}
      />
    );
  });
  return content.length ? <>{content}</> : renderNoModifier(true);
}

interface SetterSectionProps {
  buff: ArtifactBuff;
  inputs?: ModifierInput[];
  path: ToggleModCtrlPath;
}
function SetterSection({ buff, inputs = [], path }: SetterSectionProps) {
  const dispatch = useDispatch();

  if (!buff.inputConfig) return null;
  const { labels, initialValues, maxValues, renderTypes } = buff.inputConfig;

  return (
    <>
      {labels.map((label, i) => {
        const input = inputs[i];
        let options: string[] | number[] = [];

        if (renderTypes[i] === "stacks") {
          options = genNumberSequence(maxValues?.[i], initialValues[i] === 0);
        } //
        else if (renderTypes[i] === "swirl") {
          options = ["pyro", "hydro", "electro", "cryo"];
        }

        return typeof input === "boolean" ? null : (
          <Setter
            key={i}
            label={label}
            inputComponent={
              <Select
                className={twInputStyles.select}
                value={input}
                onChange={(e) => {
                  const { value } = e.target;
                  dispatch(
                    changeModCtrlInput({
                      ...path,
                      inputIndex: i,
                      value: isNaN(+value) ? value : +value,
                    })
                  );
                }}
              >
                {options.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </Select>
            }
          />
        );
      })}
    </>
  );
}
