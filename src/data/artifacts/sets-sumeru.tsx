import type { DataArtifact } from "@Src/types";
import { Green, Rose } from "@Components/atoms";
import { findByCode } from "@Src/utils";
import { applyModifier, makeModApplier, ReactionBonusPath } from "@Src/utils/calculation";
import { EModAffect } from "@Src/constants";

const sumeruSets: DataArtifact[] = [
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
            When Charged Attacks hit opponents, the equipping character's{" "}
            <Green>Normal Attack SPD</Green> will increase by <Green b>10%</Green> while{" "}
            <Green>Normal, Charged, and Plunging Attack DMG</Green> will increase by{" "}
            <Green b>40%</Green> for 10s.
          </>
        ),
      },
    ],
    buffs: [
      {
        index: 0,
        desc: () => findByCode(sumeruSets, 36)?.setBonuses[1].desc,
        affect: EModAffect.SELF,
        applyBuff: ({ totalAttr, attPattBonus, desc, tracker }) => {
          applyModifier(desc, totalAttr, "naAtkSpd", 10, tracker);
          applyModifier(desc, attPattBonus, ["NA.pct", "CA.pct", "PA.pct"], 40, tracker);
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
              The equipping character's <Green>Bloom, Hyperbloom, and Burgeon reaction DMG</Green>{" "}
              are increased by <Green b>40%</Green>. {this.xtraDesc?.[0]} This effect can only be
              triggered once per second. The character who equips this can still trigger its effects
              when not on the field.
            </>
          );
        },
        xtraDesc: [
          <>
            Additionally, when the equipping character triggers Bloom, Hyperbloom, or Burgeon, they
            will gain another <Green b>25%</Green> bonus to the effect mentioned prior. Each stack
            of this lasts 10s. Max <Rose>4</Rose> stacks.
          </>,
        ],
        applyBuff: makeModApplier("rxnBonus", ["bloom.pct", "hyperbloom.pct", "burgeon.pct"], 40),
      },
    ],
    buffs: [
      {
        index: 0,
        desc: () => findByCode(sumeruSets, 35)?.setBonuses[1]?.xtraDesc?.[0],
        affect: EModAffect.SELF,
        inputConfigs: [
          {
            type: "stacks",
            max: 4,
          },
        ],
        applyBuff: ({ rxnBonus, inputs, desc, tracker }) => {
          const fields: ReactionBonusPath[] = ["bloom.pct", "hyperbloom.pct", "burgeon.pct"];
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
            After Elemental Skills or Bursts hit opponents, the targets' <Green>Dendro RES</Green>{" "}
            will be decreased by <Green b>30%</Green> for 8s. This effect can be triggered even if
            the equipping character is not on the field.
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
              Within 8s of triggering an Elemental Reaction, the character equipping this will
              obtain buffs based on the Elemental Type of the other party members.{" "}
              {this.xtraDesc?.[0]} Each of the aforementioned buffs will count up to 3 characters.
              This effect can be triggered once every 8s. The character who equips this can still
              trigger its effects when not on the field.
            </>
          );
        },
        xtraDesc: [
          <>
            <Green>ATK</Green> is increased by <Green b>14%</Green> for each party member whose
            Elemental Type is the same as the equipping character, and{" "}
            <Green b>Elemental Mastery</Green> is increased by <Green b>50</Green> for every party
            member with a different Elemental Type.
          </>,
        ],
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
