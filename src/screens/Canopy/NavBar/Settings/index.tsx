import { useState } from "react";
import type { AppSettings } from "@Store/calculatorSlice/types";

import { useSelector } from "@Store/hooks";

type ConfigOption = {
  field: keyof AppSettings;
  desc: string;
};

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

export const Settings = () => {
  const settings = useSelector((state) => state.calculator.settings);

  const [tempSettings, setTempSettings] = useState(settings);

  return (
    <div className="space-y-3">
      <div className="p-4 rounded-lg bg-darkblue-2">
        <div className="space-y-4">
          {CONFIG_OPTIONS.map(({ field, desc }, i) => (
            <label key={i} className="flex items-center group">
              <input
                type="checkbox"
                className="ml-1 mr-4 scale-180"
                checked={tempSettings[field]}
                onChange={() => setTempSettings((prev) => ({ ...prev, [field]: !prev[field] }))}
              />
              <span className="group-hover:text-lightgold cursor-pointer">{desc}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
