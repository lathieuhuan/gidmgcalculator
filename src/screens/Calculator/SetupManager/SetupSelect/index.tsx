import cn from "classnames";
import { useState, type ButtonHTMLAttributes } from "react";
import { FaCopy, FaSave, FaBalanceScaleLeft } from "react-icons/fa";
import { SiTarget } from "react-icons/si";
import type { ModalInfo } from "./types";

import { useDispatch, useSelector } from "@Store/hooks";
import { duplicateCalcSetup, updateCalculator } from "@Store/calculatorSlice";
import {
  selectActiveId,
  selectComparedIds,
  selectStandardId,
  selectSetupManageInfos,
} from "@Store/calculatorSlice/selectors";
import { MAX_CALC_SETUPS } from "@Src/constants";

import { ComplexSelect } from "@Components/ComplexSelect";
import { Modal } from "@Components/modals";
import { SaveSetup } from "../modal-content";

import styles from "./styles.module.scss";
import { findById } from "@Src/utils";

export function SetupSelect() {
  const dispatch = useDispatch();

  const activeId = useSelector(selectActiveId);
  const setupManageInfos = useSelector(selectSetupManageInfos);
  const standardId = useSelector(selectStandardId);
  const comparedIds = useSelector(selectComparedIds);

  const [modal, setModal] = useState<ModalInfo>({
    type: "",
    index: undefined,
  });
  const [moreActionsIndex, setMoreActionsIndex] = useState(-1);

  const isAtMax = setupManageInfos.length === MAX_CALC_SETUPS;

  const closeModal = () => setModal({ type: "", index: undefined });

  const onCloseSetupSelect = () => {
    setMoreActionsIndex(-1);
  };

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

  const onClickMoreActions = (index: number) => () => {
    setMoreActionsIndex(index === moreActionsIndex ? -1 : index);
  };

  const onClickSaveSetup = (index: number) => {
    setModal({ type: "SAVE_SETUP", index });
  };

  const renderSuffixButton = (
    { className, ...otherAttrs }: ButtonHTMLAttributes<HTMLButtonElement>,
    index?: number
  ) => {
    return (
      <button
        key={index}
        className={cn(
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
            renderSuffix: ({ closeSelect }) => {
              const shownButtons: Array<ButtonHTMLAttributes<HTMLButtonElement>> = [
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
                  className: cn(isAtMax && "bg-lesser"),
                  disabled: isAtMax,
                  onClick: onClickCopySetup(ID),
                  children: <FaCopy />,
                },
              ];
              const hidddenButtons: Array<ButtonHTMLAttributes<HTMLButtonElement>> = [
                {
                  onClick: () => {
                    closeSelect();
                    onClickSaveSetup(i);
                  },
                  children: <FaSave />,
                },
              ];

              return (
                <div className="ml-auto flex text-xl transition-all duration-300">
                  {shownButtons.map(renderSuffixButton)}

                  <div
                    className="flex overflow-hidden transition-all duration-300"
                    style={{
                      width: i === moreActionsIndex ? `${2.25 * hidddenButtons.length}rem` : 0,
                    }}
                  >
                    {hidddenButtons.map(renderSuffixButton)}
                  </div>

                  {renderSuffixButton({
                    className: cn(
                      styles["more-actions-btn"],
                      i === moreActionsIndex && styles.active + " bg-green"
                    ),
                    onClick: onClickMoreActions(i),
                    children: <div className="bg-black" />,
                  })}
                </div>
              );
            },
          };
        })}
        onChange={onClickSetupName}
        onCloseSelect={onCloseSetupSelect}
      />

      <Modal
        active={modal.type === "SAVE_SETUP"}
        isCustom
        className="rounded-lg max-w-95"
        style={{ width: "30rem" }}
        onClose={closeModal}
      >
        <SaveSetup setup={setupManageInfos[modal.index || 0]} onClose={closeModal} />
      </Modal>
    </>
  );
}
