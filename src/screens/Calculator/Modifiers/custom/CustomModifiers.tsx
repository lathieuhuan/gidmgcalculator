import clsx from "clsx";
import { useState } from "react";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import type { CustomBuffCtrl, CustomDebuffCtrl } from "@Src/types";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";
import { useTranslation } from "@Src/hooks";

import { selectActiveId, selectSetupManageInfos, selectCalcSetupsById } from "@Store/calculatorSlice/selectors";
import { updateCustomBuffCtrls, updateCustomDebuffCtrls, removeCustomModCtrl } from "@Store/calculatorSlice";
import { percentSign, toCustomBuffLabel } from "@Src/utils";

// Component
import { ToggleButton, CloseButton, Input, Modal } from "@Src/pure-components";
import { CopySection } from "../../components";
import BuffCtrlCreator from "./BuffCtrlCreator";
import DebuffCtrlCreator from "./DebuffCtrlCreator";

const isBuffCtrl = (ctrl: CustomBuffCtrl | CustomDebuffCtrl): ctrl is CustomBuffCtrl => {
  return "category" in (ctrl as CustomBuffCtrl);
};

interface CustomModifiersProps {
  isBuffs: boolean;
}
export const CustomModifiers = ({ isBuffs }: CustomModifiersProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const key = isBuffs ? "customBuffCtrls" : "customDebuffCtrls";

  const activeId = useSelector(selectActiveId);
  const setupsById = useSelector(selectCalcSetupsById);
  const setupManageInfos = useSelector(selectSetupManageInfos);

  const [modalOn, setModalOn] = useState(false);

  const modCtrls = setupsById[activeId][key];
  const updateAction = isBuffs ? updateCustomBuffCtrls : updateCustomDebuffCtrls;
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
        <ToggleButton
          icon={<FaTrashAlt />}
          variant="negative"
          active={modCtrls.length !== 0}
          disabled={modCtrls.length === 0}
          onClick={() => {
            dispatch(updateAction({ actionType: "replace", ctrls: [] }));
          }}
        />
        <ToggleButton
          icon={<FaPlus />}
          variant="positive"
          active={modCtrls.length <= 9}
          disabled={modCtrls.length > 9}
          onClick={() => setModalOn(true)}
        />
      </div>

      {copyOptions.length ? <CopySection className="mt-6" options={copyOptions} onClickCopy={copyModCtrls} /> : null}

      <div className="mt-6 flex flex-col-reverse space-y-4 space-y-reverse" style={{ marginLeft: "-0.5rem" }}>
        {modCtrls.map((ctrl, ctrlIndex) => {
          let label = "";
          let min = 0;
          let max = 0;

          if (isBuffCtrl(ctrl)) {
            const sign = percentSign(ctrl.subType || ctrl.type);

            min = sign ? -99 : -9999;
            max = sign ? 999 : 99_999;
            label = clsx(
              toCustomBuffLabel(ctrl.category, ctrl.type, t),
              ctrl.subType && ` ${t(ctrl.subType)}`,
              sign && `(${sign})`
            );
          } else {
            max = 200;
            label = `${t(ctrl.type, { ns: "resistance" })} reduction (%)`;
          }

          return (
            <div key={ctrlIndex} className="flex items-center">
              <CloseButton
                boneOnly
                onClick={() => {
                  dispatch(removeCustomModCtrl({ isBuffs, ctrlIndex }));
                }}
              />
              <p className="pl-1 pr-2 text-sm capitalize">{label}</p>

              <Input
                type="number"
                className="ml-auto w-16 px-2 py-1 text-right text-lg font-medium"
                value={ctrl.value}
                min={min}
                max={max}
                onChange={(value) => {
                  dispatch(
                    updateAction({
                      actionType: "edit",
                      ctrls: {
                        index: ctrlIndex,
                        value,
                      },
                    })
                  );
                }}
              />
            </div>
          );
        })}
      </div>

      <Modal
        active={modalOn}
        className="p-4 rounded-lg flex flex-col bg-darkblue-1 shadow-white-glow"
        style={{ minWidth: isBuffs ? 302 : "auto" }}
        onClose={closeModal}
      >
        {isBuffs ? <BuffCtrlCreator onClose={closeModal} /> : <DebuffCtrlCreator onClose={closeModal} />}
      </Modal>
    </div>
  );
};
