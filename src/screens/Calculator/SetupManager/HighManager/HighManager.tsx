import clsx from "clsx";
import { useState, useEffect } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import { BiImport } from "react-icons/bi";

import type { NewSetupManageInfo } from "@Store/calculatorSlice/reducer-types";
import { MAX_CALC_SETUPS } from "@Src/constants";
import { selectComparedIds, selectStandardId, selectSetupManageInfos } from "@Store/calculatorSlice/selectors";
import { useDispatch, useSelector } from "@Store/hooks";

// Util
import { findById, getCopyName } from "@Src/utils";
import { getSetupManageInfo, getNewSetupName } from "@Src/utils/setup";

// Action
import { updateSetups } from "@Store/calculatorSlice";
import { updateUI } from "@Store/uiSlice";

// Component
import { Button, Popover, CollapseAndMount, CloseButton } from "@Src/pure-components";
import { SetupImporter } from "@Src/components";
import { SetupControl } from "./SetupControl";

import styles from "../../styles.module.scss";

function HighManagerCore() {
  const dispatch = useDispatch();

  const setupManageInfos = useSelector(selectSetupManageInfos);
  const comparedIds = useSelector(selectComparedIds);
  const standardId = useSelector(selectStandardId);

  const [tempSetups, setTempSetups] = useState<NewSetupManageInfo[]>(
    setupManageInfos.map((manageInfos) => ({
      ...manageInfos,
      status: "OLD",
      isCompared: comparedIds.includes(manageInfos.ID),
    }))
  );
  const [tempStandardId, setTempStandardId] = useState(findById(tempSetups, standardId)?.ID || 0);
  const [importManageOn, setImportManageOn] = useState(false);
  const [errorCode, setErrorCode] = useState<"NO_SETUPS" | "">("");

  const displayedSetups = tempSetups.filter((tempSetup) => tempSetup.status !== "REMOVED");
  const comparedSetups = displayedSetups.filter((tempSetup) => tempSetup.isCompared);
  const canAddMoreSetup = displayedSetups.length < MAX_CALC_SETUPS;

  useEffect(() => {
    if (comparedSetups.length === 0 && tempStandardId !== 0) {
      setTempStandardId(0);
    } else if (
      comparedSetups.length === 1 ||
      comparedSetups.every((comparedSetup) => comparedSetup.ID !== tempStandardId)
    ) {
      setTempStandardId(comparedSetups[0]?.ID || 0);
    }
  }, [comparedSetups.length, tempStandardId]);

  const changeSetupName = (index: number) => (newName: string) => {
    setTempSetups((prev) => {
      const newTempSetups = [...prev];
      newTempSetups[index].name = newName;
      return newTempSetups;
    });

    if (errorCode) {
      setErrorCode("");
    }
  };

  const removeSetup = (index: number) => () => {
    if (tempSetups[index] && tempSetups[index].status === "OLD") {
      setTempSetups((prev) => {
        const newTempSetups = [...prev];
        newTempSetups[index].status = "REMOVED";
        newTempSetups[index].isCompared = false;
        return newTempSetups;
      });
    } else {
      setTempSetups((prev) => {
        const newTempSetups = [...prev];
        newTempSetups.splice(index, 1);
        return newTempSetups;
      });
    }
  };

  const copySetup = (index: number) => () => {
    setTempSetups((prev) => {
      const newSetupName = getCopyName(
        prev[index].name,
        displayedSetups.map(({ name }) => name)
      );

      const newSetup: NewSetupManageInfo = {
        ...prev[index],
        ID: Date.now(),
        name: newSetupName || "New setup",
        type: "original",
        originId: prev[index].ID,
        status: "DUPLICATE",
      };

      return [...prev, newSetup];
    });
  };

  const addNewSetup = () => {
    setTempSetups((prev) => {
      const newSetup: NewSetupManageInfo = {
        ...getSetupManageInfo({ name: getNewSetupName(prev) }),
        status: "NEW",
        isCompared: false,
      };
      return [...prev, newSetup];
    });

    setErrorCode("");
  };

  const onToggleSetupCompared = (index: number) => () => {
    setTempSetups((prevTempSetups) => {
      const newTempSetups = [...prevTempSetups];
      newTempSetups[index].isCompared = !newTempSetups[index].isCompared;
      return newTempSetups;
    });
  };

  const onChooseStandardSetup = (index: number) => () => {
    setTempStandardId(tempSetups[index].ID);
  };

  const tryApplyNewSettings = () => {
    if (!tempSetups.filter((tempSetup) => tempSetup.status !== "REMOVED").length) {
      setErrorCode("NO_SETUPS");
      return;
    }

    dispatch(
      updateSetups({
        newSetupManageInfos: tempSetups,
        newStandardId: tempStandardId,
      })
    );
    dispatch(updateUI({ highManagerActive: false }));
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <CloseButton
        className="absolute top-2 right-2"
        boneOnly
        onClick={() => dispatch(updateUI({ highManagerActive: false }))}
      />

      <p className="my-2 text-1.5xl text-center text-orange-500 font-bold">Setups Management</p>

      <div className="flex-grow hide-scrollbar">
        <div>
          <div className="space-y-3">
            {tempSetups.map((setup, index) => {
              if (setup.status === "REMOVED") {
                return null;
              }

              return (
                <SetupControl
                  key={setup.ID}
                  setup={setup}
                  isStandard={setup.ID === tempStandardId}
                  choosableAsStandard={setup.isCompared && comparedSetups.length > 1}
                  copiable={canAddMoreSetup}
                  onChangeSetupName={changeSetupName(index)}
                  onRemoveSetup={removeSetup(index)}
                  onCopySetup={copySetup(index)}
                  onToggleCompared={onToggleSetupCompared(index)}
                  onChooseStandard={onChooseStandardSetup(index)}
                />
              );
            })}
          </div>

          {canAddMoreSetup && (
            <div className="mt-4 space-y-4">
              <Button
                variant="custom"
                className="w-full bg-blue-400 text-black"
                icon={<FaPlus />}
                onClick={addNewSetup}
              >
                Add
              </Button>
              <Button
                className="w-full text-black"
                icon={<BiImport className="text-xl" />}
                onClick={() => setImportManageOn(true)}
              >
                Import
              </Button>
            </div>
          )}
        </div>
      </div>

      <Button className="mt-4 mx-auto group relative" variant="positive" onClick={tryApplyNewSettings}>
        {errorCode === "NO_SETUPS" && (
          <Popover
            className="w-56 mb-2 px-2 py-1 left-1/2 -translate-x-1/2 bottom-full text-center text-red-100 group-hover:scale-100"
            withTooltipStyle
          >
            Please have atleast 1 setup
          </Popover>
        )}
        <span>Apply</span>
      </Button>

      <SetupImporter active={importManageOn} onClose={() => setImportManageOn(false)} />
    </div>
  );
}

interface HighManagerProps {
  height: number;
}
export default function HighManager({ height }: HighManagerProps) {
  const highManagerActive = useSelector((state) => state.ui.highManagerActive);

  return (
    <CollapseAndMount
      active={highManagerActive}
      className={clsx("absolute bottom-0 left-0 bg-dark-500 z-30", styles.card)}
      activeHeight={height / 16 + 2 + "rem"}
      moveDuration={200}
    >
      <HighManagerCore />
    </CollapseAndMount>
  );
}
