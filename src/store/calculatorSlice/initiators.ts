import type {
  CharInfo,
  Rarity,
  WeaponType,
  ArtifactType,
  ModifierCtrl,
  Target,
  CalcArtifact,
  CalcWeapon,
  ElementModCtrl,
  Monster,
  Teammate,
} from "@Src/types";
import { findDataCharacter } from "@Data/controllers";
import {
  ATTACK_ELEMENTS,
  DEFAULT_WEAPON_CODE,
  DEFAULT_MODIFIER_INITIAL_VALUES,
  EModAffect,
} from "@Src/constants";

type InitCharInfo = Omit<CharInfo, "name">;
export function initCharInfo(info: Partial<InitCharInfo>): InitCharInfo {
  return {
    level: info.level || "1/20",
    NAs: info.NAs || 1,
    ES: info.ES || 1,
    EB: info.EB || 1,
    cons: info.cons || 0,
  };
}

interface InitWeapon {
  type: WeaponType;
  code?: number;
}
export function initWeapon({ type, code }: InitWeapon): Omit<CalcWeapon, "ID"> {
  return { type, code: code || DEFAULT_WEAPON_CODE[type], level: "1/20", refi: 1 };
}

interface InitArtPiece {
  type: ArtifactType;
  code: number;
  rarity: Rarity;
}
export function initArtPiece({ type, code, rarity }: InitArtPiece): Omit<CalcArtifact, "ID"> {
  return {
    type,
    code,
    rarity,
    level: 0,
    mainStatType: type === "flower" ? "hp" : type === "plume" ? "atk" : "atk_",
    subStats: [
      { type: "def", value: 0 },
      { type: "def_", value: 0 },
      { type: "cRate", value: 0 },
      { type: "cDmg", value: 0 },
    ],
  };
}

export function initCharModCtrls(name: string, forSelf: boolean) {
  const buffCtrls: ModifierCtrl[] = [];
  const debuffCtrls: ModifierCtrl[] = [];
  const { buffs = [], debuffs = [] } = findDataCharacter({ name }) || {};

  for (const buff of buffs) {
    if (buff.affect === (forSelf ? EModAffect.TEAMMATE : EModAffect.SELF)) {
      continue;
    }
    const node: ModifierCtrl = { activated: false, index: buff.index };

    if (buff.inputConfigs) {
      const initialValues = [];

      for (const config of buff.inputConfigs) {
        if ((forSelf && config.for !== "teammate") || (!forSelf && config.for !== "self")) {
          initialValues.push(
            config.initialValue ?? DEFAULT_MODIFIER_INITIAL_VALUES[config.type] ?? 0
          );
        }
      }
      if (initialValues.length) {
        node.inputs = initialValues;
      }
    }
    buffCtrls.push(node);
  }
  for (const debuff of debuffs) {
    if (!forSelf && debuff.affect === EModAffect.SELF) {
      continue;
    }
    const node: ModifierCtrl = { activated: false, index: debuff.index };

    if (debuff.inputConfigs) {
      const initialValues = [];

      for (const config of debuff.inputConfigs) {
        if ((forSelf && config.for !== "teammate") || (!forSelf && config.for !== "self")) {
          initialValues.push(
            config.initialValue ?? DEFAULT_MODIFIER_INITIAL_VALUES[config.type] ?? 0
          );
        }
      }
      if (initialValues.length) {
        node.inputs = initialValues;
      }
    }
    debuffCtrls.push(node);
  }
  return [buffCtrls, debuffCtrls];
}

interface IInitTeammateArgs {
  name: string;
  weaponType: WeaponType;
}
export function initTeammate({ name, weaponType }: IInitTeammateArgs): Teammate {
  const [buffCtrls, debuffCtrls] = initCharModCtrls(name, false);
  const weaponCode = DEFAULT_WEAPON_CODE[weaponType];

  return {
    name,
    buffCtrls,
    debuffCtrls,
    weapon: {
      code: weaponCode,
      type: weaponType,
      refi: 1,
      buffCtrls: [],
    },
    artifact: {
      code: 0,
      buffCtrls: [],
      debuffCtrls: [],
    },
  };
}

export const initElmtModCtrls = (): ElementModCtrl => ({
  infuse_reaction: null,
  reaction: null,
  superconduct: false,
  resonances: [],
});

export const initMonster = (): Monster => ({
  code: 0,
  variantType: null,
});

export function initTarget() {
  const result = { level: 1 } as Target;
  for (const elmt of ATTACK_ELEMENTS) {
    result[elmt] = 10;
  }
  return result;
}
