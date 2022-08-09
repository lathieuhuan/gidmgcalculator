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
import { findByIndex, processNumInput } from "@Src/utils";

import { ModifierLayout } from "@Src/styled-components";
import { renderNoModifier } from "@Screens/Calculator/components";
import { CharModSetters } from "../components";

export function SelfBuffs() {
  const char = useSelector(selectChar);
  const charData = useSelector(selectCharData);
  const partyData = getPartyData(useSelector(selectParty));
  const totalAttr = useSelector(selectTotalAttr);
  const selfBuffCtrls = useSelector(
    (state) => state.calculator.allSelfBuffCtrls[state.calculator.currentIndex]
  );
  const dispatch = useDispatch();

  const { buffs } = findCharacter(char)!;
  const content: JSX.Element[] = [];

  selfBuffCtrls.forEach((ctrl, ctrlIndex) => {
    const { activated, index, inputs = [] } = ctrl;
    const buff = findByIndex(buffs!, index);

    const path: ToggleModCtrlPath = {
      modCtrlName: "allSelfBuffCtrls",
      ctrlIndex,
    };

    if (buff && buff.isGranted(char)) {
      let setters = null;

      if (buff.inputConfig) {
        const { selfLabels = [], renderTypes, initialValues, maxValues } = buff.inputConfig;

        setters = (
          <CharModSetters
            labels={selfLabels}
            renderTypes={renderTypes}
            initialValues={initialValues}
            maxValues={maxValues}
            inputs={inputs}
            onTextChange={(value, i) =>
              dispatch(
                changeModCtrlInput({
                  ...path,
                  inputIndex: i,
                  value: processNumInput(value, +inputs[i], maxValues?.[i] || undefined),
                })
              )
            }
            onToggleCheck={(i) =>
              dispatch(changeModCtrlInput({ ...path, inputIndex: i, value: !inputs[i] }))
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
        <ModifierLayout
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
  return content.length ? <>{content}</> : renderNoModifier(true);
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
  return content.length ? <>{content}</> : renderNoModifier(true);
}

interface TeammateBuffsProps {
  teammate: Teammate;
  teammateIndex: number;
  partyData: PartyData;
}
function TeammateBuffs({ teammate, teammateIndex, partyData }: TeammateBuffsProps) {
  const totalAttr = useSelector(selectTotalAttr);
  const char = useSelector(selectChar);
  const charData = useSelector(selectCharData);
  const dispatch = useDispatch();

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

    if (buff.inputConfig) {
      const { labels = [], renderTypes, initialValues, maxValues } = buff.inputConfig;

      setters = (
        <CharModSetters
          labels={labels}
          renderTypes={renderTypes}
          initialValues={initialValues}
          inputs={inputs}
          onTextChange={(value, i) =>
            dispatch(
              changeTeammateModCtrlInput({
                ...path,
                inputIndex: i,
                value: processNumInput(value, +inputs[i], maxValues?.[i] || undefined),
              })
            )
          }
          onToggleCheck={(i) =>
            dispatch(
              changeTeammateModCtrlInput({
                ...path,
                inputIndex: i,
                value: !inputs[i],
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
      <ModifierLayout
        key={ctrlIndex}
        checked={activated}
        onToggle={() => dispatch(toggleTeammateModCtrl(path))}
        heading={buff.src}
        desc={buff.desc({
          toSelf: false,
          char,
          charData,
          partyData,
          inputs,
          charBuffCtrls: teammate.buffCtrls,
          totalAttr,
        })}
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