import { useState } from "react";
import { FaSyncAlt } from "react-icons/fa";

import { findCharacter } from "@Data/controllers";

import { levelCalcChar } from "@Store/calculatorSlice";
import { selectChar, selectCharData } from "@Store/calculatorSlice/selectors";
import { useDispatch, useSelector } from "@Store/hooks";

import { BetaMark, StarLine } from "@Components/minors";
import { IconButton, Select } from "@Src/styled-components";
import { MainSelect } from "../components";
import contentByTab from "./content";

import type { Level } from "@Src/types";
import { LEVELS } from "@Src/constants";
import { wikiImg } from "@Src/utils";

interface OverviewCharProps {
  onClickCharImg: () => void;
}
export default function OverviewChar({ onClickCharImg }: OverviewCharProps) {
  const [tab, setTab] = useState("Attributes");

  const char = useSelector(selectChar)!;
  const charData = useSelector(selectCharData);
  const dispatch = useDispatch();

  const Content = contentByTab[tab];
  const { beta, icon, vision, rarity } = findCharacter(charData)!;

  return (
    <div className="h-full flex flex-col">
      <div className="mt-2 pb-6 flex">
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
          <div className="mt-1 flex">
            <p className="mr-1 text-h6">Level</p>
            <Select
              className={`text-lg text-${vision} font-bold text-last-right`}
              value={char.level}
              onChange={(e) => dispatch(levelCalcChar(e.target.value as Level))}
            >
              {LEVELS.map((lv) => (
                <option key={lv} className="text-black">
                  {lv}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>
      <MainSelect
        tab={tab}
        onChangeTab={setTab}
        options={["Attributes", "Weapon", "Artifacts", "Constellation", "Talents"]}
      />
      <div className="mt-3 grow hide-scrollbar">{Content && <Content />}</div>
    </div>
  );
}
