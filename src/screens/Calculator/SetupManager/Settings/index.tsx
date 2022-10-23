import cn from "classnames";
import { useState, useEffect } from "react";
import { FaInfoCircle, FaPlus } from "react-icons/fa";
import type { ConfigOption } from "./types";

import { useDispatch, useSelector } from "@Store/hooks";
import { applySettings } from "@Store/calculatorSlice";
import {
  selectComparedIds,
  selectStandardId,
  selectSetupManageInfos,
} from "@Store/calculatorSlice/selectors";
import { getNewSetupName, getSetupManageInfo } from "@Store/calculatorSlice/utils";
import { NewSetupManageInfo } from "@Store/calculatorSlice/reducer-types";
import { updateUI } from "@Store/uiSlice";

import { Button, Checkbox, CloseButton, Green } from "@Src/styled-components";
import { TipsModal } from "@Components/minors";
import { CollapseAndMount } from "@Components/collapse";
import SectionTarget from "../SectionTarget";
import { SetupControl } from "./SetupControl";

import { MAX_CALC_SETUPS } from "@Src/constants";
import { useTabs } from "@Hooks/useTabs";
import { findById, randomString } from "@Src/utils";

import styles from "@Screens/Calculator/styles.module.scss";

const CONFIG_OPTIONS: ConfigOption[] = [
  {
    field: "separateCharInfo",
    desc: "Separate Character's Info on each Setup",
  },
  {
    field: "keepArtStatsOnSwitch",
    desc: "Keep Artifact Stats when switching to a new Set",
  },
];

