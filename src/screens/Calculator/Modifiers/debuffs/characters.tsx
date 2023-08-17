import type { PartyData, Teammate } from "@Src/types";
import type { ToggleModCtrlPath, ToggleTeammateModCtrlPath } from "@Store/calculatorSlice/reducer-types";

import { useDispatch, useSelector } from "@Store/hooks";
import { selectChar, selectParty } from "@Store/calculatorSlice/selectors";
import { findByIndex, parseCharacterDescription } from "@Src/utils";
import { appData } from "@Data/index";

// Action
import {
  changeModCtrlInput,
  changeTeammateModCtrlInput,
  toggleModCtrl,
  toggleTeammateModCtrl,
} from "@Store/calculatorSlice";

// Component
import { ModifierTemplate, renderModifiers } from "@Src/components";

export function SelfDebuffs({ partyData }: { partyData: PartyData }) {
  const dispatch = useDispatch();
  const char = useSelector(selectChar);
  const selfDebuffCtrls = useSelector(
    (state) => state.calculator.setupsById[state.calculator.activeId].selfDebuffCtrls
  );

  const charData = appData.getCharData(char.name) || {};
  const content: JSX.Element[] = [];

  selfDebuffCtrls.forEach((ctrl) => {
    const debuff = findByIndex(charData.debuffs || [], ctrl.index);

    if (debuff && (!debuff.isGranted || debuff.isGranted(char))) {
      const { inputs = [] } = ctrl;
      const path: ToggleModCtrlPath = {
        modCtrlName: "selfDebuffCtrls",
        ctrlIndex: ctrl.index,
      };
      const inputConfigs = debuff.inputConfigs?.filter((config) => config.for !== "teammate");

      content.push(
        <ModifierTemplate
          key={ctrl.index}
          heading={debuff.src}
          description={parseCharacterDescription(
            debuff.description,
            { fromSelf: true, char, partyData, inputs },
            charData.dsGetters
          )}
          inputs={inputs}
          inputConfigs={inputConfigs}
          checked={ctrl.activated}
          onToggle={() => dispatch(toggleModCtrl(path))}
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

  party.forEach((teammate, teammateIndex) => {
    if (teammate && teammate.debuffCtrls.length)
      content.push(<TeammateDebuffs key={teammateIndex} {...{ teammate, teammateIndex, partyData }} />);
  });
  return renderModifiers(content, "debuffs");
}

interface TeammateDebuffsProps {
  teammate: Teammate;
  teammateIndex: number;
  partyData: PartyData;
}
function TeammateDebuffs({ teammate, teammateIndex, partyData }: TeammateDebuffsProps) {
  const char = useSelector(selectChar);
  const dispatch = useDispatch();

  const teammateData = appData.getCharData(teammate.name);
  if (!teammateData) return null;

  const subContent: JSX.Element[] = [];

  teammate.debuffCtrls.forEach((ctrl, ctrlIndex) => {
    const debuff = findByIndex(teammateData.debuffs || [], ctrl.index);
    if (!debuff) return;

    const { inputs = [] } = ctrl;
    const path: ToggleTeammateModCtrlPath = {
      teammateIndex,
      modCtrlName: "debuffCtrls",
      ctrlIndex,
    };
    const inputConfigs = debuff.inputConfigs?.filter((config) => config.for !== "self");

    subContent.push(
      <ModifierTemplate
        key={ctrl.index}
        heading={debuff.src}
        description={parseCharacterDescription(
          debuff.description,
          { fromSelf: false, char, partyData, inputs },
          teammateData.dsGetters
        )}
        inputs={inputs}
        inputConfigs={inputConfigs}
        checked={ctrl.activated}
        onToggle={() => dispatch(toggleTeammateModCtrl(path))}
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
