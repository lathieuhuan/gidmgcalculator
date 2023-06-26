import { useState } from "react";
import { FaUserSlash } from "react-icons/fa";
import { createSelector } from "@reduxjs/toolkit";

import type { Level } from "@Src/types";
import { LEVELS } from "@Src/constants";

// Store
import { useDispatch, useSelector } from "@Store/hooks";
import { removeUserCharacter, updateUserCharacter } from "@Store/userDatabaseSlice";
import { selectChosenChar, selectUserArts, selectUserChars, selectUserWps } from "@Store/userDatabaseSlice/selectors";

// Util
import getBaseStats from "@Src/calculation/baseStats";
import { findById, findByName, getImgSrc } from "@Src/utils";
import { findDataCharacter } from "@Data/controllers";

// Component
import { IconButton, StarLine, Modal, ConfirmModalBody } from "@Src/pure-components";
import { AttributeTable, TalentList, ConsList } from "@Src/components";
import Gears from "./Gears";

const selectChosenInfo = createSelector(
  selectUserChars,
  selectUserWps,
  selectUserArts,
  selectChosenChar,
  (userChars, userWps, userArts, chosen) => {
    const { weaponID, artifactIDs, ...char } = findByName(userChars, chosen)!;

    return {
      char,
      weapon: findById(userWps, weaponID),
      artifacts: artifactIDs.map((ID) => (ID ? findById(userArts, ID)! : null)),
    };
  }
);

export default function MyCharacterInfo() {
  const [removing, setRemoving] = useState(false);
  const { char, weapon, artifacts } = useSelector(selectChosenInfo);
  const dispatch = useDispatch();

  const dataChar = findDataCharacter(char);
  if (!dataChar || !weapon) {
    return null;
  }
  const { code, name, icon, rarity, nation, vision } = dataChar;

  const { totalAttr, artAttr } = getBaseStats({
    char,
    charData: {
      code,
      name,
      icon,
      nation,
      vision,
      weaponType: dataChar.weaponType,
      EBcost: dataChar.activeTalents.EB.energyCost,
    },
    weapon,
    artifacts,
  });
  const isMobile = window.innerWidth <= 700;

  return (
    <div
      className="py-4 flex h-98/100 overflow-auto"
      style={{ width: window.innerWidth <= 480 ? "calc(100% - 2rem)" : "88%" }}
    >
      <div className="p-4 rounded-lg bg-darkblue-1 flex flex-col relative">
        <IconButton className="absolute top-4 right-4" variant="negative" onClick={() => setRemoving(true)}>
          <FaUserSlash size="1.125rem" />
        </IconButton>

        <div className="flex" onDoubleClick={() => console.log(char, weapon, artifacts)}>
          {isMobile && <img className="mr-4 mb-4 w-20" src={getImgSrc(icon)} alt={name} />}
          <div>
            {!isMobile && <p className={`text-3xl text-${vision} font-black`}>{name}</p>}
            <StarLine rarity={rarity} />

            <div className="ml-1 my-1 flex text-lg">
              <p className="mr-1">Level</p>
              <select
                className={`text-right text-last-right text-${vision} font-semibold`}
                value={char.level}
                onChange={(e) => dispatch(updateUserCharacter({ name, level: e.target.value as Level }))}
              >
                {LEVELS.map((lv, i) => (
                  <option key={i}>{LEVELS[LEVELS.length - 1 - i]}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grow w-75 h-0 custom-scrollbar">
          <AttributeTable attributes={totalAttr} />
        </div>
      </div>

      <Gears weapon={weapon} artifacts={artifacts} artAttr={artAttr} />

      <div className="ml-2 p-4 rounded-lg bg-darkblue-1">
        <div className="h-full w-75">
          <ConsList
            char={char}
            onClickIcon={(i) => {
              dispatch(
                updateUserCharacter({
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
            key={char.name}
            char={char}
            onChangeTalentLevel={(type, level) => {
              dispatch(updateUserCharacter({ name: char.name, [type]: level }));
            }}
          />
        </div>
      </div>

      <Modal active={removing} className="small-modal" onClose={() => setRemoving(false)}>
        <ConfirmModalBody
          message={
            <>
              Remove <b>{name}</b>?
            </>
          }
          buttons={[undefined, { onClick: () => dispatch(removeUserCharacter(name)) }]}
          onClose={() => setRemoving(false)}
        />
      </Modal>
    </div>
  );
}
