import type {
  CalcArtPiece,
  CalcArtSet,
  CalcChar,
  CalcSetup,
  CalculatorState,
  CalcWeapon,
  CharInfo,
  ModifierCtrl,
  Monster,
  DatabaseArt,
  DatabaseWp,
  SubArtModCtrl,
  SubWeaponBuffCtrl,
  Target,
  Weapon,
} from "@Src/types";
import { findById } from "@Src/utils";
import { findArtifactSet, findCharacter, findWeapon } from "@Data/controllers";
import { ATTACK_ELEMENTS, EModAffect } from "@Src/constants";
import artifacts from "@Data/artifacts";
import calculateAll from "@Src/calculators";
import type { PickedChar } from "./reducer-types";
import { initCharInfo, initWeapon } from "./initiators";
import monsters from "@Data/monsters";
import weapons from "@Data/weapons";

export function calculate(state: CalculatorState, all?: boolean) {
  try {
    const indexes = all ? [...Array(state.setups.length).keys()] : [state.currentIndex];

    for (const i of indexes) {
      const char = getCharAtSetup(state.char, i);

      if (!char) {
        throw new Error(`Character ${state.char.name} not found`);
      }
      const results = calculateAll(
        char,
        state.charData,
        state.allSelfBuffCtrls[i],
        state.allSelfDebuffCtrls[i],
        state.allParties[i],
        state.allWeapons[i],
        state.allWpBuffCtrls[i],
        state.allSubWpComplexBuffCtrls[i],
        state.allArtInfos[i],
        state.allArtBuffCtrls[i],
        state.allSubArtBuffCtrls[i],
        state.allSubArtDebuffCtrls[i],
        state.allElmtModCtrls[i],
        state.allCustomBuffCtrls[i],
        state.allCustomDebuffCtrls[i],
        state.target
      );
      state.allFinalInfusion[i] = results[0];
      state.allTotalAttrs[i] = results[1];
      state.allRxnBonuses[i] = results[4];
      state.allArtAttrs[i] = results[5];
      state.allDmgResult[i] = results[6];
    }
  } catch (err) {
    console.log(err);
    state.isError = true;
  }
}

export function parseAndInitData(
  { name, weaponID, artifactIDs = [null, null, null, null, null], ...info }: PickedChar,
  myWps: DatabaseWp[],
  myArts: DatabaseArt[]
) {
  let rootID = Date.now();
  const char: CharInfo = { ...initCharInfo(info), name };

  let weapon: CalcWeapon;
  let wpBuffCtrls: ModifierCtrl[];
  const existedWp = findById(myWps, weaponID);

  if (existedWp) {
    const { user, ...weaponInfo } = existedWp;
    weapon = weaponInfo;
    wpBuffCtrls = getMainWpBuffCtrls(existedWp);
  } //
  else {
    const newWp = initWeapon({ type: findCharacter(char)!.weapon });
    weapon = { ...newWp, ID: rootID++ };
    wpBuffCtrls = getMainWpBuffCtrls(newWp);
  }

  const pieces = artifactIDs.map((id) => {
    const artPiece = findById(myArts, id);
    if (artPiece) {
      const { user, ...info } = artPiece;
      return info;
    }
    return null;
  });
  const sets = getArtifactSets(pieces);
  const setCode = sets[0]?.bonusLv === 1 ? sets[0].code : null;

  return {
    char,
    weapon,
    wpBuffCtrls,
    artInfo: { pieces, sets },
    artBuffCtrls: getMainArtBuffCtrls(setCode),
    subArtBuffCtrls: getAllSubArtBuffCtrls(setCode),
    subArtDebuffCtrls: getAllSubArtDebuffCtrls(),
  } as const;
}

export function getMainWpBuffCtrls(weapon: { type: Weapon; code: number }) {
  const result: ModifierCtrl[] = [];
  const { buffs } = findWeapon(weapon)!;

  if (buffs) {
    for (const buff of buffs) {
      if (buff.outdated || buff.affect === EModAffect.TEAMMATE) {
        continue;
      }
      const node: ModifierCtrl = {
        activated: false,
        index: buff.index,
      };

      if (buff.inputConfig) {
        node.inputs = [...buff.inputConfig.initialValues];
      }
      result.push(node);
    }
  }
  return result;
}

