import { useState } from "react";
import { FaSyncAlt } from "react-icons/fa";

import { findCharacter } from "@Data/controllers";

import { updateCharacter } from "@Store/calculatorSlice";
import { selectChar, selectCharData } from "@Store/calculatorSlice/selectors";
import { useDispatch, useSelector } from "@Store/hooks";

import { BetaMark, StarLine } from "@Components/minors";
import { IconButton, Select } from "@Src/styled-components";
import contentByTab from "./content";

import type { Level } from "@Src/types";
import { LEVELS } from "@Src/constants";
import { wikiImg } from "@Src/utils";
import { ComplexSelect } from "@Components/ComplexSelect";

interface OverviewCharProps {
  onClickCharImg: () => void;
}
export default function OverviewChar({ onClickCharImg }: OverviewCharProps) {
  const dispatch = useDispatch();
  const char = useSelector(selectChar)!;
  const charData = useSelector(selectCharData);

  const [activeTab, setActiveTab] = useState("Attributes");

  const Content = contentByTab[activeTab];
  const { beta, icon, vision, rarity } = findCharacter(charData)!;

  return (
    <div className="h-full flex flex-col">
      <div className="mt-2 pb-4 flex">
        <div className="mr-4 relative" onClick={onClickCharImg}>
          <IconButton className="absolute -top-2.5 -left-2.5 z-10 text-xl" variant="positive">
            <FaSyncAlt />
          </IconButton>

          {beta && <BetaMark className="absolute -top-2 -right-2 z-10" />}
          <img
            className="w-24 cursor-pointer"
            src={beta ? icon : wikiImg(icon)}
            alt={char.name}
            draggable={false}
          />
        </div>

        <div className="overflow-hidden">
          <p className={`text-h1 truncate text-${vision} font-black`}>{char.name}</p>
          <StarLine className="mt-1" rarity={rarity} />
          <div className="mt-1 flex items-center">
            <p className="mr-1 text-h6">Level</p>
            <Select
              className={`text-lg text-${vision} font-bold text-last-right`}
              value={char.level}
              onChange={(e) => dispatch(updateCharacter({ level: e.target.value as Level }))}
            >
              {LEVELS.map((lv) => (
                <option key={lv} className="text-black">
                  {lv}
                </option>
              ))}
            </Select>
            <p
              className={`ml-2 px-3 pt-2 pb-1.5 flex-center rounded-lg bg-darkblue-2 text-${vision} leading-none font-bold cursor-default`}
            >
              <span>C{char.cons}</span>
            </p>
          </div>
        </div>
      </div>

      <ComplexSelect
        selectId="character-overview-select"
        value={activeTab}
        options={[
          { label: "Attributes", value: "Attributes" },
          { label: "Weapon", value: "Weapon" },
          { label: "Artifacts", value: "Artifacts" },
          { label: "Constellation", value: "Constellation" },
          { label: "Talents", value: "Talents" },
        ]}
        onChange={(newTab) => setActiveTab(newTab.toString())}
      />

      <div className="mt-3 grow hide-scrollbar">{Content && <Content />}</div>
    </div>
  );
}
