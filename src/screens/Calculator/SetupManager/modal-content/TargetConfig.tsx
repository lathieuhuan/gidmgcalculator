import clsx from "clsx";
import type { ChangeEvent } from "react";
import type { AttackElement, Vision } from "@Src/types";

// Constant
import { ATTACK_ELEMENTS } from "@Src/constants";

// Action
import { updateTarget } from "@Store/calculatorSlice";

// Selector
import { selectTarget } from "@Store/calculatorSlice/selectors";

// Util
import { findMonster } from "@Data/controllers";
import { turnArray } from "@Src/utils";

// Hook
import { useTranslation } from "@Src/hooks";
import { useDispatch, useSelector } from "@Store/hooks";

// Component
import { Button, CloseButton } from "@Components/atoms";
import { ComboBox } from "./ComboBox";

interface TargetConfigProps {
  onClose: () => void;
}
export function TargetConfig({ onClose }: TargetConfigProps) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const target = useSelector(selectTarget);
  const dataMonster = findMonster(target);

  if (!dataMonster) {
    return null;
  }

  const { variant } = dataMonster;
  const inputConfigs = dataMonster.inputConfigs ? turnArray(dataMonster.inputConfigs) : [];

  const onChangeElementVariant = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch(updateTarget({ variantType: e.target.value as Vision }));
  };

  const onChangeTargetProp = (key: "level" | AttackElement) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const value = +e.target.value;

      if (isNaN(value) && value > 100) {
        return;
      }

      if (key === "level" && value >= 0) {
        dispatch(updateTarget({ level: Math.round(value) }));
      } else {
        if (value > -100) {
          const newResistances = { ...target.resistances };

          newResistances[key as Vision] = Math.round(value);
          dispatch(updateTarget({ resistances: newResistances }));
        }
      }
    };
  };

  const onChangeTargetInputs = (value: number, index: number) => {
    if (target.inputs) {
      const newInputs = [...target.inputs];

      newInputs[index] = value;
      dispatch(updateTarget({ inputs: newInputs }));
    }
  };

  return (
    <div
      className="pl-5 pr-2 pt-4 pb-2 bg-darkblue-1 flex flex-col rounded-lg shadow-white-glow overflow-auto"
      style={{ height: "90vh" }}
    >
      <CloseButton className="absolute top-2 right-2" boneOnly onClick={onClose} />
      <p className="text-1.5xl text-orange font-bold" onDoubleClick={() => console.log(target)}>
        Target Config
      </p>

      <div className="py-4 grow flex custom-scrollbar">
        <div className="w-80 flex flex-col shrink-0">
          <div className="grow overflow-auto flex flex-col">
            <div className="flex">
              <label className="ml-auto flex items-center">
                <span className="mr-4 text-lg text-lightgold">Level</span>
                <input
                  className="w-16 p-2 text-right textinput-common font-bold"
                  value={target.level}
                  onChange={onChangeTargetProp("level")}
                />
              </label>
            </div>

            <ComboBox
              className="mt-4"
              targetCode={target.code}
              targetTitle={dataMonster.title}
              onSelectMonster={({ monsterCode, inputs, variantType }) => {
                dispatch(
                  updateTarget({
                    code: monsterCode,
                    inputs,
                    variantType,
                  })
                );
              }}
            />

            {variant?.types.length && target.variantType ? (
              <div className="mt-4 flex justify-end items-center">
                <p className="mr-4 text-default">Variant</p>

                <select
                  className="styled-select capitalize"
                  value={target.variantType}
                  onChange={onChangeElementVariant}
                >
                  {variant.types.map((variantType, i) => {
                    return (
                      <option
                        key={i}
                        value={typeof variantType === "string" ? variantType : variantType.value}
                      >
                        {typeof variantType === "string" ? variantType : variantType.label}
                      </option>
                    );
                  })}
                </select>
              </div>
            ) : null}

            {inputConfigs.map((config, index) => {
              let inputElement;
              const { type: configType = "check" } = config;

              switch (configType) {
                case "check":
                  const checked = target.inputs?.[index] === 1;

                  inputElement = (
                    <input
                      type="checkbox"
                      className="mr-1.5 scale-150 lg:scale-180"
                      checked={checked}
                      onChange={() => onChangeTargetInputs(checked ? 0 : 1, index)}
                    />
                  );
                  break;
                case "select":
                  inputElement = (
                    <select
                      className="styled-select capitalize"
                      value={`${target.inputs?.[index] || 0}`}
                      onChange={(e) => onChangeTargetInputs(+e.target.value, index)}
                    >
                      <option value={-1}>None</option>
                      {config.options?.map((option, optionIndex) => {
                        return (
                          <option key={optionIndex} value={optionIndex}>
                            {typeof option === "string" ? option : option.label}
                          </option>
                        );
                      })}
                    </select>
                  );
                  break;
              }

              return (
                <div key={index} className="mt-4 flex justify-end items-center">
                  <label className="mr-4">{config.label}</label>
                  {inputElement}
                </div>
              );
            })}
          </div>

          <Button className="mt-3 mr-auto" variant="positive" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="mx-4" />

        <div className="w-80 shrink-0 flex flex-col">
          <div className="mt-2 pr-4 space-y-4 grow custom-scrollbar">
            {ATTACK_ELEMENTS.map((attElmt) => {
              return (
                <div key={attElmt} className="flex justify-between items-center">
                  <p
                    className={clsx(
                      "text-lg",
                      attElmt === "phys" ? "text-default" : `text-${attElmt}`
                    )}
                  >
                    {t(attElmt, { ns: "resistance" })}
                  </p>
                  <input
                    className="w-20 p-2 text-right textinput-common font-bold disabled:bg-lesser"
                    disabled={target.code !== 0}
                    value={target.resistances[attElmt]}
                    onChange={onChangeTargetProp(attElmt)}
                  />
                </div>
              );
            })}
          </div>

          <p className="mt-4 pr-1 text-default">
            You can search for your target's Resistances on{" "}
            <a
              href="https://genshin-impact.fandom.com/wiki/Resistance#Base_Enemy_Resistances"
              rel="noreferrer"
              target="_blank"
            >
              this page of the Genshin Impact Wiki
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
