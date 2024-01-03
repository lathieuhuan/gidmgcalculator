import type { PartyData, Teammate } from "@Src/types";
import type { ToggleModCtrlPath, ToggleTeammateModCtrlPath } from "@Store/calculatorSlice/reducer-types";

import { findByIndex, isGranted, parseAbilityDescription } from "@Src/utils";
import { $AppData } from "@Src/services";

// Store
import { useDispatch, useSelector } from "@Store/hooks";
import { selectChar, selectParty } from "@Store/calculatorSlice/selectors";
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

  const charData = $AppData.getCharData(char.name) || {};
  const modifierElmts: JSX.Element[] = [];

  selfDebuffCtrls.forEach((ctrl) => {
    const debuff = findByIndex(charData.debuffs || [], ctrl.index);

    if (debuff && isGranted(debuff, char)) {
      const { inputs = [] } = ctrl;
      const path: ToggleModCtrlPath = {
        modCtrlName: "selfDebuffCtrls",
        ctrlIndex: ctrl.index,
      };
      const inputConfigs = debuff.inputConfigs?.filter((config) => config.for !== "team");

      const updateDebuffCtrlInput = (value: number, inputIndex: number) => {
        dispatch(changeModCtrlInput(Object.assign({ value, inputIndex }, path)));
      };

      modifierElmts.push(
        <ModifierTemplate
          key={ctrl.index}
          heading={debuff.src}
          description={parseAbilityDescription(debuff, { char, charData, partyData }, inputs, true)}
          inputs={inputs}
          inputConfigs={inputConfigs}
          checked={ctrl.activated}
          onToggle={() => {
            dispatch(toggleModCtrl(path));
          }}
          onToggleCheck={(currentInput, inputIndex) => {
            updateDebuffCtrlInput(currentInput === 1 ? 0 : 1, inputIndex);
          }}
          onChangeText={updateDebuffCtrlInput}
          onSelectOption={updateDebuffCtrlInput}
        />
      );
    }
  });
  return renderModifiers(modifierElmts, "debuffs", true);
}

export function PartyDebuffs({ partyData }: { partyData: PartyData }) {
  const party = useSelector(selectParty);
  const modifierElmts: JSX.Element[] = [];

  party.forEach((teammate, teammateIndex) => {
    if (teammate && teammate.debuffCtrls.length)
      modifierElmts.push(<TeammateDebuffs key={teammateIndex} {...{ teammate, teammateIndex, partyData }} />);
  });
  return renderModifiers(modifierElmts, "debuffs");
}

interface TeammateDebuffsProps {
  teammate: Teammate;
  teammateIndex: number;
  partyData: PartyData;
}
function TeammateDebuffs({ teammate, teammateIndex, partyData }: TeammateDebuffsProps) {
  const char = useSelector(selectChar);
  const dispatch = useDispatch();

  const teammateData = $AppData.getCharData(teammate.name);
  if (!teammateData) return null;

  const modifierElmts: JSX.Element[] = [];

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

    const updateDebuffCtrlInput = (value: number, inputIndex: number) => {
      dispatch(changeTeammateModCtrlInput(Object.assign({ value, inputIndex }, path)));
    };

    modifierElmts.push(
      <ModifierTemplate
        key={ctrl.index}
        heading={debuff.src}
        description={parseAbilityDescription(debuff, { char, charData: teammateData, partyData }, inputs, false)}
        inputs={inputs}
        inputConfigs={inputConfigs}
        checked={ctrl.activated}
        onToggle={() => {
          dispatch(toggleTeammateModCtrl(path));
        }}
        onToggleCheck={(currentInput, inputIndex) => {
          updateDebuffCtrlInput(currentInput === 1 ? 0 : 1, inputIndex);
        }}
        onChangeText={updateDebuffCtrlInput}
        onSelectOption={updateDebuffCtrlInput}
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
