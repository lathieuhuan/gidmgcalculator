import type { ModifierCtrl, PartyData } from "@Src/types";
import {
  selectChar,
  selectCharData,
  selectParty,
  selectTotalAttr,
} from "@Store/calculatorSlice/selectors";
import { changeModCtrlInput, toggleModCtrl } from "@Store/calculatorSlice";
import { ToggleModCtrlPath } from "@Store/calculatorSlice/reducer-types";
import { useDispatch, useSelector } from "@Store/hooks";
import { findCharacter } from "@Data/controllers";
import { findByIndex, processNumInput } from "@Src/utils";

import { ModifierLayout } from "@Styled/DataDisplay";
import { CharModSetters, renderNoModifier } from "@Screens/Calculator/components";

interface SelfBuffsProps {
  partyData: PartyData;
}
export function SelfBuffs({ partyData }: SelfBuffsProps) {
  const char = useSelector(selectChar);
  const charData = useSelector(selectCharData);
  const totalAttr = useSelector(selectTotalAttr);
  const selfBuffCtrls = useSelector(
    (state) => state.calculator.allSelfBuffCtrls[state.calculator.currentSetup]
  );
  const dispatch = useDispatch();

  const { buffs } = findCharacter(char)!;
  const content: JSX.Element[] = [];

  selfBuffCtrls.forEach((ctrl, ctrlIndex) => {
    const { activated, index, inputs = [] } = ctrl;
    const buff = findByIndex(buffs!, index);

    const path: ToggleModCtrlPath = {
      modCtrlName: "allSelfBuffCtrls",
      index: ctrlIndex,
    };
    if (buff && buff.isGranted(char)) {
      let setters = null;

      if (buff.inputConfig) {
        const { selfLabels = [], renderTypes, maxValues } = buff.inputConfig;

        setters = (
          <CharModSetters
            labels={selfLabels}
            renderTypes={renderTypes}
            inputs={inputs}
            maxValues={maxValues}
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
  return content.length ? content : renderNoModifier(true);
}

interface PartyBuffsProps {
  partyData: PartyData;
  tmBuffCtrls: ModifierCtrl[];
}
export function PartyBuffs({ partyData, tmBuffCtrls }: PartyBuffsProps) {
  const party = useSelector(selectParty);
  const content: JSX.Element[] = [];

  party.forEach((teammate, index) => {
    if (teammate && tmBuffCtrls.length) {
      content.push(
        <TeammateBuffs
          key={index}
          name={teammate}
          index={index}
          buffCtrls={tmBuffCtrls}
          partyData={partyData}
        />
      );
    }
  });
  return content.length ? content : renderNoModifier(true);
}

interface TeammateBuffsProps {
  name: string;
  index: number;
  partyData: PartyData;
  buffCtrls: ModifierCtrl[];
}
function TeammateBuffs({ name, index, partyData, buffCtrls }: TeammateBuffsProps) {
  const char = useSelector(selectChar);
  const charData = useSelector(selectCharData);
  const dispatch = useDispatch();

  const subContent: JSX.Element[] = [];
  const { buffs = [], vision } = findCharacter({ name }) || {};

  buffCtrls.forEach((ctrl, ctrlIndex) => {
    const { activated, index, inputs } = ctrl;
    const buff = findByIndex(buffs, index);

    const path: ToggleModCtrlPath = {
      modCtrlName: "allTmBuffCtrls",
      index: ctrlIndex,
    };

    subContent.push(
      <Section
        key={ctrlIndex}
        checked={activated}
        handleCheck={() => dispatch(TOGGLE_TM_MCS({ ...path, activated: !activated }))}
        heading={buff.src}
        desc={buff.desc({
          toSelf: false,
          charBCs: teammate.BCs,
          inputs,
          char,
          charData,
          partyData,
        })}
        setters={<TmSetterSection buff={buff} inputs={inputs} path={path} />}
      />
    );
  });
  return (
    <>
      <Text className="pt-2 mb-m1" variant="h6" bold color={vision} align="center">
        {teammate.name.toUpperCase()}
      </Text>
      {subContent}
    </>
  );
}

function TmSetterSection({ buff, inputs, path }) {
  const dispatch = useDispatch();
  if (!buff.labels) return null;
  return (
    <CharModSetter
      labels={buff.labels}
      mod={buff}
      inputs={inputs}
      handleText={(value, i) =>
        dispatch(
          CHANGE_TM_MCS_INPUT({
            ...path,
            inpIndex: i,
            value: processNumInp(value, inputs[i], buff.maxs[i]),
          })
        )
      }
      handleCheck={(inpIndex) =>
        dispatch(
          CHANGE_TM_MCS_INPUT({
            ...path,
            inpIndex,
            value: !inputs[inpIndex],
          })
        )
      }
      handleSelect={(value, inpIndex) =>
        dispatch(
          CHANGE_TM_MCS_INPUT({
            ...path,
            inpIndex,
            value: isNaN(value) ? value : +value,
          })
        )
      }
    />
  );
}
