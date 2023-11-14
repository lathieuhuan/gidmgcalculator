import type { PartyData, Teammate } from "@Src/types";
import type { ToggleModCtrlPath, ToggleTeammateModCtrlPath } from "@Store/calculatorSlice/reducer-types";

import { selectChar, selectParty } from "@Store/calculatorSlice/selectors";
import { useDispatch, useSelector } from "@Store/hooks";

// Action
import {
  changeModCtrlInput,
  changeTeammateModCtrlInput,
  toggleModCtrl,
  toggleTeammateModCtrl,
} from "@Store/calculatorSlice";

// Util
import { appData } from "@Src/data";
import { findByIndex, parseCharacterDescription } from "@Src/utils";

// Component
import { ModifierTemplate, renderModifiers } from "@Src/components";

export function SelfBuffs() {
  const dispatch = useDispatch();
  const char = useSelector(selectChar);
  const charData = appData.getCharData(char.name);
  const partyData = appData.getPartyData(useSelector(selectParty));
  const selfBuffCtrls = useSelector((state) => {
    return state.calculator.setupsById[state.calculator.activeId].selfBuffCtrls;
  });

  const { innateBuffs = [], buffs = [] } = appData.getCharData(char.name) || {};
  const modifierElmts: JSX.Element[] = [];

  innateBuffs.forEach((buff, index) => {
    if (buff.isGranted(char)) {
      modifierElmts.push(
        <ModifierTemplate
          key={`innate-${index}`}
          mutable={false}
          heading={buff.src}
          description={parseCharacterDescription(
            buff.description,
            { fromSelf: true, char, partyData, inputs: [] },
            charData.dsGetters
          )}
        />
      );
    }
  });

  selfBuffCtrls.forEach((ctrl, ctrlIndex) => {
    const buff = findByIndex(buffs, ctrl.index);

    if (buff && (!buff.isGranted || buff.isGranted(char))) {
      const { inputs = [] } = ctrl;
      const path: ToggleModCtrlPath = {
        modCtrlName: "selfBuffCtrls",
        ctrlIndex,
      };
      const inputConfigs = buff.inputConfigs?.filter((config) => config.for !== "teammate");

      const updateBuffCtrlInput = (value: number, inputIndex: number) => {
        dispatch(changeModCtrlInput(Object.assign({ value, inputIndex }, path)));
      };

      modifierElmts.push(
        <ModifierTemplate
          key={`self-${ctrl.index}`}
          heading={buff.src}
          description={parseCharacterDescription(
            buff.description,
            { fromSelf: true, char, partyData, inputs },
            charData.dsGetters
          )}
          inputs={inputs}
          inputConfigs={inputConfigs}
          checked={ctrl.activated}
          onToggle={() => {
            dispatch(toggleModCtrl(path));
          }}
          onToggleCheck={(currentinput, inputIndex) => {
            updateBuffCtrlInput(currentinput === 1 ? 0 : 1, inputIndex);
          }}
          onChangeText={updateBuffCtrlInput}
          onSelectOption={updateBuffCtrlInput}
        />
      );
    }
  });

  return renderModifiers(modifierElmts, "buffs", true);
}

export function PartyBuffs() {
  const party = useSelector(selectParty);
  const partyData = appData.getPartyData(useSelector(selectParty));
  const modifierElmts: JSX.Element[] = [];

  party.forEach((teammate, index) => {
    if (teammate && teammate.buffCtrls.length) {
      modifierElmts.push(<TeammateBuffs key={index} teammate={teammate} teammateIndex={index} partyData={partyData} />);
    }
  });
  return renderModifiers(modifierElmts, "buffs");
}

interface TeammateBuffsProps {
  teammate: Teammate;
  teammateIndex: number;
  partyData: PartyData;
}
function TeammateBuffs({ teammate, teammateIndex, partyData }: TeammateBuffsProps) {
  const dispatch = useDispatch();
  const char = useSelector(selectChar);

  const modifierElmts: JSX.Element[] = [];
  const teammateData = appData.getCharData(teammate.name);

  teammate.buffCtrls.forEach((ctrl, ctrlIndex) => {
    const { inputs = [] } = ctrl;
    const buff = findByIndex(teammateData.buffs || [], ctrl.index);
    if (!buff) return;

    const path: ToggleTeammateModCtrlPath = {
      teammateIndex,
      modCtrlName: "buffCtrls",
      ctrlIndex,
    };

    const updateBuffCtrlInput = (value: number, inputIndex: number) => {
      dispatch(changeTeammateModCtrlInput(Object.assign({ value, inputIndex }, path)));
    };

    modifierElmts.push(
      <ModifierTemplate
        key={ctrl.index}
        checked={ctrl.activated}
        heading={buff.src}
        description={parseCharacterDescription(
          buff.description,
          { fromSelf: false, char, partyData, inputs },
          teammateData.dsGetters
        )}
        inputs={inputs}
        inputConfigs={buff.inputConfigs}
        onToggle={() => {
          dispatch(toggleTeammateModCtrl(path));
        }}
        onToggleCheck={(currentInput, inputIndex) => {
          updateBuffCtrlInput(currentInput === 1 ? 0 : 1, inputIndex);
        }}
        onChangeText={updateBuffCtrlInput}
        onSelectOption={updateBuffCtrlInput}
      />
    );
  });

  return (
    <div>
      <p className={`text-lg text-${teammateData.vision} font-bold text-center uppercase`}>{teammate.name}</p>
      <div className="mt-1 space-y-3">{modifierElmts}</div>
    </div>
  );
}
