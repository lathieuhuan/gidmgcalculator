import { addAndTrack, simpleAnTmaker } from "../../../calculators/helpers";
import { anemoDmg, Green } from "../../../styledCpns/DataDisplay";
import { SwordDesc, TravelerInfo, TravelerNCPAs } from "../config";
import { checkCons, xtraTlLv } from "../helpers";

const AnemoMC = {
  ...TravelerInfo,
  code: 1,
  name: "Anemo Traveler",
  vision: "Anemo",
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Foreign Ironwind",
      desc: SwordDesc,
      stats: TravelerNCPAs
    },
    {
      type: "Elemental Skill",
      name: "Palm Vortex",
      image: "0/07/Talent_Palm_Vortex",
      desc: [
        {
          content: (
            <>
              Grasping the wind's might, you form a vortex of vacuum in your
              palm, causing continuous {anemoDmg} to opponents in front of you.
              <br />
              The vacuum vortex explodes when the skill duration ends, causing a
              greater amount of {anemoDmg} over a larger area.
            </>
          )
        },
        { heading: "Hold", content: "DMG and AoE will gradually increase." },
        { heading: "Elemental Absorption", content: "the vortex" }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Initial Cutting",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 12,
          multType: 2
        },
        {
          name: "Max Cutting",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 16.8,
          multType: 2
        },
        {
          name: "Initial Storm",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 176,
          multType: 2
        },
        {
          name: "Max Storm",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 192,
          multType: 2
        }
      ],
      otherStats: () => [
        { name: "Base CD", value: "5s" },
        { name: "Max Charging CD", value: "8s" }
      ]
    },
    {
      type: "Elemental Burst",
      name: "Gust Surge",
      image: "9/98/Talent_Gust_Surge",
      desc: [
        {
          content: (
            <>
              Guiding the path of the wind currents, you summon a forward-moving
              tornado that pulls objects and opponents towards itself, dealing
              continuous {anemoDmg}.
            </>
          )
        },
        {
          heading: "Elemental Absorption",
          content: "the tornado"
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Tornado DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 80.8,
          multType: 2
        },
        {
          name: "Additional Elemental DMG",
          dmgTypes: ["EB", "Various"],
          baseMult: 24.8,
          multType: 2
        }
      ],
      otherStats: () => [
        { name: "Duration", value: "6s" },
        { name: "CD", value: "15" }
      ],
      energyCost: 60
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Slitting Wind",
      image: "2/22/Talent_Slitting_Wind",
      desc: (
        <>
          The last hit of a Normal Attack combo unleashes a wind blade, dealing{" "}
          <Green b>60%</Green> of <Green>ATK</Green> as {anemoDmg} to all
          opponents in its path.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Second Wind",
      image: "5/5e/Talent_Second_Wind",
      desc: (
        <>
          Palm Vortex kills regenerate <Green b>2%</Green> <Green>HP</Green> for
          5s. This effect can only occur once every 5s.
        </>
      )
    }
  ],
  constellation: [
    {
      name: "Raging Vortex",
      image: "6/67/Constellation_Raging_Vortex",
      desc: <>Palm Vortex pulls in opponents and objects within a 5m radius.</>
    },
    {
      name: "Uprising Whirlwind",
      image: "d/d4/Constellation_Uprising_Whirlwind",
      desc: (
        <>
          Increases <Green>Energy Recharge</Green> by <Green b>16%</Green>.
        </>
      )
    },
    {
      name: "Sweeping Gust",
      image: "c/c6/Constellation_Sweeping_Gust",
      desc: "Gust Surge"
    },
    {
      name: "Cherishing Breezes",
      image: "6/6e/Constellation_Cherishing_Breezes",
      desc: (
        <>
          Reduces <Green>DMG taken</Green> while casting Palm Vortex by{" "}
          <Green b>10%</Green>.
        </>
      )
    },
    {
      name: "Vortex Stellaris",
      image: "9/98/Constellation_Vortex_Stellaris",
      desc: "Palm Vortex"
    },
    {
      name: "Intertwined Winds",
      image: "8/87/Constellation_Intertwined_Winds",
      desc: (
        <>
          Targets who take DMG from Gust Surge have their{" "}
          <Green>Anemo RES</Green> decreased by <Green b>20%</Green>.<br />
          If an Elemental Absorption occurred, then their <Green>
            RES
          </Green>{" "}
          towards the <Green>corresponding Element</Green> is also decreased by{" "}
          <Green b>20%</Green>.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Constellation 2",
      desc: () => AnemoMC.constellation[1].desc,
      isGranted: checkCons[2],
      affect: "self",
      addBnes: simpleAnTmaker("ATTRs", "Energy Recharge", 16)
    }
  ],
  debuffs: [
    {
      index: 0,
      src: "Constellation 6",
      desc: () => AnemoMC.constellation[5].desc,
      isGranted: checkCons[6],
      selfLabels: ["Element Absorbed"],
      labels: ["Element Absorbed"],
      inputTypes: ["absorption"],
      addPntes: ({ rdMult, inputs, tkDesc, tracker }) => {
        const fields = ["Anemo_rd", `${inputs[0]}_rd`];
        addAndTrack(tkDesc, rdMult, fields, 20, tracker);
      }
    }
  ]
};

export default AnemoMC;