export function getSubWeaponBuffCtrls(weapon: { type: Weapon; code: number }) {
  const buffCtrls: SubWeaponBuffCtrl[] = [];
  const weaponData = findWeapon(weapon);

  if (weaponData && weaponData.buffs) {
    for (const buff of weaponData.buffs) {
      if (buff.outdated || buff.affect === "self") {
        continue;
      }
      const node: SubWeaponBuffCtrl = {
        code: weapon.code,
        activated: false,
        refi: 1,
        index: buff.index,
      };
      if (buff.inputConfig) {
        const { initialValues, renderTypes } = buff.inputConfig;
        node.inputs = [];

        renderTypes.forEach((renderType, j) => {
          if (renderType === "choices") {
            node.inputs!.push(initialValues[j]);
          }
        });
      }
      buffCtrls.push(node);
    }
  }
  return buffCtrls;
}

export function getSubWeaponComplexBuffCtrls(type: Weapon, mainWpCode: number) {
  const result = [];
  for (const weapon of weapons[type]) {
    if (weapon.code !== mainWpCode) {
      result.push(...getSubWeaponBuffCtrls({ type, code: weapon.code }));
    }
  }
  return result;
}

export function getArtifactSets(pieces: (CalcArtPiece | null)[] = []): CalcArtSet[] {
  const sets = [];
  const count: Record<number, number> = {};

  for (const artP of pieces) {
    if (artP) {
      const { code } = artP;
      count[code] = (count[code] || 0) + 1;

      if (count[code] === 2) {
        sets.push({ code, bonusLv: 0 });
      } else if (count[code] === 4) {
        sets[0].bonusLv = 1;
      }
    }
  }
  return sets;
}

export function getMainArtBuffCtrls(code: number | null) {
  if (!code) {
    return [];
  }
  const result: ModifierCtrl[] = [];
  const { buffs } = findArtifactSet({ code })!;

  if (buffs) {
    buffs.forEach((buff, index) => {
      if (buff.affect !== EModAffect.TEAMMATE) {
        const node: ModifierCtrl = {
          activated: false,
          index,
        };

        if (buff.inputConfig) {
          node.inputs = [...buff.inputConfig.initialValues];
        }
        result.push(node);
      }
    });
  }
  return result;
}

export function getSubArtBuffCtrls(code: number) {
  const result: SubArtModCtrl[] = [];
  const { buffs } = findArtifactSet({ code })!;

  if (buffs) {
    buffs.forEach((buff, index) => {
      if (buff.affect !== EModAffect.SELF) {
        const node: SubArtModCtrl = {
          code,
          activated: false,
          index,
        };

        if (buff.inputConfig) {
          node.inputs = [...buff.inputConfig.initialValues];
        }
        result.push(node);
      }
    });
  }
  return result;
}

export function getAllSubArtBuffCtrls(mainCode: number | null) {
  const result: SubArtModCtrl[] = [];
  for (const { code } of artifacts) {
    if (code !== mainCode) {
      result.push(...getSubArtBuffCtrls(code));
    }
  }
  return result;
}

export function getAllSubArtDebuffCtrls(): SubArtModCtrl[] {
  return [{ code: 15, activated: false, index: 0, inputs: ["pyro"] }];
}

export function autoModifyTarget(target: Target, monster: Monster) {
  const { index, variantIndex, configs } = monster;
  const { resistance, variant, changeResistance } = monsters[index];
  const { base, ...otherResistances } = resistance;

  for (const key of ATTACK_ELEMENTS) {
    const overwriteValue = otherResistances[key];
    target[key] = overwriteValue || base;
  }
  if (changeResistance) {
    changeResistance({
      target,
      variant: variant && variantIndex ? variant.options[variantIndex] : undefined,
      configs,
    });
  }
}

function isCharInfo(info: CalcChar): info is CharInfo {
  return !Array.isArray(info?.level);
}

export function getCharAtSetup(char: CalcChar, index: number) {
  if (!char) {
    return null;
  }
  if (isCharInfo(char)) {
    return char;
  }
  return {
    name: char.name,
    level: char.level[index],
    NAs: char.NAs[index],
    ES: char.ES[index],
    EB: char.EB[index],
    cons: char.cons[index],
  };
}

export const getSetupInfo = ({
  name = "Setup 1",
  ID = Date.now(),
  type = "original",
}: Partial<CalcSetup>): CalcSetup => ({ name, ID, type });
