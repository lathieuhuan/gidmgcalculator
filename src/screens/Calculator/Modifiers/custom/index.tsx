import { useState } from "react";
import { FaMinus, FaPlus, FaTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "@Store/hooks";
import {
  changeCustomModCtrlValue,
  clearCustomModCtrls,
  copyCustomModCtrls,
  removeCustomModCtrl,
} from "@Store/calculatorSlice";
import { indexByName, processNumInput } from "@Src/utils";

import { CopySection } from "@Screens/Calculator/components";
import { IconButton } from "@Src/styled-components";

interface CustomModifiersProps {
  isBuffs: boolean;
}
export default function CustomModifiers({ isBuffs }: CustomModifiersProps) {
  const currentSetup = useSelector((state) => state.calculator.currentSetup);
  const allCustomBuffCtrls = useSelector((state) => state.calculator.allCustomBuffCtrls);
  const allCustomDebuffCtrls = useSelector((state) => state.calculator.allCustomDebuffCtrls);
  const setups = useSelector((state) => state.calculator.setups);
  const dispatch = useDispatch();

  const [modalOn, setModalOn] = useState(false);

  const allModCtrls = isBuffs ? allCustomBuffCtrls : allCustomDebuffCtrls;
  const modCtrls = isBuffs ? allCustomBuffCtrls[currentSetup] : allCustomDebuffCtrls[currentSetup];
  const copyOptions = [];

  if (!modCtrls.length) {
    for (const index in allModCtrls) {
      if (allModCtrls[index].length) {
        copyOptions.push(setups[index].name);
      }
    }
  }

  const copyModCtrls = (sourceName: string) => {
    dispatch(
      copyCustomModCtrls({
        isBuffs,
        sourceIndex: indexByName(setups, sourceName),
      })
    );
  };

  const renderCreateModal = () => {
    return <div></div>;
  };

  return (
    <div className="flex flex-col">
      <div className="mx-auto mt-4 flex">
        {modCtrls.length > 0 && (
          <IconButton
            className="mr-8 glow-on-hover"
            variant="negative"
            onClick={() => dispatch(clearCustomModCtrls(isBuffs))}
          >
            <FaTrashAlt />
          </IconButton>
        )}
        {modCtrls.length <= 10 && (
          <IconButton variant="positive" onClick={() => setModalOn(true)}>
            <FaPlus />
          </IconButton>
        )}
      </div>

      {copyOptions.length ? (
        <div className="mt-8">
          <CopySection options={copyOptions} onClickCopy={copyModCtrls} />
        </div>
      ) : null}

      {modCtrls.map(({ type, value }, ctrlIndex) => (
        <div key={ctrlIndex} className="mt-6 flex align-center">
          <IconButton
            className="mr-4 text-xl"
            variant="negative"
            onClick={() => dispatch(removeCustomModCtrl({ isBuffs, ctrlIndex }))}
          >
            <FaMinus />
          </IconButton>

          <div className="grow-1 flex align-center">
            <p className="pr-2">{type}</p>
            <input
              className="ml-auto p-2"
              value={value}
              onChange={(e) =>
                dispatch(
                  changeCustomModCtrlValue({
                    isBuffs,
                    ctrlIndex,
                    value: processNumInput(e.target.value, value, 999),
                  })
                )
              }
            />
          </div>
        </div>
      ))}
      {modalOn && renderCreateModal()}
    </div>
  );
}
