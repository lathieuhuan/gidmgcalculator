import type {
  ArtifactMainStatType,
  ArtifactSubStat,
  ArtifactSubStatType,
  Level,
  UserArtifact,
  UserCharacter,
  UserWeapon,
} from "@Src/types";

import characters from "@Data/characters";
import weapons from "@Data/weapons";
import artifacts from "@Data/artifacts";
import { findDataCharacter } from "@Data/controllers";
import { ARTIFACT_TYPES, DEFAULT_WEAPON_CODE } from "@Src/constants";
import { createWeapon } from "../creators";
import { findByName } from "../pure-utils";
import { mapGoodFormat } from "./constants";

const convertLevel = (level: any, ascension: any) => {
  return `${level}/${ascension ? ascension * 10 + 30 : 20}` as Level;
};

const uppercaseFirstLetter = (word: any): string => {
  return word[0].toUpperCase() + word.slice(1);
};

const convertName = (str: any) => {
  return str.replace(/'|"|-/g, "").split(" ").map(uppercaseFirstLetter).join("");
};

const searchCharacterByKey = (key: any) => {
  if (!key) return undefined;

  for (const { name, GOOD } of Object.values(characters)) {
    if (name === key || GOOD === key) {
      return name;
    }
  }
  return undefined;
};

const searchWeaponByKey = (key: any) => {
  for (const type in weapons) {
    const weaponType = type as keyof typeof weapons;

    for (const wp of weapons[weaponType]) {
      if (key === convertName(wp.name)) {
        return {
          code: wp.code,
          type: weaponType,
        };
      }
    }
  }
  return undefined;
};

const searchArtifactByKey = (key: any) => {
  for (const { name, code } of artifacts) {
    if (key === convertName(name)) {
      return code;
    }
  }
  return undefined;
};

type Result = {
  version: number;
  characters: UserCharacter[];
  weapons: UserWeapon[];
  artifacts: UserArtifact[];
};

export function convertFromGoodFormat(data: any) {
  const result: Result = {
    version: 3,
    characters: [],
    weapons: [],
    artifacts: [],
  };
  let seedID = Date.now();

  for (const char of data.characters || []) {
    let name;

    if (char.key === "Traveler" && char.elementKey) {
      name = uppercaseFirstLetter(char.elementKey) + " Traveler";
    } else {
      name = searchCharacterByKey(char.key);
    }

    if (!name) continue;

    const { ascension, talent } = char;
    const charInfo: UserCharacter = {
      name,
      level: convertLevel(char.level, ascension),
      NAs: talent.auto,
      ES: talent.skill,
      EB: talent.burst,
      cons: char.constellation,
      weaponID: 0,
      artifactIDs: [null, null, null, null, null],
    };

    result.characters.push(charInfo);
  }

  for (const artifact of data.artifacts || []) {
    const { rarity, slotKey, level } = artifact;
    const code = searchArtifactByKey(artifact.setKey);

    if (!code || (rarity !== 4 && rarity !== 5)) continue;

    let mainStatType: ArtifactMainStatType =
      slotKey === "flower" ? "hp" : slotKey === "plume" ? "atk" : "atk_";
    const subStats: ArtifactSubStat[] = [];
    const owner = searchCharacterByKey(artifact.location) || null;

    if (artifact.mainStatKey && artifact.mainStatKey in mapGoodFormat) {
      mainStatType = mapGoodFormat[artifact.mainStatKey] as ArtifactMainStatType;
    }

    for (const { key, value } of artifact.substats) {
      let type: ArtifactSubStatType = "atk";

      if (key && key in mapGoodFormat) {
        type = mapGoodFormat[key] as ArtifactSubStatType;
      }
      subStats.push({ type, value });
    }
    const artifactID = seedID++;
    const newArtifact: UserArtifact = {
      ID: artifactID,
      type: slotKey,
      rarity,
      level,
      mainStatType,
      subStats,
      owner,
      code,
    };

    result.artifacts.push(newArtifact);

    if (owner) {
      const character = findByName(result.characters, owner);

      if (character) {
        character.artifactIDs[ARTIFACT_TYPES.indexOf(slotKey)] = artifactID;
      }
    }
  }

  for (const weapon of data.weapons || []) {
    const { code = 0, type = "sword" } = searchWeaponByKey(weapon.key) || {};
    const owner = searchCharacterByKey(weapon.location) || null;

    if (!code || (DEFAULT_WEAPON_CODE[type] === code && !owner)) continue;

    const weaponID = seedID++;
    const newWeapon: UserWeapon = {
      ID: weaponID,
      type,
      level: convertLevel(weapon.level, weapon.ascension),
      refi: weapon.refinement,
      owner,
      code,
    };
    result.weapons.push(newWeapon);

    if (owner) {
      const character = findByName(result.characters, owner);

      if (character) {
        character.weaponID = weaponID;
      }
    }
  }

  for (const char of result.characters) {
    if (!char.weaponID) {
      const { weaponType } = findDataCharacter(char)! || {};
      const weaponID = seedID++;
      const newWeapon = createWeapon({ type: weaponType });

      result.weapons.unshift({
        ID: weaponID,
        ...newWeapon,
        owner: char.name,
      });

      char.weaponID = weaponID;
    }
  }

  console.log(result.artifacts);

  return result;
}