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
  const dispatch = useDispatch();
  const char = useSelector(selectChar);
  const selfDebuffCtrls = useSelector((state) => {
    return state.calculator.setupsById[state.calculator.activeId].selfDebuffCtrls;
  });

  const { debuffs = [] } = findCharacter(char) || {};
  const content: JSX.Element[] = [];

  selfDebuffCtrls.forEach(({ index, activated, inputs = [] }, ctrlIndex) => {
    const debuff = findByIndex(debuffs, index);

    if (debuff && (!debuff.isGranted || debuff.isGranted(char))) {
      const path: ToggleModCtrlPath = {
        modCtrlName: "selfDebuffCtrls",
        ctrlIndex,
      };
      let setters = null;
      const inputConfigs = debuff.inputConfigs?.filter((config) => config.for !== "teammate");

      if (inputConfigs) {
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
            onToggleCheck={(currentInput, inputIndex) => {
              dispatch(
                changeModCtrlInput({ ...path, inputIndex, value: currentInput === 1 ? 0 : 1 })
              );
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

  teammate.debuffCtrls.forEach(({ activated, index, inputs = [] }, ctrlIndex) => {
    const debuff = findByIndex(debuffs, index);
    if (!debuff) return;

    const path: ToggleTeammateModCtrlPath = {
      teammateIndex: tmIndex,
      modCtrlName: "debuffCtrls",
      ctrlIndex,
    };
    let setters = null;
    const inputConfigs = debuff.inputConfigs?.filter((config) => config.for !== "self");

    if (inputConfigs) {
      setters = (
        <CharModSetters
          inputs={inputs}
          inputConfigs={inputConfigs}
          onTextChange={(value, i) => {
            dispatch(
              changeTeammateModCtrlInput({
                ...path,
                inputIndex: i,
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
          onSelect={(value, inputIndex) =>
            dispatch(changeTeammateModCtrlInput({ ...path, inputIndex, value }))
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
