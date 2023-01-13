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
  Teammate,
} from "@Src/types";
import { findDataCharacter } from "@Data/controllers";
import {
  ATTACK_ELEMENTS,
  DEFAULT_WEAPON_CODE,
  DEFAULT_MODIFIER_INITIAL_VALUES,
  EModAffect,
} from "@Src/constants";

type PartialCharInfo = Omit<CharInfo, "name">;

export function createCharInfo(info?: Partial<PartialCharInfo>): PartialCharInfo {
  return {
    level: info?.level || "1/20",
    NAs: info?.NAs || 1,
    ES: info?.ES || 1,
    EB: info?.EB || 1,
    cons: info?.cons || 0,
  };
}

interface CreateWeaponArgs {
  type: WeaponType;
  code?: number;
}
export function createWeapon({ type, code }: CreateWeaponArgs): Omit<CalcWeapon, "ID"> {
  return { type, code: code || DEFAULT_WEAPON_CODE[type], level: "1/20", refi: 1 };
}

interface CreateArtifactArgs {
  type: ArtifactType;
  code: number;
  rarity: Rarity;
}
export function createArtifact({
  type,
  code,
  rarity,
}: CreateArtifactArgs): Omit<CalcArtifact, "ID"> {
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

export function createCharModCtrls(name: string, forSelf: boolean) {
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

interface CreateTeammateArgs {
  name: string;
  weaponType: WeaponType;
}
export function createTeammate({ name, weaponType }: CreateTeammateArgs): Teammate {
  const [buffCtrls, debuffCtrls] = createCharModCtrls(name, false);
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

export const createElmtModCtrls = (): ElementModCtrl => ({
  infuse_reaction: null,
  reaction: null,
  superconduct: false,
  resonances: [],
});

export function createTarget() {
  const result = { code: 0, level: 1, resistances: {} } as Target;
  for (const elmt of ATTACK_ELEMENTS) {
    result.resistances[elmt] = 10;
  }
  return result;
}
