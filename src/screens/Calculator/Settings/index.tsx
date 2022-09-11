import cn from "classnames";
import { useCallback, useState } from "react";
import { FaPlus } from "react-icons/fa";
import type { CalcConfigurations, CalcSetupManageInfo } from "@Src/types";
import type { SettingsModalInfo, SettingsModalType, TemporarySetup } from "./types";

import { useDispatch, useSelector } from "@Store/hooks";
import { selectCurrentIndex, selectSetupManageInfos } from "@Store/calculatorSlice/selectors";
import { getNewSetupName, getSetupManageInfo } from "@Store/calculatorSlice/utils";
import {
  applySettingsOnUI,
  selectComparedIndexes,
  selectStandardIndex,
  toggleSettings,
} from "@Store/uiSlice";

import { TipsModal, InfoSign } from "@Components/minors";
import { CollapseAndMount } from "@Components/collapse";
import { Modal } from "@Components/modals";
import { Button, Checkbox, CloseButton, Green } from "@Src/styled-components";
import { SetupControl } from "./SetupControl";
import { SaveSetup } from "./modal-content";

import styles from "../styles.module.scss";
import { applySettingsOnCalculator } from "@Store/calculatorSlice";

const CONFIG_OPTIONS: Array<{
  field: keyof CalcConfigurations;
  desc: string;
}> = [
  {
    field: "separateCharInfo",
    desc: "Separate Character's Info on each Setup",
  },
  {
    field: "keepArtStatsOnSwitch",
    desc: "Keep Artifact Stats when switching to a new Set",
  },
];

const SETUP_LIMIT = 4;

