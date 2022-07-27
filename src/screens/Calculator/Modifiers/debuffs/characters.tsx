import type { Teammate } from "@Src/types";
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

import { ModifierLayout } from "@Src/styled-components";
import { renderNoModifier } from "@Screens/Calculator/components";
import { CharModSetters } from "../components";

import { findCharacter } from "@Data/controllers";
import { findByIndex, processNumInput } from "@Src/utils";

export function SelfDebuffs() {
  const char = useSelector(selectChar);
  const selfDebuffCtrls = useSelector(
    (state) => state.calculator.allSelfDebuffCtrls[state.calculator.currentSetup]
  );
  const dispatch = useDispatch();

  const { debuffs } = findCharacter(char) || {};
  if (!debuffs) return null;

  const content: JSX.Element[] = [];

  selfDebuffCtrls.forEach(({ index, activated, inputs = [] }, ctrlIndex) => {
    const debuff = findByIndex(debuffs, index);

    if (debuff && debuff.isGranted(char)) {
      const path: ToggleModCtrlPath = {
        modCtrlName: "allSelfDebuffCtrls",
        ctrlIndex,
      };
      let setters = null;

      if (debuff.inputConfig) {
        const { selfLabels = [], renderTypes, initialValues, maxValues } = debuff.inputConfig;

        setters = (
          <CharModSetters
            labels={selfLabels}
            inputs={inputs}
            renderTypes={renderTypes}
            initialValues={initialValues}
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
          onToggle={() => {
            dispatch(toggleModCtrl(path));
          }}
          heading={debuff.src}
          desc={debuff.desc({ fromSelf: true, char })}
          setters={setters}
        />
      );
    }
  });
  return content.length ? <>{content}</> : renderNoModifier(false);
}

export function PartyDebuffs() {
  const party = useSelector(selectParty);
  const content: JSX.Element[] = [];

  party.forEach((teammate, tmIndex) => {
    if (teammate && teammate.debuffCtrls.length)
      content.push(<TeammateDebuffs key={tmIndex} teammate={teammate} tmIndex={tmIndex} />);
  });
  return content.length ? <>{content}</> : renderNoModifier(false);
}

interface TeammateDebuffsProps {
  teammate: Teammate;
  tmIndex: number;
}
function TeammateDebuffs({ teammate, tmIndex }: TeammateDebuffsProps) {
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

    if (debuff.inputConfig) {
      const { labels = [], renderTypes, initialValues, maxValues } = debuff.inputConfig;

      setters = (
        <CharModSetters
          labels={labels}
          inputs={inputs}
          renderTypes={renderTypes}
          initialValues={initialValues}
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
        heading={debuff.src}
        desc={debuff.desc({ fromSelf: false, char })}
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
