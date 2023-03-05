import type { CharInfo, DataCharacter, ModifierInput } from "@Src/types";
import { Green, Lightgold, Red, Rose } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { applyModifier, finalTalentLv } from "@Src/utils/calculation";
import { checkAscs, checkCons } from "../utils";

interface DetectorBuffValueArgs {
  toSelf: boolean;
  char: CharInfo;
  inputs: ModifierInput[];
}
const detectorBuff = ({ toSelf, char, inputs }: DetectorBuffValueArgs) => {
  let maxStacks = 5;

  if (toSelf) {
    if (!checkAscs[4](char)) maxStacks--;
    if (!checkCons[6](char)) maxStacks--;
  }
  return {
    value: Math.min(toSelf ? inputs[0] || 0 : inputs[1] || 0, maxStacks) * 10,
    maxStacks,
  };
};

const Mika: DataCharacter = {
  code: 67,
  beta: true,
  name: "Mika",
  icon: "https://i.ibb.co/PjXsMSt/mika.png",
  sideIcon: "",
  rarity: 4,
  nation: "mondstadt",
  vision: "cryo",
  weaponType: "polearm",
  stats: [
    [1049, 19, 60],
    [2694, 48, 154],
    [3477, 62, 198],
    [5208, 93, 297],
    [5765, 103, 329],
    [6631, 118, 378],
    [7373, 131, 420],
    [8239, 147, 470],
    [8796, 157, 502],
    [9661, 172, 551],
    [10217, 182, 583],
    [11083, 198, 632],
    [11640, 208, 664],
    [12506, 223, 713],
  ],
  bonusStat: { type: "hp_", value: 6 },
  NAsConfig: {
    name: "Spear of Favonius - Point Passage",
  },
  isReverseXtraLv: true,
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 43.26 },
        { name: "2-Hit", multFactors: 41.5 },
        { name: "3-Hit", multFactors: 54.5 },
        { name: "4-Hit (1/2)", multFactors: 27.61 },
        { name: "5-Hit", multFactors: 70.87 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", multFactors: 112.75 }] },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Starfrost Swirl",
      image: "",
      stats: [
        { name: "Flowfrost Arrow", multFactors: 67.2 },
        { name: "Rimestar Flare", multFactors: 84 },
        { name: "Rimestar Shard", multFactors: 25.2 },
      ],
    },
    EB: {
      name: "Skyfeather Song",
      image: "",
      stats: [
        { name: "Activation Healing", notAttack: "healing", multFactors: 12.17, flatFactor: 1172 },
        {
          name: "Eagleplume Regeneration",
          notAttack: "healing",
          multFactors: 2.43,
          flatFactor: 234,
        },
      ],
      multAttributeType: "hp",
      energyCost: 70,
    },
  },
  passiveTalents: [
    { name: "Rapid-Fire Suppression", image: "" },
    { name: "Geomorphological Mapping", image: "" },
    { name: "Demarcation", image: "" },
  ],
  constellation: [
    {
      name: "Contingency Factor",
      image: "",
      desc: (
        <>
          The Soulwind state [~ES] can decrease the healing interval between instances caused by
          Eagleplume state [~EB]. This decrease percentage is equal to the ATK SPD increase provided
          by Soulwind.
        </>
      ),
    },
    {
      name: "Chaperone's Ingress",
      image: "",
      desc: (
        <>
          When Flowfrost Arrow [~ES] first hits an opponent, or its Rimestar Flare hits opponents, 1
          Detector stack [~A1] will be generated.
        </>
      ),
    },
    { name: "The Wages of Sin", image: "" },
    {
      name: "Painful Grace",
      image: "",
      desc: (
        <>
          When Eagleplume state [~EB] heal other party members, this will restore 3 Energy to Mika.
          This form of Energy restoration can occur 5 times during the Eagleplume state created by 1
          use of Skyfeather Song.
        </>
      ),
    },
    { name: "Last Rites", image: "" },
    {
      name: "Divine Retribution",
      image: "",
      desc: (
        <>
          The maximum number of Detector stacks Soulwind can gain is increased by 1. Additionally,
          characters affected by Soulwind will deal 60% more Physical CRIT DMG.
        </>
      ),
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.ES,
      affect: EModAffect.ACTIVE_UNIT,
      desc: (obj) => (
        <>
          Grants nearby active characters Soulwind, increasing their ATK SPD.
          <br />• At <Lightgold>A1</Lightgold>, Soulwind can grant characters the Detector effect,
          increasing their <Green>Physical DMG</Green> by <Green>10%</Green> each stack. Max{" "}
          <Rose>3</Rose> stacks.
          <br />• At <Lightgold>A4</Lightgold>, the maximum number of <Green>stacks</Green> is
          increased by <Green>1</Green>.
          <br />• At <Lightgold>C6</Lightgold>, the maximum number of <Green>stacks</Green> is
          increased by <Green>1</Green>. Grants <Green b>60%</Green>{" "}
          <Green>Physical CRIT DMG</Green> bonus.
          {obj.toSelf && (
            <>
              <br />
              <Red>
                --- Max Detector stacks: {checkAscs[1](obj.char) ? detectorBuff(obj).maxStacks : 0}{" "}
                ---
              </Red>
            </>
          )}
        </>
      ),
      inputConfigs: [
        { label: "Elemental Skill Level", type: "level", for: "teammate" },
        { label: "Detector stacks (A1)", type: "select", initialValue: 0, max: 5 },
        { label: "Constellation 6", type: "check", for: "teammate" },
      ],
      applyBuff: ({ toSelf, char, totalAttr, attElmtBonus, inputs, partyData, desc, tracker }) => {
        const level = toSelf
          ? finalTalentLv({ char, dataChar: Mika, talentType: "ES", partyData })
          : inputs[0] || 0;
        const buffValue = level ? Math.min(12 + level, 25) : 0;
        applyModifier(desc, totalAttr, "naAtkSpd_", buffValue, tracker);

        if (!toSelf || checkAscs[1](char)) {
          const buffValue = detectorBuff({ toSelf, char, inputs }).value;
          applyModifier(desc + ` + ${EModSrc.A1}`, totalAttr, "phys", buffValue, tracker);
        }
        if ((toSelf && checkCons[6](char)) || (!toSelf && inputs[2])) {
          applyModifier(desc + ` + ${EModSrc.C6}`, attElmtBonus, "phys.cDmg_", 60, tracker);
        }
      },
    },
  ],
};

export default Mika;
