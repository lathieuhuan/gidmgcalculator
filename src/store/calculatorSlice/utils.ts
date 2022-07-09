import type {
  CalcArtInfo,
  CalcArtPiece,
  CalcArtSet,
  CalcSetup,
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
import { initCharInfo, initWeapon } from "./initiators";
import { findArtifactSet, findCharacter, findWeapon } from "@Data/controllers";
import { EModAffect } from "@Src/constants";
import artifacts from "@Data/artifacts";

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

export const getSetupInfo = ({
  name = "Setup 1",
  ID = Date.now(),
  type = "original",
}: Partial<CalcSetup>): CalcSetup => ({ name, ID, type });
