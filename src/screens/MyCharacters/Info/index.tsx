import { useState } from "react";
import { FaUserSlash } from "react-icons/fa";
import { createSelector } from "@reduxjs/toolkit";

import type { Level } from "@Src/types";
import { LEVELS } from "@Src/constants";
import getBaseStats from "@Calculators/baseStats";
import { findById, findByName, getImgSrc } from "@Src/utils";
import { findCharacter } from "@Data/controllers";

import { useDispatch, useSelector } from "@Store/hooks";
import { removeUsersCharacter, updateUsersCharacter } from "@Store/usersDatabaseSlice";
import {
  selectChosenChar,
  selectMyArts,
  selectMyChars,
  selectMyWps,
} from "@Store/usersDatabaseSlice/selectors";
import { getArtifactSets } from "@Store/calculatorSlice/utils";

import { ConsList, TalentList } from "@Components/ability";
import { ConfirmTemplate, StarLine } from "@Components/minors";
import { AttributeTable } from "@Components/AttributeTable";
import { Modal } from "@Components/modals";
import { IconButton, Select } from "@Src/styled-components";
import Gears from "./Gears";
import { ArtifactInfo } from "./types";

const selectChosenInfo = createSelector(
  selectMyChars,
  selectMyWps,
  selectMyArts,
  selectChosenChar,
  (myChars, myWps, myArts, chosen) => {
    const { weaponID, artifactIDs, ...char } = findByName(myChars, chosen)!;
    const pieces = artifactIDs.map((ID) => (ID ? findById(myArts, ID)! : null));
    const artInfo: ArtifactInfo = {
      pieces,
      sets: getArtifactSets(pieces),
    };
    return [char, findById(myWps, weaponID), artInfo] as const;
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
  const { code, name, icon, rarity, nation, vision, weapon } = dataChar;

  const { totalAttr, artAttr } = getBaseStats({
    char,
    charData: {
      code,
      name,
      icon,
      nation,
      vision,
      weapon,
      EBcost: dataChar.activeTalents.EB.energyCost,
    },
    weapon: wpInfo,
    artifact: artInfo,
  });
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

        <div className="flex">
          {isMobile && <img className="mr-4 mb-4 w-20" src={getImgSrc(icon)} alt={name} />}
          <div>
            {!isMobile && <p className={`text-3xl text-${vision} font-black`}>{name}</p>}
            <StarLine rarity={rarity} />

            <div className="ml-1 my-1 flex">
              <p className="mr-1 text-h5">Level</p>
              <Select
                className={`text-right text-last-right text-xl text-${vision} font-bold`}
                value={char.level}
                onChange={(e) =>
                  dispatch(updateUsersCharacter({ name, level: e.target.value as Level }))
                }
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

      <Gears wpInfo={wpInfo} artInfo={artInfo} artAttr={artAttr} />

      <div className="ml-2 p-4 rounded-lg bg-darkblue-1">
        <div className="h-full w-75">
          <ConsList
            char={char}
            onClickIcon={(i) => {
              dispatch(
                updateUsersCharacter({
                  name: char.name,
                  cons: char.cons === i + 1 ? i : i + 1,
                })
              );
            }}
          />
        </div>
      </div>

      <div className="ml-2 p-4 rounded-lg bg-darkblue-1">
        <div className="h-full w-75">
          <TalentList
            char={char}
            onChangeLevelOf={(type) => (level) => {
              dispatch(updateUsersCharacter({ name: char.name, [type]: level }));
            }}
          />
        </div>
      </div>

      <Modal active={removing} className="small-modal" onClose={() => setRemoving(false)}>
        <ConfirmTemplate
          message={
            <>
              Remove <b>{name}</b>?
            </>
          }
          right={{ onClick: () => dispatch(removeUsersCharacter(name)) }}
          onClose={() => setRemoving(false)}
        />
      </Modal>
    </div>
  );
}
