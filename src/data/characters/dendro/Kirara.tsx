import type { DataCharacter } from "@Src/types";
import { Dendro, Green, Rose } from "@Src/pure-components";
import { EModAffect, VISION_TYPES } from "@Src/constants";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { round } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { checkAscs } from "../utils";

const Kirara: DataCharacter = {
  code: 71,
  name: "Kirara",
  icon: "https://images2.imgbox.com/4c/09/DLJYSuy8_o.png",
  sideIcon: "1/1b/Kirara_Side_Icon",
  rarity: 4,
  nation: "inazuma",
  vision: "dendro",
  weaponType: "sword",
  stats: [
    [1021, 19, 46],
    [2623, 48, 118],
    [3386, 62, 152],
    [5072, 93, 227],
    [5614, 103, 252],
    [6458, 118, 290],
    [7181, 131, 322],
    [8024, 147, 360],
    [8566, 157, 384],
    [9409, 172, 422],
    [9951, 182, 446],
    [10794, 198, 484],
    [11336, 208, 508],
    [12180, 223, 546],
  ],
  bonusStat: { type: "hp_", value: 6 },
  NAsConfig: {
    name: "Boxcutter",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 47.9 },
        { name: "2-Hit", multFactors: 46.35 },
        { name: "3-Hit", multFactors: [25.42, 38.13] },
        { name: "4-Hit", multFactors: 73.27 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", multFactors: [22.38, 44.75, 44.75] }] },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Meow-teor Kick",
      image: "7/79/Talent_Meow-teor_Kick",
      stats: [
        { name: "Tail-Flicking Flying Kick", multFactors: 104 },
        { name: "Urgent Neko Parcel Hit", multFactors: 33.6 },
        { name: "Flipclaw Strike", multFactors: 144 },
        {
          name: "Shield DMG Absorption",
          notAttack: "shield",
          multFactors: { root: 10, attributeType: "hp" },
          flatFactor: 962,
        },
        {
          name: "Max Shield DMG Absorption",
          notAttack: "shield",
          multFactors: { root: 16, attributeType: "hp" },
          flatFactor: 1541,
        },
      ],
    },
    EB: {
      name: "Secret Art: Surprise Dispatch",
      image: "a/a1/Talent_Secret_Art_Surprise_Dispatch",
      stats: [
        { name: "Skill DMG", multFactors: 570.24 },
        { name: "Cat Grass Cardamom Explosion", multFactors: 35.64 },
        { name: "Small Cat Grass Cardamoms (C4)", multFactors: { root: 200, scale: 0 } },
      ],
      energyCost: 60,
    },
  },
  passiveTalents: [
    {
      name: "Bewitching, Betwitching Tails",
      image: "5/56/Talent_Bewitching%2C_Betwitching_Tails",
      desc: (
        <>
          When Kirara is in the Urgent Neko Parcel state [~ES], each impact against an opponent will grant a stack of
          Reinforced Packaging. This effect can be triggered once on each opponent every 0.5s. Max 3 stacks. When this
          state ends, each stack will create 1 Shield of Safe Transport [~ES] for Kirara which will have 20% DMG
          absorption of the normal one. If Kirara is already protected by a Shield of Safe Transport, its DMG absorption
          will stack with these shields and its duration will reset.
        </>
      ),
    },
    {
      name: "Pupillary Variance",
      image: "a/a3/Talent_Pupillary_Variance",
      desc: (
        <>
          Every 1,000 Max HP Kirara possesses will increase the Meow-teor Kick <Green>[ES] DMG</Green> by{" "}
          <Green b>0.4%</Green>, and the Secret Art: Surprise Dispatch <Green>[EB] DMG</Green> by <Green b>0.3%</Green>.
        </>
      ),
    },
    { name: "Cat's Creeping Carriage", image: "5/51/Talent_Cat%27s_Creeping_Carriage" },
  ],
  constellation: [
    {
      name: "Material Circulation",
      image: "2/26/Constellation_Material_Circulation",
      desc: (
        <>
          Every 8,000 Max HP Kirara possesses will cause her to create <Green b>1</Green> extra{" "}
          <Green>Cat Grass Cardamom</Green> when she uses Secret Art: Surprise Dispatch [EB]. A maximum of{" "}
          <Rose>4</Rose> extra can be created.
        </>
      ),
    },
    {
      name: "Perfectly Packaged",
      image: "8/83/Constellation_Perfectly_Packaged",
      desc: (
        <>
          When Kirara is in the Urgent Neko Parcel state [~ES], she will grant other party members she crashes into
          Critical Transport Shields. They have 40% DMG absorption of the normal Shields of Safe Transportation, last
          12s and can be triggered once on each character every 10s.
        </>
      ),
    },
    { name: "Universal Recognition", image: "e/ea/Constellation_Universal_Recognition" },
    {
      name: "Steed of Skanda",
      image: "7/72/Constellation_Steed_of_Skanda",
      desc: (
        <>
          After active character(s) protected by Shields of Safe Transport or Critical Transport Shields hit opponents
          with Normal, Charged, or Plunging Attacks, Kirara will perform a coordinated attack with them using Small Cat
          Grass Cardamoms, dealing <Green b>200%</Green> of her <Green>ATK</Green> as Elemental Burst and{" "}
          <Dendro>Dendro DMG</Dendro>. Can be triggered once every <Rose>3.8s</Rose>.
        </>
      ),
    },
    { name: "A Thousand Miles in a Day", image: "e/e4/Constellation_A_Thousand_Miles_in_a_Day" },
    {
      name: "Countless Sights to See",
      image: "9/95/Constellation_Countless_Sights_to_See",
      desc: (
        <>
          All nearby party members will gain <Green b>12%</Green> <Green>All Elemental DMG Bonus</Green> within 15s
          after Kirara uses her Elemental Skill or Burst.
        </>
      ),
    },
  ],
  innateBuffs: [
    {
      src: EModSrc.A4,
      desc: () => Kirara.passiveTalents[1].desc,
      isGranted: checkAscs[4],
      applyFinalBuff: ({ totalAttr, attPattBonus, desc, tracker }) => {
        const stacks = totalAttr.hp / 1000;
        const ESBuffValue = round(stacks * 0.4, 1);
        const EBBuffValue = round(stacks * 0.3, 1);

        applyModifier(desc, attPattBonus, ["ES.pct_", "EB.pct_"], [ESBuffValue, EBBuffValue], tracker);
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.PARTY,
      desc: () => Kirara.constellation[5].desc,
      applyBuff: makeModApplier("totalAttr", [...VISION_TYPES], 12),
    },
  ],
};

export default Kirara;
