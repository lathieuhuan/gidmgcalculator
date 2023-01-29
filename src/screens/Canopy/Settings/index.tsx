import { useState } from "react";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";

// Selector
import { selectCalcSettings } from "@Store/calculatorSlice/selectors";
import { CheckSetting, Section, SelectSetting } from "./atoms";
import { ButtonBar } from "@Components/molecules";
import { LEVELS } from "@Src/constants";
import { Level } from "@Src/types";
import { updateCalculator } from "@Store/calculatorSlice";

interface SettingsProps {
  onClose: () => void;
}
export const Settings = ({ onClose }: SettingsProps) => {
  const dispatch = useDispatch();
  const settings = useSelector(selectCalcSettings);

  const [tempSettings, setTempSettings] = useState(settings);

  return (
    <div className="h-full px-2 py-4 flex flex-col">
      <h3 className="text-2xl text-orange text-center font-bold">SETTINGS</h3>
      <div className="grow">
        <Section title="Calculator">
          <div className="mt-2 space-y-3">
            <CheckSetting
              label="Separate Character's Info on each Setup"
              checked={tempSettings.separateCharInfo}
              onChange={() => {
                setTempSettings((prevSettings) => {
                  return {
                    ...prevSettings,
                    separateCharInfo: !prevSettings.separateCharInfo,
                  };
                });
              }}
            />
            <CheckSetting
              label="Keep Artifact Stats when switching to a new Set"
              checked={tempSettings.keepArtStatsOnSwitch}
              onChange={() => {
                setTempSettings((prevSettings) => {
                  return {
                    ...prevSettings,
                    keepArtStatsOnSwitch: !prevSettings.keepArtStatsOnSwitch,
                  };
                });
              }}
            />
          </div>
        </Section>

        <Section title="General">
          <div className="mt-2 space-y-3">
            <SelectSetting
              label="Character level"
              value={tempSettings.charLevel}
              options={LEVELS}
              onChange={(e) => {
                setTempSettings((prevSettings) => {
                  return {
                    ...prevSettings,
                    charLevel: e.target.value as Level,
                  };
                });
              }}
            />

            {}
            <SelectSetting
              label="Character Normal Attack level"
              value={tempSettings.charNAs}
              options={[...Array(13)].map((_, i) => i + 1)}
              onChange={(e) => {
                setTempSettings((prevSettings) => {
                  return {
                    ...prevSettings,
                    charNAs: +e.target.value,
                  };
                });
              }}
            />
          </div>
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
              dispatch(updateCalculator({ settings: tempSettings }));
              onClose();
            },
          },
        ]}
      />
    </div>
  );
};
