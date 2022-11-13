import { useDispatch, useSelector } from "@Store/hooks";
import {
  selectChar,
  selectCharData,
  selectElmtModCtrls,
  selectRxnBonus,
  selectTotalAttr,
} from "@Store/calculatorSlice/selectors";
import { resonanceRenderInfo, VISION_TYPES } from "@Src/constants";
import { AmplifyingReaction, ModInputConfig, Vision } from "@Src/types";
import { ModifierTemplate, ModSelectOption } from "@Components/ModifierTemplate";
import { updateCalcSetup, updateResonance } from "@Store/calculatorSlice";
import { renderAmpReactionDesc, renderModifiers, renderQuickenDesc } from "@Components/minors";
import { Select } from "@Src/styled-components";
import { twInputStyles } from "@Screens/Calculator/components";
import { getQuickenBuffDamage } from "@Calculators/utils";

export default function ElementBuffs() {
  const dispatch = useDispatch();
  const { vision } = useSelector(selectCharData);
  const char = useSelector(selectChar);
  const totalAttr = useSelector(selectTotalAttr);
  const elmtModCtrls = useSelector(selectElmtModCtrls);
  const rxnBonus = useSelector(selectRxnBonus);
  const customInfusion = useSelector((state) => {
    return state.calculator.setupsById[state.calculator.activeId].customInfusion;
  });

  const { element: infusedElement } = customInfusion;
  const content: JSX.Element[] = [];

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
    field: "reaction" | "infusion_reaction",
    reaction: AmplifyingReaction
  ) => {
    const activated = elmtModCtrls[field] === reaction;
    const bonusField = field === "reaction" ? reaction : (`infusion_${reaction}` as const);
    return (
      <ModifierTemplate
        key={reaction + (field === "infusion_reaction" ? "-external" : "")}
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
            <span className="text-lesser font-normal">
              (vs {element === "pyro" ? (reaction === "melt" ? "Cryo" : "Hydro") : "Pyro"})
            </span>
          </>
        }
        desc={renderAmpReactionDesc(element, rxnBonus[bonusField])}
      />
    );
  };

  const quickenBuff = getQuickenBuffDamage(char.level, totalAttr.em, rxnBonus);

  const renderSpreadAggravate = (
    element: Vision,
    field: "reaction" | "infusion_reaction",
    reaction: "spread" | "aggravate"
  ) => {
    const activated = elmtModCtrls[field] === reaction;
    return (
      <ModifierTemplate
        key={reaction + (field === "infusion_reaction" ? "-external" : "")}
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
            <span className="text-lesser font-normal">
              ({element === "electro" ? "Electro" : "Dendro"} on Quicken)
            </span>
          </>
        }
        desc={renderQuickenDesc(element, quickenBuff[reaction])}
      />
    );
  };

  switch (vision) {
    case "pyro":
      content.push(
        renderMeltVaporize(vision, "reaction", "melt"),
        renderMeltVaporize(vision, "reaction", "vaporize")
      );
      break;
    case "hydro":
      content.push(renderMeltVaporize(vision, "reaction", "vaporize"));
      break;
    case "cryo":
      content.push(renderMeltVaporize(vision, "reaction", "melt"));
      break;
    case "electro":
      content.push(renderSpreadAggravate(vision, "reaction", "aggravate"));
      break;
    case "dendro":
      content.push(renderSpreadAggravate(vision, "reaction", "spread"));
      break;
  }

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
        heading="External Infusion"
        desc="This Infusion will overwrite self infusion if possible."
        checked={isInfused}
        onToggle={() => {
          dispatch(
            updateCalcSetup({
              elmtModCtrls: {
                ...elmtModCtrls,
                infusion_reaction: isInfused ? null : elmtModCtrls.infusion_reaction,
              },
              customInfusion: {
                ...customInfusion,
                element: isInfused ? "phys" : "pyro",
              },
            })
          );
        }}
      />
      <div className="pt-2 pb-1 pr-1 flex items-center justify-end">
        <span className="mr-4 text-base leading-6 text-right">Element</span>
        <Select
          className={twInputStyles.select + " capitalize"}
          value={customInfusion.element}
          disabled={!isInfused}
          onChange={(e) => {
            if (isInfused) {
              dispatch(
                updateCalcSetup({
                  elmtModCtrls: {
                    ...elmtModCtrls,
                    infusion_reaction: null,
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
        </Select>
      </div>
    </div>
  );

  if (infusedElement !== vision && infusedElement !== "phys") {
    switch (infusedElement) {
      case "pyro":
        content.push(
          renderMeltVaporize(infusedElement, "infusion_reaction", "melt"),
          renderMeltVaporize(infusedElement, "infusion_reaction", "vaporize")
        );
        break;
      case "hydro":
        content.push(renderMeltVaporize(infusedElement, "infusion_reaction", "vaporize"));
        break;
      case "cryo":
        content.push(renderMeltVaporize(infusedElement, "infusion_reaction", "melt"));
        break;
      case "electro":
        content.push(renderSpreadAggravate(infusedElement, "infusion_reaction", "aggravate"));
        break;
      case "dendro":
        content.push(renderSpreadAggravate(infusedElement, "infusion_reaction", "spread"));
        break;
    }
  }

  return renderModifiers(content, true);
}
