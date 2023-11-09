import type { AppCharacter, ApplyCharBuffArgs, DefaultAppCharacter, TotalAttribute } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyModifier, finalTalentLv } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons } from "../utils";

const getEBBonus = ({
  fromSelf,
  char,
  partyData,
  inputs,
}: Pick<ApplyCharBuffArgs, "fromSelf" | "char" | "partyData" | "inputs">) => {
  const level = fromSelf
    ? finalTalentLv({ char, charData: Mona as AppCharacter, talentType: "EB", partyData })
    : inputs[0] || 0;
  return level ? Math.min(40 + level * 2, 60) : 0;
};

const getA4BuffValue = (totalAttr: TotalAttribute) => Math.round(totalAttr.er_ * 2) / 10;

const Mona: DefaultAppCharacter = {
  code: 16,
  name: "Mona",
  icon: "4/41/Mona_Icon",
  sideIcon: "6/61/Mona_Side_Icon",
  rarity: 5,
  nation: "mondstadt",
  vision: "hydro",
  weaponType: "catalyst",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  innateBuffs: [
    {
      src: EModSrc.A4,
      description: `Increases Mona's {Hydro DMG Bonus}#[gr] by {20%}#[b,gr] of her {Energy Recharge}#[gr].`,
      isGranted: checkAscs[4],
      applyFinalBuff: ({ totalAttr, desc, tracker }) => {
        applyModifier(desc, totalAttr, "hydro", getA4BuffValue(totalAttr), tracker);
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.PARTY,
      description: `Omen increases {DMG}#[gr] taken by opponents.
      <br />• At {C1}#[g], increases {Electro-Charged DMG}#[gr], {Vaporize DMG}#[gr], and {Hydro Swirl DMG}#[gr] by
      {15%}#[b,gr] for 8s.
      <br />• At {C4}#[g], increases {CRIT Rate}#[gr] by {15%}#[b,gr].`,
      inputConfigs: [
        { label: "Elemental Burst Level", type: "level", for: "teammate" },
        { label: "Constellation 1", type: "check", for: "teammate" },
        { label: "Constellation 4", type: "check", for: "teammate" },
      ],
      applyBuff: ({ totalAttr, attPattBonus, rxnBonus, desc, tracker, ...rest }) => {
        const { fromSelf, inputs, char } = rest;
        applyModifier(desc, attPattBonus, "all.pct_", getEBBonus(rest), tracker);

        if ((fromSelf && checkCons[1](char)) || (!fromSelf && inputs[1])) {
          applyModifier(desc, rxnBonus, ["electroCharged.pct_", "swirl.pct_", "vaporize.pct_"], 15, tracker);
        }
        if ((fromSelf && checkCons[4](char)) || (!fromSelf && inputs[2])) {
          applyModifier(desc, totalAttr, "cRate_", 15, tracker);
        }
      },
    },
    {
      index: 4,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      description: `Upon entering Illusory Torrent, Mona gains a {60%}#[b,gr] {DMG bonus}#[gr] of her next
      {Charged Attack}#[gr] per second of movement (up to {180%}#[r]) for 8s.`,
      isGranted: checkCons[6],
      inputConfigs: [
        {
          type: "stacks",
          max: 3,
        },
      ],
      applyBuff: ({ attPattBonus, inputs, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "CA.pct_", 60 * (inputs[0] || 0), tracker);
      },
    },
  ],
};

export default Mona as AppCharacter;
