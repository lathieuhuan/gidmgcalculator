import type { AppCharacter, ApplyCharBuffArgs, DefaultAppCharacter, TotalAttribute } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Green, Lightgold, Red, Rose } from "@Src/pure-components";
import { applyModifier, finalTalentLv } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons } from "../utils";

const getEBBuffValue = ({
  toSelf,
  char,
  partyData,
  inputs,
}: Pick<ApplyCharBuffArgs, "toSelf" | "char" | "partyData" | "inputs">) => {
  const level = toSelf
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
      desc: ({ totalAttr }) => (
        <>
          Increases Mona's <Green>Hydro DMG Bonus</Green> by a degree equivalent to <Green b>20%</Green> of her{" "}
          <Green>Energy Recharge</Green> rate. <Red>Hydro DMG Bonus: {getA4BuffValue(totalAttr)}%.</Red>
        </>
      ),
      isGranted: checkAscs[4],
      applyBuff: ({ totalAttr, desc, tracker }) => {
        applyModifier(desc, totalAttr, "hydro", getA4BuffValue(totalAttr), tracker);
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.PARTY,
      desc: (obj) => (
        <>
          Omen increases <Green b>{getEBBuffValue(obj)}%</Green> <Green>DMG</Green> taken by opponents.
          <br />• At <Lightgold>C1</Lightgold>, increases <Green>Electro-Charged DMG</Green>,{" "}
          <Green>Vaporize DMG</Green>, and <Green>Hydro Swirl DMG</Green> by <Green b>15%</Green> for 8s.
          <br />• At <Lightgold>C4</Lightgold>, increases <Green>CRIT Rate</Green> by <Green b>15%</Green>.
        </>
      ),
      inputConfigs: [
        { label: "Elemental Burst Level", type: "level", for: "teammate" },
        { label: "Constellation 1", type: "check", for: "teammate" },
        { label: "Constellation 4", type: "check", for: "teammate" },
      ],
      applyBuff: ({ totalAttr, attPattBonus, rxnBonus, desc, tracker, ...rest }) => {
        const { toSelf, inputs, char } = rest;
        applyModifier(desc, attPattBonus, "all.pct_", getEBBuffValue(rest), tracker);

        if ((toSelf && checkCons[1](char)) || (!toSelf && inputs[1])) {
          applyModifier(desc, rxnBonus, ["electroCharged.pct_", "swirl.pct_", "vaporize.pct_"], 15, tracker);
        }
        if ((toSelf && checkCons[4](char)) || (!toSelf && inputs[2])) {
          applyModifier(desc, totalAttr, "cRate_", 15, tracker);
        }
      },
    },
    {
      index: 4,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Upon entering Illusory Torrent, Mona gains a <Green b>60%</Green> <Green>DMG increase</Green> of her next{" "}
          <Green>Charged Attack</Green> per second of movement (up to <Rose b>180%</Rose>) for 8s.
        </>
      ),
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
