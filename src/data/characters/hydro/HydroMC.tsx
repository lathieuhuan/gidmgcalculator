import type { DataCharacter } from "@Src/types";
import { Green, Lesser, Rose } from "@Src/pure-components";
import { EModSrc, TRAVELER_INFO, TRAVELLER_NCPAs } from "../constants";
import { finalTalentLv } from "@Src/utils/calculation";
import { charModIsInUse, findInput, talentBuff } from "../utils";
import { EModAffect } from "@Src/constants";
import { applyPercent, round } from "@Src/utils";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";

const HydroMC: DataCharacter = {
  code: 75,
  name: "Hydro Traveler",
  ...TRAVELER_INFO,
  vision: "hydro",
  NAsConfig: {
    name: "Foreign Stream",
  },
  bonusLvFromCons: ["ES", "EB"],
  activeTalents: {
    ...TRAVELLER_NCPAs,
    ES: {
      name: "Aquacrest Saber",
      image: "",
      stats: [
        {
          name: "Torrent Surge",
          multFactors: 189.28,
          getTalentBuff: ({ char, selfBuffCtrls, totalAttr }) => {
            const multiplier = 45;
            const isInUse = charModIsInUse(HydroMC.buffs!, char, selfBuffCtrls, 1);
            const stacks = findInput(selfBuffCtrls, 1, 0);
            const consumedHP = stacks ? stacks * applyPercent(totalAttr.hp, 4) : findInput(selfBuffCtrls, 1, 1);
            let buffValue = applyPercent(consumedHP, multiplier);
            let desc = `${EModSrc.A4} / ${multiplier}% of ${consumedHP} HP consumed`;
            if (buffValue > 5000) {
              buffValue = 5000;
              desc += " / limit to 5000";
            }
            return talentBuff([isInUse, "flat", desc, buffValue]);
          },
        },
        {
          name: "Dewdrop",
          multFactors: 28.8,
          getTalentBuff: ({ char, partyData, selfBuffCtrls, totalAttr }) => {
            const level = finalTalentLv({ char, dataChar: HydroMC, talentType: "ES", partyData });
            const multiplier = round(0.64 * TALENT_LV_MULTIPLIERS[2][level], 2);
            const isInUse = charModIsInUse(HydroMC.buffs!, char, selfBuffCtrls, 0);
            const desc = `Suffusion / ${multiplier}% of ${totalAttr.hp} HP`;
            return talentBuff([isInUse, "flat", desc, applyPercent(totalAttr.hp, multiplier)]);
          },
        },
        { name: "Spiritbreath Thorn", multFactors: 32.8 },
        { name: "Sourcewater Droplet Self Healing (A1)", notAttack: "healing", multFactors: { root: 7, scale: 0 } },
        { name: "Sourcewater Droplet Teammate Healing (C6)", notAttack: "healing", multFactors: { root: 6, scale: 0 } },
        { name: "Aquacrest Aegis (C4)", notAttack: "shield", multFactors: { root: 10, scale: 0 } },
      ],
    },
    EB: {
      name: "Rising Waters",
      image: "",
      stats: [{ name: "Skill DMG", multFactors: 101.87 }],
      energyCost: 80,
    },
  },
  passiveTalents: [
    {
      name: "Spotless Waters",
      image: "",
      desc: (
        <>
          After the Dewdrop fired by the Hold Mode of the Aquacrest Saber hits an opponent, a Sourcewater Droplet will
          be generated near to the Traveler. If the Traveler picks it up, they will restore 7% HP. 1 Droplet can be
          created this way every second, and each use of Aquacrest Saber can create 4 Droplets at most.
        </>
      ),
    },
    {
      name: "Clear Waters",
      image: "",
      desc: (
        <>
          If HP has been consumed via Suffusion [~ES], increases the <Green>Torrent Surge DMG</Green> by{" "}
          <Green b>45%</Green> of the <Green>total HP consumed</Green>. The maximum DMG Bonus that can be gained this
          way is <Rose>5,000</Rose>.
        </>
      ),
    },
  ],
  constellation: [
    {
      name: "Swelling Lake",
      image: "",
      desc: (
        <>
          Picking up a Sourcewater Droplet will restore 2 Energy to the Traveler. Requires the Passive Talent "Spotless
          Waters."
        </>
      ),
    },
    {
      name: "Trickling Purity",
      image: "",
      desc: <>The Movement SPD of Rising Waters' bubble will be decreased by 30%, and its duration increased by 3s.</>,
    },
    { name: "Turbulent Ripples", image: "" },
    {
      name: "Pouring Descent",
      image: "",
      desc: (
        <>
          When using Aquacrest Saber, an Aquacrest Aegis that can absorb 10% of the Traveler's Max HP in DMG will be
          created and will absorb Hydro DMG with 250% effectiveness. It will persist until the Traveler finishes using
          the skill. Once every 2s, after a Dewdrop hits an opponent, if the Traveler is being protected by Aquacrest
          Aegis, the DMG Absorption of the Aegis will be restored to 10% of the Traveler's Max HP. If the Traveler is
          not presently being protected by an Aegis, one will be redeployed.
        </>
      ),
    },
    { name: "Churning Whirlpool", image: "" },
    {
      name: "Tides of Justice",
      image: "",
      desc: (
        <>
          When the Traveler picks up a Sourcewater Droplet, they will restore HP to the nearest party member with the
          lowest HP percentage remaining based on 6% of their Max HP.
        </>
      ),
    },
  ],
  buffs: [
    {
      index: 0,
      src: "Suffusion",
      affect: EModAffect.SELF,
      desc: () => (
        <>
          When the Traveler's HP is higher than 50%, they will continuously lose HP and cause Dewdrop DMG to increase
          based on their HP.
        </>
      ),
    },
    {
      index: 1,
      src: EModSrc.A4,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          {HydroMC.passiveTalents[1].desc}{" "}
          <Lesser>
            HP comsumed will be calculated based on "Suffusion time". "HP consumed" is manually input and should be used
            when Max HP changes while holding. Set "Suffusion time" to 0 to use "HP consumed".
          </Lesser>
        </>
      ),
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
    },
  ],
};

export default HydroMC;
