import { simpleAnTmaker } from "../../../calculators/helpers";
import { geoDmg, Green } from "../../../styledCpns/DataDisplay";
import { SwordDesc, TravelerInfo, TravelerNCPAs } from "../config";
import { checkCons, xtraTlLv } from "../helpers";

const GeoMC = {
  code: 12,
  name: "Geo Traveler",
  ...TravelerInfo,
  vision: "Geo",
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Foreign Rockblade",
      desc: SwordDesc,
      stats: TravelerNCPAs
    },
    {
      type: "Elemental Skill",
      name: "Starfell Sword",
      image: "0/05/Talent_Starfell_Sword",
      desc: [
        {
          content: (
            <>
              You disgorge a meteorite from the depths of the earth, dealing AoE{" "}
              {geoDmg}.
              <br />
              The meteorite is considered a Geo Construct, and can be climbed or
              used to block attacks.
            </>
          )
        },
        {
          heading: "Hold",
          content: <>This skill's positioning may be adjusted.</>
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 248,
          multType: 2
        }
      ],
      otherStats: () => [
        { name: "Meteorite Duration", value: "30s" },
        { name: "CD", value: "8s" }
      ]
    },
    {
      type: "Elemental Burst",
      name: "Wake of Earth",
      image: "5/5f/Talent_Wake_of_Earth",
      desc: [
        {
          content: (
            <>
              Energizing the Geo deep underground, you set off expanding
              shockwaves.
              <br />
              Launches surrounding opponents back and deals AoE {geoDmg}
              .
              <br />A stone wall is erected at the edges of the shockwave.
              <br />
              The stone wall is considered a Geo Construct, and may be used to
              block attacks.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "DMG per Shockwave",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 148,
          multType: 2
        }
      ],
      otherStats: () => [
        { name: "Stonewall Duration", value: "30s" },
        { name: "CD", value: "15s" }
      ],
      energyCost: 60
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Shattered Darkrock",
      image: "5/5e/Talent_Shattered_Darkrock",
      desc: (
        <>
          Reduces Starfell Sword's <Green>CD</Green> by <Green b>2s</Green>.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Frenzied Rockslide",
      image: "4/40/Talent_Frenzied_Rockslide",
      desc: (
        <>
          The final hit of a Normal Attack combo triggers a collapse, dealing{" "}
          <Green b>60%</Green> of <Green>ATK</Green> as AoE {geoDmg}.
        </>
      )
    }
  ],
  constellation: [
    {
      name: "Invincible Stonewall",
      image: "a/a1/Constellation_Invincible_Stonewall",
      desc: (
        <>
          Party members within the radius of Wake of Earth have their{" "}
          <Green>CRIT Rate</Green> increased by <Green b>10%</Green> and have
          increased resistance against interruption.
        </>
      )
    },
    {
      name: "Rockcore Meltdown",
      image: "f/f4/Constellation_Rockcore_Meltdown",
      desc: (
        <>
          When the meteorite created by Starfell Sword is destroyed, it will
          also explode, dealing additional AoE {geoDmg} equal to the amount of
          damage dealt by Starfell Sword.
        </>
      )
    },
    {
      name: "Will of the Rock",
      image: "1/19/Constellation_Will_of_the_Rock",
      desc: "Wake of Earth"
    },
    {
      name: "Reaction Force",
      image: "4/41/Constellation_Reaction_Force",
      desc: (
        <>
          The shockwave triggered by Wake of Earth regenerates{" "}
          <Green b>5</Green> <Green>Energy</Green> for every opponent hit.
          <br />A <Green>maximum</Green> of <Green b>25</Green>{" "}
          <Green>Energy</Green> can be regenerated in this manner at any one
          time.
        </>
      )
    },
    {
      name: "Meteorite Impact",
      image: "f/fd/Constellation_Meteorite_Impact",
      desc: "Starfell Sword"
    },
    {
      name: "Everlasting Boulder",
      image: "9/95/Constellation_Everlasting_Boulder",
      desc: (
        <>
          The barrier created by Wake of Earth lasts <Green b>5s</Green> longer.
          <br />
          The meteorite created by Starfell Sword lasts <Green b>
            10s
          </Green>{" "}
          longer.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Constellation 1",
      desc: () => GeoMC.constellation[0].desc,
      isGranted: checkCons[1],
      affect: "party",
      addBnes: simpleAnTmaker("ATTRs", "CRIT Rate", 10)
    }
  ]
};

export default GeoMC;
