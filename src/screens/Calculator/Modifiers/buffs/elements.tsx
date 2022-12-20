import { useState } from "react";
import type { AmplifyingReaction, ModInputConfig, Vision } from "@Src/types";

// Constant
import { VISION_TYPES } from "@Src/constants";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";

// Selector
import {
  selectChar,
  selectCharData,
  selectElmtModCtrls,
  selectRxnBonus,
} from "@Store/calculatorSlice/selectors";

// Action
import { updateCalcSetup, updateResonance } from "@Store/calculatorSlice";

// Util
import { getAmplifyingMultiplier, getQuickenBuffDamage } from "@Calculators/utils";

// Component
import {
  ModifierTemplate,
  resonanceRenderInfo,
  renderAmpReactionDesc,
  renderAmpReactionHeading,
  renderModifiers,
  renderQuickenDesc,
  renderQuickenHeading,
  type ModSelectOption,
} from "@Components/molecules";

export default function ElementBuffs() {
  const dispatch = useDispatch();
  const { vision } = useSelector(selectCharData);
  const char = useSelector(selectChar);
  const elmtModCtrls = useSelector(selectElmtModCtrls);
  const rxnBonus = useSelector(selectRxnBonus);
  const customInfusion = useSelector((state) => {
    return state.calculator.setupsById[state.calculator.activeId].customInfusion;
  });

  const { element: infusedElement } = customInfusion;
  const content: JSX.Element[] = [];

  const [infusedValue, setInfusedValue] = useState(
    infusedElement === "phys" ? "pyro" : infusedElement
  );

  // Resonance buffs
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

  if (content.length) {
    content.push(<div key="divider-1" className="mx-auto w-1/2 h-px bg-lesser" />);
  }

  // Reaction buff
  const renderMeltVaporize = (
    element: Vision,
    field: "reaction" | "infuse_reaction",
    reaction: AmplifyingReaction
  ) => {
    const activated = elmtModCtrls[field] === reaction;

    return (
      <ModifierTemplate
        key={reaction + (field === "infuse_reaction" ? "-external" : "")}
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
        heading={renderAmpReactionHeading(element, reaction)}
        desc={renderAmpReactionDesc(element, getAmplifyingMultiplier(element, rxnBonus)[reaction])}
      />
    );
  };

  const renderSpreadAggravate = (
    element: Vision,
    field: "reaction" | "infuse_reaction",
    reaction: "spread" | "aggravate"
  ) => {
    const activated = elmtModCtrls[field] === reaction;

    return (
      <ModifierTemplate
        key={reaction + (field === "infuse_reaction" ? "-external" : "")}
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
        heading={renderQuickenHeading(element, reaction)}
        desc={renderQuickenDesc(element, getQuickenBuffDamage(char.level, rxnBonus)[reaction])}
      />
    );
  };

  const addAttackReaction = (attReaction: "reaction" | "infuse_reaction") => {
    const element = attReaction === "reaction" ? vision : infusedElement;

    switch (element) {
      case "pyro":
        content.push(
          renderMeltVaporize(element, attReaction, "melt"),
          renderMeltVaporize(element, attReaction, "vaporize")
        );
        break;
      case "hydro":
        content.push(renderMeltVaporize(element, attReaction, "vaporize"));
        break;
      case "cryo":
        content.push(renderMeltVaporize(element, attReaction, "melt"));
        break;
      case "electro":
        content.push(renderSpreadAggravate(element, attReaction, "aggravate"));
        break;
      case "dendro":
        content.push(renderSpreadAggravate(element, attReaction, "spread"));
        break;
    }
  };

  addAttackReaction("reaction");

  if (content.length > elmtModCtrls.resonances.length) {
    content.push(<div key="divider-2" className="mx-auto w-1/2 h-px bg-lesser" />);
  }

  const isInfused = infusedElement !== "phys";
  const infuseOptions: ModSelectOption[] = VISION_TYPES.map((vision) => ({
    value: vision,
    label: vision,
  }));

  content.push(
    <div key="custom-infusion">
      <ModifierTemplate
        heading="Custom Infusion"
        desc={
          <>
            This infusion overwrites self infusion but does not overwrite elemental nature of
            attacks{" "}
            <span className="text-lesser">(Catalyst's attacks, Bow's fully-charge aim shot)</span>.
          </>
        }
        checked={isInfused}
        onToggle={() => {
          dispatch(
            updateCalcSetup({
              elmtModCtrls: {
                ...elmtModCtrls,
                infuse_reaction: isInfused ? null : elmtModCtrls.infuse_reaction,
              },
              customInfusion: {
                ...customInfusion,
                element: isInfused ? "phys" : infusedValue,
              },
            })
          );
        }}
      />
      <div className="pt-2 pb-1 pr-1 flex items-center justify-end">
        <span className="mr-4 text-base leading-6 text-right">Element</span>
        <select
          className="styled-select capitalize"
          value={infusedValue}
          disabled={!isInfused}
          onChange={(e) => {
            if (isInfused) {
              setInfusedValue(e.target.value as Vision);

              dispatch(
                updateCalcSetup({
                  elmtModCtrls: {
                    ...elmtModCtrls,
                    infuse_reaction: null,
                  },
                  customInfusion: {
                    ...customInfusion,
                    element: e.target.value as Vision,
                  },
                })
              );
            }
          }}
        >
          {infuseOptions.map((opt, i) => (
            <option key={i} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  if (infusedElement !== vision && infusedElement !== "phys") {
    addAttackReaction("infuse_reaction");
  }

  return renderModifiers(content, "buffs", true);
}
