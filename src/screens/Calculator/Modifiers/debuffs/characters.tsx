import type { PartyData, Teammate } from "@Src/types";
import type { ToggleModCtrlPath, ToggleTeammateModCtrlPath } from "@Store/calculatorSlice/reducer-types";

import { useDispatch, useSelector } from "@Store/hooks";
import { selectChar, selectParty } from "@Store/calculatorSlice/selectors";
import { findByIndex } from "@Src/utils";
import { appData } from "@Data/index";

// Action
import {
  changeModCtrlInput,
  changeTeammateModCtrlInput,
  toggleModCtrl,
  toggleTeammateModCtrl,
} from "@Store/calculatorSlice";

// Component
import { ModifierTemplate, parseCharacterDescription, renderModifiers } from "@Src/components";

export function SelfDebuffs({ partyData }: { partyData: PartyData }) {
  const dispatch = useDispatch();
  const char = useSelector(selectChar);
  const selfDebuffCtrls = useSelector(
    (state) => state.calculator.setupsById[state.calculator.activeId].selfDebuffCtrls
  );

  const charData = appData.getCharData(char.name) || {};
  const content: JSX.Element[] = [];

  selfDebuffCtrls.forEach(({ index, activated, inputs = [] }, ctrlIndex) => {
    const debuff = findByIndex(charData.debuffs || [], index);

    if (debuff && (!debuff.isGranted || debuff.isGranted(char))) {
      const path: ToggleModCtrlPath = {
        modCtrlName: "selfDebuffCtrls",
        ctrlIndex,
      };
      const inputConfigs = debuff.inputConfigs?.filter((config) => config.for !== "teammate");

      content.push(
        <ModifierTemplate
          key={ctrlIndex}
          checked={activated}
          onToggle={() => dispatch(toggleModCtrl(path))}
          heading={debuff.src}
          description={parseCharacterDescription(
            debuff.description,
            { fromSelf: true, char, partyData, inputs },
            charData.dsGetters
          )}
          inputs={inputs}
          inputConfigs={inputConfigs}
          onChangeText={(value, i) => {
            dispatch(
              changeModCtrlInput({
                ...path,
                inputIndex: i,
                value,
              })
            );
          }}
          onToggleCheck={(currentInput, inputIndex) => {
            dispatch(changeModCtrlInput({ ...path, inputIndex, value: currentInput === 1 ? 0 : 1 }));
          }}
          onSelectOption={(value, inputIndex) => {
            dispatch(
              changeModCtrlInput({
                ...path,
                inputIndex,
                value: isNaN(+value) ? value : +value,
              })
            );
          }}
        />
      );
    }
  });
  return renderModifiers(content, "debuffs", true);
}

export function PartyDebuffs({ partyData }: { partyData: PartyData }) {
  const party = useSelector(selectParty);
  const content: JSX.Element[] = [];

  party.forEach((teammate, tmIndex) => {
    if (teammate && teammate.debuffCtrls.length)
      content.push(<TeammateDebuffs key={tmIndex} teammate={teammate} tmIndex={tmIndex} partyData={partyData} />);
  });
  return renderModifiers(content, "debuffs");
}

interface TeammateDebuffsProps {
  teammate: Teammate;
  tmIndex: number;
  partyData: PartyData;
}
function TeammateDebuffs({ teammate, tmIndex, partyData }: TeammateDebuffsProps) {
  const char = useSelector(selectChar);
  const dispatch = useDispatch();

  const teammateData = appData.getCharData(teammate.name);
  if (!teammateData) return null;

  const subContent: JSX.Element[] = [];

  teammate.debuffCtrls.forEach(({ activated, index, inputs = [] }, ctrlIndex) => {
    const debuff = findByIndex(teammateData.debuffs || [], index);
    if (!debuff) return;

    const path: ToggleTeammateModCtrlPath = {
      teammateIndex: tmIndex,
      modCtrlName: "debuffCtrls",
      ctrlIndex,
    };
    const inputConfigs = debuff.inputConfigs?.filter((config) => config.for !== "self");

    subContent.push(
      <ModifierTemplate
        key={ctrlIndex}
        checked={activated}
        onToggle={() => dispatch(toggleTeammateModCtrl(path))}
        heading={debuff.src}
        description={parseCharacterDescription(
          debuff.description,
          { fromSelf: false, char, partyData, inputs },
          teammateData.dsGetters
        )}
        inputs={inputs}
        inputConfigs={inputConfigs}
        onChangeText={(value, inputIndex) => {
          dispatch(
            changeTeammateModCtrlInput({
              ...path,
              inputIndex,
              value,
            })
          );
        }}
        onToggleCheck={(currentInput, inputIndex) => {
          dispatch(
            changeTeammateModCtrlInput({
              ...path,
              inputIndex,
              value: currentInput === 1 ? 0 : 1,
            })
          );
        }}
        onSelectOption={(value, inputIndex) => dispatch(changeTeammateModCtrlInput({ ...path, inputIndex, value }))}
      />
    );
  });

  return (
    <>
      <p className={`text-lg text-${teammateData.vision} font-bold text-center uppercase`}>{teammate.name}</p>
      {subContent}
    </>
  );
}
