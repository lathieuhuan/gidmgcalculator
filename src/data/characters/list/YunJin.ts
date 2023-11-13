import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyPercent, countVision, round } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, getTalentMultiplier } from "../utils";

const getEBBonus = (args: DescriptionSeedGetterArgs) => {
  return getTalentMultiplier({ talentType: "EB", root: 32.16, inputIndex: 1 }, YunJin as AppCharacter, args);
};

const YunJin: DefaultAppCharacter = {
  code: 48,
  name: "Yun Jin",
  icon: "9/9c/Yun_Jin_Icon",
  sideIcon: "f/fb/Yun_Jin_Side_Icon",
  rarity: 4,
  nation: "liyue",
  vision: "geo",
  weaponType: "polearm",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  innateBuffs: [
    {
      src: EModSrc.A4,
      description: `The {Normal Attack DMG Bonus}#[k] granted by Flying Cloud Flag Formation [~EB] is further increased
      by {2.5%}#[v]/{5%}#[v]/{7.5%}#[v]/{11.5%}#[v] of Yun Jin's {DEF}#[k] when the party contains
      characters of 1/2/3/4 Elemental Types, respectively.`,
      isGranted: checkAscs[4],
    },
  ],
  dsGetters: [(args) => `${round(getEBBonus(args)[1], 2)}%`],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      description: `Increases {Normal Attack DMG}#[k] based on {@0}#[v] of Yun Jin's {current DEF}#[k].
      <br />• At {A4}#[ms], further increases the bonus based on how many element types in the party.
      <br />• At {C2}#[ms], increases {Normal Attack DMG}#[k] by {15%}#[v].
      <br />• At {C6}#[ms], increases {Normal ATK SPD}#[k] by {12%}#[v].`,
      affect: EModAffect.PARTY,
      inputConfigs: [
        { label: "Current DEF", type: "text", max: 9999, for: "teammate" },
        { label: "Elemental Burst Level", type: "level", for: "teammate" },
        { label: EModSrc.A4, type: "check", for: "teammate" },
        { label: EModSrc.C2, type: "check", for: "teammate" },
        { label: EModSrc.C6, type: "check", for: "teammate" },
      ],
      applyFinalBuff: (obj) => {
        const { fromSelf, inputs, char, tracker } = obj;
        const descRoot = fromSelf ? "Self" : "Yun Jin";
        const DEF = fromSelf ? obj.totalAttr.def : inputs[0] || 0;
        let [level, mult] = getEBBonus(obj);
        let description = `${obj.desc} Lv.${level}`;

        if (fromSelf ? checkAscs[4](char) : inputs[2]) {
          const visionCount = countVision(obj.partyData, obj.charData);
          const numOfElmts = Object.keys(visionCount).length;
          mult += numOfElmts * 2.5 + (numOfElmts === 4 ? 1.5 : 0);
          description += ` + ${EModSrc.A4}`;
        }
        description += ` / ${round(mult, 2)}% of DEF`;
        const buffValue = applyPercent(DEF, mult);

        applyModifier(description, obj.attPattBonus, "NA.flat", buffValue, tracker);

        if (fromSelf ? checkCons[2](char) : inputs[3]) {
          const descriptionC2 = `${descRoot} / ${EModSrc.C2}`;
          applyModifier(descriptionC2, obj.attPattBonus, "NA.pct_", 15, tracker);
        }
        if (fromSelf ? checkCons[6](char) : inputs[4]) {
          const descriptionC6 = `${descRoot} / ${EModSrc.C6}`;
          applyModifier(descriptionC6, obj.totalAttr, "naAtkSpd_", 12, tracker);
        }
      },
    },
    {
      index: 3,
      src: EModSrc.C4,
      affect: EModAffect.SELF,
      description: `When Yun Jin trigger the Crystallize Reaction, her {DEF}#[k] is increased by {20%}#[v] for 12s.`,
      isGranted: checkCons[4],
      applyBuff: makeModApplier("totalAttr", "def_", 20),
    },
  ],
};

export default YunJin as AppCharacter;
