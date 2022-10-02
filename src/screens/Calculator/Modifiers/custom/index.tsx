import cn from "classnames";
import { useState } from "react";
import { FaMinus, FaPlus, FaTrashAlt } from "react-icons/fa";
import { createSelector } from "@reduxjs/toolkit";

import { useDispatch, useSelector } from "@Store/hooks";
import {
  selectActiveId,
  selectSetupManageInfos,
  selectCalcSetupsById,
} from "@Store/calculatorSlice/selectors";
import {
  changeCustomModCtrlValue,
  clearCustomModCtrls,
  copyCustomModCtrls,
  removeCustomModCtrl,
} from "@Store/calculatorSlice";
import { indexById, processNumInput } from "@Src/utils";

import { CopySection } from "@Screens/Calculator/components";
import { IconButton } from "@Src/styled-components";
import { Modal } from "@Components/modals";
import BuffCtrlCreator from "./BuffCtrlCreator";
import DebuffCtrlCreator from "./DebuffCtrlCreator";

const selectAllCustomBuffCtrls = createSelector(
  selectSetupManageInfos,
  selectCalcSetupsById,
  (setupManageInfos, setupsById) => {
    return setupManageInfos.map(({ ID }) => setupsById[ID].customBuffCtrls);
  }
);
const selectAllCustomDebuffCtrls = createSelector(
  selectSetupManageInfos,
  selectCalcSetupsById,
  (setupManageInfos, setupsById) => {
    return setupManageInfos.map(({ ID }) => setupsById[ID].customDebuffCtrls);
  }
);

interface CustomModifiersProps {
  isBuffs: boolean;
}
export default function CustomModifiers({ isBuffs }: CustomModifiersProps) {
  const dispatch = useDispatch();

  const activeId = useSelector(selectActiveId);
  const allCustomBuffCtrls = useSelector(selectAllCustomBuffCtrls);
  const allCustomDebuffCtrls = useSelector(selectAllCustomDebuffCtrls);
  const setupManageInfos = useSelector(selectSetupManageInfos);

  const [modalOn, setModalOn] = useState(false);

  const activeIndex = indexById(setupManageInfos, activeId);
  const allModCtrls = isBuffs ? allCustomBuffCtrls : allCustomDebuffCtrls;
  const modCtrls = isBuffs ? allCustomBuffCtrls[activeIndex] : allCustomDebuffCtrls[activeIndex];
  const copyOptions = [];

  if (!modCtrls.length) {
    for (const index in allModCtrls) {
      if (allModCtrls[index].length) {
        copyOptions.push({
          label: setupManageInfos[index].name,
          value: setupManageInfos[index].ID,
        });
      }
    }
  }

  const copyModCtrls = (args: { value: number }) => {
    dispatch(copyCustomModCtrls({ isBuffs, sourceID: args.value }));
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
              className="ml-auto p-2 w-16 text-right textinput-common"
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
        isCustom
        className="p-4 rounded-lg flex flex-col bg-darkblue-1 shadow-white-glow max-w-95"
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
