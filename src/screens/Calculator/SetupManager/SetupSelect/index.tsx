import clsx from "clsx";
import { useState, type ButtonHTMLAttributes } from "react";
import { FaCopy, FaSave, FaBalanceScaleLeft, FaTrashAlt } from "react-icons/fa";
import { SiTarget } from "react-icons/si";

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
} from "@Store/calculatorSlice/selectors";

// Util
import { findById } from "@Src/utils";

// Component
import { ComplexSelect, Modal } from "@Components/molecules";
import { SaveSetup } from "../modal-content";
import { ConfirmModal } from "@Components/organisms";

type ModalInfo = {
  type: "SAVE_SETUP" | "REMOVE_SETUP" | "";
  setupIndex: number;
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
    const newComparedIds = comparedIds.includes(ID)
      ? comparedIds.filter((id) => id !== ID)
      : comparedIds.concat(ID);

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

  const onClickRemoveSetup = (setupIndex: number) => {
    setModal({ type: "REMOVE_SETUP", setupIndex });
  };

  const renderSuffixButton = (
    { className, ...otherAttrs }: ButtonHTMLAttributes<HTMLButtonElement>,
    index?: number
  ) => {
    return (
      <button
        key={index}
        className={clsx(
          "h-9 w-9 border-l border-b border-white flex-center shrink-0 disabled:bg-lesser disabled:text-black",
          className
        )}
        {...otherAttrs}
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
                  disabled: comparedIds.length < 2 || !comparedIds.includes(ID),
                  onClick: onClickChooseStandard(ID),
                  children: <SiTarget className="text-1.5xl" />,
                },
                {
                  className: comparedIds.includes(ID) ? "bg-green" : "bg-default",
                  disabled: setupManageInfos.length < 2,
                  onClick: onClickToggleCompared(ID),
                  children: <FaBalanceScaleLeft className="text-1.5xl" />,
                },
                {
                  className: "hover:bg-lightgold" + (isAtMax ? " bg-lesser" : ""),
                  disabled: isAtMax,
                  onClick: onClickCopySetup(ID),
                  children: <FaCopy />,
                },
                {
                  className: "hover:bg-lightgold",
                  onClick: () => {
                    closeSelect();
                    onClickSaveSetup(i);
                  },
                  children: <FaSave />,
                },
                {
                  className: "hover:bg-darkred hover:text-default",
                  disabled: setupManageInfos.length < 2,
                  onClick: () => {
                    closeSelect();
                    onClickRemoveSetup(i);
                  },
                  children: <FaTrashAlt />,
                },
              ];

              return (
                <div className="ml-auto flex justify-end">
                  {rightButtons.map(renderSuffixButton)}
                </div>
              );
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
