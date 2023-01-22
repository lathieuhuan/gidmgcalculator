import type { PartyData, Teammate } from "@Src/types";
import type {
  ToggleModCtrlPath,
  ToggleTeammateModCtrlPath,
} from "@Store/calculatorSlice/reducer-types";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";

// Action
import {
  changeModCtrlInput,
  changeTeammateModCtrlInput,
  toggleModCtrl,
  toggleTeammateModCtrl,
} from "@Store/calculatorSlice";

// Selector
import { selectChar, selectParty } from "@Store/calculatorSlice/selectors";

// Util
import { findDataCharacter } from "@Data/controllers";
import { findByIndex } from "@Src/utils";

// Component
import { ModifierTemplate, renderModifiers } from "@Components/molecules";

export function SelfDebuffs({ partyData }: { partyData: PartyData }) {
  const dispatch = useDispatch();
  const char = useSelector(selectChar);
  const selfDebuffCtrls = useSelector((state) => {
    return state.calculator.setupsById[state.calculator.activeId].selfDebuffCtrls;
  });

  const { debuffs = [] } = findDataCharacter(char) || {};
  const content: JSX.Element[] = [];

  selfDebuffCtrls.forEach(({ index, activated, inputs = [] }, ctrlIndex) => {
    const debuff = findByIndex(debuffs, index);

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
          desc={debuff.desc({ fromSelf: true, char, inputs: inputs || [], partyData })}
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
            dispatch(
              changeModCtrlInput({ ...path, inputIndex, value: currentInput === 1 ? 0 : 1 })
            );
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
      content.push(
        <TeammateDebuffs
          key={tmIndex}
          teammate={teammate}
          tmIndex={tmIndex}
          partyData={partyData}
        />
      );
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

  const tmData = findDataCharacter(teammate);
  if (!tmData) return null;

  const { vision, debuffs = [] } = tmData;
  const subContent: JSX.Element[] = [];

  teammate.debuffCtrls.forEach(({ activated, index, inputs = [] }, ctrlIndex) => {
    const debuff = findByIndex(debuffs, index);
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
        desc={debuff.desc({ fromSelf: false, char, inputs: inputs || [], partyData })}
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
        onSelectOption={(value, inputIndex) =>
          dispatch(changeTeammateModCtrlInput({ ...path, inputIndex, value }))
        }
      />
    );
  });

  return (
    <>
      <p className={`text-lg text-${vision} font-bold text-center uppercase`}>{teammate.name}</p>
      {subContent}
    </>
  );
}
