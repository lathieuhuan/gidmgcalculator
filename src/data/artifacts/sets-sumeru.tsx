import type { DataArtifact } from "@Src/types";
import { Green, Rose } from "@Components/atoms";
import { findByCode } from "@Src/utils";
import { applyModifier, makeModApplier, ReactionBonusPath } from "@Src/utils/calculation";
import { EModAffect } from "@Src/constants";

const sumeruSets: DataArtifact[] = [
  {
    code: 38,
    beta: true,
    name: "Nymph's Dream",
    variants: [4, 5],
    flower: {
      name: "Flower",
      icon: "https://images2.imgbox.com/13/09/wXfgluY1_o.png",
    },
    plume: {
      name: "Plume",
      icon: "https://images2.imgbox.com/9b/64/E73Jd8oG_o.png",
    },
    sands: {
      name: "Sands",
      icon: "https://images2.imgbox.com/d1/d3/eb0bo07q_o.png",
    },
    goblet: {
      name: "Goblet",
      icon: "https://images2.imgbox.com/08/58/YfTdk50T_o.png",
    },
    circlet: {
      name: "Circlet",
      icon: "https://images2.imgbox.com/2b/18/4t2yE5RG_o.png",
    },
    setBonuses: [
      {
        desc: (
          <>
            <Green>Hydro DMG Bonus</Green> +<Green b>15%</Green>.
          </>
        ),
        applyBuff: makeModApplier("totalAttr", "hydro", 15),
      },
      {
        get desc() {
          return (
            <>
              When Normal, Charged, or Plunging Attacks, Elemental Skills or Elemental Bursts hit an opponent, each
              attack type can provide 1 stack of Nymph's Croix for 8s. Max 5 stacks. Each stack's duration is counted
              independently. {this.xtraDesc?.[0]}
            </>
          );
        },
        xtraDesc: [
          <>
            While 1, 2, or 3 or more Nymph's Croix stacks are in effect, <Green>ATK</Green> is increased by{" "}
            <Green b>7%/16%/25%</Green>, and <Green>Hydro DMG</Green> is increased by <Green b>4%/9%/15%</Green>.
          </>,
        ],
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: () => findByCode(sumeruSets, 38)?.setBonuses[1].xtraDesc?.[0],
        inputConfigs: [
          {
            type: "stacks",
            max: 3,
          },
        ],
        applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
          const index = (inputs[0] || 1) - 1;
          const atkBuff = [7, 16, 25][index];
          const hydroBuff = [4, 9, 15][index];
          applyModifier(desc, totalAttr, ["atk_", "hydro"], [atkBuff, hydroBuff], tracker);
        },
      },
    ],
  },
  {
    code: 37,
    beta: true,
    name: "Dewflower's Glow",
    variants: [4, 5],
    flower: {
      name: "Flower",
      icon: "https://images2.imgbox.com/c9/12/v51uGpOY_o.png",
    },
    plume: {
      name: "Plume",
      icon: "https://images2.imgbox.com/a2/cf/PwY8vxPz_o.png",
    },
    sands: {
      name: "Sands",
      icon: "https://images2.imgbox.com/4e/31/YhZ8cbWs_o.png",
    },
    goblet: {
      name: "Goblet",
      icon: "https://images2.imgbox.com/3a/bf/xjmGyFNb_o.png",
    },
    circlet: {
      name: "Circlet",
      icon: "https://images2.imgbox.com/2e/47/8XJPzx6h_o.png",
    },
    setBonuses: [
      {
        desc: (
          <>
            <Green>HP</Green> +<Green b>20%</Green>.
          </>
        ),
        applyBuff: makeModApplier("totalAttr", "hp_", 20),
      },
      {
        get desc() {
          return (
            <>
              Increases <Green>Elemental Skill and Elemental Burst DMG</Green> by <Green b>10%</Green>.{" "}
              {this.xtraDesc?.[0]} The duration of each stack is counted independently. These stacks will continue to
              take effect even when the equipping character is not on the field.
            </>
          );
        },
        xtraDesc: [
          <>
            When the equipping character takes DMG, Increases <Green>Elemental Skill and Elemental Burst DMG</Green> by{" "}
            <Green b>8%</Green> for 5s. Max <Rose>5</Rose> stacks.
          </>,
        ],
        applyBuff: makeModApplier("attPattBonus", ["ES.pct_", "EB.pct_"], 10),
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: () => findByCode(sumeruSets, 37)?.setBonuses[1].xtraDesc?.[0],
        inputConfigs: [
          {
            type: "stacks",
            max: 5,
          },
        ],
        applyBuff: ({ attPattBonus, inputs, desc, tracker }) => {
          const stacks = inputs[0] || 0;
          applyModifier(desc, attPattBonus, ["ES.pct_", "EB.pct_"], stacks * 8, tracker);
        },
      },
    ],
  },
  {
    code: 36,
    name: "Desert Pavilion Chronicle",
    variants: [4, 5],
    flower: {
      name: "The First Days of the City of Kings",
      icon: "0/01/Item_The_First_Days_of_the_City_of_Kings",
    },
    plume: {
      name: "End of the Golden Realm",
      icon: "4/49/Item_End_of_the_Golden_Realm",
    },
    sands: {
      name: "Timepiece of the Lost Path",
      icon: "4/45/Item_Timepiece_of_the_Lost_Path",
    },
    goblet: {
      name: "Defender of the Enchanting Dream",
      icon: "5/57/Item_Defender_of_the_Enchanting_Dream",
    },
    circlet: {
      name: "Legacy of the Desert High-Born",
      icon: "0/0c/Item_Legacy_of_the_Desert_High-Born",
    },
    setBonuses: [
      {
        desc: (
          <>
            Increases <Green b>15%</Green> <Green>Anemo DMG Bonus</Green>.
          </>
        ),
        applyBuff: makeModApplier("totalAttr", "anemo", 15),
      },
      {
        desc: (
          <>
            When Charged Attacks hit opponents, the equipping character's <Green>Normal Attack SPD</Green> will increase
            by <Green b>10%</Green> while <Green>Normal, Charged, and Plunging Attack DMG</Green> will increase by{" "}
            <Green b>40%</Green> for 10s.
          </>
        ),
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: () => findByCode(sumeruSets, 36)?.setBonuses[1].desc,
        applyBuff: ({ totalAttr, attPattBonus, desc, tracker }) => {
          applyModifier(desc, totalAttr, "naAtkSpd_", 10, tracker);
          applyModifier(desc, attPattBonus, ["NA.pct_", "CA.pct_", "PA.pct_"], 40, tracker);
        },
      },
    ],
  },
  {
    code: 35,
    name: "Flower of Paradise Lost",
    variants: [4, 5],
    flower: {
      name: "Moon Maiden's Myriad",
      icon: "8/8f/Item_Ay-Khanoum%27s_Myriad",
    },
    plume: {
      name: "Wilting Feast",
      icon: "f/f1/Item_Wilting_Feast",
    },
    sands: {
      name: "A Moment Congealed",
      icon: "3/33/Item_A_Moment_Congealed",
    },
    goblet: {
      name: "Secret-Keeper's Magic Bottle",
      icon: "6/6f/Item_Secret-Keeper%27s_Magic_Bottle",
    },
    circlet: {
      name: "Amethyst Crown",
      icon: "0/09/Item_Amethyst_Crown",
    },
    setBonuses: [
      {
        desc: (
          <>
            Increases <Green>Elemental Mastery</Green> by <Green b>80</Green>.
          </>
        ),
        applyBuff: makeModApplier("totalAttr", "em", 80),
      },
      {
        get desc() {
          return (
            <>
              The equipping character's <Green>Bloom, Hyperbloom, and Burgeon reaction DMG</Green> are increased by{" "}
              <Green b>40%</Green>. {this.xtraDesc?.[0]} This effect can only be triggered once per second. The
              character who equips this can still trigger its effects when not on the field.
            </>
          );
        },
        xtraDesc: [
          <>
            When the equipping character triggers Bloom, Hyperbloom, or Burgeon, they will gain another{" "}
            <Green b>10%</Green> <Green>DMG bonus</Green> to those reations. Max <Rose>4</Rose> stacks. Each stack lasts
            10s.
          </>,
        ],
        applyBuff: makeModApplier("rxnBonus", ["bloom.pct_", "hyperbloom.pct_", "burgeon.pct_"], 40),
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: () => findByCode(sumeruSets, 35)?.setBonuses[1]?.xtraDesc?.[0],
        inputConfigs: [
          {
            type: "stacks",
            max: 4,
          },
        ],
        applyBuff: ({ rxnBonus, inputs, desc, tracker }) => {
          const fields: ReactionBonusPath[] = ["bloom.pct_", "hyperbloom.pct_", "burgeon.pct_"];
          applyModifier(desc, rxnBonus, fields, 10 * inputs[0], tracker);
        },
      },
    ],
  },
  {
    code: 33,
    name: "Deepwood Memories",
    variants: [4, 5],
    flower: {
      name: "Labyrinth Wayfarer",
      icon: "a/ab/Item_Labyrinth_Wayfarer",
    },
    plume: {
      name: "Scholar of Vines",
      icon: "0/0f/Item_Scholar_of_Vines",
    },
    sands: {
      name: "A Time of Insight",
      icon: "7/7c/Item_A_Time_of_Insight",
    },
    goblet: {
      name: "Lamp of the Lost",
      icon: "c/cd/Item_Lamp_of_the_Lost",
    },
    circlet: {
      name: "Laurel Coronet",
      icon: "b/b8/Item_Laurel_Coronet",
    },
    setBonuses: [
      {
        desc: (
          <>
            <Green>Dendro DMG Bonus</Green> <Green b>+15%</Green>.
          </>
        ),
        applyBuff: makeModApplier("totalAttr", "dendro", 15),
      },
      {
        desc: (
          <>
            After Elemental Skills or Bursts hit opponents, the targets' <Green>Dendro RES</Green> will be decreased by{" "}
            <Green b>30%</Green> for 8s. This effect can be triggered even if the equipping character is not on the
            field.
          </>
        ),
      },
    ],
    debuffs: [
      {
        index: 0,
        desc: () => findByCode(sumeruSets, 33)?.setBonuses[1].desc,
        applyDebuff: makeModApplier("resistReduct", "dendro", 30),
      },
    ],
  },
  {
    code: 34,
    name: "Gilded Dreams",
    variants: [4, 5],
    flower: {
      name: "Dreaming Steelbloom",
      icon: "0/0c/Item_Dreaming_Steelbloom",
    },
    plume: {
      name: "Feather of Judgment",
      icon: "1/1b/Item_Feather_of_Judgment",
    },
    sands: {
      name: "The Sunken Years",
      icon: "9/92/Item_The_Sunken_Years",
    },
    goblet: {
      name: "Honeyed Final Feast",
      icon: "f/fa/Item_Honeyed_Final_Feast",
    },
    circlet: {
      name: "Shadow of the Sand King",
      icon: "2/2b/Item_Shadow_of_the_Sand_King",
    },
    setBonuses: [
      {
        desc: (
          <>
            <Green>Elemental Mastery</Green> +<Green b>80</Green>.
          </>
        ),
        applyBuff: makeModApplier("totalAttr", "em", 80),
      },
      {
        get desc() {
          return (
            <>
              Within 8s of triggering an Elemental Reaction, the character equipping this will obtain buffs based on the
              Elemental Type of the other party members. {this.xtraDesc?.[0]} Each of the aforementioned buffs will
              count up to 3 characters. This effect can be triggered once every 8s. The character who equips this can
              still trigger its effects when not on the field.
            </>
          );
        },
        xtraDesc: [
          <>
            <Green>ATK</Green> is increased by <Green b>14%</Green> for each party member whose Elemental Type is the
            same as the equipping character, and <Green b>Elemental Mastery</Green> is increased by <Green b>50</Green>{" "}
            for every party member with a different Elemental Type.
          </>,
        ],
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: () => findByCode(sumeruSets, 34)?.setBonuses[1].xtraDesc?.[0],
        applyBuff: ({ desc, totalAttr, charData, partyData, tracker }) => {
          if (partyData) {
            let atkBuff = 0;
            let emBuff = 0;

            for (const teammate of partyData) {
              if (teammate) {
                if (teammate.vision === charData.vision) {
                  atkBuff += 14;
                } else {
                  emBuff += 50;
                }
              }
            }
            applyModifier(desc, totalAttr, ["atk_", "em"], [atkBuff, emBuff], tracker);
          }
        },
      },
    ],
  },
];

export default sumeruSets;
