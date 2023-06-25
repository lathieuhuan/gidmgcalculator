import clsx from "clsx";
import { useState, type ButtonHTMLAttributes } from "react";
import { FaCopy, FaSave, FaBalanceScaleLeft, FaTrashAlt, FaShareAlt } from "react-icons/fa";
import { SiTarget } from "react-icons/si";
import type { CalcSetupManageInfo } from "@Src/types";

// Constant
import { MAX_CALC_SETUPS } from "@Src/constants";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";

// Action
import { duplicateCalcSetup, removeCalcSetup, updateCalculator } from "@Store/calculatorSlice";

// Selector
import {
  selectActiveId,
  selectComparedIds,
  selectStandardId,
  selectSetupManageInfos,
  selectTarget,
} from "@Store/calculatorSlice/selectors";

// Util
import { findById } from "@Src/utils";
import { cleanupCalcSetup } from "@Src/utils/setup";

// Component
import { ComplexSelect, Modal, ConfirmModal, SetupExporter, SetupImporter } from "@Components";
import { SaveSetup } from "../modal-content";

type ModalInfo = {
  type: "SAVE_SETUP" | "REMOVE_SETUP" | "SHARE_SETUP" | "IMPORT_SETUP" | "";
  setupIndex: number;
};

interface CalcSetupExporterProps extends CalcSetupManageInfo {
  active: boolean;
  onClose: () => void;
}
const CalcSetupExporter = ({ name, ID, ...rest }: CalcSetupExporterProps) => {
  const calculator = useSelector((state) => state.calculator);
  const target = useSelector(selectTarget);

  return (
    calculator.setupsById[ID] && (
      <SetupExporter
        setupName={name}
        calcSetup={{
          ...cleanupCalcSetup(calculator, ID),
          weapon: calculator.setupsById[ID].weapon,
          artifacts: calculator.setupsById[ID].artifacts,
        }}
        target={target}
        {...rest}
      />
    )
  );
};

export function SetupSelect() {
  const dispatch = useDispatch();

  const activeId = useSelector(selectActiveId);
  const setupManageInfos = useSelector(selectSetupManageInfos);
  const standardId = useSelector(selectStandardId);
  const comparedIds = useSelector(selectComparedIds);

  const [modal, setModal] = useState<ModalInfo>({
    type: "",
    setupIndex: 0,
  });

  const isAtMax = setupManageInfos.length === MAX_CALC_SETUPS;

  const closeModal = () => setModal({ type: "", setupIndex: 0 });

  const onClickSetupName = (newID: string | number) => {
    if (+newID !== activeId) {
      dispatch(updateCalculator({ activeId: +newID }));
    }
  };

  const onClickChooseStandard = (ID: number) => () => {
    if (ID !== standardId) {
      dispatch(updateCalculator({ standardId: ID }));
    }
  };

  const onClickToggleCompared = (ID: number) => () => {
    let newStandardId = standardId;
    const newComparedIds = comparedIds.includes(ID) ? comparedIds.filter((id) => id !== ID) : comparedIds.concat(ID);

    if (newComparedIds.length === 0) {
      newStandardId = 0;
    } else if (newComparedIds.length === 1 || !newComparedIds.includes(newStandardId)) {
      newStandardId = newComparedIds[0];
    }

    dispatch(
      updateCalculator({
        standardId: newStandardId,
        comparedIds: newComparedIds,
      })
    );
  };

  const onClickCopySetup = (ID: number) => () => {
    dispatch(duplicateCalcSetup(ID));
  };

  const onClickSaveSetup = (setupIndex: number) => {
    setModal({ type: "SAVE_SETUP", setupIndex });
  };

  const onClickShareSetup = (setupIndex: number) => {
    setModal({ type: "SHARE_SETUP", setupIndex });
  };

  const onClickRemoveSetup = (setupIndex: number) => {
    setModal({ type: "REMOVE_SETUP", setupIndex });
  };

  const renderSuffixButton = ({ className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>, index?: number) => {
    return (
      <button
        key={index}
        className={clsx(
          "h-9 w-9 border-l border-b border-white flex-center shrink-0 disabled:bg-lesser disabled:text-black",
          className
        )}
        {...rest}
      />
    );
  };

  return (
    <>
      <ComplexSelect
        selectId="setup-select"
        value={findById(setupManageInfos, activeId)?.ID}
        options={setupManageInfos.map(({ name, ID }, i) => {
          return {
            label: name,
            value: ID,
            renderActions: ({ closeSelect }) => {
              const rightButtons: Array<ButtonHTMLAttributes<HTMLButtonElement>> = [
                {
                  className: ID === standardId ? "bg-green" : "bg-default",
                  children: <SiTarget className="text-1.5xl" />,
                  disabled: comparedIds.length < 2 || !comparedIds.includes(ID),
                  onClick: onClickChooseStandard(ID),
                },
                {
                  className: comparedIds.includes(ID) ? "bg-green" : "bg-default",
                  children: <FaBalanceScaleLeft className="text-1.5xl" />,
                  disabled: setupManageInfos.length < 2,
                  onClick: onClickToggleCompared(ID),
                },
                {
                  className: "hover:bg-lightgold" + (isAtMax ? " bg-lesser" : ""),
                  children: <FaCopy />,
                  disabled: isAtMax,
                  onClick: onClickCopySetup(ID),
                },
                {
                  className: "hover:bg-lightgold",
                  children: <FaSave />,
                  onClick: () => {
                    onClickSaveSetup(i);
                    closeSelect();
                  },
                },
                {
                  className: "hover:bg-lightgold",
                  children: <FaShareAlt />,
                  onClick: () => {
                    onClickShareSetup(i);
                    closeSelect();
                  },
                },
                {
                  className: "hover:bg-darkred hover:text-default",
                  children: <FaTrashAlt />,
                  disabled: setupManageInfos.length < 2,
                  onClick: () => {
                    closeSelect();
                    onClickRemoveSetup(i);
                  },
                },
              ];

              return <div className="ml-auto flex justify-end">{rightButtons.map(renderSuffixButton)}</div>;
            },
          };
        })}
        onChange={onClickSetupName}
      />

      <Modal
        active={modal.type === "SAVE_SETUP"}
        className="rounded-lg"
        style={{ width: "30rem" }}
        onClose={closeModal}
      >
        <SaveSetup manageInfo={setupManageInfos[modal.setupIndex]} onClose={closeModal} />
      </Modal>

      <CalcSetupExporter
        active={modal.type === "SHARE_SETUP"}
        {...setupManageInfos[modal.setupIndex]}
        onClose={closeModal}
      />

      <SetupImporter active={modal.type === "IMPORT_SETUP"} onClose={closeModal} />

      <ConfirmModal
        active={modal.type === "REMOVE_SETUP"}
        message={
          <>
            Remove <b>{setupManageInfos[modal.setupIndex]?.name}</b>?
          </>
        }
        buttons={[
          undefined,
          {
            onClick: () => dispatch(removeCalcSetup(setupManageInfos[modal.setupIndex]?.ID)),
          },
        ]}
        onClose={closeModal}
      />
    </>
  );
}
