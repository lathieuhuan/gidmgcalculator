import type { DataWeapon } from "@Src/types";
import { Green } from "@Src/styled-components";
import { EModAffect, VISION_TYPES } from "@Src/constants";
import { LiyueSeries } from "../series";
import { getInput, applyModifier } from "@Calculators/utils";
import { applyPercent, findByCode } from "@Src/utils";
import { makeWpModApplier } from "../utils";

import aThousandFloatingDreamsImg from "@Src/assets/images/a-thousand-floating-dreams.png";

const goldCatalysts: DataWeapon[] = [
  {
    code: 143,
    beta: true,
    name: "A Thousand Floating Dreams",
    icon: aThousandFloatingDreamsImg,
    rarity: 5,
    mainStatScale: "44b",
    subStat: { type: "em", scale: "58" },
    applyBuff: ({ totalAttr, charData, partyData, refi, desc, tracker }) => {
      if (partyData) {
        const sameVision = partyData.reduce((result, data) => {
          return data.vision === charData.vision ? result + 1 : result;
        }, 0);
        const emBuffValue = sameVision * (24 + refi * 8);
        const elmtDmgBuffValue = (partyData.length - sameVision) * (6 + refi * 4);

        applyModifier(desc, totalAttr, "em", emBuffValue, tracker);
        applyModifier(desc, totalAttr, charData.vision, elmtDmgBuffValue, tracker);
      }
    },
    buffs: [
      {
        index: 1,
        affect: EModAffect.TEAMMATE,
        applyBuff: ({ totalAttr, refi, desc, tracker }) => {
          applyModifier(desc, totalAttr, "em", 38 + refi * 2, tracker);
        },
        desc: ({ refi }) => findByCode(goldCatalysts, 143)!.passiveDesc({ refi }).extra![0],
      },
    ],
    passiveName: "A Thousand Nights' Dawnsong",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            Party members other than the equipping character will provide the equipping character
            with buffs based on whether their Elemental Type is the same as the latter or not. If
            their Elemental Types are the same, increase <Green>Elemental Mastery</Green> by{" "}
            <Green b>{24 + refi * 8}</Green>. If not, increase the equipping character's{" "}
            <Green>DMG Bonus</Green> from their Elemental Type by <Green b>{6 + refi * 4}%</Green>.
            Max <Green b>3</Green> <Green>stacks</Green>. {this.extra![0]}
          </>
        );
      },
      extra: [
        <>
          Additionally, all nearby party members other than the equipping character will have their{" "}
          <Green>Elemental Mastery</Green> increased by <Green b>{38 + refi * 2}</Green>. Multiple
          such effects from multiple such weapons can stack.
        </>,
      ],
    }),
  },
  {
    code: 122,
    name: "Kagura's Verity",
    icon: "b/b7/Weapon_Kagura%27s_Verity",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "cDmg", scale: "14.4%" },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        inputConfig: {
          labels: ["Stacks"],
          renderTypes: ["stacks"],
          initialValues: [1],
          maxValues: [3],
        },
        applyBuff: ({ totalAttr, attPattBonus, refi, inputs, desc, tracker }) => {
          const stack = getInput(inputs, 0, 0);
          applyModifier(desc, attPattBonus, "ES.pct", (9 + refi * 3) * stack, tracker);

          if (stack === 3) {
            applyModifier(desc, totalAttr, [...VISION_TYPES], 9 + refi * 3, tracker);
          }
        },
        desc: ({ refi }) => findByCode(goldCatalysts, 122)!.passiveDesc({ refi }).core,
      },
    ],
    passiveName: "Kagura Dance of the Sacred Sakura",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Gains the Kagura Dance effect when using an Elemental Skill, causing the{" "}
          <Green>Elemental Skill DMG</Green> of the character wielding this weapon to increase by{" "}
          <Green b>{9 + refi * 3}%</Green> for 16s. Max <Green b>3</Green> <Green>stacks</Green>.
          This character will gain <Green b>{9 + refi * 3}%</Green>{" "}
          <Green>All Elemental DMG Bonus</Green> when they possess 3 stacks.
        </>
      ),
    }),
  },
  {
    code: 34,
    name: "Everlasting Moonglow",
    icon: "e/e1/Weapon_Everlasting_Moonglow",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "hp_", scale: "10.8%" },
    applyBuff: makeWpModApplier("totalAttr", "healBn", 10),
    applyFinalBuff: ({ totalAttr, attPattBonus, refi, desc, tracker }) => {
      if (attPattBonus) {
        const buffValue = applyPercent(totalAttr.hp, 0.75 + refi * 0.25);
        applyModifier(desc, attPattBonus, "NA.flat", buffValue, tracker);
      }
    },
    passiveName: "Byakuya Kougetsu",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          <Green>Healing Bonus</Green> increased by <Green b>{7.5 + refi * 2.5}%</Green>,{" "}
          <Green>Normal Attack DMG</Green> is increased by <Green b>{0.75 + refi * 0.25}%</Green> of
          the <Green>Max HP</Green> of the character equipping this weapon. For 12s after using an
          Elemental Burst, Normal Attacks that hit opponents will restore 0.6 Energy. Energy can be
          restored this way once every 0.1s.
        </>
      ),
    }),
  },
  {
    code: 31,
    name: "Skyward Atlas",
    icon: "3/33/Weapon_Skyward_Atlas",
    rarity: 5,
    mainStatScale: "48",
    subStat: { type: "atk_", scale: "7.2%" },
    applyBuff: makeWpModApplier("totalAttr", [...VISION_TYPES], 12),
    passiveName: "Wandering Clouds",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Increases <Green>Elemental DMG Bonus</Green> by <Green b>{9 + refi * 3}%</Green>. Normal
          Attack hits have a <Green>50% chance</Green> to earn the favor of the clouds. which
          actively seek out nearby opponents to attack for 15s, dealing{" "}
          <Green b>{120 + refi * 40}%</Green> <Green>ATK</Green> DMG. Can only occur once every{" "}
          <Green>30s</Green>.
        </>
      ),
    }),
  },
  {
    code: 32,
    name: "Lost Prayer to the Sacred Winds",
    icon: "9/98/Weapon_Lost_Prayer_to_the_Sacred_Winds",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "cRate", scale: "7.2%" },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        inputConfig: {
          labels: ["Stacks"],
          renderTypes: ["stacks"],
          initialValues: [1],
          maxValues: [5],
        },
        applyBuff: ({ totalAttr, refi, inputs, desc, tracker }) => {
          const buffValue = (6 + refi * 2) * getInput(inputs, 0, 0);
          applyModifier(desc, totalAttr, [...VISION_TYPES], buffValue, tracker);
        },
        desc: ({ refi }) => findByCode(goldCatalysts, 32)!.passiveDesc({ refi }).extra![0],
      },
    ],
    passiveName: "Boundless Blessing",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            Increases Movement SPD by 10%. {this.extra![0]} {this.extra![1]}
          </>
        );
      },
      extra: [
        <>
          When in battle, gain an <Green b>{6 + refi * 2}%</Green>{" "}
          <Green>Elemental DMG Bonus</Green> every 4s. Max <Green b>4</Green> stacks.
        </>,
        <>Lasts until the character falls or leaves combat.</>,
      ],
    }),
  },
  {
    code: 33,
    name: "Memory of Dust",
    icon: "c/ca/Weapon_Memory_of_Dust",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "atk_", scale: "10.8%" },
    ...LiyueSeries,
  },
];

export default goldCatalysts;
