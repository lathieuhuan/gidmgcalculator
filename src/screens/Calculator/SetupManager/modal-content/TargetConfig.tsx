import type { ChangeEvent } from "react";

import type { AttackElement, Vision } from "@Src/types";
import { ATTACK_ELEMENTS } from "@Src/constants";
import { useTranslation } from "@Src/pure-hooks";
import { $AppData } from "@Src/services";
import { toArray } from "@Src/utils";

// Store
import { useDispatch, useSelector } from "@Store/hooks";
import { selectTarget } from "@Store/calculatorSlice/selectors";
import { updateTarget } from "@Store/calculatorSlice";

// Component
import { Input } from "@Src/pure-components";
import { ComboBox } from "./ComboBox";

export function TargetConfig() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const target = useSelector(selectTarget);
  const monsData = $AppData.getMonsData(target);

  if (!monsData) {
    return null;
  }

  const { variant } = monsData;
  const inputConfigs = monsData.inputConfigs ? toArray(monsData.inputConfigs) : [];

  const onChangeElementVariant = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch(updateTarget({ variantType: e.target.value as Vision }));
  };

  const onChangeTargetResistance = (attElmt: AttackElement) => {
    return (value: number) => {
      const newResistances = { ...target.resistances };
      newResistances[attElmt] = value;

      dispatch(updateTarget({ resistances: newResistances }));
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
    <div className="h-full px-2 flex hide-scrollbar" onDoubleClick={() => console.log(target)}>
      <div className="w-75 flex flex-col shrink-0">
        <div className="grow overflow-auto flex flex-col">
          <div className="flex">
            <label className="ml-auto flex items-center">
              <span className="mr-4 text-lg text-yellow-400">Level</span>
              <Input
                type="number"
                className="w-16 p-2 text-right font-bold"
                value={target.level}
                max={100}
                maxDecimalDigits={0}
                onChange={(value) => dispatch(updateTarget({ level: value }))}
              />
            </label>
          </div>

          <ComboBox
            className="mt-3"
            targetCode={target.code}
            targetTitle={monsData.title}
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
              <p className="mr-4 text-light-400">Variant</p>

              <select className="styled-select capitalize" value={target.variantType} onChange={onChangeElementVariant}>
                {variant.types.map((variantType, i) => {
                  return (
                    <option key={i} value={typeof variantType === "string" ? variantType : variantType.value}>
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

        {/* <div className="mt-3 flex space-x-2">
          <Button onClick={onClose}>Close</Button>
          {button}
        </div> */}
      </div>

      <div className="mx-2" />

      <div className="w-75 shrink-0 flex flex-col">
        <div className="space-y-3 grow custom-scrollbar">
          {ATTACK_ELEMENTS.map((attElmt) => {
            return (
              <div key={attElmt} className="flex justify-end items-center">
                <p className={"mr-4 text-base " + (attElmt === "phys" ? "text-light-400" : `text-${attElmt}`)}>
                  {t(attElmt, { ns: "resistance" })}
                </p>
                <Input
                  type="number"
                  className="w-20 p-2 text-right font-bold disabled:bg-light-800"
                  disabled={target.code !== 0}
                  value={target.resistances[attElmt]}
                  maxDecimalDigits={0}
                  max={100}
                  min={-100}
                  onChange={onChangeTargetResistance(attElmt)}
                />
              </div>
            );
          })}
        </div>

        <p className="mt-4 pr-1 text-sm text-right text-light-400">
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
  );
}
