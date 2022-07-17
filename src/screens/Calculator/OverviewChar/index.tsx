import cn from "classnames";
import { useState } from "react";
import { FaSyncAlt } from "react-icons/fa";

import characters from "@Data/characters";
import { findCharacter } from "@Data/controllers";

import { levelCalcChar } from "@Store/calculatorSlice";
import { selectChar, selectCharData } from "@Store/calculatorSlice/selectors";
import { useDispatch, useSelector } from "@Store/hooks";
import { startCalculation } from "@Store/thunks";

import { BetaMark, StarLine } from "@Components/minors";
import Picker from "@Components/Picker";
import { Button, IconButton, Select } from "@Styled/Inputs";
import { colorByVision } from "@Styled/tw-compounds";

import type { Level } from "@Src/types";
import { LEVELS } from "@Src/constants";
import { findByName, wikiImg } from "@Src/utils";

import { MainSelect } from "../components";
import styles from "../styles.module.scss";
import contentByTab from "./content";

export default function OverviewChar() {
  const [pickerOn, setPickerOn] = useState(false);
  const [tab, setTab] = useState("Attributes");

  const char = useSelector(selectChar)!;
  const charData = useSelector(selectCharData);
  const touched = useSelector((state) => state.calculator.touched);
  const dispatch = useDispatch();

  if (!touched) {
    return (
      <div className={cn("px-4 py-3 flex flex-col bg-darkblue-1", styles.card)}>
        <Button className="mx-auto" variant="positive" onClick={() => setPickerOn(true)}>
          Choose a Character
        </Button>
        {pickerOn && <CharPicker close={() => setPickerOn(false)} />}
      </div>
    );
  }
  const Content = contentByTab[tab];
  const { beta, icon, vision, rarity } = findCharacter(charData)!;

  return (
    <div className={cn("px-4 py-3 flex flex-col bg-darkblue-1", styles.card)}>
      <div className="mt-2 pb-4 flex">
        <div className="mr-3 relative" onClick={() => setPickerOn(true)}>
          <IconButton className="absolute -top-2.5 left-2.5 z-10 text-xl" variant="positive">
            <FaSyncAlt />
          </IconButton>

          {beta && <BetaMark className="absolute -top-2 -right-2 z-10" />}
          <img
            className="w-24 cursor-pointer"
            src={wikiImg(icon)}
            alt={char.name}
            draggable={false}
          />
        </div>

        <div className="overflow-hidden">
          <p className={cn("text-h1 truncate", colorByVision[vision])}>{char.name}</p>
          <StarLine className="mt-1" rarity={rarity} />
          <div className="mt-1 flex">
            <p className="mr-1 text-h6">Level</p>
            <Select
              className={cn("text-lg font-bold text-last-right", colorByVision[vision])}
              value={char.level}
              onChange={(e) => dispatch(levelCalcChar(e.target.value as Level))}
            >
              {LEVELS.map((lv) => (
                <option key={lv}>{lv}</option>
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
      {Content && <Content />}

      {pickerOn && <CharPicker close={() => setPickerOn(false)} />}
    </div>
  );
}

function CharPicker({ close }: { close: () => void }) {
  const myChars = useSelector((state) => state.database.myChars);
  const dispatch = useDispatch();

  const mixedList = [];
  for (const { name, code, beta, icon, rarity, vision, weapon } of characters) {
    const char = { code, beta, icon, rarity, vision, weapon };
    const existedChar = findByName(myChars, name);

    if (existedChar) {
      mixedList.push({ ...existedChar, ...char });
    } else {
      mixedList.push({ name, ...char });
    }
  }
  return (
    <Picker
      data={mixedList}
      dataType="character"
      close={close}
      onPickItem={(pickedChar) => dispatch(startCalculation(pickedChar))}
    />
  );
}
