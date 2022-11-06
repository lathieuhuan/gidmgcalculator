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
import { ModifierTemplate } from "@Src/styled-components";
import { CharModSetters } from "../components";

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
      let setters = null;
      const inputConfigs = buff.inputConfigs?.filter((config) => config.for !== "teammate");

      if (inputConfigs?.length) {
        setters = (
          <CharModSetters
            inputs={inputs}
            inputConfigs={inputConfigs}
            onTextChange={(value, i) => {
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
            onSelect={(value, i) => {
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
      content.push(
        <ModifierTemplate
          key={ctrlIndex}
          checked={activated}
          onToggle={() => dispatch(toggleModCtrl(path))}
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
          setters={setters}
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
    let setters = null;

    if (buff.inputConfigs) {
      setters = (
        <CharModSetters
          inputs={inputs}
          inputConfigs={buff.inputConfigs}
          onTextChange={(value, i) => {
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
          onSelect={(value, i) => {
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
    }
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
        setters={setters}
      />
    );
  });
  return (
    <div>
      <p
        className={`text-h6 text-${vision} font-bold text-center uppercase`}
        style={{ marginTop: "-0.25rem" }}
      >
        {teammate.name}
      </p>
      <div className="mt-1 space-y-3">{subContent}</div>
    </div>
  );
}
