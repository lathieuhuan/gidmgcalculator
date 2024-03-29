import type {
  ArtifactDebuffCtrl,
  ArtifactType,
  CalcArtifact,
  CalcWeapon,
  CharInfo,
  ElementModCtrl,
  ModifierCtrl,
  ModInputConfig,
  Target,
  Teammate,
  WeaponType,
} from "@Src/types";
import { ATTACK_ELEMENTS, DEFAULT_MODIFIER_INITIAL_VALUES, DEFAULT_WEAPON_CODE, EModAffect } from "@Src/constants";
import { $AppData, $AppCharacter, $AppSettings } from "@Src/services";

type PartialCharInfo = Omit<CharInfo, "name">;

export const createCharInfo = (info?: Partial<PartialCharInfo>): PartialCharInfo => {
  const { charLevel, charCons, charNAs, charES, charEB } = $AppSettings.get();

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
  const { wpLevel, wpRefi } = $AppSettings.get();
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
  rarity: number;
}
export const createArtifact = ({ type, code, rarity }: CreateArtifactArgs): Omit<CalcArtifact, "ID"> => {
  const { artLevel } = $AppSettings.get();
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
};

type Modifier = {
  index: number;
  inputConfigs?: ModInputConfig[];
};
const createModCrtl = (mod: Modifier, forSelf: boolean) => {
  const ctrl: ModifierCtrl = { index: mod.index, activated: false };

  if (mod.inputConfigs) {
    const initialValues = [];

    for (const config of mod.inputConfigs) {
      if (config.for !== (forSelf ? "team" : "self")) {
        initialValues.push(config.initialValue ?? DEFAULT_MODIFIER_INITIAL_VALUES[config.type] ?? 0);
      }
    }
    if (initialValues.length) ctrl.inputs = initialValues;
  }
  return ctrl;
};

export const createCharModCtrls = (forSelf: boolean, name: string) => {
  const buffCtrls: ModifierCtrl[] = [];
  const debuffCtrls: ModifierCtrl[] = [];
  const { buffs = [], debuffs = [] } = $AppCharacter.get(name) || {};

  for (const buff of buffs) {
    if (buff.affect === (forSelf ? EModAffect.TEAMMATE : EModAffect.SELF)) {
      continue;
    }
    buffCtrls.push(createModCrtl(buff, forSelf));
  }
  for (const debuff of debuffs) {
    if (!forSelf && debuff.affect === EModAffect.SELF) {
      continue;
    }
    debuffCtrls.push(createModCrtl(debuff, forSelf));
  }
  return [buffCtrls, debuffCtrls];
};

interface RefModifier {
  index: number;
  affect: EModAffect;
  inputConfigs?: ModInputConfig[];
}
const createBuffCtrls = (forSelf: boolean, buffs: RefModifier[]) => {
  const buffCtrls: ModifierCtrl[] = [];

  for (const buff of buffs) {
    if (buff.affect !== (forSelf ? EModAffect.TEAMMATE : EModAffect.SELF)) {
      buffCtrls.push(createModCrtl(buff, forSelf));
    }
  }
  return buffCtrls;
};

export const createWeaponBuffCtrls = (forSelf: boolean, weapon: { type: WeaponType; code: number }) => {
  const { buffs = [] } = $AppData.getWeapon(weapon.code) || {};
  return createBuffCtrls(forSelf, buffs);
};

export const createArtifactBuffCtrls = (forSelf: boolean, hasCode?: { code?: number }) => {
  if (!hasCode?.code) {
    return [];
  }
  const { buffs = [] } = $AppData.getArtifactSet(hasCode.code) || {};
  return createBuffCtrls(forSelf, buffs);
};

export const createArtifactDebuffCtrls = (): ArtifactDebuffCtrl[] => {
  return [
    { code: 15, activated: false, index: 0, inputs: [0] },
    { code: 33, activated: false, index: 0 },
  ];
};

interface CreateTeammateArgs {
  name: string;
  weaponType: WeaponType;
}
export const createTeammate = ({ name, weaponType }: CreateTeammateArgs): Teammate => {
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
};

export const createElmtModCtrls = (): ElementModCtrl => ({
  infuse_reaction: null,
  reaction: null,
  superconduct: false,
  resonances: [],
  absorption: null,
});

export const createTarget = () => {
  const result = { code: 0, level: 1, resistances: {} } as Target;
  for (const elmt of ATTACK_ELEMENTS) {
    result.resistances[elmt] = 10;
  }
  return result;
};
