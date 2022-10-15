import cn from "classnames";
import { useState } from "react";
import { FaTimes, FaPlus, FaTrashAlt } from "react-icons/fa";
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
import { Modal } from "@Components/modals";
import BuffCtrlCreator from "./BuffCtrlCreator";
import DebuffCtrlCreator from "./DebuffCtrlCreator";
import { useTranslation } from "@Hooks/useTranslation";

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
  const { t } = useTranslation();

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
      <div className="mt-3 flex justify-between">
        <button
          className={cn(
            "w-8 h-8 shrink-0 rounded-circle flex-center",
            modCtrls.length ? "bg-darkred glow-on-hover text-default" : "text-lesser"
          )}
          disabled={modCtrls.length === 0}
          onClick={() => dispatch(clearCustomModCtrls(isBuffs))}
        >
          <FaTrashAlt />
        </button>

        <button
          className={cn(
            "w-8 h-8 shrink-0 rounded-circle flex-center",
            modCtrls.length <= 9 ? "bg-lightgold text-black glow-on-hover" : "text-lesser"
          )}
          disabled={modCtrls.length > 9}
          onClick={() => setModalOn(true)}
        >
          <FaPlus />
        </button>
      </div>

      {copyOptions.length ? (
        <CopySection className="mt-6" options={copyOptions} onClickCopy={copyModCtrls} />
      ) : null}

      <div className="mt-6 space-y-4">
        {modCtrls.map(({ type, value }, ctrlIndex) => (
          <div key={ctrlIndex} className="flex items-center">
            <button
              className="mr-3 text-lesser text-xl hover:text-darkred"
              onClick={() => dispatch(removeCustomModCtrl({ isBuffs, ctrlIndex }))}
            >
              <FaTimes />
            </button>
            <p className="pr-2 text-lg">{t(type)}</p>

            <input
              className="ml-auto w-16 px-2 py-1 text-right text-lg textinput-common font-medium"
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
        ))}
      </div>

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
