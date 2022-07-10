import type {
  CalcArtInfo,
  CalcArtPiece,
  CalcArtSet,
  CalcChar,
  CalcSetup,
  CalculatorState,
  CalcWeapon,
  CharInfo,
  ModifierCtrl,
  MyArts,
  MyWps,
  SubArtModCtrl,
  Weapon,
} from "@Src/types";
import type { PickedChar } from "./reducer-types";
import { findById } from "@Src/utils";
import { findArtifactSet, findCharacter, findWeapon } from "@Data/controllers";
import { EModAffect } from "@Src/constants";
import artifacts from "@Data/artifacts";
import calculateAll from "@Src/calculators";
import { initCharInfo, initWeapon } from "./initiators";

export function calculate(state: CalculatorState, all: boolean) {
  try {
    const indexes = all ? [...Array(state.setups.length).keys()] : [state.currentSetup];

    for (const i of indexes) {
      const char = getCharAtSetup(state.char, i);

      if (!state.charData || !char) {
        throw new Error("No character's Data / Info");
      }
      const __ = calculateAll(
        char,
        state.charData,
        state.allSelfBuffCtrls[i],
        state.allSelfDebuffCtrls[i],
        state.allParties[i],
        state.allWps[i],
        state.allSubWpComplexBuffCtrls[i],
        state.allArtInfo[i],
        state.allElmtModCtrls[i],
        state.allCustomBuffCtrls[i],
        state.allCustomDebuffCtrls[i],
        state.target
      );
      state.allFinalInfusion[i] = __[0];
      state.allTotalAttrs[i] = __[1];
      state.allRxnBonuses[i] = __[3];
      state.allArtAttrs[i] = __[4];
      state.allDmgResult[i] = __[5];
    }
  } catch (err) {
    console.log(err);
    state.isError = true;
  }
}

export function parseAndInitData(
  { name, weaponID, artifactIDs = [null, null, null, null, null], ...info }: PickedChar,
  myWps: MyWps,
  myArts: MyArts
): [CharInfo, CalcWeapon, CalcArtInfo] {
  //
  let rootID = Date.now();

  const char: CharInfo = { ...initCharInfo(info), name };

  let weapon: CalcWeapon;
  const existedWp = findById(myWps, weaponID);

  if (existedWp) {
    const { user, ...weaponInfo } = existedWp;
    weapon = {
      ...weaponInfo,
      buffCtrls: getMainWpBuffCtrls(existedWp),
    };
  } else {
    const newWp = initWeapon({ type: findCharacter(char)!.weapon });
    weapon = { ...newWp, ID: rootID++, buffCtrls: getMainWpBuffCtrls(newWp) };
  }

  const pieces = artifactIDs.map((id) => {
    const artPiece = findById(myArts, id);
    if (artPiece) {
      const { user, ...info } = artPiece;
      return info;
    }
    return null;
  });
  const sets = getArtSets(pieces);
  const setCode = sets[0]?.bonusLv === 1 ? sets[0].code : null;
  const art: CalcArtInfo = {
    pieces,
    sets,
    buffCtrls: getMainArtBuffCtrls(setCode),
    subBuffCtrls: getAllSubArtBuffCtrls(setCode),
    subDebuffCtrls: getAllSubArtDebuffCtrls(),
  };
  return [char, weapon, art];
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

export function getArtSets(pieces: (CalcArtPiece | null)[] = []): CalcArtSet[] {
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