function HiddenSettings() {
  const dispatch = useDispatch();

  const setupManageInfos = useSelector(selectSetupManageInfos);
  const currentIndex = useSelector(selectCurrentIndex);
  const standardIndex = useSelector(selectStandardIndex);
  const configs = useSelector((state) => state.calculator.configs);
  const comparedIndexes = useSelector(selectComparedIndexes);

  const [tempoSetups, setTempoSetups] = useState<TemporarySetup[]>(
    setupManageInfos.map((manageInfos, index) => {
      return {
        ID: manageInfos.ID,
        name: manageInfos.name,
        type: manageInfos.type,
        index,
        checked: comparedIndexes.includes(index),
        isStandard: index === standardIndex,
        isCurrent: index === currentIndex,
      };
    })
  );
  const [tempoConfigs, setTempoConfigs] = useState(configs);
  const [isError, setIsError] = useState(false);
  const [modal, setModal] = useState<SettingsModalInfo>({ type: "", index: null });

  const openModal = (index: number | null) => (type: SettingsModalType) => {
    setModal({ type, index });
  };

  const closeModal = () => setModal({ type: "", index: null });

  const changeSetupName = (index: number) => (newName: string) => {
    setTempoSetups((prev) => {
      const newTempoSetups = [...prev];
      newTempoSetups[index].name = newName;
      return newTempoSetups;
    });

    if (isError) {
      setIsError(false);
    }
  };

  const removeSetup = (index: number) => () => {
    setTempoSetups((prev) => {
      const newTempoSetups = [...prev];
      newTempoSetups.splice(index, 1);
      return newTempoSetups;
    });
  };

  const copySetup = (index: number) => () => {
    if (tempoSetups.length < SETUP_LIMIT) {
      setTempoSetups((prev) => {
        let name = prev[index].name.trim();
        name += name ? " (copy)" : "Setup copy";

        return [
          ...prev,
          {
            ...getSetupManageInfo({ name }),
            index: prev[index].index,
            checked: false,
            isStandard: false,
            isCurrent: false,
          },
        ];
      });
    }
  };

  const addNewSetup = () => {
    setTempoSetups((prev) => {
      return [
        ...prev,
        {
          ...getSetupManageInfo({ name: getNewSetupName(prev) }),
          index: null,
          checked: false,
          isCurrent: false,
          isStandard: false,
        },
      ];
    });
  };

  const toggleCompareSetup = (index: number) => () => {
    setTempoSetups((prev) => {
      const newTempoSetups = [...prev];
      newTempoSetups[index].checked = !newTempoSetups[index].checked;
      return newTempoSetups;
    });
  };

  const tryApply = useCallback(() => {
    let appliable = true;
    const names: string[] = [];

    for (const tempoSetup of tempoSetups) {
      const name = tempoSetup.name.trim();

      if (!name.length || names.includes(name)) {
        appliable = false;
        break;
      } else {
        names.push(name);
      }
    }
    if (appliable) {
      const setupManageInfos: CalcSetupManageInfo[] = [];
      const comparedIndexes: number[] = [];
      const indexes: (number | null)[] = [];
      let standardIndex = 0;
      let currentIndex = -1;

      for (const i in tempoSetups) {
        const tempoSetup = tempoSetups[i];
        const { name, ID, type } = tempoSetups[i];

        setupManageInfos.push({ name, ID, type });
        indexes.push(tempoSetup.index);

        if (tempoSetup.checked) comparedIndexes.push(+i);
        if (tempoSetup.isStandard) standardIndex = +i;
        if (tempoSetup.isCurrent) currentIndex = +i;
      }
      dispatch(
        applySettingsOnCalculator({
          setupManageInfos,
          indexes,
          tempoConfigs,
          standardIndex,
          currentIndex,
        })
      );
      dispatch(applySettingsOnUI({ comparedIndexes, standardIndex }));
    } else {
      setIsError(true);
    }
  }, [tempoSetups, tempoConfigs, dispatch]);

  // const settingsUtils = {
  //   save: <SaveUtil setup={tempoSetups[util.index]} close={closeUtil} />,
  //   share: <SharedUtil setup={tempoSetups[util.index]} close={closeUtil} />,
  //   updateDB: <UpdateDB index={util.index} close={closeUtil} />,
  // };

  return (
    <div className="p-4 h-full flex flex-col">
      <CloseButton
        className="absolute top-3 right-3"
        onClick={() => dispatch(toggleSettings(false))}
      />

      <p className="mt-2 text-h3 text-center text-orange font-bold">SETTINGS</p>

      <div className="mt-2 flex-grow flex flex-col hide-scrollbar">
        <div className="space-y-4">
          {tempoSetups.map((setup, index) => (
            <SetupControl
              key={index}
              setup={setup}
              changeSetupName={changeSetupName(index)}
              removeSetup={removeSetup(index)}
              copySetup={copySetup(index)}
              toggleCompareSetup={toggleCompareSetup(index)}
              openModal={openModal(index)}
            />
          ))}
        </div>

        {tempoSetups.length < 4 && (
          <div className="mt-6">
            <button
              className="h-8 w-full flex-center rounded-2xl bg-blue-600 hover:bg-blue-500"
              onClick={addNewSetup}
            >
              <FaPlus />
            </button>
            {/* <ImportBtn /> */}
          </div>
        )}

        <div className="mt-6 p-4 relative rounded-lg bg-darkblue-2">
          <InfoSign
            className="absolute top-3 right-3"
            selfHover
            onClick={() =>
              setModal({
                type: "CONFIG_TIPS",
                index: null,
              })
            }
          />
          <p className="text-h5 text-orange">Configurations</p>

          <div className="mt-2 space-y-4">
            {CONFIG_OPTIONS.map(({ field, desc }, i) => (
              <label key={i} className="flex items-center group">
                <Checkbox
                  className="ml-1 mr-4 scale-180"
                  checked={tempoConfigs[field]}
                  onChange={() => setTempoConfigs((prev) => ({ ...prev, [field]: !prev[field] }))}
                />
                <span className="group-hover:text-lightgold cursor-pointer">{desc}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <Button className="mt-4 mx-auto group relative" variant="positive" onClick={tryApply}>
        <span
          className={cn(
            "w-60 mb-2 px-2 py-1 small-tooltip bottom-full origin-bottom-center text-lightred",
            isError && "group-hover:scale-100"
          )}
        >
          Please choose a unique name for each Setup.
        </span>
        <span>Apply</span>
      </Button>

      <Modal
        active={modal.index !== null}
        isCustom
        className="rounded-lg max-w-95"
        style={{ width: "30rem" }}
        onClose={closeModal}
      >
        <SaveSetup setup={tempoSetups[modal.index || 0]} onClose={closeModal} />
      </Modal>

      <TipsModal
        active={modal.type === "CONFIG_TIPS"}
        content={
          <div className="space-y-2">
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
              session.
            </p>
          </div>
        }
        onClose={closeModal}
      />
    </div>
  );
}

export default function Settings({ height }: { height: number }) {
  const active = useSelector((state) => state.ui.settingsOn);
  return (
    <CollapseAndMount
      active={active}
      className={cn("absolute bottom-0 left-0 bg-darkblue-3 z-10", styles.card)}
      activeHeight={height / 16 + 2 + "rem"}
      duration={250}
    >
      <HiddenSettings />
    </CollapseAndMount>
  );
}
