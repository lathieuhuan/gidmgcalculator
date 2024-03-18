import type { ModifierInput } from "@Src/types";
import type { ToggleModCtrlPath } from "@Store/calculatorSlice/reducer-types";

import { useDispatch, useSelector } from "@Store/hooks";
import { changeModCtrlInput, toggleModCtrl, updateTeammateArtifact } from "@Store/calculatorSlice";
import { selectArtifacts, selectParty } from "@Store/calculatorSlice/selectors";
import { deepCopy, findByIndex } from "@Src/utils";
import { getArtifactSetBonuses } from "@Src/utils/calculation";
import { ArtifactBuffsView } from "@Src/components";

export const ArtifactBuffs = () => {
  const dispatch = useDispatch();
  const artifacts = useSelector(selectArtifacts);
  const artBuffCtrls = useSelector((state) => state.calculator.setupsById[state.calculator.activeId].artBuffCtrls);
  const party = useSelector(selectParty);

  return (
    <ArtifactBuffsView
      mutable
      {...{ setBonuses: getArtifactSetBonuses(artifacts), party, artBuffCtrls }}
      getSelfHandlers={({ ctrl }) => {
        const path: ToggleModCtrlPath = {
          modCtrlName: "artBuffCtrls",
          ctrlIndex: ctrl.index,
        };
        const updateBuffCtrlInput = (value: number, inputIndex: number) => {
          dispatch(changeModCtrlInput(Object.assign({ value, inputIndex }, path)));
        };
        return {
          onToggle: () => {
            dispatch(toggleModCtrl(path));
          },
          onToggleCheck: (currentInput, inputIndex) => {
            updateBuffCtrlInput(currentInput === 1 ? 0 : 1, inputIndex);
          },
          onChangeText: updateBuffCtrlInput,
          onSelectOption: updateBuffCtrlInput,
        };
      }}
      getTeammateHandlers={({ ctrl, ctrls, teammateIndex }) => {
        const updateBuffCtrl = (value: ModifierInput | "toggle", inputIndex = 0) => {
          const newBuffCtrls = deepCopy(ctrls);
          const buffCtrl = findByIndex(newBuffCtrls, ctrl.index);
          if (!buffCtrl) return;

          if (value === "toggle") {
            buffCtrl.activated = !ctrl.activated;
          } else if (buffCtrl.inputs) {
            buffCtrl.inputs[inputIndex] = value;
          } else {
            return;
          }

          dispatch(
            updateTeammateArtifact({
              teammateIndex,
              buffCtrls: newBuffCtrls,
            })
          );
        };
        return {
          onToggle: () => {
            updateBuffCtrl("toggle");
          },
          onToggleCheck: (currentInput, inputIndex) => {
            updateBuffCtrl(currentInput === 1 ? 0 : 1, inputIndex);
          },
          onChangeText: updateBuffCtrl,
          onSelectOption: updateBuffCtrl,
        };
      }}
    />
  );
};
