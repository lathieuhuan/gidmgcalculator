import cn from "classnames";
import { useState } from "react";
import { FaMinus, FaPlus, FaTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "@Store/hooks";
import { selectCurrentIndex, selectSetups } from "@Store/calculatorSlice/selectors";
import {
  changeCustomModCtrlValue,
  clearCustomModCtrls,
  copyCustomModCtrls,
  removeCustomModCtrl,
} from "@Store/calculatorSlice";
import { indexByName, processNumInput } from "@Src/utils";

import { CopySection } from "@Screens/Calculator/components";
import { IconButton } from "@Src/styled-components";
import { Modal } from "@Components/modals";
import BuffCtrlCreator from "./BuffCtrlCreator";
import DebuffCtrlCreator from "./DebuffCtrlCreator";

interface CustomModifiersProps {
  isBuffs: boolean;
}
export default function CustomModifiers({ isBuffs }: CustomModifiersProps) {
  const currentIndex = useSelector(selectCurrentIndex);
  const allCustomBuffCtrls = useSelector((state) => state.calculator.allCustomBuffCtrls);
  const allCustomDebuffCtrls = useSelector((state) => state.calculator.allCustomDebuffCtrls);
  const setups = useSelector(selectSetups);
  const dispatch = useDispatch();

  const [modalOn, setModalOn] = useState(false);

  const allModCtrls = isBuffs ? allCustomBuffCtrls : allCustomDebuffCtrls;
  const modCtrls = isBuffs ? allCustomBuffCtrls[currentIndex] : allCustomDebuffCtrls[currentIndex];
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

  const closeModal = () => setModalOn(false);

  return (
    <div className="flex flex-col">
      <div className={cn("mx-auto mt-4 flex", !modCtrls.length && "pb-2")}>
        {modCtrls.length > 0 && (
          <IconButton
            className="mr-8 glow-on-hover"
            variant="negative"
            onClick={() => dispatch(clearCustomModCtrls(isBuffs))}
          >
            <FaTrashAlt />
          </IconButton>
        )}
        {modCtrls.length < 10 && (
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
        <div key={ctrlIndex} className="mt-6 flex items-center">
          <IconButton
            className="mr-4 text-xl"
            variant="negative"
            onClick={() => dispatch(removeCustomModCtrl({ isBuffs, ctrlIndex }))}
          >
            <FaMinus />
          </IconButton>

          <div className="grow flex items-center">
            <p className="pr-2">{type}</p>
            <input
              className="ml-auto p-2 w-16 rounded text-black text-right"
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

      <Modal
        active={modalOn}
        className="p-4 rounded-lg flex flex-col bg-darkblue-1 shadow-white-glow max-width-95"
        onClose={closeModal}
      >
        {isBuffs ? (
          <BuffCtrlCreator onClose={closeModal} />
        ) : (
          <DebuffCtrlCreator onClose={closeModal} />
        )}
      </Modal>
    </div>
  );
}
