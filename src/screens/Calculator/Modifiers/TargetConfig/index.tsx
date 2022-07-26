import cn from "classnames";
import type { ChangeEventHandler } from "react";

import type { Target } from "@Src/types";
import { ATTACK_ELEMENTS } from "@Src/constants";
import { MONSTER_VARIANT_LABELS } from "@Data/monsters/constants";

import { selectCharData, selectFinalInfusion } from "@Store/calculatorSlice/selectors";
import { useDispatch, useSelector } from "@Store/hooks";
import { changeMonster, changeMonsterConfig, modifyTarget } from "@Store/calculatorSlice";

import monsters from "@Data/monsters";
import { findMonster } from "@Data/controllers";

import CollapseList from "@Components/Collapse";
import { InfusionNotes } from "@Components/minors";
import { Checkbox, Select, colorByVision, linkStyles } from "@Src/styled-components";

export default function TargetConfig() {
  const target = useSelector((state) => state.calculator.target);
  const monster = useSelector((state) => state.calculator.monster);
  const infusion = useSelector(selectFinalInfusion);
  const { weapon, vision } = useSelector(selectCharData);

  const dispatch = useDispatch();

  const monsterData = findMonster(monster);

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
        <div className="mb-4 flex justify-end items-center">
          {labelIndex && <p className="mr-4">{MONSTER_VARIANT_LABELS[labelIndex]}</p>}

          <Select>
            {options.map((opt, i) => {
              return <option key={i}>{opt}</option>;
            })}
          </Select>
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
          <div className="mb-4 flex justify-end items-center">
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
    <div>
      <div className="mt-2 px-4">
        <div className="mb-4 flex justify-between items-center">
          <p className="text-h6 text-lightgold">Level</p>
          <input value={target.level} onChange={onChangeTargetProp("level")} />
        </div>

        {monsterData && (
          <Select
            className="mb-4 p-1 rounded bg-white font-bold"
            value={monsterData.name}
            onChange={(e) => dispatch(changeMonster(e.target.selectedIndex))}
          >
            {monsters.map(({ name }, i) => (
              <option key={i}>{name}</option>
            ))}
          </Select>
        )}

        {renderVariant()}
        {renderConfig()}
      </div>

      <CollapseList
        headingList={["Resistances"]}
        contentList={[
          <div className="pt-4 px-4">
            {ATTACK_ELEMENTS.map((attElmt) => {
              return (
                <div key={attElmt} className="mb-4 flex justify-between items-center">
                  <p
                    className={cn(
                      "text-h6",
                      attElmt === "phys" ? "text-white" : colorByVision[attElmt]
                    )}
                  >
                    {attElmt}
                  </p>
                  <input value={target[attElmt]} onChange={onChangeTargetProp(attElmt)} />
                </div>
              );
            })}

            <p>
              You can search for your target's Resistances on{" "}
              <a
                className={linkStyles}
                href="https://genshin-impact.fandom.com/wiki/Resistance#Base_Enemy_Resistances"
                rel="noreferrer"
                target="_blank"
              >
                this page of the Genshin Impact Wiki
              </a>
              .
            </p>
          </div>,
        ]}
      />
      <InfusionNotes infusion={infusion} weapon={weapon} vision={vision} />
    </div>
  );
}
