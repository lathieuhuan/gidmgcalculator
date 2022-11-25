import type { DataArtifact } from "@Src/types";
import { Green } from "@Src/styled-components";
import { EModAffect } from "@Src/constants";
import { applyPercent, findByCode } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Calculators/utils";
import { NCPA_PERCENTS } from "@Data/constants";

const inazumaSets: DataArtifact[] = [
  {
    code: 32,
    name: "Echoes of an Offering",
    variants: [4, 5],
    flower: {
      name: "Soulscent Bloom",
      icon: "6/64/Item_Soulscent_Bloom",
    },
    plume: {
      name: "Jade Leaf",
      icon: "9/97/Item_Jade_Leaf",
    },
    sands: {
      name: "Symbol of Felicitation",
      icon: "0/03/Item_Symbol_of_Felicitation",
    },
    goblet: {
      name: "Chalice of the Font",
      icon: "8/89/Item_Chalice_of_the_Font",
    },
    circlet: {
      name: "Flowing Rings",
      icon: "5/53/Item_Flowing_Rings",
    },
    setBonuses: [
      {
        desc: (
          <>
            <Green>ATK</Green> <Green b>+18%</Green>.
          </>
        ),
        applyBuff: makeModApplier("totalAttr", "atk_", 18),
      },
      {
        get desc() {
          return (
            <>
              {this.xtraDesc![0]} This effect will be dispelled 0.05s after a Normal Attack deals
              DMG. {this.xtraDesc![1]} This trigger can occur once every 0.2s.
            </>
          );
        },
        xtraDesc: [
          <>
            When Normal Attacks hit opponents, there is a <Green b>36%</Green> <Green>chance</Green>{" "}
            that it will trigger Valley Rite, which will increase <Green>Normal Attack DMG</Green>{" "}
            by <Green b>70%</Green> of <Green>ATK</Green>.
          </>,
          <>
            If a Normal Attack fails to trigger Valley Rite, the <Green>odds</Green> of it
            triggering the next time will increase by <Green b>20%</Green>.
          </>,
        ],
      },
    ],
    buffs: [
      {
        index: 0,
        desc: () => {
          const { xtraDesc } = findByCode(inazumaSets, 32)!.setBonuses[1];
          return (
            <>
              {xtraDesc![0]} {xtraDesc![1]}
            </>
          );
        },
        affect: EModAffect.SELF,
        applyFinalBuff: ({ totalAttr, attPattBonus, desc, tracker }) => {
          applyModifier(desc, attPattBonus, "NA.flat", applyPercent(totalAttr.atk, 70), tracker);
        },
      },
    ],
  },
  {
    code: 31,
    name: "Vermillion Hereafter",
    variants: [4, 5],
    flower: {
      name: "Flowering Life",
      icon: "1/11/Item_Flowering_Life",
    },
    plume: {
      name: "Feather of Nascent Light",
      icon: "a/a7/Item_Feather_of_Nascent_Light",
    },
    sands: {
      name: "Solar Relic",
      icon: "1/12/Item_Solar_Relic",
    },
    goblet: {
      name: "Moment of the Pact",
      icon: "7/77/Item_Moment_of_the_Pact",
    },
    circlet: {
      name: "Thundering Poise",
      icon: "0/0e/Item_Thundering_Poise",
    },
    setBonuses: [
      {
        desc: (
          <>
            <Green>ATK</Green> <Green b>+18%</Green>.
          </>
        ),
        applyBuff: makeModApplier("totalAttr", "atk_", 18),
      },
      {
        get desc() {
          return (
            <>
              {this.xtraDesc![0]} This effect can be triggered once every 0.8s. Nascent Light will
              be dispelled when the character leaves the field. If an Elemental Burst is used again
              during the duration of Nascent Light, the original Nascent Light will be dispelled.
            </>
          );
        },
        xtraDesc: [
          <>
            After using an Elemental Burst, this character will gain the Nascent Light effect,
            increasing their <Green>ATK</Green> by <Green b>8%</Green> for 16s. When the character's
            HP decreases, Their <Green>ATK</Green> will further increase by <Green b>10%</Green>.
            This increase can occur this way a maximum of <Green b>4</Green> <Green>times</Green>.
          </>,
        ],
      },
    ],
    buffs: [
      {
        index: 0,
        desc: () => findByCode(inazumaSets, 31)!.setBonuses[1].xtraDesc![0],
        affect: EModAffect.SELF,
        inputConfigs: [
          {
            type: "stacks",
            initialValue: 0,
            max: 4,
          },
        ],
        applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
          applyModifier(desc, totalAttr, "atk_", 10 * (inputs[0] || 0) + 8, tracker);
        },
      },
    ],
  },
  {
    code: 1,
    name: "Emblem of Severed Fate",
    variants: [4, 5],
    flower: {
      name: "Magnificent Tsuba",
      icon: "5/53/Item_Magnificent_Tsuba",
    },
    plume: {
      name: "Sundered Feather",
      icon: "d/d6/Item_Sundered_Feather",
    },
    sands: {
      name: "Storm Cage",
      icon: "e/e5/Item_Storm_Cage",
    },
    goblet: {
      name: "Scarlet Vessel",
      icon: "0/00/Item_Scarlet_Vessel",
    },
    circlet: {
      name: "Ornate Kabuto",
      icon: "0/04/Item_Ornate_Kabuto",
    },
    setBonuses: [
      {
        desc: (
          <>
            <Green>Energy Recharge</Green> <Green b>+20%</Green>.
          </>
        ),
        applyBuff: makeModApplier("totalAttr", "er", 20),
      },
      {
        desc: (
          <>
            Increases <Green>Elemental Burst DMG</Green> by <Green b>25%</Green> of{" "}
            <Green>Energy Recharge</Green>. A maximum of <Green b>75%</Green>{" "}
            <Green>bonus DMG</Green> can be obtained in this way.
          </>
        ),
        applyFinalBuff: ({ attPattBonus, totalAttr, desc, tracker }) => {
          if (attPattBonus) {
            let buffValue = Math.round(totalAttr.er * 25) / 100;
            buffValue = Math.min(buffValue, 75);
            applyModifier(desc, attPattBonus, "EB.pct", Math.min(buffValue, 75), tracker);
          }
        },
      },
    ],
  },
  {
    code: 2,
    name: "Shimenawa's Reminiscence",
    variants: [4, 5],
    flower: {
      name: "Entangling Bloom",
      icon: "c/c2/Item_Entangling_Bloom",
    },
    plume: {
      name: "Shaft of Remembrance",
      icon: "4/41/Item_Shaft_of_Remembrance",
    },
    sands: {
      name: "Morning Dew's Moment",
      icon: "9/92/Item_Morning_Dew%27s_Moment",
    },
    goblet: {
      name: "Hopeful Heart",
      icon: "8/86/Item_Hopeful_Heart",
    },
    circlet: {
      name: "Capricious Visage",
      icon: "8/8f/Item_Capricious_Visage",
    },
    setBonuses: [
      {
        desc: (
          <>
            <Green>ATK</Green> <Green b>+18%</Green>.
          </>
        ),
        applyBuff: makeModApplier("totalAttr", "atk_", 18),
      },
      {
        desc: (
          <>
            When casting an Elemental Skill, if the character has 15 or more Energy, they lose 15
            Energy and <Green>Normal/Charged/Plunging Attack DMG</Green> is increased by{" "}
            <Green b>50%</Green> for 10s.
          </>
        ),
      },
    ],
    buffs: [
      {
        index: 0,
        desc: () => findByCode(inazumaSets, 2)!.setBonuses[1].desc,
        affect: EModAffect.SELF,
        applyBuff: ({ attPattBonus, desc, tracker }) => {
          applyModifier(desc, attPattBonus, [...NCPA_PERCENTS], 50, tracker);
        },
      },
    ],
  },
  {
    code: 3,
    name: "Husk of Opulent Dreams",
    variants: [4, 5],
    flower: {
      name: "Bloom Times",
      icon: "2/2b/Item_Bloom_Times",
    },
    plume: {
      name: "Plume of Luxury",
      icon: "2/2d/Item_Plume_of_Luxury",
    },
    sands: {
      name: "Song of Life",
      icon: "4/4f/Item_Song_of_Life",
    },
    goblet: {
      name: "Calabash of Awakening",
      icon: "6/63/Item_Calabash_of_Awakening",
    },
    circlet: {
      name: "Skeletal Hat",
      icon: "8/84/Item_Skeletal_Hat",
    },
    setBonuses: [
      {
        desc: (
          <>
            <Green>DEF</Green> <Green b>+30%</Green>.
          </>
        ),
        applyBuff: makeModApplier("totalAttr", "def_", 30),
      },
      {
        desc: (
          <>
            A character equipped with this Artifact set will obtain the Curiosity effect in the
            following conditions: When on the field, the character gains 1 stack after hitting an
            opponent with a Geo attack, triggering a maximum of once every 0.3s. When off the field,
            the character gains 1 stack every 3s. Curiosity can stack up to <Green b>4</Green>{" "}
            <Green>times</Green>, each providing <Green b>6%</Green> <Green>DEF</Green> and a{" "}
            <Green b>6%</Green> <Green>Geo DMG Bonus</Green>. When 6 seconds pass without gaining a
            Curiosity stack, 1 stack is lost.
          </>
        ),
      },
    ],
    buffs: [
      {
        index: 0,
        desc: () => (
          <>
            Curiosity can stack up to <Green b>4</Green> <Green>times</Green>, each providing{" "}
            <Green b>6%</Green> <Green>DEF</Green> and a <Green b>6%</Green>{" "}
            <Green>Geo DMG Bonus</Green>.
          </>
        ),
        affect: EModAffect.SELF,
        inputConfigs: [
          {
            type: "stacks",
            max: 4,
          },
        ],
        applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
          applyModifier(desc, totalAttr, ["def_", "geo"], 6 * (inputs[0] || 0), tracker);
        },
      },
    ],
  },
  {
    code: 4,
    name: "Ocean-Hued Clam",
    variants: [4, 5],
    flower: {
      name: "Sea-Dyed Blossom",
      icon: "5/58/Item_Sea-Dyed_Blossom",
    },
    plume: {
      name: "Deep Palace's Plume",
      icon: "3/33/Item_Deep_Palace%27s_Plume",
    },
    sands: {
      name: "Cowry of Parting",
      icon: "e/ed/Item_Cowry_of_Parting",
    },
    goblet: {
      name: "Pearl Cage",
      icon: "f/fc/Item_Pearl_Cage",
    },
    circlet: {
      name: "Crown of Watatsumi",
      icon: "6/60/Item_Crown_of_Watatsumi",
    },
    setBonuses: [
      {
        desc: (
          <>
            <Green>Healing Bonus</Green> <Green b>+15%</Green>.
          </>
        ),
        applyBuff: makeModApplier("totalAttr", "healBn", 15),
      },
      {
        desc: (
          <>
            When the character equipping this artifact set heals a character in the party, a
            Sea-Dyed Foam will appear for 3 seconds, accumulating the amount of HP recovered from
            healing (including overflow healing). At the end of the duration, the Sea-Dyed Foam will
            explode, dealing DMG to nearby opponents based on 90% of the accumulated healing. (This
            DMG is calculated similarly to Reactions such as Electro-Charged, and Superconduct, but
            it is not affected by Elemental Mastery, Character Levels, or Reaction DMG Bonuses).
            Only one Sea-Dyed Foam can be produced every 3.5 seconds. Each Sea-Dyed Foam can
            accumulate up to 30,000 HP (including overflow healing). There can be no more than one
            Sea-Dyed Foam active at any given time. This effect can still be triggered even when the
            character who is using this artifact set is not on the field.
          </>
        ),
      },
    ],
  },
];

export default inazumaSets;
