import clsx from "clsx";
import { useState, useEffect, ChangeEvent } from "react";
import { FaChevronDown } from "react-icons/fa";
import type { AttackElement, Vision } from "@Src/types";
import type { DataMonster, MonsterState } from "@Data/monsters/types";

// Constant
import { ATTACK_ELEMENTS } from "@Src/constants";
import monsters from "@Data/monsters";

// Action
import { updateTarget } from "@Store/calculatorSlice";

// Selector
import { selectTarget } from "@Store/calculatorSlice/selectors";

// Util
import { turnArray } from "@Src/utils";
import { findMonster } from "@Data/controllers";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";
import { useTranslation } from "@Src/hooks";

// Component
import { Button, CloseButton } from "@Components/atoms";

interface TargetConfigProps {
  onClose: () => void;
}
export function TargetConfig({ onClose }: TargetConfigProps) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const target = useSelector(selectTarget);
  const dataMonster = findMonster(target);

  const [monsterListOn, setMonsterListOn] = useState(false);

  useEffect(() => {
    if (monsterListOn) {
      document.querySelector(`#monster-${target.code}`)?.scrollIntoView();
    }
  }, [monsterListOn]);

  if (!dataMonster) {
    return null;
  }

  const { title, variant } = dataMonster;
  const inputConfigs = dataMonster.inputConfigs ? turnArray(dataMonster.inputConfigs) : [];

  const onClickMonster = (monster: DataMonster) => {
    if (monster.code !== target.code) {
      let newVariantType;
      let newInputs = monster.inputConfigs ? Array(turnArray(monster.states).length).fill(0) : [];

      if (monster.variant) {
        const firstVariant = monster.variant.types[0];
        newVariantType = typeof firstVariant === "string" ? firstVariant : firstVariant.value;
      }

      dispatch(
        updateTarget({
          code: monster.code,
          inputs: newInputs,
          ...(newVariantType ? { variantType: newVariantType } : undefined),
        })
      );
    }
    setMonsterListOn(false);
  };

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
          dispatch(updateTarget({ [key]: Math.round(value) }));
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
      <CloseButton className="absolute top-3 right-3" onClick={onClose} />
      <p className="text-1.5xl text-orange font-bold">Target Config</p>

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

            <div className="mt-4 rounded text-black bg-default relative">
              <button
                className="px-2 pt-1 w-full rounded text-lg font-semibold flex items-center"
                onClick={() => setMonsterListOn((prev) => !prev)}
              >
                <span className="pr-2 truncate">{title}</span>
                <FaChevronDown className="ml-auto" />
              </button>

              <div
                className="absolute top-full z-10 mt-1 w-full bg-default custom-scrollbar rounded"
                hidden={!monsterListOn}
                style={{ maxHeight: "50vh" }}
              >
                {monsters.map((monster, i) => {
                  return (
                    <div
                      key={monster.code}
                      id={`monster-${monster.code}`}
                      className={clsx(
                        "px-2 py-1 flex flex-col text-black cursor-default",
                        monster.code === target.code
                          ? "bg-lesser"
                          : "hover:bg-darkblue-3 hover:text-default hover:font-bold"
                      )}
                      onClick={() => onClickMonster(monster)}
                    >
                      <p>{monster.title}</p>
                      {monster.subtitle && <p className="text-sm italic">* {monster.subtitle}</p>}
                      {monster.names?.length && (
                        <p className="text-sm italic">{monster.names.join(", ")}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

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

              switch (config.type) {
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
                      className="px-4 py-2 text-black bg-default rounded"
                      value={`${target.inputs?.[index] || 0}`}
                      onChange={(e) => onChangeTargetInputs(+e.target.value, index)}
                    >
                      <option value={-1}>None</option>
                      {config.options.map((option, optionIndex) => {
                        return (
                          <option key={optionIndex} value={optionIndex}>
                            {option.label}
                          </option>
                        );
                      })}
                    </select>
                  );
                  break;
              }

              return (
                <div key={index} className="mt-4 flex justify-end">
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
              className="text-green"
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
