import type { ToggleModCtrlPath } from "@Store/calculatorSlice/reducer-types";

import { useDispatch, useSelector } from "@Store/hooks";
import { changeModCtrlInput, toggleModCtrl, updateTeammateArtifact } from "@Store/calculatorSlice";
import { selectArtifacts, selectParty } from "@Store/calculatorSlice/selectors";

// Util
import { deepCopy } from "@Src/utils";
import { getArtifactSetBonuses } from "@Src/utils/calculation";

// Component
import { renderArtifactBuffs, renderModifiers } from "@Src/components";

export const ArtifactBuffs = () => {
  const dispatch = useDispatch();
  const artifacts = useSelector(selectArtifacts);
  const artBuffCtrls = useSelector((state) => {
    return state.calculator.setupsById[state.calculator.activeId].artBuffCtrls;
  });
  const party = useSelector(selectParty);

  const content: (JSX.Element | null)[] = [];
  const mainCode = getArtifactSetBonuses(artifacts)[0]?.code;

  if (mainCode) {
    content.push(
      ...renderArtifactBuffs({
        fromSelf: true,
        keyPrefix: "main",
        code: mainCode,
        ctrls: artBuffCtrls,
        getHanlders: (ctrl, ctrlIndex) => {
          const path: ToggleModCtrlPath = {
            modCtrlName: "artBuffCtrls",
            ctrlIndex,
          };
          return {
            onToggle: () => dispatch(toggleModCtrl(path)),
            onSelectOption: (value, inputIndex) => {
              dispatch(
                changeModCtrlInput({
                  ...path,
                  inputIndex,
                  value,
                })
              );
            },
          };
        },
      })
    );
  }

  party.forEach((teammate, teammateIndex) => {
    if (teammate) {
      const { buffCtrls } = teammate.artifact;

      content.push(
        ...renderArtifactBuffs({
          keyPrefix: teammate.name,
          code: teammate.artifact.code,
          ctrls: buffCtrls,
          getHanlders: (ctrl) => {
            return {
              onToggle: () => {
                const newBuffCtrls = deepCopy(buffCtrls);
                newBuffCtrls[ctrl.index].activated = !ctrl.activated;

                dispatch(
                  updateTeammateArtifact({
                    teammateIndex,
                    buffCtrls: newBuffCtrls,
                  })
                );
              },
              onSelectOption: (value, inputIndex) => {
                const newBuffCtrls = deepCopy(buffCtrls);
                const { inputs } = newBuffCtrls[ctrl.index];

                if (inputs) {
                  inputs[inputIndex] = value;
                  dispatch(
                    updateTeammateArtifact({
                      teammateIndex,
                      buffCtrls: newBuffCtrls,
                    })
                  );
                }
              },
            };
          },
        })
      );
    }
  });

  return renderModifiers(content, "buffs", true);
};
