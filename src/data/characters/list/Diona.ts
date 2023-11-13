import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyModifier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons, genExclusiveBuff } from "../utils";

const Diona: DefaultAppCharacter = {
  code: 24,
  name: "Diona",
  icon: "4/40/Diona_Icon",
  sideIcon: "e/e1/Diona_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "cryo",
  weaponType: "bow",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  innateBuffs: [
    {
      src: EModSrc.C2,
      description: `Increases Icy Paws {[ES] DMG}#[k] by {15%}#[v], and increases its shield's {DMG Absorption}#[k]
      by {15%}#[v].`,
      isGranted: checkCons[2],
      applyBuff: ({ attPattBonus, calcItemBuffs, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "ES.pct_", 15, tracker);
        calcItemBuffs.push(genExclusiveBuff(EModSrc.C2, "ES.0", "pct_", 15));
      },
    },
  ],
  buffs: [
    {
      index: 1,
      src: EModSrc.C6,
      affect: EModAffect.ACTIVE_UNIT,
      description: `Buff characters within Signature Mix's radius. Increases {Elemental Mastery}#[k] by {200}#[v]
      when they have more than 50% HP, otherwise increases their {Incoming Healing Bonus}#[k] by {30%}#[v].`,
      isGranted: checkCons[6],
      inputConfigs: [
        {
          type: "check",
          label: "Below or equal to 50% HP",
        },
      ],
      applyBuff: (obj) => {
        const isAboveHalfHP = !obj.inputs[0];
        const buffValue = isAboveHalfHP ? 200 : 30;
        applyModifier(obj.desc, obj.totalAttr, isAboveHalfHP ? "em" : "inHealB_", buffValue, obj.tracker);
      },
    },
  ],
};

export default Diona as AppCharacter;
