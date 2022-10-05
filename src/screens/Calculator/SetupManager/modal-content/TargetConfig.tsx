import cn from "classnames";
import { ChangeEventHandler, useState } from "react";
import type { Monster, Target } from "@Src/types";

import monsters from "@Data/monsters";
import { findMonster } from "@Data/controllers";
import { MONSTER_VARIANT_LABELS } from "@Data/monsters/constants";
import { ATTACK_ELEMENTS } from "@Src/constants";

import { useDispatch, useSelector } from "@Store/hooks";
import { changeMonster, changeMonsterConfig, modifyTarget } from "@Store/calculatorSlice";
import { selectTarget } from "@Store/calculatorSlice/selectors";

import { Checkbox, CloseButton } from "@Src/styled-components";
import { twInputStyles } from "@Screens/Calculator/components";
import { FaChevronDown } from "react-icons/fa";

interface TargetConfigProps {
  onClose: () => void;
}
export function TargetConfig({ onClose }: TargetConfigProps) {
  const dispatch = useDispatch();
  const target = useSelector(selectTarget);
  const monster = useSelector((state) => state.calculator.monster);
  // const [monster, setMonster] = useState<Monster>({
  // });
  const monsterData = findMonster(monster);

  const [listOn, setListOn] = useState(false);

  const onChangeTargetProp = (key: keyof Target): ChangeEventHandler<HTMLInputElement> => {
    return (e) => {
      const value = +e.target.value;

      if (!isNaN(value) && value >= 0 && value <= 100) {
        dispatch(modifyTarget({ key, value: Math.round(value) }));
      }
    };
  };

  const renderVariant = () => {
    if (monsterData.variant) {
      const { labelIndex, options } = monsterData.variant;

      return (
        <div className="mt-4 flex justify-end items-center">
          {labelIndex && <p className="mr-4">{MONSTER_VARIANT_LABELS[labelIndex]}</p>}

          <select className={twInputStyles.select}>
            {options.map((opt, i) => {
              return <option key={i}>{opt}</option>;
            })}
          </select>
        </div>
      );
    }
    return null;
  };

  const renderConfig = () => {
    if (monsterData.config) {
      const { labels, renderTypes } = monsterData.config;
      const configItems: JSX.Element[] = [];

      labels.forEach((label, i) => {
        let inputComponent = null;

        switch (renderTypes[i]) {
          case "check":
            inputComponent = (
              <Checkbox
                key={i}
                className="mr-1"
                checked={!!monster.configs[i]}
                onChange={() =>
                  dispatch(changeMonsterConfig({ inputIndex: i, value: !monster.configs[i] }))
                }
              />
            );
            break;
        }

        configItems.push(
          <div className="mt-4 flex justify-end items-center">
            <p className="mr-4">{label}</p>
            {inputComponent}
          </div>
        );
      });
      return configItems;
    }
    return null;
  };

  return (
    <div
      className="pl-5 pr-2 py-4 bg-darkblue-2 flex flex-col rounded-lg shadow-white-glow overflow-auto"
      style={{ height: "80vh" }}
    >
      <CloseButton className="absolute top-3 right-3" onClick={onClose} />
      <p className="text-h4 text-orange font-bold">Target Config</p>

      <div className="grow flex overflow-auto">
        <div className="w-80 flex flex-col shrink-0">
          <label className="flex items-center justify-end">
            <span className="mr-4 text-h6 text-lightgold">Level</span>
            <input
              className="w-20 p-2 text-right font-bold textinput-common"
              value={target.level}
              onChange={onChangeTargetProp("level")}
            />
          </label>

          {monsterData && (
            <div className="mt-4 bg-default rounded text-black flex flex-col overflow-auto">
              <button
                className="px-2 pt-1 w-full rounded-t text-lg font-bold flex items-center"
                onClick={() => setListOn((prev) => !prev)}
              >
                {monsterData.name}
                <FaChevronDown className="ml-auto" />
              </button>

              <div
                className={cn(
                  "custom-scrollbar rounded-b duration-150 ease-in-out",
                  listOn && "grow"
                )}
                style={{ maxHeight: listOn ? `${monsters.length * 2}rem` : 0 }}
              >
                {monsters.map(({ name }) => {
                  return (
                    <button className="px-2 py-1 hover:bg-darkblue-2 hover:text-default outline-none">
                      {name}
                    </button>
                  );
                })}
              </div>

              <button className="h-1 rounded-b outline-none" onClick={() => setListOn(true)} />
            </div>
          )}

          {renderVariant()}
          {renderConfig()}
        </div>

        <div className="mx-4 w-0.5 bg-darkblue-3" />

        <div className="w-80 shrink-0 flex flex-col">
          <p className="text-orange font-bold text-h5">Resistances</p>

          <div className="mt-2 pr-4 space-y-4 grow custom-scrollbar">
            {ATTACK_ELEMENTS.map((attElmt) => {
              return (
                <div key={attElmt} className="flex justify-between items-center">
                  <p
                    className={cn(
                      "text-h6",
                      attElmt === "phys" ? "text-default" : `text-${attElmt}`
                    )}
                  >
                    {attElmt}
                  </p>
                  <input
                    className="w-20 p-2 text-right textinput-common"
                    value={target[attElmt]}
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
