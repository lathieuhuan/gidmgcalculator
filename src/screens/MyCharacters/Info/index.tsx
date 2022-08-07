import { useState } from "react";
import { FaUserSlash } from "react-icons/fa";
import { createSelector } from "@reduxjs/toolkit";

import type { Level } from "@Src/types";
import { LEVELS } from "@Src/constants";
import getBaseStats from "@Src/calculators/baseStats";
import { findById, findByName, wikiImg } from "@Src/utils";
import { findCharacter } from "@Data/controllers";

import { useDispatch, useSelector } from "@Store/hooks";
import {
  changeUsersCharConsLevel,
  changeUsersCharTalentLevel,
  levelUsersChar,
  removeUsersChar,
} from "@Store/usersDatabaseSlice";
import {
  selectChosenChar,
  selectMyArts,
  selectMyChars,
  selectMyWps,
} from "@Store/usersDatabaseSlice/selectors";
import { getArtifactSets } from "@Store/calculatorSlice/utils";

import { ConsList, TalentList } from "@Components/ability";
import { StarLine } from "@Components/minors";
import { AttributeTable } from "@Components/AttributeTable";
import { ConfirmModal } from "@Components/modals";
import { IconButton, Select } from "@Src/styled-components";
import Gears from "./Gears";

const selectChosenInfo = createSelector(
  selectMyChars,
  selectMyWps,
  selectMyArts,
  selectChosenChar,
  (myChars, myWps, myArts, chosen) => {
    const { weaponID, artifactIDs, ...char } = findByName(myChars, chosen)!;
    const pieces = artifactIDs.map((ID) => (ID ? findById(myArts, ID)! : null));
    const art = { pieces, sets: getArtifactSets(pieces) };
    return [char, findById(myWps, weaponID), art] as const;
  }
);

export default function Info() {
  const [removing, setRemoving] = useState(false);
  const [char, wpInfo, artInfo] = useSelector(selectChosenInfo);
  const dispatch = useDispatch();

  const dataChar = findCharacter(char);
  if (!dataChar || !wpInfo) {
    return null;
  }
  const { code, beta, name, rarity, nation, vision, weapon, icon } = dataChar;

  const [totalAttr, artAttrs] = getBaseStats(
    {
      code,
      name,
      nation,
      vision,
      weapon,
      EBcost: dataChar.activeTalents.EB.energyCost,
    },
    char,
    wpInfo,
    artInfo
  );
  const isMobile = window.innerWidth <= 700;

  return (
    <div
      className="py-4 flex h-98/100 overflow-auto"
      style={{ width: window.innerWidth <= 480 ? "calc(100% - 2rem)" : "88%" }}
    >
      <div className="p-4 rounded-lg bg-darkblue-1 flex flex-col relative">
        <IconButton
          className="absolute top-4 right-4"
          variant="negative"
          onClick={() => setRemoving(true)}
        >
          <FaUserSlash size="1.125rem" />
        </IconButton>

        <div className="pb-1 flex">
          {isMobile && (
            <img
              className="mr-4 mb-4"
              width="4.875rem"
              src={beta ? icon : wikiImg(icon)}
              alt={name}
            />
          )}
          <div>
            {!isMobile && <p className={`text-h1 text-${vision} font-black`}>{name}</p>}
            <StarLine rarity={rarity} />

            <div className="ml-1 my-1 flex">
              <p className="mr-1 text-h5">Level</p>
              <Select
                className={`text-right text-last-right text-xl text-${vision} font-bold`}
                value={char.level}
                onChange={(e) => dispatch(levelUsersChar({ name, level: e.target.value as Level }))}
              >
                {LEVELS.map((lv, i) => (
                  <option key={i}>{lv}</option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        <div className="grow w-75 h-0 custom-scrollbar">
          <AttributeTable attributes={totalAttr} />
        </div>
      </div>

      {/* <Gears wpInfo={wpInfo} artInfo={artInfo} artAttrs={artAttrs} /> */}

      <div className="ml-2 p-4 rounded-lg bg-darkblue-1">
        <div className="h-full w-75">
          <ConsList
            char={char}
            onClickIcon={(consIndex) => {
              dispatch(changeUsersCharConsLevel({ name: char.name, consIndex }));
            }}
          />
        </div>
      </div>

      <div className="ml-2 p-4 rounded-lg bg-darkblue-1">
        <div className="h-full w-75">
          <TalentList
            char={char}
            onChangeLevelOf={(type) => (level) => {
              dispatch(changeUsersCharTalentLevel({ name: char.name, type, level }));
            }}
          />
        </div>
      </div>

      {removing && (
        <ConfirmModal
          message={
            <>
              Remove <b>{name}</b>?
            </>
          }
          right={{ onClick: () => dispatch(removeUsersChar(name)) }}
          onClose={() => setRemoving(false)}
        />
      )}
    </div>
  );
}
