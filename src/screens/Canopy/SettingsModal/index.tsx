import { useRef, useState } from "react";

// util
import { appSettings } from "@Src/utils";

// Hook
import { useDispatch } from "@Store/hooks";

// Action
import { applySettings } from "@Store/calculatorSlice";

// Component
import { CloseButton } from "@Components/atoms";
import { ButtonBar, Modal, ModalControl } from "@Components/molecules";
import { CheckSetting, Section, SelectSetting } from "./atoms";
import { LEVELS } from "@Src/constants";

const genNumberSequence = (count: number, startFromZero?: boolean) => {
  return [...Array(count)].map((_, i) => i + (startFromZero ? 0 : 1));
};

interface SettingsProps {
  onClose: () => void;
}
const Settings = ({ onClose }: SettingsProps) => {
  const dispatch = useDispatch();
  const [tempSettings, setTempSettings] = useState(appSettings.get());

  const onConfirmNewSettings = () => {
    if (appSettings.get().charInfoIsSeparated && !tempSettings.charInfoIsSeparated) {
      dispatch(
        applySettings({
          doMergeCharInfo: true,
        })
      );
    }

    appSettings.set(tempSettings);
    onClose();
  };

  const defaultValueSettings = useRef([
    {
      key: "charLevel",
      label: "Character level",
      options: LEVELS.map((_, i) => LEVELS[LEVELS.length - 1 - i]),
    },
    {
      key: "charCons",
      label: "Character constellation",
      options: genNumberSequence(7, true),
    },
    {
      key: "charNAs",
      label: "Character Normal Attack level",
      options: genNumberSequence(10),
    },
    {
      key: "charES",
      label: "Character Elemental Skill level",
      options: genNumberSequence(10),
    },
    {
      key: "charEB",
      label: "Character Elemental Burst level",
      options: genNumberSequence(10),
    },
    {
      key: "wpLevel",
      label: "Weapon level",
      options: LEVELS.map((_, i) => LEVELS[LEVELS.length - 1 - i]),
    },
    { key: "wpRefi", label: "Weapon refinement", options: genNumberSequence(5) },
    {
      key: "artLevel",
      label: "Artifact level",
      options: [...Array(6)].map((_, i) => i * 4),
    },
  ] as const);

  return (
    <div className="w-80 md1:w-96 h-full px-2 py-4 flex flex-col">
      <h3 className="text-2xl text-orange text-center font-bold">SETTINGS</h3>

      <div className="grow hide-scrollbar">
        <Section title="Calculator">
          <CheckSetting
            label="Separate main character's info on each setup"
            defaultChecked={tempSettings.charInfoIsSeparated}
            onChange={() => {
              setTempSettings((prevSettings) => ({
                ...prevSettings,
                charInfoIsSeparated: !prevSettings.charInfoIsSeparated,
              }));
            }}
          />
          <CheckSetting
            label="Keep artifact stats when switching to a new set"
            defaultChecked={tempSettings.doKeepArtStatsOnSwitch}
            onChange={() => {
              setTempSettings((prevSettings) => ({
                ...prevSettings,
                doKeepArtStatsOnSwitch: !prevSettings.doKeepArtStatsOnSwitch,
              }));
            }}
          />
        </Section>

        <Section title="Default values">
          {defaultValueSettings.current.map(({ key, ...rest }) => {
            return (
              <SelectSetting
                key={key}
                defaultValue={tempSettings[key]}
                onChange={(newvalue) => {
                  setTempSettings((prevSettings) => ({
                    ...prevSettings,
                    [key]: newvalue,
                  }));
                }}
                {...rest}
              />
            );
          })}
        </Section>
      </div>

      <ButtonBar
        className="mt-4"
        buttons={[
          {
            text: "Cancel",
            onClick: onClose,
          },
          {
            text: "Confirm",
            onClick: onConfirmNewSettings,
          },
        ]}
      />
    </div>
  );
};

export const SettingsModal = (props: ModalControl) => {
  return (
    <Modal className="h-large-modal rounded-lg bg-darkblue-2 shadow-white-glow" {...props}>
      <CloseButton className="absolute top-1 right-1" boneOnly onClick={props.onClose} />
      <Settings onClose={props.onClose} />
    </Modal>
  );
};
