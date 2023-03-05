import { useState } from "react";
import { FaPlus, FaTrashAlt } from "react-icons/fa";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";
import { useTranslation } from "@Src/hooks";

// Selector
import { selectActiveId, selectSetupManageInfos, selectCalcSetupsById } from "@Store/calculatorSlice/selectors";

// Action
import { updateCustomBuffCtrls, updateCustomDebuffCtrls, removeCustomModCtrl } from "@Store/calculatorSlice";

// Component
import { CloseButton, IconToggleButton, Input } from "@Components/atoms";
import { Modal } from "@Components/molecules";
import { CopySection } from "@Screens/Calculator/components";
import BuffCtrlCreator from "./BuffCtrlCreator";
import DebuffCtrlCreator from "./DebuffCtrlCreator";

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
        <IconToggleButton
          color="text-default bg-darkred"
          disabled={modCtrls.length === 0}
          onClick={() => {
            dispatch(updateAction({ actionType: "replace", ctrls: [] }));
          }}
        >
          <FaTrashAlt />
        </IconToggleButton>

        <IconToggleButton disabled={modCtrls.length > 9} onClick={() => setModalOn(true)}>
          <FaPlus />
        </IconToggleButton>
      </div>

      {copyOptions.length ? <CopySection className="mt-6" options={copyOptions} onClickCopy={copyModCtrls} /> : null}

      <div className="mt-6 space-y-4" style={{ marginLeft: "-0.5rem" }}>
        {modCtrls.map(({ type, value }, ctrlIndex) => (
          <div key={ctrlIndex} className="flex items-center">
            <CloseButton
              boneOnly
              className="text-1.5xl"
              onClick={() => {
                dispatch(removeCustomModCtrl({ isBuffs, ctrlIndex }));
              }}
            />
            <p className="pl-1 pr-2">
              {t(type, { ns: isBuffs ? "common" : "resistance" })} {!isBuffs && "reduction"}
            </p>

            <Input
              type="number"
              className="ml-auto w-16 px-2 py-1 text-right text-lg font-medium"
              value={value}
              max={999}
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
        ))}
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
}
