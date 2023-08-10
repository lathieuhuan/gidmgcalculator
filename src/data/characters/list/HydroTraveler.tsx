import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyPercent, round } from "@Src/utils";
import { EModSrc, TRAVELER_INFO, TRAVELLER_NCPAs } from "../constants";
import { checkAscs, exclBuff, getTalentMultiplier } from "../utils";

const HydroTraveler: DefaultAppCharacter = {
  code: 75,
  name: "Hydro Traveler",
  ...TRAVELER_INFO,
  vision: "hydro",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  calcList: {
    ...TRAVELLER_NCPAs,
    ES: [
      { id: "ES.0", name: "Torrent Surge", multFactors: 189.28 },
      { id: "ES.1", name: "Dewdrop", multFactors: 32.8 },
      { name: "Spiritbreath Thorn", multFactors: 32.8 },
      {
        name: "Sourcewater Droplet Self Healing (A1)",
        type: "healing",
        multFactors: { root: 7, scale: 0, attributeType: "hp" },
      },
      {
        name: "Sourcewater Droplet Teammate Healing (C6)",
        type: "healing",
        multFactors: { root: 6, scale: 0, attributeType: "hp" },
      },
      {
        name: "Aquacrest Aegis (C4)",
        type: "shield",
        multFactors: { root: 10, scale: 0, attributeType: "hp" },
      },
    ],
    EB: [
      {
        name: "Skill DMG",
        multFactors: 101.87,
      },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Foreign Stream",
    },
    ES: {
      name: "Aquacrest Saber",
      image: "",
    },
    EB: {
      name: "Rising Waters",
      image: "",
    },
  },
  passiveTalents: [
    {
      name: "Spotless Waters",
      image: "",
      description:
        "After the Dewdrop fired by the Hold Mode of the Aquacrest Saber hits an opponent, a Sourcewater Droplet will be generated near to the Traveler. If the Traveler picks it up, they will restore 7% HP. 1 Droplet can be created this way every second, and each use of Aquacrest Saber can create 4 Droplets at most.",
    },
    {
      name: "Clear Waters",
      image: "",
      description:
        "If HP has been consumed via Suffusion [~ES], increases the Torrent Surge DMG by 45% of the total HP consumed. The maximum DMG Bonus that can be gained this way is 5,000.",
    },
  ],
  constellation: [
    {
      name: "Swelling Lake",
      image: "",
      description:
        'Picking up a Sourcewater Droplet will restore 2 Energy to the Traveler. Requires the Passive Talent "Spotless Waters."',
    },
    {
      name: "Trickling Purity",
      image: "",
      description:
        "The Movement SPD of Rising Waters' bubble will be decreased by 30%, and its duration increased by 3s.",
    },
    { name: "Turbulent Ripples", image: "" },
    {
      name: "Pouring Descent",
      image: "",
      description: `When using Aquacrest Saber, an Aquacrest Aegis that can absorb 10% of the Traveler's Max HP in DMG will be created and will absorb Hydro DMG with 250% effectiveness. It will persist until the Traveler finishes using the skill. Once every 2s, after a Dewdrop hits an opponent, if the Traveler is being protected by Aquacrest Aegis, the DMG Absorption of the Aegis will be restored to 10% of the Traveler's Max HP. If the Traveler is not presently being protected by an Aegis, one will be redeployed.`,
    },
    { name: "Churning Whirlpool", image: "" },
    {
      name: "Tides of Justice",
      image: "",
      description:
        "When the Traveler picks up a Sourcewater Droplet, they will restore HP to the nearest party member with the lowest HP percentage remaining based on 6% of their Max HP.",
    },
  ],
  buffs: [
    {
      index: 0,
      src: "Suffusion [~ES]",
      affect: EModAffect.SELF,
      description: `When the Traveler's HP is higher than 50%, they will continuously lose HP and cause
      {Dewdrop DMG}#[gr] to increase based on their {HP}#[gr].`,
      applyFinalBuff: (obj) => {
        const [level, mult] = getTalentMultiplier({ talentType: "ES", root: 2 }, HydroTraveler as AppCharacter, obj);
        const buffValue = applyPercent(obj.totalAttr.hp, mult);
        const description = `Suffusion Lv.${level} / ${round(mult, 2)}% of Max HP`;
        obj.calcItemBuffs.push(exclBuff(description, "ES.1", "flat", buffValue));
      },
    },
    {
      index: 1,
      src: EModSrc.A4,
      isGranted: checkAscs[4],
      affect: EModAffect.SELF,
      description: `If HP has been consumed via Suffusion [~ES], increases the {Torrent Surge DMG}#[gr] by {45%}#[b,gr]
      of the {total HP consumed}#[gr]. The maximum DMG Bonus that can be gained this way is {5,000}#[r].
      <br />{HP comsumed will be calculated based on "Suffusion time". "HP consumed" can be manually input and should be used when Max HP changes while holding. Set "Suffusion time" to 0 to use "HP consumed".}#[l]`,
      inputConfigs: [
        {
          type: "stacks",
          label: "Suffusion time (max 6s)",
          initialValue: 0,
          max: 6,
        },
        {
          type: "text",
          label: "HP consumed",
          max: 99999,
        },
      ],
      applyFinalBuff: ({ calcItemBuffs, inputs, totalAttr }) => {
        const multiplier = 45;
        const stacks = inputs[0] || 0;
        const consumedHP = stacks ? stacks * applyPercent(totalAttr.hp, 4) : inputs[1] || 0;
        let buffValue = applyPercent(consumedHP, multiplier);
        let desc = `${EModSrc.A4} / ${multiplier}% of ${consumedHP} HP consumed`;
        if (buffValue > 5000) {
          buffValue = 5000;
          desc += " / limit to 5000";
        }
        calcItemBuffs.push(exclBuff(desc, "ES.0", "flat", buffValue));
      },
    },
  ],
};

export default HydroTraveler as AppCharacter;
