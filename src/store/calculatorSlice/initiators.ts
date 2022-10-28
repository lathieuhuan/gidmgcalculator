import type {
  Artifact,
  CharInfo,
  ModifierInput,
  Rarity,
  Weapon,
  DebuffInputRenderType,
  ModifierCtrl,
  Target,
  CalcArtPiece,
  CalcWeapon,
  ElementModCtrl,
  Monster,
  Teammate,
} from "@Src/types";
import { findCharacter, findWeapon } from "@Data/controllers";
import { ATTACK_ELEMENTS, DEFAULT_WEAPON_CODE, EModAffect } from "@Src/constants";

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
  type: Weapon;
  code?: number;
}
export function initWeapon({ type, code }: InitWeapon): Omit<CalcWeapon, "ID"> {
  return { type, code: code || DEFAULT_WEAPON_CODE[type], level: "1/20", refi: 1 };
}

interface InitArtPiece {
  type: Artifact;
  code: number;
  rarity: Rarity;
}
export function initArtPiece({ type, code, rarity }: InitArtPiece): Omit<CalcArtPiece, "ID"> {
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
  const { buffs, debuffs } = findCharacter({ name })!;

  if (buffs) {
    for (const buff of buffs) {
      if (buff.affect === (forSelf ? EModAffect.TEAMMATE : EModAffect.SELF)) {
        continue;
      }
      const node: ModifierCtrl = {
        activated: false,
        index: buff.index,
      };

      if (buff.inputConfig) {
        const { labels, selfLabels, initialValues } = buff.inputConfig;

        if ((forSelf && selfLabels) || (!forSelf && labels)) {
          node.inputs = [...initialValues];
        }
      }
      buffCtrls.push(node);
    }
  }
  /**
    v2.8 - debuffs need inputs:
    From self: AnemoMC C6 & Venti C6 / Not from self: Eula E & Shenhe Q
  */
  function getInputs(labels: string[], renderTypes: DebuffInputRenderType[]) {
    const inputs: ModifierInput[] = [];

    labels.forEach((_, i) => {
      const type = renderTypes[i];
      if (type === "anemoable") {
        inputs.push("pyro");
      } else if (type === "text") {
        inputs.push(1); // level
      }
    });
    return inputs;
  }
  if (debuffs) {
    for (const debuff of debuffs) {
      if (!forSelf && debuff.affect === EModAffect.SELF) {
        continue;
      }
      const node: ModifierCtrl = {
        activated: false,
        index: debuff.index,
      };

      if (debuff.inputConfig) {
        const { labels, selfLabels, renderTypes } = debuff.inputConfig;

        if (forSelf && selfLabels) {
          node.inputs = getInputs(selfLabels, renderTypes);
        } else if (!forSelf && labels) {
          node.inputs = getInputs(labels, renderTypes);
        }
      }
      debuffCtrls.push(node);
    }
  }
  return [buffCtrls, debuffCtrls];
}

interface IInitTeammateArgs {
  name: string;
  weapon: Weapon;
}
export function initTeammate({ name, weapon }: IInitTeammateArgs): Teammate {
  const [buffCtrls, debuffCtrls] = initCharModCtrls(name, false);

  const weaponCode = DEFAULT_WEAPON_CODE[weapon];
  const { buffs: weaponBuffs = [] } = findWeapon({ code: weaponCode, type: weapon }) || {};

  const weaponBuffCtrls = weaponBuffs.reduce((accumulator, { index, affect, inputConfig }) => {
    if (affect !== EModAffect.SELF) {
      const buffNode: ModifierCtrl = {
        index,
        activated: false,
      };
      if (inputConfig) {
        buffNode.inputs = [...inputConfig.initialValues];
      }
      accumulator.push(buffNode);
    }
    return accumulator;
  }, [] as ModifierCtrl[]);

  return {
    name,
    buffCtrls,
    debuffCtrls,
    weapon: {
      code: weaponCode,
      refi: 1,
      buffCtrls: weaponBuffCtrls,
    },
    artifact: {
      code: -1,
      buffCtrls: [],
      debuffCtrls: [],
    },
  };
}

export const initElmtModCtrls = (): ElementModCtrl => ({
  infusion_ampRxn: null,
  ampRxn: null,
  superconduct: false,
  aggravate: false,
  spread: false,
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
