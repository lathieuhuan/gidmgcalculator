import type { PartyData, Teammate } from "@Src/types";
import type {
  ToggleModCtrlPath,
  ToggleTeammateModCtrlPath,
} from "@Store/calculatorSlice/reducer-types";
import {
  selectChar,
  selectCharData,
  selectParty,
  selectTotalAttr,
} from "@Store/calculatorSlice/selectors";
import {
  changeModCtrlInput,
  changeTeammateModCtrlInput,
  toggleModCtrl,
  toggleTeammateModCtrl,
} from "@Store/calculatorSlice";
import { useDispatch, useSelector } from "@Store/hooks";
import { findCharacter, getPartyData } from "@Data/controllers";
import { findByIndex } from "@Src/utils";

import { renderModifiers } from "@Components/minors";
import { ModifierTemplate } from "@Components/ModifierTemplate";

export function SelfBuffs() {
  const dispatch = useDispatch();
  const char = useSelector(selectChar);
  const charData = useSelector(selectCharData);
  const partyData = getPartyData(useSelector(selectParty));
  const totalAttr = useSelector(selectTotalAttr);
  const selfBuffCtrls = useSelector((state) => {
    return state.calculator.setupsById[state.calculator.activeId].selfBuffCtrls;
  });

  const { innateBuffs = [], buffs = [] } = findCharacter(char) || {};
  const content: JSX.Element[] = [];

  innateBuffs.forEach(({ src, isGranted, desc }, index) => {
    if (isGranted(char)) {
      content.push(
        <ModifierTemplate
          key={`innate-${index}`}
          mutable={false}
          heading={src}
          desc={desc({ totalAttr, charData, partyData })}
        />
      );
    }
  });

  selfBuffCtrls.forEach((ctrl, ctrlIndex) => {
    const { activated, index, inputs = [] } = ctrl;
    const buff = findByIndex(buffs, index);

    if (buff && (!buff.isGranted || buff.isGranted(char))) {
      const path: ToggleModCtrlPath = {
        modCtrlName: "selfBuffCtrls",
        ctrlIndex,
      };
      const inputConfigs = buff.inputConfigs?.filter((config) => config.for !== "teammate");

      content.push(
        <ModifierTemplate
          key={`self-${ctrlIndex}`}
          heading={buff.src}
          desc={buff.desc({
            toSelf: true,
            totalAttr,
            char,
            charBuffCtrls: selfBuffCtrls,
            inputs,
            charData,
            partyData,
          })}
          checked={activated}
          onToggle={() => dispatch(toggleModCtrl(path))}
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
          onToggleCheck={(currentinput, i) => {
            const newInput = currentinput === 1 ? 0 : 1;
            dispatch(changeModCtrlInput({ ...path, inputIndex: i, value: newInput }));
          }}
          onSelectOption={(value, i) => {
            dispatch(
              changeModCtrlInput({
                ...path,
                inputIndex: i,
                value: isNaN(+value) ? value : +value,
              })
            );
          }}
        />
      );
    }
  });
  return renderModifiers(content, true);
}

export function PartyBuffs() {
  const party = useSelector(selectParty);
  const partyData = getPartyData(useSelector(selectParty));
  const content: JSX.Element[] = [];

  party.forEach((teammate, index) => {
    if (teammate && teammate.buffCtrls.length) {
      content.push(
        <TeammateBuffs
          key={index}
          teammate={teammate}
          teammateIndex={index}
          partyData={partyData}
        />
      );
    }
  });
  return renderModifiers(content, true);
}

interface TeammateBuffsProps {
  teammate: Teammate;
  teammateIndex: number;
  partyData: PartyData;
}
function TeammateBuffs({ teammate, teammateIndex, partyData }: TeammateBuffsProps) {
  const dispatch = useDispatch();
  const totalAttr = useSelector(selectTotalAttr);
  const char = useSelector(selectChar);
  const charData = useSelector(selectCharData);

  const subContent: JSX.Element[] = [];
  const { buffs = [], vision } = findCharacter(teammate)!;

  teammate.buffCtrls.forEach((ctrl, ctrlIndex) => {
    const { activated, index, inputs = [] } = ctrl;
    const buff = findByIndex(buffs, index);
    if (!buff) return;

    const path: ToggleTeammateModCtrlPath = {
      teammateIndex,
      modCtrlName: "buffCtrls",
      ctrlIndex,
    };

    subContent.push(
      <ModifierTemplate
        key={ctrlIndex}
        checked={activated}
        onToggle={() => dispatch(toggleTeammateModCtrl(path))}
        heading={buff.src}
        desc={buff.desc({
          toSelf: false,
          char,
          charData,
          partyData,
          inputs: inputs || [],
          charBuffCtrls: teammate.buffCtrls,
          totalAttr,
        })}
        inputs={inputs}
        inputConfigs={buff.inputConfigs}
        onChangeText={(value, i) => {
          dispatch(
            changeTeammateModCtrlInput({
              ...path,
              inputIndex: i,
              value,
            })
          );
        }}
        onToggleCheck={(currentInput, i) => {
          dispatch(
            changeTeammateModCtrlInput({
              ...path,
              inputIndex: i,
              value: currentInput === 1 ? 0 : 1,
            })
          );
        }}
        onSelectOption={(value, i) => {
          dispatch(
            changeTeammateModCtrlInput({
              ...path,
              inputIndex: i,
              value: +value,
            })
          );
        }}
      />
    );
  });
  return (
    <div>
      <p className={`-mt-1 text-h6 text-${vision} font-bold text-center uppercase`}>
        {teammate.name}
      </p>
      <div className="mt-1 space-y-3">{subContent}</div>
    </div>
  );
}
