import type { AmplifyingReaction, Vision } from "@Src/types";
import type { ToggleModCtrlPath } from "@Store/calculatorSlice/reducer-types";
import { useDispatch, useSelector } from "@Store/hooks";
import {
  changeElementModCtrl,
  changeResonanceInput,
  toggleElementModCtrl,
  toggleModCtrl,
  toggleResonance,
} from "@Store/calculatorSlice";
import {
  selectArtInfo,
  selectChar,
  selectCharData,
  selectElmtModCtrls,
  selectFinalInfusion,
  selectRxnBonus,
  selectTotalAttr,
} from "@Store/calculatorSlice/selectors";

import { renderAmpReactionDesc, renderModifiers } from "@Components/minors";
import { Checkbox, Green, ModifierTemplate } from "@Src/styled-components";
import { Setter } from "@Screens/Calculator/components";
import { SetterSection } from "../components";

import { findArtifactSet } from "@Data/controllers";
import { findByIndex } from "@Src/utils";
import { resonanceRenderInfo } from "@Src/constants";
import { getQuickenBuffDamage } from "@Calculators/utils";

export function ElememtBuffs() {
  const dispatch = useDispatch();

  const { vision } = useSelector(selectCharData);
  const elmtModCtrls = useSelector(selectElmtModCtrls);
  const rxnBonus = useSelector(selectRxnBonus);
  const infusion = useSelector(selectFinalInfusion)?.NA;

  const content: JSX.Element[] = [];

  elmtModCtrls.resonance.forEach((rsn) => {
    const { name, desc } = resonanceRenderInfo[rsn.vision];
    let setters;

    if (rsn.vision === "dendro") {
      const renderBuff = (index: number) => {
        return (
          <Setter
            key={index}
            label={
              index
                ? "Trigger Aggravate, Spread, Hyperbloom, Burgeon"
                : "Trigger Burning, Quicken, Bloom"
            }
            inputComponent={
              <Checkbox
                checked={rsn.inputs?.[index]}
                onChange={() => dispatch(changeResonanceInput(index))}
              />
            }
          />
        );
      };
      setters = [renderBuff(0), renderBuff(1)];
    }

    content.push(
      <ModifierTemplate
        key={rsn.vision}
        checked={rsn.activated}
        onToggle={() => dispatch(toggleResonance(rsn.vision))}
        heading={name}
        desc={desc}
        setters={setters}
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
          onToggle={() =>
            dispatch(changeElementModCtrl({ field, value: activated ? null : reaction }))
          }
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

  if (vision === "electro" || vision === "dendro") {
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
  const activated = useSelector(selectElmtModCtrls)[reaction];

  const buffValue = getQuickenBuffDamage(char.level, totalAttr.em, rxnBonus)[reaction];

  const heading =
    reaction === "spread" ? "Spread (Dendro on Quicken)" : "Aggravate (Electro on Quicken)";

  return (
    <ModifierTemplate
      heading={heading}
      checked={activated}
      onToggle={() => dispatch(toggleElementModCtrl(reaction))}
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
  const { sets } = useSelector(selectArtInfo);
  const buffCtrls = useSelector((state) => {
    return state.calculator.setupsById[state.calculator.activeId].artBuffCtrls;
  });
  const subBuffCtrls = useSelector((state) => {
    return state.calculator.setupsById[state.calculator.activeId].subArtBuffCtrls;
  });
  const dispatch = useDispatch();

  const content: JSX.Element[] = [];
  const mainCode = sets[0]?.code;

  buffCtrls.forEach((ctrl, ctrlIndex) => {
    const { activated, inputs } = ctrl;
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
        checked={activated}
        onToggle={() => dispatch(toggleModCtrl(path))}
        heading={name + " (self)"}
        desc={buff.desc()}
        setters={
          inputs ? <SetterSection buff={buff} inputs={ctrl.inputs} path={path} /> : undefined
        }
      />
    );
  });

  subBuffCtrls.forEach((ctrl, ctrlIndex) => {
    const { code, activated, inputs } = ctrl;
    const { name, buffs } = findArtifactSet({ code })!;
    const buff = findByIndex(buffs!, ctrl.index);
    if (!buff) return;

    const path: ToggleModCtrlPath = {
      modCtrlName: "subArtBuffCtrls",
      ctrlIndex,
    };
    content.push(
      <ModifierTemplate
        key={code.toString() + ctrlIndex}
        checked={activated}
        onToggle={() => dispatch(toggleModCtrl(path))}
        heading={name}
        desc={buff.desc()}
        setters={
          inputs ? <SetterSection buff={buff} inputs={ctrl.inputs} path={path} /> : undefined
        }
      />
    );
  });
  return renderModifiers(content, true);
}
