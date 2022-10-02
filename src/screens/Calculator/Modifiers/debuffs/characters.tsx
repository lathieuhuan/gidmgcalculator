import type { PartyData, Teammate } from "@Src/types";
import type {
  ToggleModCtrlPath,
  ToggleTeammateModCtrlPath,
} from "@Store/calculatorSlice/reducer-types";
import { useDispatch, useSelector } from "@Store/hooks";
import {
  changeModCtrlInput,
  changeTeammateModCtrlInput,
  toggleModCtrl,
  toggleTeammateModCtrl,
} from "@Store/calculatorSlice";
import { selectChar, selectParty } from "@Store/calculatorSlice/selectors";

import { renderModifiers } from "@Components/minors";
import { ModifierTemplate } from "@Src/styled-components";
import { CharModSetters } from "../components";

import { findCharacter } from "@Data/controllers";
import { findByIndex, processNumInput } from "@Src/utils";

export function SelfDebuffs({ partyData }: { partyData: PartyData }) {
  const char = useSelector(selectChar);
  const selfDebuffCtrls = useSelector((state) => {
    return state.calculator.setupsById[state.calculator.activeId].selfDebuffCtrls;
  });
  const dispatch = useDispatch();

  const { debuffs } = findCharacter(char) || {};
  if (!debuffs) {
    return renderModifiers([], false);
  }

  const content: JSX.Element[] = [];

  selfDebuffCtrls.forEach(({ index, activated, inputs }, ctrlIndex) => {
    const debuff = findByIndex(debuffs, index);

    if (debuff && (!debuff.isGranted || debuff.isGranted(char))) {
      const path: ToggleModCtrlPath = {
        modCtrlName: "selfDebuffCtrls",
        ctrlIndex,
      };
      let setters = null;

      if (debuff.inputConfig) {
        const { selfLabels = [], renderTypes, initialValues, maxValues } = debuff.inputConfig;
        const validatedInputs = inputs || initialValues;

        setters = (
          <CharModSetters
            labels={selfLabels}
            inputs={validatedInputs}
            renderTypes={renderTypes}
            initialValues={initialValues}
            onTextChange={(value, i) =>
              dispatch(
                changeModCtrlInput({
                  ...path,
                  inputIndex: i,
                  value: processNumInput(value, +validatedInputs[i], maxValues?.[i] || undefined),
                })
              )
            }
            onToggleCheck={(i) =>
              dispatch(changeModCtrlInput({ ...path, inputIndex: i, value: !validatedInputs[i] }))
            }
            onSelect={(value, i) =>
              dispatch(
                changeModCtrlInput({
                  ...path,
                  inputIndex: i,
                  value: isNaN(+value) ? value : +value,
                })
              )
            }
          />
        );
      }
      content.push(
        <ModifierTemplate
          key={ctrlIndex}
          checked={activated}
          onToggle={() => {
            dispatch(toggleModCtrl(path));
          }}
          heading={debuff.src}
          desc={debuff.desc({ fromSelf: true, char, inputs: inputs || [], partyData })}
          setters={setters}
        />
      );
    }
  });
  return renderModifiers(content, false);
}

export function PartyDebuffs({ partyData }: { partyData: PartyData }) {
  const party = useSelector(selectParty);
  const content: JSX.Element[] = [];

  party.forEach((teammate, tmIndex) => {
    if (teammate && teammate.debuffCtrls.length)
      content.push(
        <TeammateDebuffs
          key={tmIndex}
          teammate={teammate}
          tmIndex={tmIndex}
          partyData={partyData}
        />
      );
  });
  return renderModifiers(content, false);
}

interface TeammateDebuffsProps {
  teammate: Teammate;
  tmIndex: number;
  partyData: PartyData;
}
function TeammateDebuffs({ teammate, tmIndex, partyData }: TeammateDebuffsProps) {
  const char = useSelector(selectChar);
  const dispatch = useDispatch();

  const tmData = findCharacter(teammate);
  if (!tmData) return null;

  const { vision, debuffs = [] } = tmData;
  const subContent: JSX.Element[] = [];

  teammate.debuffCtrls.forEach(({ activated, index, inputs }, ctrlIndex) => {
    const debuff = findByIndex(debuffs, index);
    if (!debuff) return;

    const path: ToggleTeammateModCtrlPath = {
      teammateIndex: tmIndex,
      modCtrlName: "debuffCtrls",
      ctrlIndex,
    };
    let setters = null;

    if (debuff.inputConfig) {
      const { labels = [], renderTypes, initialValues, maxValues } = debuff.inputConfig;
      const validatedInputs = inputs || initialValues;

      setters = (
        <CharModSetters
          labels={labels}
          inputs={validatedInputs}
          renderTypes={renderTypes}
          initialValues={initialValues}
          onTextChange={(value, i) =>
            dispatch(
              changeTeammateModCtrlInput({
                ...path,
                inputIndex: i,
                value: processNumInput(value, +validatedInputs[i], maxValues?.[i] || undefined),
              })
            )
          }
          onToggleCheck={(i) =>
            dispatch(
              changeTeammateModCtrlInput({
                ...path,
                inputIndex: i,
                value: !validatedInputs[i],
              })
            )
          }
          onSelect={(value, i) =>
            dispatch(
              changeTeammateModCtrlInput({
                ...path,
                inputIndex: i,
                value: isNaN(+value) ? value : +value,
              })
            )
          }
        />
      );
    }
    subContent.push(
      <ModifierTemplate
        key={ctrlIndex}
        checked={activated}
        onToggle={() => dispatch(toggleTeammateModCtrl(path))}
        heading={debuff.src}
        desc={debuff.desc({ fromSelf: false, char, inputs: inputs || [], partyData })}
        setters={setters}
      />
    );
  });
  return (
    <>
      <p className={`pt-2 -mb-1 text-h6 text-${vision} font-bold text-center uppercase`}>
        {teammate.name}
      </p>
      {subContent}
    </>
  );
}
