import cn from "classnames";
import { ChangeEventHandler, useState, useEffect } from "react";
import { FaChevronDown, FaInfoCircle } from "react-icons/fa";
import type { Target, Vision } from "@Src/types";
import type { DataMonster } from "@Data/monsters/types";

import monsters from "@Data/monsters";
import { findMonster } from "@Data/controllers";
import { ATTACK_ELEMENTS } from "@Src/constants";

import { useDispatch, useSelector } from "@Store/hooks";
import { updateMonster, updateTarget } from "@Store/calculatorSlice";
import { selectTarget } from "@Store/calculatorSlice/selectors";
import { indexByCode, turnArray } from "@Src/utils";
import { useTranslation } from "@Hooks/useTranslation";

import { Button, CloseButton } from "@Src/styled-components";
import { twInputStyles } from "@Screens/Calculator/components";
import { InfoSign } from "@Components/minors";

interface TargetConfigProps {
  onClose: () => void;
}
export function TargetConfig({ onClose }: TargetConfigProps) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const target = useSelector(selectTarget);
  const chosenMonster = useSelector((state) => state.calculator.monster);
  const chosenMonsterData = findMonster(chosenMonster);

  const [monsterListOn, setMonsterListOn] = useState(false);
  const [detailsIndex, setDetailsIndex] = useState(0);

  useEffect(() => {
    const list = document.querySelector("#monster-list");
    const { code } = chosenMonster || {};

    if (list && code) {
      const chosenIndex = indexByCode(monsters, code);

      list.scrollTop = chosenIndex * 32 + (chosenIndex > 1 ? Math.min(chosenIndex - 1, 4) * 20 : 0);
    }
  }, []);

  useEffect(() => {
    if (!monsterListOn) {
      setDetailsIndex(0);
    }
  }, [monsterListOn]);

  if (!chosenMonsterData) {
    return null;
  }

  const { variantType } = chosenMonster;
  const { title, variant, names = [], states = [] } = chosenMonsterData;

  const onClickMonster = (monster: DataMonster) => {
    if (monster.code !== chosenMonster.code) {
      let variantType = null;

      if (monster.variant) {
        const firstVariant = monster.variant.types[0];
        variantType = typeof firstVariant === "string" ? firstVariant : firstVariant.value;
      }

      dispatch(
        updateMonster({
          code: monster.code,
          variantType,
        })
      );
    }
    setMonsterListOn(false);
  };

  const onChangeElementVariant: ChangeEventHandler<HTMLSelectElement> = (e) => {
    dispatch(updateMonster({ variantType: e.target.value as Vision }));
  };

  const onChangeTargetProp = (key: keyof Target): ChangeEventHandler<HTMLInputElement> => {
    return (e) => {
      const value = +e.target.value;

      if (!isNaN(value) && value >= (key === "level" ? 0 : -100) && value <= 100) {
        dispatch(updateTarget({ [key]: Math.round(value) }));
      }
    };
  };

  return (
    <div
      className="pl-5 pr-2 pt-4 pb-2 bg-darkblue-1 flex flex-col rounded-lg shadow-white-glow overflow-auto"
      style={{ height: "90vh" }}
    >
      <CloseButton className="absolute top-3 right-3" onClick={onClose} />
      <p className="text-h4 text-orange font-bold">Target Config</p>

      <div className="py-4 grow flex custom-scrollbar">
        <div className="w-80 flex flex-col shrink-0">
          <div className="grow overflow-auto flex flex-col">
            <div className="flex">
              {turnArray(states).length ? (
                <div className="self-end group relative text-default">
                  <InfoSign />
                  <ul className="w-75 ml-2 mt-2 px-2 py-1 marker:mr-1 small-tooltip group-hover:scale-100 origin-top-left">
                    {turnArray(states).map((state, i) => {
                      const changes = Object.entries(state.changes)
                        .map(([key, value]) => {
                          const changeField = {
                            base: "all Resistances",
                            variant: "Resistance to their Element",
                          }[key];

                          return `${value > 0 ? "+" : ""}${value}% ${changeField || key}`;
                        })
                        .join(", ");

                      return (
                        <li
                          key={i}
                          dangerouslySetInnerHTML={{
                            __html:
                              `• When <span class="text-lightred">${state.label}</span>, ` +
                              `this target gets <span class="text-green">${changes}</span>.`,
                          }}
                        />
                      );
                    })}
                  </ul>
                </div>
              ) : null}

              <label className="ml-auto flex items-center">
                <span className="mr-4 text-h6 text-lightgold">Level</span>
                <input
                  className="w-16 p-2 text-right textinput-common font-bold"
                  value={target.level}
                  onChange={onChangeTargetProp("level")}
                />
              </label>
            </div>

            <div className="mt-4 bg-default rounded text-black flex flex-col overflow-auto">
              <button
                className="px-2 pt-1 w-full rounded-t text-lg font-bold flex items-center"
                onClick={() => setMonsterListOn((prev) => !prev)}
              >
                <span className="pr-2 truncate">{title}</span>
                <FaChevronDown className="ml-auto" />
              </button>

              <div
                id="monster-list"
                className={cn(
                  "flex flex-col custom-scrollbar rounded-b duration-200 ease-in-out",
                  monsterListOn && "grow"
                )}
                style={{ maxHeight: monsterListOn ? `${monsters.length * 2}rem` : 0 }}
              >
                {monsters.map((monster, i) => {
                  return (
                    <button
                      key={monster.code}
                      className={cn(
                        "text-black flex justify-between cursor-default group font-medium",
                        monster.code === chosenMonster.code
                          ? "bg-lesser"
                          : "hover:bg-blue-600 hover:text-default hover:font-bold"
                      )}
                      onClick={() => onClickMonster(monster)}
                    >
                      <p className="px-2 py-1 text-left flex flex-col">
                        <span>{monster.title}</span>
                        {monster.subtitle && (
                          <span className="text-sm italic">{monster.subtitle}</span>
                        )}
                      </p>
                      {monster.names && (
                        <span
                          className="h-full px-2 flex items-center text-xl"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDetailsIndex(i);
                          }}
                        >
                          <FaInfoCircle />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <button className="h-1 rounded-b" onClick={() => setMonsterListOn(true)} />
            </div>

            {variant?.types.length && variantType ? (
              <div className="mt-4 flex justify-end items-center">
                <p className="mr-4 text-default">Variant</p>

                <select
                  className={twInputStyles.select + " capitalize"}
                  value={variantType}
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

            {monsters[detailsIndex]?.names ? (
              <p className="mt-3 text-default">
                <span className="text-lightred">{monsters[detailsIndex].title}</span>:{" "}
                {monsters[detailsIndex].names?.join(", ")}
              </p>
            ) : null}
          </div>

          <Button className="mt-3 mr-auto" variant="positive" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="mx-4" />

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
                    {t(attElmt, { ns: "resistance" })}
                  </p>
                  <input
                    className="w-20 p-2 text-right textinput-common font-bold disabled:bg-lesser"
                    disabled={chosenMonster.code !== 0}
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
