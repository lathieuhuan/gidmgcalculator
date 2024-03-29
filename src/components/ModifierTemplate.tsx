import clsx from "clsx";
import { ReactNode } from "react";

import type { ModifierInput, ModInputConfig } from "@Src/types";
import { genNumberSequenceOptions } from "@Src/utils";

// Component
import { Input, Green, Checkbox } from "@Src/pure-components";

export type ModSelectOption = {
  label: string | number;
  value: string | number;
};

const ANEMOABLE_OPTIONS: ModSelectOption[] = [
  { label: "Pyro", value: 0 },
  { label: "Hydro", value: 1 },
  { label: "Electro", value: 2 },
  { label: "Cryo", value: 3 },
];

const DENDROABLE_OPTIONS: ModSelectOption[] = [
  { label: "Pyro", value: 0 },
  { label: "Hydro", value: 1 },
  { label: "Electro", value: 2 },
];

export const resonanceRenderInfo: Record<string, { name: string; description: JSX.Element }> = {
  pyro: {
    name: "Fervent Flames",
    description: (
      <>
        Increases <Green>ATK</Green> by <Green b>25%</Green>.
      </>
    ),
  },
  cryo: {
    name: "Shattering Ice",
    description: (
      <>
        Increases <Green>CRIT Rate</Green> against enemies that are Frozen or affected by Cryo by <Green b>15%</Green>.
      </>
    ),
  },
  geo: {
    name: "Enduring Rock",
    description: (
      <>
        Increases <Green>Shield Strength</Green> by <Green b>15%</Green>. Increases <Green>DMG</Green> dealt by
        characters that protected by a shield by <Green b>15%</Green>.
      </>
    ),
  },
  hydro: {
    name: "Soothing Water",
    description: (
      <>
        Increases <Green>Max HP</Green> by <Green b>25%</Green>.
      </>
    ),
  },
  dendro: {
    name: "Sprawling Greenery",
    description: (
      <>
        Increases <Green>Elemental Mastery</Green> by <Green b>50</Green>. After triggering Burning, Quicken, or Bloom
        reactions, all nearby party members gain <Green>30</Green> <Green>Elemental Mastery</Green> for 6s. After
        triggering Aggravate, Spread, Hyperbloom, or Burgeon reactions, all nearby party members gain <Green>20</Green>{" "}
        <Green>Elemental Mastery</Green> for 6s. The durations of the aforementioned effects will be counted
        independently.
      </>
    ),
  },
};

export interface ModifierTemplateProps {
  mutable?: boolean;
  checked?: boolean;
  heading: ReactNode;
  description: ReactNode;
  inputConfigs?: ModInputConfig[];
  inputs?: ModifierInput[];
  onToggle?: () => void;
  onChangeText?: (newValue: number, inputIndex: number) => void;
  onToggleCheck?: (currentInput: number, inputIndex: number) => void;
  onSelectOption?: (value: number, inputIndex: number) => void;
}
export const ModifierTemplate = ({
  mutable = true,
  checked,
  heading,
  description,
  inputConfigs = [],
  inputs = [],
  onToggle,
  onChangeText,
  onToggleCheck,
  onSelectOption,
}: ModifierTemplateProps) => {
  //
  const renderInput = (index: number) => {
    const config = inputConfigs[index];
    const input = inputs[index];

    switch (config.type) {
      case "text":
      case "level":
        if (mutable) {
          return (
            <Input
              type="number"
              className="w-20 p-2 text-right font-semibold"
              value={input}
              max={config.type === "level" ? 13 : config.max}
              onChange={(value) => onChangeText?.(value, index)}
            />
          );
        }
        return <p className="text-orange-500 capitalize">{input}</p>;
      case "check":
        return <Checkbox checked={input === 1} readOnly={!mutable} onChange={() => onToggleCheck?.(input, index)} />;
      default:
        let options: ModSelectOption[] = [];

        switch (config.type) {
          case "select":
          case "stacks":
            if (config.options) {
              options = config.options.map((option, optionIndex) => {
                return {
                  label: option,
                  value: optionIndex,
                };
              });
            } else {
              options = genNumberSequenceOptions(config.max, config.initialValue === 0);
            }
            break;
          case "anemoable":
            options = ANEMOABLE_OPTIONS;
            break;
          case "dendroable":
            options = DENDROABLE_OPTIONS;
            break;
        }

        if (mutable) {
          return (
            <select className="styled-select" value={input} onChange={(e) => onSelectOption?.(+e.target.value, index)}>
              {options.map((opt, i) => (
                <option key={i} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          );
        }
        let { label } = options.find((option) => option.value === input) || {};

        return <p className="text-orange-500 capitalize">{label}</p>;
    }
  };

  return (
    <div>
      <div className="mb-1 flex">
        <label className="flex items-center">
          {mutable && <Checkbox className="mr-2" checked={checked} onChange={onToggle} />}
          <span className="font-semibold text-yellow-400">
            {mutable ? "" : "+"} {heading}
          </span>
        </label>
      </div>
      {typeof description === "string" ? (
        <p className="text-sm" dangerouslySetInnerHTML={{ __html: description }} />
      ) : (
        <p className="text-sm">{description}</p>
      )}

      {inputConfigs.length ? (
        <div className={clsx("flex flex-col", mutable ? "pt-2 pb-1 pr-1 space-y-3" : "mt-1 space-y-2")}>
          {inputConfigs.map((config, i) => (
            <div key={i} className="flex items-center justify-end" style={{ minHeight: "2.25rem" }}>
              <span className="mr-4 text-base leading-6 text-right">{config.label || "Stacks"}</span>

              {renderInput(i)}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
