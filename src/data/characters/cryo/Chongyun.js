import { addAndTrack, simpleAnTmaker } from "../../../calculators/helpers";
import { NAs } from "../../../configs";
import { Cryo, cryoDmg, Green } from "../../../styledCpns/DataDisplay";
import { CaStaminaClaymore, ClaymoreDesc_4spin, heavyPAs } from "../config";
import { checkAscs, checkCons, xtraTlLv } from "../helpers";

const Chongyun = {
  code: 4,
  name: "Chongyun",
  icon: "6/68/Character_Chongyun_Thumb",
  sideIcon: "c/cc/Character_Chongyun_Side_Icon",
  rarity: 4,
  nation: "Liyue",
  vision: "Cryo",
  weapon: "Claymore",
  stats: [
    { "Base HP": 921, "Base ATK": 19, "Base DEF": 54 },
    { "Base HP": 2366, "Base ATK": 48, "Base DEF": 140 },
    { "Base HP": 3054, "Base ATK": 62, "Base DEF": 180 },
    { "Base HP": 4574, "Base ATK": 93, "Base DEF": 270 },
    { "Base HP": 5063, "Base ATK": 103, "Base DEF": 299, "ATK%": 6 },
    { "Base HP": 5824, "Base ATK": 119, "Base DEF": 344, "ATK%": 6 },
    { "Base HP": 6475, "Base ATK": 131, "Base DEF": 382, "ATK%": 12 },
    { "Base HP": 7236, "Base ATK": 147, "Base DEF": 427, "ATK%": 12 },
    { "Base HP": 7725, "Base ATK": 157, "Base DEF": 456, "ATK%": 12 },
    { "Base HP": 8485, "Base ATK": 172, "Base DEF": 501, "ATK%": 12 },
    { "Base HP": 8974, "Base ATK": 182, "Base DEF": 530, "ATK%": 18 },
    { "Base HP": 9734, "Base ATK": 198, "Base DEF": 575, "ATK%": 18 },
    { "Base HP": 10223, "Base ATK": 208, "Base DEF": 603, "ATK%": 24 },
    { "Base HP": 10874, "Base ATK": 223, "Base DEF": 648, "ATK%": 24 }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Demonbane",
      desc: ClaymoreDesc_4spin,
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 70,
          multType: 1
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 63.12,
          multType: 1
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 80.32,
          multType: 1
        },
        {
          name: "4-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 101.22,
          multType: 1
        },
        {
          name: "Charged Attack Spinning",
          dmgTypes: ["CA", "Physical"],
          baseMult: 56.29,
          multType: 1
        },
        {
          name: "Charged Attack Final",
          dmgTypes: ["CA", "Physical"],
          baseMult: 101.78,
          multType: 1
        },
        ...CaStaminaClaymore,
        ...heavyPAs
      ]
    },
    {
      type: "Elemental Skill",
      name: "Spirit Blade: Chonghua's Layered Frost",
      image: "a/aa/Talent_Spirit_Blade_Chonghua%27s_Layered_Frost",
      desc: [
        {
          get content() {
            return (
              <>
                Chongyun strikes the ground with his greatsword, causing a Cryo
                explosion in a circular AoE in front of him that deals {cryoDmg}
                .
                <br />
                {this.buff}
              </>
            );
          },
          buff: (
            <>
              After a short delay, the cold air created by the Cryo explosion
              will coalesce into a Chonghua Frost Field, within which all Sword,
              Claymore and Polearm-wielding characters' weapons will be{" "}
              <Green>infused</Green> with <Cryo>Cryo</Cryo>.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 172.04,
          multType: 2
        }
      ],
      otherStats: (lv) => [
        {
          name: "Infusion Duration",
          value: Math.min(19 + lv, 30) / 10 + "s"
        },
        { name: "Field Duration", value: "10s" },
        { name: "CD", value: "15s" }
      ]
    },
    {
      type: "Elemental Burst",
      name: "Spirit Blade: Cloud-Parting Star",
      image: "9/93/Talent_Spirit_Blade_Cloud-Parting_Star",
      desc: [
        {
          content: (
            <>
              Performing the secret hand seals, Chongyun summons 3 giant spirit
              blades in mid-air that fall to the earth one by one after a short
              delay, exploding as they hit the ground. When the spirit blades
              explode, they will deal AoE {cryoDmg} and launch opponents.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 142.4,
          multType: 2
        }
      ],
      otherStats: () => [{ name: "CD", value: "12s" }],
      energyCost: 40
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Steady Breathing",
      image: "4/49/Talent_Steady_Breathing",
      desc: (
        <>
          Sword, Claymore, or Polearm-wielding characters within the field
          created by Spirit Blade: Chonghua's Layered Frost have their{" "}
          <Green>Normal ATK SPD</Green> increased by <Green b>8%</Green>.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Rimechaser Blade",
      image: "1/12/Talent_Rimechaser_Blade",
      desc: (
        <>
          When the field created by Spirit Blade: Chonghua's Layered Frost
          disappears, another spirit blade will be summoned to strike nearby
          opponents and decrease their <Green>Cryo RES</Green> by{" "}
          <Green b>10%</Green> for 8s.
        </>
      )
    },
    {
      type: "Passive",
      name: "Gallant Journey",
      image: "c/c4/Talent_Gallant_Journey",
      desc: (
        <>
          When dispatched on an <Green>expedition</Green> in Liyue,{" "}
          <Green>time consumed</Green> is reduced by <Green b>25%</Green>.
        </>
      )
    }
  ],
  constellation: [
    {
      name: "Ice Unleashed",
      image: "d/db/Constellation_Ice_Unleashed",
      desc: (
        <>
          The last attack of Chongyun's Normal Attack combo releases{" "}
          <Green b>3</Green> ice blades. Each blade deals <Green b>50%</Green>{" "}
          of Chongyun's <Green>ATK</Green> as {cryoDmg} to all opponents in its
          path.
        </>
      )
    },
    {
      name: "Atmospheric Revolution",
      image: "8/8f/Constellation_Atmospheric_Revolution",
      desc: (
        <>
          Elemental Skills and Elemental Bursts cast within the Frost Field
          created by Spirit Blade: Chonghua's Layered Frost have their{" "}
          <Green>CD</Green> time decreased by <Green b>15%</Green>.
        </>
      )
    },
    {
      name: "Cloudburst",
      image: "b/b6/Constellation_Cloudburst",
      desc: "Spirit Blade: Cloud-parting Star"
    },
    {
      name: "Frozen Skies",
      image: "9/99/Constellation_Frozen_Skies",
      desc: (
        <>
          Chongyun regenerates <Green b>1</Green> <Green>Energy</Green> every
          time he hits an opponent affected by Cryo.
          <br />
          This effect can only occur once every 2s.
        </>
      )
    },
    {
      name: "The True Path",
      image: "3/33/Constellation_The_True_Path",
      desc: "Spirit Blade: Chonghua's Layered Frost "
    },
    {
      name: "Rally of Four Blades",
      image: "1/18/Constellation_Rally_of_Four_Blades",
      desc: (
        <>
          <Green>Spirit Blade: Cloud-Parting Star</Green> deals{" "}
          <Green b>15%</Green> <Green>more DMG</Green> to opponents with a lower
          percentage of their Max HP remaining than Chongyun.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Elemental Skill",
      desc: () => Chongyun.actvTalents[1].desc[0].buff,
      isGranted: () => true,
      affect: "party",
      canInfuse: ({ weapon }) =>
        ["Sword", "Claymore", "Polearm"].includes(weapon),
      infuseElmt: "Cryo",
      infuseRange: NAs,
      canBeOverrided: true
    },
    {
      index: 1,
      src: "Ascension 1 Passive Talent",
      desc: () => Chongyun.pasvTalents[0].desc,
      isGranted: checkAscs[1],
      affect: "party",
      addBnes: ({ ATTRs, charData, tkDesc, tracker }) => {
        if (["Sword", "Claymore", "Polearm"].includes(charData.weapon))
          addAndTrack(tkDesc, ATTRs, "Normal ATK SPD", 8, tracker);
      }
    },
    {
      index: 2,
      src: "Constellation 6",
      desc: () => Chongyun.constellation[5].desc,
      isGranted: checkCons[6],
      affect: "self",
      addBnes: ({ hitBnes, tkDesc, tracker }) => {
        addAndTrack(tkDesc, hitBnes, "EB.pct", 15, tracker);
      }
    }
  ],
  debuffs: [
    {
      index: 0,
      src: "Ascension 4 Passive Talent",
      desc: () => Chongyun.pasvTalents[1].desc,
      isGranted: checkAscs[4],
      addPntes: simpleAnTmaker("rdMult", "Cryo_rd", 10)
    }
  ]
};

export default Chongyun;
