import type { DataArtifact } from "@Src/types";
import { Green } from "@Src/styled-components";
import { findByCode } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/calculators/utils";

const sumeruSets: DataArtifact[] = [
  {
    code: 33,
    beta: true,
    name: "Deepwood Memories",
    variants: [4, 5],
    flower: {
      name: "Labyrinth Wayfarer",
      icon: "https://i.ibb.co/kyRvxjF/deepwood-memories-flower.png",
    },
    plume: {
      name: "Scholar of Vines",
      icon: "https://i.ibb.co/ZhZsDr7/deepwood-memories-plume.png",
    },
    sands: {
      name: "A Time of Insight",
      icon: "https://i.ibb.co/hD4rDVM/deepwood-memories-sands.png",
    },
    goblet: {
      name: "Lamp of the Lost",
      icon: "https://i.ibb.co/JHQhwd8/deepwood-memories-goblet.png",
    },
    circlet: {
      name: "Laurel Coronet",
      icon: "https://i.ibb.co/jzBH3CH/deepwood-memories-circlet.png",
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
    beta: true,
    name: "Gilded Dreams",
    variants: [4, 5],
    flower: {
      name: "Dreaming Steelbloom",
      icon: "https://i.ibb.co/GHWrzz6/gilded-dreams-flower.png",
    },
    plume: {
      name: "Feather of Judgment",
      icon: "https://i.ibb.co/Rpsd1xb/gilded-dreams-plume.png",
    },
    sands: {
      name: "The Sunken Years",
      icon: "https://i.ibb.co/Ch9wNYb/gilded-dreams-sands.png",
    },
    goblet: {
      name: "Honeyed Final Feast",
      icon: "https://i.ibb.co/0tNRvbg/gilded-dreams-goblet.png",
    },
    circlet: {
      name: "Shadow of the Sand King",
      icon: "https://i.ibb.co/yWmmy7g/gilded-dreams-circlet.png",
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
              (result, data) => result + (data.vision === charData.vision ? 1 : 0),
              0
            );
            const emBuff = partyData.reduce(
              (result, data) => result + (data.vision !== charData.vision ? 1 : 0),
              0
            );
            applyModifier(desc, totalAttr, ["atk_", "em"], [atkBuff * 14, emBuff * 50], tracker);
          }
        },
      },
    ],
  },
];

export default sumeruSets;
