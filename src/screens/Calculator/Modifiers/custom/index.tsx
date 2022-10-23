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
  updateCustomBuffCtrls,
  updateCustomDebuffCtrls,
  removeCustomModCtrl,
} from "@Store/calculatorSlice";
import { indexById, processNumInput } from "@Src/utils";

import { CopySection } from "@Screens/Calculator/components";
import { Modal } from "@Components/modals";
import BuffCtrlCreator from "./BuffCtrlCreator";
import DebuffCtrlCreator from "./DebuffCtrlCreator";
import { useTranslation } from "@Hooks/useTranslation";
import { IconToggleButton } from "@Src/styled-components";

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
  const key = isBuffs ? "customBuffCtrls" : "customDebuffCtrls";

  const activeId = useSelector(selectActiveId);
  const setupsById = useSelector(selectCalcSetupsById);
  const setupManageInfos = useSelector(selectSetupManageInfos);

  const [modalOn, setModalOn] = useState(false);

  const modCtrls = setupsById[activeId][key];
  const copyOptions = [];

  if (!modCtrls.length) {
    for (const { ID, name } of setupManageInfos) {
      if (setupsById[ID][key].length) {
        copyOptions.push({
          label: name,
          value: ID,
        });
      }
    }
  }

  const copyModCtrls = ({ value }: { value: number }) => {
    if (isBuffs) {
      console.log(setupsById[value].customBuffCtrls);

      dispatch(
        updateCustomBuffCtrls({
          actionType: "replace",
          ctrls: setupsById[value].customBuffCtrls,
        })
      );
    } else {
      dispatch(
        updateCustomDebuffCtrls({
          actionType: "replace",
          ctrls: setupsById[value].customDebuffCtrls,
        })
      );
    }
  };

  const closeModal = () => setModalOn(false);

  return (
    <div className="flex flex-col">
      <div className="mt-3 flex justify-between">
        <IconToggleButton
          color="text-default bg-darkred"
          disabled={modCtrls.length === 0}
          onClick={() => {
            if (isBuffs) {
              dispatch(updateCustomBuffCtrls({ actionType: "replace", ctrls: [] }));
            } else {
              dispatch(updateCustomDebuffCtrls({ actionType: "replace", ctrls: [] }));
            }
          }}
        >
          <FaTrashAlt />
        </IconToggleButton>

        <IconToggleButton disabled={modCtrls.length > 9} onClick={() => setModalOn(true)}>
          <FaPlus />
        </IconToggleButton>
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
