import { useState } from "react";

import { CheckSetting, Section } from "./atoms";
import { ButtonBar } from "@Components/molecules";
import { appSettings } from "@Src/utils";

interface SettingsProps {
  onClose: () => void;
}

export const Settings = ({ onClose }: SettingsProps) => {
  const [tempSettings, setTempSettings] = useState(appSettings.get());

  return (
    <div className="h-full px-2 py-4 flex flex-col" style={{ minWidth: 320 }}>
      <h3 className="text-2xl text-orange text-center font-bold">SETTINGS</h3>

      <div className="grow custom-scrollbar">
        <Section title="Calculator">
          <CheckSetting
            label="Separate Character's Info on each Setup"
            defaultChecked={tempSettings.separateCharInfo}
            onChange={() => {
              setTempSettings((prevSettings) => ({
                ...prevSettings,
                separateCharInfo: !prevSettings.separateCharInfo,
              }));
            }}
          />
          <CheckSetting
            label="Keep Artifact Stats when switching to a new Set"
            defaultChecked={tempSettings.keepArtStatsOnSwitch}
            onChange={() => {
              setTempSettings((prevSettings) => ({
                ...prevSettings,
                keepArtStatsOnSwitch: !prevSettings.keepArtStatsOnSwitch,
              }));
            }}
          />
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
            onClick: () => {
              appSettings.set(tempSettings);
              onClose();
            },
          },
        ]}
      />
    </div>
  );
};