interface HiddenSettingsProps {
  shouldShowTarget: boolean;
  onMoveTarget: () => void;
}
function HiddenSettings({ shouldShowTarget, onMoveTarget }: HiddenSettingsProps) {
  const dispatch = useDispatch();

  const setupManageInfos = useSelector(selectSetupManageInfos);
  const configs = useSelector((state) => state.calculator.configs);
  const comparedIds = useSelector(selectComparedIds);
  const standardId = useSelector(selectStandardId);

  const { activeIndex, tabs } = useTabs({
    className: "shrink-0",
    level: 2,
    configs: [{ text: "Setups" }, { text: "Configs" }],
  });
  const [tempSetups, setTempSetups] = useState<NewSetupManageInfo[]>(
    setupManageInfos.map((manageInfos) => ({
      ...manageInfos,
      status: "OLD",
      isCompared: comparedIds.includes(manageInfos.ID),
    }))
  );
  const [tempStandardId, setTempStandardId] = useState(findById(tempSetups, standardId)?.ID || 0);
  const [tempConfigs, setTempConfigs] = useState(configs);
  const [errorCode, setErrorCode] = useState<"DUPLICATE_SETUP_NAME" | "NO_SETUPS" | "">("");
  const [tipsOn, setTipsOn] = useState(false);

  const comparedSetups = tempSetups.filter((tempSetup) => tempSetup.isCompared);

  useEffect(() => {
    if (comparedSetups.length && tempStandardId === 0) {
      setTempStandardId(comparedSetups[0].ID);
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
        return newTempSetups;
      });
      // setRemovedIds((prev) => [...prev, tempSetups[index].ID]);
    } else {
      setTempSetups((prev) => {
        const newTempSetups = [...prev];
        newTempSetups.splice(index, 1);
        return newTempSetups;
      });
    }
  };

  const copySetup = (index: number) => () => {
    if (tempSetups.length < MAX_CALC_SETUPS) {
      setTempSetups((prev) => {
        let name = prev[index].name.trim();
        const newSetup: NewSetupManageInfo = {
          ...prev[index],
          ID: Date.now(),
          name: name ? `${name} (copy)` : "Setup copy",
          type: "original",
          originId: prev[index].ID,
          status: "DUPLICATE",
        };

        return [...prev, newSetup];
      });
    }
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

  const onSelectSetupForCompare = (index: number) => () => {
    const { isCompared: isToggleOff, ID } = tempSetups[index] || {};

    if (isToggleOff && ID === tempStandardId) {
      setTempStandardId(0);
    }

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
    if (!tempSetups.length) {
      setErrorCode("NO_SETUPS");
      return;
    }

    const nameMap: Record<string, boolean> = {};
    for (const tempSetup of tempSetups) {
      const name = tempSetup.name.trim();

      if (!name.length || nameMap[name]) {
        setErrorCode("DUPLICATE_SETUP_NAME");
        return;
      } else {
        nameMap[name] = true;
      }
    }

    dispatch(
      applySettings({
        newSetupManageInfos: tempSetups,
        newConfigs: tempConfigs,
        standardId: tempStandardId,
      })
    );
    dispatch(updateUI({ settingsOn: false }));
  };

  // const settingsUtils = {
  //   share: <SharedUtil setup={tempSetups[util.index]} close={closeUtil} />,
  //   updateDB: <UpdateDB index={util.index} close={closeUtil} />,
  // };

  return (
    <div className="p-4 h-full flex flex-col">
      <CloseButton
        className="absolute top-3 right-3"
        onClick={() => dispatch(updateUI({ settingsOn: false }))}
      />

      <p className="mt-2 mb-3 text-h3 text-center text-orange font-bold">SETTINGS</p>
      <div className="relative">
        {tabs}
        {activeIndex === 1 && (
          <button
            className="w-40 h-8 absolute top-0 right-0 pr-2 flex items-center justify-end text-2xl text-black"
            onClick={() => setTipsOn(true)}
          >
            <FaInfoCircle />
          </button>
        )}
      </div>

      <div className="mt-3 flex-grow hide-scrollbar">
        {activeIndex === 0 && (
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
                    changeSetupName={changeSetupName(index)}
                    removeSetup={removeSetup(index)}
                    copySetup={copySetup(index)}
                    onSelectForCompare={onSelectSetupForCompare(index)}
                    onChooseStandard={onChooseStandardSetup(index)}
                  />
                );
              })}
            </div>

            {tempSetups.length < 4 && (
              <div className="mt-4">
                <button
                  className="h-8 w-full flex-center rounded-2xl bg-blue-600 glow-on-hover"
                  onClick={addNewSetup}
                >
                  <FaPlus />
                </button>
                {/* <ImportBtn /> */}
              </div>
            )}
          </div>
        )}

        {activeIndex === 1 && (
          <div className="space-y-3">
            {shouldShowTarget && <SectionTarget onMove={onMoveTarget} />}
            <div className="p-4 rounded-lg bg-darkblue-2">
              <div className="space-y-4">
                {CONFIG_OPTIONS.map(({ field, desc }, i) => (
                  <label key={i} className="flex items-center group">
                    <Checkbox
                      className="ml-1 mr-4 scale-180"
                      checked={tempConfigs[field]}
                      onChange={() =>
                        setTempConfigs((prev) => ({ ...prev, [field]: !prev[field] }))
                      }
                    />
                    <span className="group-hover:text-lightgold cursor-pointer">{desc}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Button
        className="mt-4 mx-auto group relative"
        variant="positive"
        onClick={tryApplyNewSettings}
      >
        <span
          className={cn(
            "w-60 mb-2 px-2 py-1 left-1/2 -translate-x-1/2 text-center small-tooltip bottom-full origin-bottom-center text-lightred",
            errorCode !== "" && "group-hover:scale-100"
          )}
        >
          {errorCode === "NO_SETUPS"
            ? "Please have atleast 1 Setup"
            : errorCode === "DUPLICATE_SETUP_NAME" && "Please choose a unique name for each Setup."}
        </span>
        <span>Apply</span>
      </Button>

      <TipsModal
        active={tipsOn}
        content={
          <div className="space-y-2 text-default">
            <p>
              - Be careful when the Calculator is under the effect of{" "}
              <Green>Separate Character's Info</Green> (level, constellation, talents) on each
              Setup. It can make things complicated.
            </p>
            <p>
              - When Separate Character's Info is deactivated. Info on the Standard Setup will be
              used for others.
            </p>
            <p>
              - Separate Character's Info will be reset to not activated at the start of every
              calculating session.
            </p>
          </div>
        }
        onClose={() => setTipsOn(false)}
      />
    </div>
  );
}

interface SettingsProps extends HiddenSettingsProps {
  height: number;
}
export default function Settings({ height, ...rest }: SettingsProps) {
  const active = useSelector((state) => state.ui.settingsOn);
  return (
    <CollapseAndMount
      active={active}
      className={cn("absolute bottom-0 left-0 bg-darkblue-3 z-30", styles.card)}
      activeHeight={height / 16 + 2 + "rem"}
      duration={200}
    >
      <HiddenSettings {...rest} />
    </CollapseAndMount>
  );
}
