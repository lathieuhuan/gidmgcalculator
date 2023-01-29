import { useState, type ReactNode } from "react";
import type { CalculatorSettings } from "@Store/calculatorSlice/types";

import { useSelector } from "@Store/hooks";

type CalculatorOption = {
  field: keyof CalculatorSettings;
  desc: string;
};

interface SectionProps {
  title: string;
  children: ReactNode;
}
const Section = ({ title, children }: SectionProps) => {
  return (
    <div className="mt-2 px-4 py-2 bg-darkblue-1 rounded">
      <p className="text-lightgold text-lg font-semibold">{title}</p>
      {children}
    </div>
  );
};

export const Settings = () => {
  const settings = useSelector((state) => state.calculator.settings);

  const [tempSettings, setTempSettings] = useState(settings);

  const CALC_OPTIONS: CalculatorOption[] = [
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
    <div className="h-full px-2 py-4">
      <h3 className="text-2xl text-orange text-center font-bold">SETTINGS</h3>
      <Section title="Calculator">
        <div className="mt-2 space-y-3">
          {CALC_OPTIONS.map(({ field, desc }, i) => (
            <label key={i} className="flex items-center hover:text-green">
              <input
                type="checkbox"
                className="ml-1 mr-4 scale-180"
                checked={tempSettings[field]}
                onChange={() => setTempSettings((prev) => ({ ...prev, [field]: !prev[field] }))}
              />
              <span>{desc}</span>
            </label>
          ))}
        </div>
      </Section>
    </div>
  );
};
