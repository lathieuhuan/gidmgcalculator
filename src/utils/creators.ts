import type {
  ArtifactDebuffCtrl,
  ArtifactType,
  CalcArtifact,
  CalcWeapon,
  CharInfo,
  ElementModCtrl,
  ModifierCtrl,
  ModInputConfig,
  Rarity,
  Target,
  Teammate,
  WeaponType,
} from "@Src/types";
import { ATTACK_ELEMENTS, DEFAULT_MODIFIER_INITIAL_VALUES, DEFAULT_WEAPON_CODE, EModAffect } from "@Src/constants";
import { appData } from "@Data/index";
import { appSettings } from "./utils";

type PartialCharInfo = Omit<CharInfo, "name">;

export const createCharInfo = (info?: Partial<PartialCharInfo>): PartialCharInfo => {
  const { charLevel, charCons, charNAs, charES, charEB } = appSettings.get();

  return {
    level: info?.level || charLevel,
    NAs: info?.NAs || charNAs,
    ES: info?.ES || charES,
    EB: info?.EB || charEB,
    cons: info?.cons || charCons,
  };
};

interface CreateWeaponArgs {
  type: WeaponType;
  code?: number;
}
export const createWeapon = ({ type, code }: CreateWeaponArgs): Omit<CalcWeapon, "ID"> => {
  const { wpLevel, wpRefi } = appSettings.get();
  return {
    type,
    code: code || DEFAULT_WEAPON_CODE[type],
    level: wpLevel,
    refi: wpRefi,
  };
};

interface CreateArtifactArgs {
  type: ArtifactType;
  code: number;
  rarity: Rarity;
}
export function createArtifact({ type, code, rarity }: CreateArtifactArgs): Omit<CalcArtifact, "ID"> {
  const { artLevel } = appSettings.get();
  return {
    type,
    code,
    rarity,
    level: Math.min(artLevel, rarity === 5 ? 20 : 16),
    mainStatType: type === "flower" ? "hp" : type === "plume" ? "atk" : "atk_",
    subStats: [
      { type: "def", value: 0 },
      { type: "def_", value: 0 },
      { type: "cRate_", value: 0 },
      { type: "cDmg_", value: 0 },
    ],
  };
}

export function createCharModCtrls(forSelf: boolean, name: string) {
  const buffCtrls: ModifierCtrl[] = [];
  const debuffCtrls: ModifierCtrl[] = [];
  const { buffs = [], debuffs = [] } = appData.getCharData(name) || {};

  for (const buff of buffs) {
    if (buff.affect === (forSelf ? EModAffect.TEAMMATE : EModAffect.SELF)) {
      continue;
    }
    const node: ModifierCtrl = { activated: false, index: buff.index };

    if (buff.inputConfigs) {
      const initialValues = [];

      for (const config of buff.inputConfigs) {
        if ((forSelf && config.for !== "teammate") || (!forSelf && config.for !== "self")) {
          initialValues.push(config.initialValue ?? DEFAULT_MODIFIER_INITIAL_VALUES[config.type] ?? 0);
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
          initialValues.push(config.initialValue ?? DEFAULT_MODIFIER_INITIAL_VALUES[config.type] ?? 0);
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

interface RefModifier {
  index: number;
  affect: EModAffect;
  inputConfigs?: ModInputConfig[];
}
export function createModCtrls(forSelf: boolean, buffs: RefModifier[]) {
  const buffCtrls: ModifierCtrl[] = [];

  for (const buff of buffs) {
    if (buff.affect !== (forSelf ? EModAffect.TEAMMATE : EModAffect.SELF)) {
      const node: ModifierCtrl = {
        index: buff.index,
        activated: false,
      };
      if (buff.inputConfigs) {
        const initialValues = [];

        for (const config of buff.inputConfigs) {
          if ((forSelf && config.for !== "teammate") || (!forSelf && config.for !== "self")) {
            initialValues.push(config.initialValue ?? DEFAULT_MODIFIER_INITIAL_VALUES[config.type] ?? 0);
          }
        }
        if (initialValues.length) {
          node.inputs = initialValues;
        }
      }
      buffCtrls.push(node);
    }
  }
  return buffCtrls;
}

export function createWeaponBuffCtrls(forSelf: boolean, weapon: { type: WeaponType; code: number }) {
  const { buffs = [] } = appData.getWeaponData(weapon.code) || {};
  return createModCtrls(forSelf, buffs);
}

export function createArtifactBuffCtrls(forSelf: boolean, hasCode?: { code?: number }) {
  if (!hasCode?.code) {
    return [];
  }
  const { buffs = [] } = appData.getArtifactSetData(hasCode.code) || {};
  return createModCtrls(forSelf, buffs);
}

export function createArtDebuffCtrls(): ArtifactDebuffCtrl[] {
  return [
    { code: 15, activated: false, index: 0, inputs: [0] },
    { code: 33, activated: false, index: 0 },
  ];
}

interface CreateTeammateArgs {
  name: string;
  weaponType: WeaponType;
}
export function createTeammate({ name, weaponType }: CreateTeammateArgs): Teammate {
  const [buffCtrls, debuffCtrls] = createCharModCtrls(false, name);
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
    },
  };
}

export const createElmtModCtrls = (): ElementModCtrl => ({
  infuse_reaction: null,
  reaction: null,
  superconduct: false,
  resonances: [],
  absorption: null
});

export function createTarget() {
  const result = { code: 0, level: 1, resistances: {} } as Target;
  for (const elmt of ATTACK_ELEMENTS) {
    result.resistances[elmt] = 10;
  }
  return result;
}
