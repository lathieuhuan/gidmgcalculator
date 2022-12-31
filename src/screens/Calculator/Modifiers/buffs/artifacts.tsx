import type { ModifierInput } from "@Src/types";
import type { ToggleModCtrlPath } from "@Store/calculatorSlice/reducer-types";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";

// Action
import { changeModCtrlInput, toggleModCtrl, updateTeammateArtifact } from "@Store/calculatorSlice";

// Selector
import { selectArtifacts, selectParty } from "@Store/calculatorSlice/selectors";

// Util
import { deepCopy, findByIndex } from "@Src/utils";
import { getArtifactSetBonuses } from "@Src/utils/calculation";
import { findDataArtifactSet } from "@Data/controllers";

// Component
import { ModifierTemplate, renderModifiers } from "@Components/molecules";

export default function ArtifactBuffs() {
  const dispatch = useDispatch();
  const artifacts = useSelector(selectArtifacts);
  const artBuffCtrls = useSelector((state) => {
    return state.calculator.setupsById[state.calculator.activeId].artBuffCtrls;
  });
  const party = useSelector(selectParty);

  const content: JSX.Element[] = [];
  const mainCode = getArtifactSetBonuses(artifacts)[0]?.code;

  artBuffCtrls.forEach((ctrl, ctrlIndex) => {
    const { name, buffs } = findDataArtifactSet({ code: mainCode })!;
    const buff = findByIndex(buffs!, ctrl.index);
    if (!buff) return;

    const path: ToggleModCtrlPath = {
      modCtrlName: "artBuffCtrls",
      ctrlIndex,
    };
    content.push(
      <ModifierTemplate
        key={mainCode.toString() + ctrlIndex}
        checked={ctrl.activated}
        onToggle={() => dispatch(toggleModCtrl(path))}
        heading={name + " (self)"}
        desc={buff.desc()}
        inputs={ctrl.inputs}
        inputConfigs={buff.inputConfigs}
        onSelectOption={(value, inputIndex) => {
          dispatch(
            changeModCtrlInput({
              ...path,
              inputIndex,
              value,
            })
          );
        }}
      />
    );
  });

  party.forEach((teammate, teammateIndex) => {
    if (!teammate) return;
    const { code, buffCtrls } = teammate.artifact;
    const { name, buffs = [] } = findDataArtifactSet(teammate.artifact) || {};
    if (!name) return;

    const updateArtifactInputs = (ctrlIndex: number, inputIndex: number, value: ModifierInput) => {
      const newBuffCtrls = deepCopy(buffCtrls);
      const { inputs } = newBuffCtrls[ctrlIndex];

      if (inputs) {
        inputs[inputIndex] = value;
        dispatch(
          updateTeammateArtifact({
            teammateIndex,
            buffCtrls: newBuffCtrls,
          })
        );
      }
    };

    buffCtrls.forEach(({ index, activated, inputs = [] }, ctrlIndex) => {
      const buff = findByIndex(buffs, index);
      if (!buff) return;

      content.push(
        <ModifierTemplate
          key={teammateIndex.toString() + code + ctrlIndex}
          checked={activated}
          onToggle={() => {
            const newBuffCtrls = deepCopy(buffCtrls);
            newBuffCtrls[ctrlIndex].activated = !activated;

            dispatch(
              updateTeammateArtifact({
                teammateIndex,
                buffCtrls: newBuffCtrls,
              })
            );
          }}
          heading={name}
          desc={buff.desc()}
          inputs={inputs}
          inputConfigs={buff.inputConfigs}
          onSelectOption={(value, inputIndex) => updateArtifactInputs(ctrlIndex, inputIndex, value)}
        />
      );
    });
  });

  return renderModifiers(content, "buffs", true);
}
