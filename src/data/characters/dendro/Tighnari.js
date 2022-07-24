import { addAndTrack, simpleAnTmaker } from "../../../calculators/helpers";
import { Green } from "../../../styledCpns/DataDisplay";
import { lightPAs_Bow } from "../config";
import { checkAscs, checkCons, xtraTlLv } from "../helpers";

const Tighnari = {
  code: 54,
  beta: true,
  name: "Tighnari",
  icon: "https://i.ibb.co/VpczyBc/tighnari.png",
  sideIcon: "",
  rarity: 5,
  nation: "Sumeru",
  vision: "Dendro",
  weapon: "Bow",
  stats: [
    { "Base HP": 845, "Base ATK": 21, "Base DEF": 49 },
    { "Base HP": 2170, "Base ATK": 54, "Base DEF": 126 },
    { "Base HP": 2894, "Base ATK": 71, "Base DEF": 168 },
    { "Base HP": 4289, "Base ATK": 106, "Base DEF": 249 },
    {
      "Base HP": 4803,
      "Base ATK": 119,
      "Base DEF": 279,
      "Dendro DMG Bonus": 7.2
    },
    {
      "Base HP": 5501,
      "Base ATK": 136,
      "Base DEF": 320,
      "Dendro DMG Bonus": 7.2
    },
    {
      "Base HP": 6187,
      "Base ATK": 153,
      "Base DEF": 359,
      "Dendro DMG Bonus": 14.4
    },
    {
      "Base HP": 6885,
      "Base ATK": 170,
      "Base DEF": 400,
      "Dendro DMG Bonus": 14.4
    },
    {
      "Base HP": 7399,
      "Base ATK": 183,
      "Base DEF": 430,
      "Dendro DMG Bonus": 14.4
    },
    {
      "Base HP": 8096,
      "Base ATK": 200,
      "Base DEF": 470,
      "Dendro DMG Bonus": 14.4
    },
    {
      "Base HP": 8611,
      "Base ATK": 213,
      "Base DEF": 500,
      "Dendro DMG Bonus": 21.6
    },
    {
      "Base HP": 9308,
      "Base ATK": 230,
      "Base DEF": 541,
      "Dendro DMG Bonus": 21.6
    },
    {
      "Base HP": 9823,
      "Base ATK": 243,
      "Base DEF": 571,
      "Dendro DMG Bonus": 28.8
    },
    {
      "Base HP": 10520,
      "Base ATK": 260,
      "Base DEF": 611,
      "Dendro DMG Bonus": 28.8
    }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Khanda Barrier-Buster",
      desc: [
        //
      ],
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 44.63,
          multType: 1
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 41.97,
          multType: 1
        },
        {
          name: "3-Hit (1/2)",
          dmgTypes: ["NA", "Physical"],
          baseMult: 26.45,
          multType: 1
        },
        {
          name: "4-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 68.63,
          multType: 1
        },
        {
          name: "Aimed Shot",
          dmgTypes: ["CA", "Physical"],
          baseMult: 43.86,
          multType: 1
        },
        {
          name: "Level 1 Aimed Shot",
          dmgTypes: ["CA", "Elemental"],
          baseMult: 124,
          multType: 2
        },
        {
          name: "Wreath Arrow DMG",
          dmgTypes: ["CA", "Elemental"],
          baseMult: 87.2,
          multType: 2
        },
        {
          name: "Clusterbloom Arrow DMG",
          dmgTypes: ["CA", "Elemental"],
          baseMult: 38.6,
          multType: 2
        },
        ...lightPAs_Bow
      ]
    },
    {
      type: "Elemental Skill",
      name: "Vijnana-Phala Mine",
      image: "",
      desc: [
        //
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 149.6,
          multType: 2
        }
      ],
      otherStats: () => [
        {
          name: "Vijnana-Phala Field Duration",
          value: "8s"
        },
        {
          name: "Vijnana Penetrator Duration",
          value: "12s"
        },
        { name: "CD", value: "12s" }
      ]
    },
    {
      type: "Elemental Burst",
      name: "Fashioner's Tanglevine Shaft",
      image: "",
      desc: [
        //
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Tanglevine Shaft DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 55.62,
          multType: 2
        },
        {
          name: "Secondary Tanglevine Shaft DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 67.98,
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
      name: "Keen Sight",
      image: "",
      desc: (
        <>
          After Tighnari fires a Wreath Arrow, his{" "}
          <Green>Elemental Mastery</Green> is increased by <Green b>50</Green>{" "}
          for 4s.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Scholarly Blade",
      image: "",
      desc: (
        <>
          For every point of Elemental Mastery Tighnari possesses, his{" "}
          <Green>Charged Attack and Fashioner's Tanglevine Shaft DMG</Green> are
          increased by <Green b>0.08%</Green>.
          <br />
          The maximum DMG bonus obtainable this way is 80%.
        </>
      )
    },
    {
      type: "Passive",
      name: "Encyclopedic Knowledge",
      image: "",
      desc: ""
    }
  ],
  constellation: [
    {
      name: "Beginnings Determined at the Roots",
      image: "",
      desc: (
        <>
          Tighnari's <Green>Charged Attack CRIT Rate</Green> is increased by{" "}
          <Green b>15%</Green>.
        </>
      )
    },
    {
      name: "Origins Known From the Stem",
      image: "",
      get desc() {
        return (
          <>
            {this.buff}
            <br />
            The effect will last up to 6s if the field's duraton ends or if it
            no longer has opponents within it.
          </>
        );
      },
      buff: (
        <>
          When there are opponents within Vijnana-Khanda Field created by
          Vijnana-Phala Mine, Tighnari gains <Green b>20%</Green>{" "}
          <Green>Dendro DMG Bonus</Green>.
        </>
      )
    },
    {
      name: "Fortunes Read Amongst the Branches",
      image: "",
      desc: "Fashioner's Tanglevine Shaft"
    },
    {
      name: "Withering Glimpsed in the Leaves",
      image: "",
      get desc() {
        return (
          <>
            {this.buff} This latter case will also refresh the buff state's
            duration.
          </>
        );
      },
      buff: (
        <>
          When Fashioner's Tanglevine Shaft is unleashed, all party members gain{" "}
          <Green b>60</Green> <Green>Elemental Mastery</Green> for 8s. If the
          Fashioner's Tanglevine Shaft triggers a Burning, Bloom, Aggravate, or
          Spread reaction, their<Green>Elemental Mastery</Green> will be further
          increased by <Green b>60</Green>.
        </>
      )
    },
    {
      name: "Comprehension Amidst the Flowers",
      image: "",
      desc: "Vijnana-Phala Mine"
    },
    {
      name: "Karma Adjudged From the Leaden Fruit",
      image: "",
      desc: (
        <>
          Wreath Arrow's charging time is decreased by 0.9s, and will produce{" "}
          <Green b>1</Green> <Green>additional Clusterbloom Arrow</Green> upon
          hit.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Ascension 1 Passive",
      desc: () => Tighnari.pasvTalents[0].desc,
      isGranted: checkAscs[1],
      affect: "self",
      addBnes: simpleAnTmaker("ATTRs", "Elemental Mastery", 50)
    },
    {
      index: 1,
      src: "Ascension 4 Passive",
      desc: () => Tighnari.pasvTalents[1].desc,
      isGranted: checkAscs[4],
      affect: "self",
      addBnes: ({ tkDesc, ATTRs, hitBnes, tracker }) => {
        const bnValue = Math.min(ATTRs["Elemental Mastery"], 1000) * 0.08;
        addAndTrack(tkDesc, hitBnes, ["CA.pct", "EB.pct"], bnValue, tracker);
      }
    },
    {
      index: 2,
      src: "Constellation 1",
      desc: () => Tighnari.constellation[0].desc,
      isGranted: checkCons[1],
      affect: "self",
      addBnes: simpleAnTmaker("hitBnes", "CA.cRate", 15)
    },
    {
      index: 3,
      src: "Constellation 2",
      desc: () => Tighnari.constellation[1].buff,
      isGranted: checkCons[2],
      affect: "self",
      addBnes: simpleAnTmaker("ATTRs", "Dendro DMG Bonus", 20)
    },
    {
      index: 4,
      src: "Constellation 4",
      desc: () => Tighnari.constellation[3].buff,
      isGranted: checkCons[4],
      affect: "party",
      labels: ["Trigger reactions"],
      selfLabels: ["Trigger reactions"],
      inputs: [false],
      inputTypes: ["check"],
      addBnes: ({ tkDesc, ATTRs, inputs, tracker }) => {
        let bnValue = 60;
        if (inputs[0]) bnValue += 60;
        addAndTrack(tkDesc, ATTRs, "Elemental Mastery", bnValue, tracker);
      }
    }
  ]
};

export default Tighnari;
