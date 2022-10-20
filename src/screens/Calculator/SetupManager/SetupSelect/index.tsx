import cn from "classnames";
import { useState } from "react";
import { FaCopy, FaSave, FaBalanceScaleLeft } from "react-icons/fa";
import type { ModalInfo } from "./types";

import { useDispatch, useSelector } from "@Store/hooks";
import { changeActiveSetup, duplicateCalcSetup } from "@Store/calculatorSlice";
import { selectActiveId, selectSetupManageInfos } from "@Store/calculatorSlice/selectors";
import { MAX_CALC_SETUPS } from "@Src/constants";

import { ComplexSelect } from "@Components/ComplexSelect";
import { Modal } from "@Components/modals";
import { SaveSetup } from "../modal-content";

import styles from "./styles.module.scss";

export function SetupSelect() {
  const dispatch = useDispatch();

  const activeId = useSelector(selectActiveId);
  const setupManageInfos = useSelector(selectSetupManageInfos);

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
      dispatch(changeActiveSetup(+newID));
    }
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

  return (
    <>
      <ComplexSelect
        selectId="setup-select"
        value={setupManageInfos.find((setupManageInfo) => setupManageInfo.ID === activeId)?.ID}
        options={setupManageInfos.map(({ name, ID }, i) => {
          return {
            label: name,
            value: ID,
            renderSuffix: ({ closeSelect }) => {
              const commonClassNames = "h-10 w-10 border-l border-b border-white";

              return (
                <div className="ml-auto flex text-xl transition-all duration-300">
                  <button
                    className={cn(
                      commonClassNames,
                      "flex-center",
                      isAtMax ? "bg-lesser" : "bg-lightgold"
                    )}
                    disabled={isAtMax}
                    onClick={onClickCopySetup(ID)}
                  >
                    <FaCopy />
                  </button>

                  <button
                    className={cn(
                      commonClassNames,
                      styles["more-actions-btn"],
                      i === moreActionsIndex && styles.active
                    )}
                    onClick={onClickMoreActions(i)}
                  >
                    <div className="bg-black" />
                  </button>

                  <div
                    className="flex overflow-hidden transition-all duration-300"
                    style={{
                      width: i === moreActionsIndex ? "2.5rem" : 0,
                    }}
                  >
                    <button
                      className={cn(commonClassNames, "shrink-0 flex-center bg-lightgold")}
                      onClick={() => {
                        closeSelect();
                        onClickSaveSetup(i);
                      }}
                    >
                      <FaSave />
                    </button>
                  </div>
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
