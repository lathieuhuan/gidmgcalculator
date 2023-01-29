import { useState } from "react";
import type { AppSettings } from "@Store/calculatorSlice/types";

import { useSelector } from "@Store/hooks";

type ConfigOption = {
  field: keyof AppSettings;
  desc: string;
};

interface SectionProps {
  title: string;
  options: ConfigOption[];
}
const Section = ({ title, options }: SectionProps) => {
  return (
    <div className="p-2 bg-darkblue-1 rounded">
      <p className="text-lightgold text-lg font-semibold">{title}</p>
      <ul>{/*  */}</ul>
    </div>
  );
};

export const Settings = () => {
  const settings = useSelector((state) => state.calculator.settings);

  const [tempSettings, setTempSettings] = useState(settings);

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

  return (
    <div className="h-full p-4">
      <h3 className="text-2xl text-orange text-center font-bold">SETTINGS</h3>
      <p></p>
      <div className="mt-3">
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
