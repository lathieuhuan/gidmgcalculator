import type { DataArtifact } from "@Src/types";
import { Green } from "@Src/styled-components";
import { findByCode } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/calculators/utils";

const sumeruSets: DataArtifact[] = [
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
        desc: () => findByCode(sumeruSets, 33)!.setBonuses[1].desc,
        applyDebuff: makeModApplier("resisReduct", "dendro", 30),
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
              {this.xtraDesc![0]} Each of the aforementioned buffs will count up to 3 characters.
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
            const atkBuff = partyData.reduce(
              (result, data) => result + (data.vision === charData.vision ? 14 : 0),
              0
            );
            const emBuff = partyData.reduce(
              (result, data) => result + (data.vision !== charData.vision ? 50 : 0),
              0
            );
            applyModifier(desc, totalAttr, ["atk_", "em"], [atkBuff, emBuff], tracker);
          }
        },
      },
    ],
  },
];

export default sumeruSets;
