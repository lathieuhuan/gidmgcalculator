import type { ReactNode } from "react";
import type { AmplifyingReaction, ArtifactBuff, Vision } from "@Src/types";
import type { ArtModCtrlPath } from "@Store/calculatorSlice/reducer-types";
import { useDispatch, useSelector } from "@Store/hooks";
import { changeElementModCtrl, toggleModCtrl, toggleResonance } from "@Store/calculatorSlice";
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
import { renderNoModifier, Setter, twStyles } from "../../components";

import { findArtifactSet } from "@Data/controllers";
import { findByIndex } from "@Src/utils";
import { Select } from "@Styled/Inputs";

export function ElmtBuffs() {
  const { vision } = useSelector(selectCharData);
  const elmtModCtrls = useSelector(selectElmtModCtrls);
  const infusion = useSelector(selectFinalInfusion).NA;
  const dispatch = useDispatch();
  const content: ReactNode[] = [];

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
  return content.length ? content : renderNoModifier(true);
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
  const { sets, buffCtrls, subBuffCtrls } = useSelector(selectArtInfo);
  const dispatch = useDispatch();
  const content: JSX.Element[] = [];

  const mainCode = sets[0]?.code;
  buffCtrls.forEach((ctrl, index) => {
    const { activated } = ctrl;
    const { name, buffs } = findArtifactSet({ code: mainCode })!;
    const buff = findByIndex(buffs!, ctrl.index);
    if (!buff) return;

    const path: ArtModCtrlPath = {
      modCtrlName: "allArtInfos",
      field: "buffCtrls",
      index,
    };

    content.push(
      <ModifierLayout
        key={mainCode.toString() + index}
        checked={activated}
        onToggle={() => dispatch(toggleModCtrl(path))}
        heading={name + " (self)"}
        desc={buff.desc()}
        setters={<SetterSection buff={buff} inputs={ctrl.inputs} path={path} /> || <></>}
      />
    );
  });
  subBuffCtrls.forEach((ctrl, index) => {
    const { code, activated } = ctrl;
    const { name, buffs } = findArtifactSet({ code })!;
    const buff = findByIndex(buffs!, ctrl.index);
    if (!buff) return;

    const path: ArtModCtrlPath = {
      modCtrlName: "allArtInfos",
      field: "subBuffCtrls",
      index: index,
    };

    content.push(
      <ModifierLayout
        key={code.toString() + index}
        checked={activated}
        handleCheck={() => dispatch(toggleModCtrl(path))}
        heading={name}
        desc={buff.desc()}
        setters={<SetterSection buff={buff} inputs={ctrl.inputs} path={path} />}
      />
    );
  });
  return content.length ? content : renderNoModifier(true);
}

interface SetterSectionProps {
  buff: ArtifactBuff;
  inputs?: (string | number)[];
  path: ArtModCtrlPath;
}
function SetterSection({ buff, inputs = [], path }: SetterSectionProps) {
  const dispatch = useDispatch();
  if (!buff.inputConfig) return null;

  const { labels, initialValues, maxs, renderTypes } = buff.inputConfig;

  return labels.map((label, i) => {
    let options: string[] | number[] = [];

    if (renderTypes[i] === "stacks") {
      const increase = initialValues[i] === 0 ? 0 : 1;
      options = [...Array(maxs[i]).map((_, i) => i + increase)];
    } else {
      options = ["pyro", "hydro", "electro", "cryo"];
    }

    return (
      <Setter
        key={i}
        label={label}
        input={
          <Select
            className={twStyles.select}
            value={inputs[i]}
            onChange={(e) => {
              const { value } = e.target;
              // dispatch(
              //   CHANGE_MCS_INPUT({
              //     ...path,
              //     inpIndex: i,
              //     value: isNaN(value) ? value : +value,
              //   })
              // );
            }}
          >
            {options.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </Select>
        }
      />
    );
  });
}
