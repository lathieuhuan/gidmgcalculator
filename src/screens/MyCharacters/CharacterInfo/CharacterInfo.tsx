import { memo, useState } from "react";
import { FaUserSlash } from "react-icons/fa";
import { createSelector } from "@reduxjs/toolkit";

import type { Level } from "@Src/types";
import { LEVELS } from "@Src/constants";
import { useAppCharacter } from "@Src/hooks";

// Store
import { useDispatch, useSelector } from "@Store/hooks";
import { removeUserCharacter, updateUserCharacter } from "@Store/userDatabaseSlice";
import { selectChosenChar, selectUserArts, selectUserChars, selectUserWps } from "@Store/userDatabaseSlice/selectors";

// Util
import { getCalculationStats } from "@Src/calculation";
import { findById, findByName, getImgSrc } from "@Src/utils";

// Component
import { Button, ConfirmModal, LoadingIcon, RarityStars } from "@Src/pure-components";
import { AttributeTable, TalentList, ConstellationList } from "@Src/components";
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

const CharacterInfo = () => {
  const dispatch = useDispatch();
  const { char, weapon, artifacts } = useSelector(selectChosenInfo);
  const { isLoading, error, appChar } = useAppCharacter(char.name);

  const [removing, setRemoving] = useState(false);

  if (isLoading || error) {
    return (
      <div
        className="py-4 flex h-98/100 space-x-2 overflow-auto"
        style={{ width: window.innerWidth <= 480 ? "calc(100% - 2rem)" : "88%" }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 rounded-lg bg-dark-900 shrink-0" style={{ width: 332 }}>
            {error ? (
              <p className="text-center text-red-100">{error}</p>
            ) : (
              <div className="w-full h-full flex-center">
                <LoadingIcon />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (!appChar || !weapon) {
    return null;
  }
  const { name, icon, rarity, vision: elementType } = appChar;

  const { totalAttr, artAttr } = getCalculationStats({
    char,
    appChar,
    weapon,
    artifacts,
  });
  const isMobile = window.innerWidth <= 700;

  return (
    <div
      className="py-4 flex h-98/100 space-x-2 overflow-auto"
      style={{ width: window.innerWidth <= 480 ? "calc(100% - 2rem)" : "88%" }}
    >
      <div className="p-4 rounded-lg bg-dark-900 flex flex-col relative">
        <Button
          className="absolute top-4 right-4 hover:text-red-600"
          boneOnly
          icon={<FaUserSlash />}
          onClick={() => setRemoving(true)}
        />

        <div className="flex" onDoubleClick={() => console.log(char, weapon, artifacts)}>
          {isMobile && <img className="mr-4 mb-4 w-20" src={getImgSrc(icon)} alt={name} />}
          <div>
            {!isMobile && <p className={`text-2.5xl text-${elementType} font-black`}>{name}</p>}
            <RarityStars className="mt-1" rarity={rarity} />

            <div className="mt-1 flex text-lg">
              <p className="mr-1">Level</p>
              <select
                className={`text-right text-last-right text-${elementType} font-semibold`}
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

        <div className="mt-1 grow w-75 h-0 custom-scrollbar">
          <AttributeTable attributes={totalAttr} />
        </div>
      </div>

      <Gears weapon={weapon} artifacts={artifacts} artAttr={artAttr} />

      <div className="p-4 rounded-lg bg-dark-900">
        <div className="h-full w-75">
          <ConstellationList
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

      <div className="p-4 rounded-lg bg-dark-900">
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

      <ConfirmModal
        active={removing}
        message={
          <>
            Remove <b>{name}</b>?
          </>
        }
        focusConfirm
        onConfirm={() => dispatch(removeUserCharacter(name))}
        onClose={() => setRemoving(false)}
      />
    </div>
  );
};

export default memo(CharacterInfo);
