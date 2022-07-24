import { addAndTrack, simpleAnTmaker } from "../../../calculators/helpers";
import { getFinalTlLv } from "../../../helpers";
import { cryoDmg, Green } from "../../../styledCpns/DataDisplay";
import { CaStaminaClaymore, ClaymoreDesc_5slash } from "../config";
import { checkCharMC, checkCons, makeTlBnes, xtraTlLv } from "../helpers";

const tlBnes_cons4 = ({ char, selfMCs }) =>
  makeTlBnes(checkCharMC(Eula.buffs, char, selfMCs.BCs, 1), "pct", [0, 4], 25);

const Eula = {
  code: 33,
  name: "Eula",
  icon: "d/d3/Character_Eula_Thumb",
  sideIcon: "0/0d/Character_Eula_Side_Icon",
  rarity: 5,
  nation: "Mondstadt",
  vision: "Cryo",
  weapon: "Claymore",
  stats: [
    { "Base HP": 1030, "Base ATK": 27, "Base DEF": 58 },
    { "Base HP": 2671, "Base ATK": 69, "Base DEF": 152 },
    { "Base HP": 3554, "Base ATK": 92, "Base DEF": 202 },
    { "Base HP": 5317, "Base ATK": 138, "Base DEF": 302 },
    { "Base HP": 5944, "Base ATK": 154, "Base DEF": 337, "CRIT DMG": 9.6 },
    { "Base HP": 6839, "Base ATK": 177, "Base DEF": 388, "CRIT DMG": 9.6 },
    { "Base HP": 7675, "Base ATK": 198, "Base DEF": 436, "CRIT DMG": 19.2 },
    { "Base HP": 8579, "Base ATK": 222, "Base DEF": 487, "CRIT DMG": 19.2 },
    { "Base HP": 9207, "Base ATK": 238, "Base DEF": 523, "CRIT DMG": 19.2 },
    { "Base HP": 10119, "Base ATK": 262, "Base DEF": 574, "CRIT DMG": 19.2 },
    { "Base HP": 10746, "Base ATK": 278, "Base DEF": 610, "CRIT DMG": 28.8 },
    { "Base HP": 11669, "Base ATK": 302, "Base DEF": 662, "CRIT DMG": 28.8 },
    { "Base HP": 12296, "Base ATK": 318, "Base DEF": 698, "CRIT DMG": 38.4 },
    { "Base HP": 13226, "Base ATK": 342, "Base DEF": 751, "CRIT DMG": 38.4 }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Favonius Bladework - Edel",
      desc: ClaymoreDesc_5slash,
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 89.73,
          multType: 1
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 93.55,
          multType: 1
        },
        {
          name: "3-Hit (1/2)",
          dmgTypes: ["NA", "Physical"],
          baseMult: 56.8,
          multType: 1
        },
        {
          name: "4-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 112.64,
          multType: 1
        },
        {
          name: "5-Hit (1/2)",
          dmgTypes: ["NA", "Physical"],
          baseMult: 71.83,
          multType: 1
        },
        {
          name: "Charged Attack Spinning",
          dmgTypes: ["CA", "Physical"],
          baseMult: 68.8,
          multType: 1
        },
        {
          name: "Charged Attack Final",
          dmgTypes: ["CA", "Physical"],
          baseMult: 124.4,
          multType: 1
        },
        ...CaStaminaClaymore,
        {
          name: "Plunge DMG",
          dmgTypes: ["PA", "Physical"],
          baseMult: 74.59,
          multType: 1
        },
        {
          name: "Low Plunge",
          dmgTypes: ["PA", "Physical"],
          baseMult: 149.14,
          multType: 1
        },
        {
          name: "High Plunge",
          dmgTypes: ["PA", "Physical"],
          baseMult: 186.29,
          multType: 1
        }
      ]
    },
    {
      type: "Elemental Skill",
      name: "Icetide Vortex",
      image: "a/ae/Talent_Icetide_Vortex",
      desc: [
        {
          heading: "Press",
          content: (
            <>
              Slashes swiftly, dealing {cryoDmg}. When it hits an opponent, Eula
              gains a stack of Grimheart that stacks up to 2 times. These stacks
              can only be gained once every 0.3s.
            </>
          )
        },
        {
          heading: "Grimheart",
          content: <>Increases Eula's resistance to interruption and DEF.</>
        },
        {
          heading: "Hold",
          get content() {
            return (
              <>
                Wielding her sword, Eula consumes all the stacks of Grimheart
                and lashes forward, dealing AoE {cryoDmg} to opponents in front
                of her.
                <br />
                {this.debuff}.
                <br />
                Each consumed stack of Grimheart will be converted into an
                Icewhirl Brand that deals {cryoDmg} to nearby opponents.
              </>
            );
          },
          debuff: (
            <>
              If Grimheart stacks are consumed, surrounding opponents will have
              their <Green>Physical RES</Green> and <Green>Cryo RES</Green>{" "}
              decreased
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Press DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 146.4,
          multType: 2
        },
        {
          name: "Hold DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 245.6,
          multType: 2
        },
        {
          name: "Icewhirl Brand",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 96,
          multType: 2
        }
      ],
      otherStats: (lv) => [
        { name: "DEF bonus", value: "30% per Stack" },
        { name: "Grimheart Duration", value: "18s" },
        { name: "Press CD", value: "6s" },
        { name: "Physical RES Decrease", value: Math.min(15 + lv, 25) + "%" },
        { name: "Cryo RES Decrease", value: Math.min(15 + lv, 25) + "%" },
        { name: "RES Decrease Duration", value: "7s" },
        { name: "Press CD", value: "4s" },
        { name: "Hold CD", value: "10s" }
      ]
    },
    {
      type: "Elemental Burst",
      name: "Glacial Illumination",
      image: "a/af/Talent_Glacial_Illumination",
      desc: [
        {
          content: (
            <>
              Brandishes her greatsword, dealing {cryoDmg} to nearby opponents
              and creating a Lightfall Sword that follows her around for a
              duration of up to 7s. While present, the Lightfall Sword increases
              Eula's resistance to interruption. When Eula's own Normal Attack,
              Elemental Skill, and Elemental Burst deal DMG to opponents, they
              will charge the Lightfall Sword, which can gain an energy stack
              once every 0.1s.
              <br />
              Once its duration ends, the Lightfall Sword will descend and
              explode violently, dealing Physical DMG to nearby opponents.
              <br />
              This DMG scales on the number of energy stacks the Lightfall Sword
              has accumulated.
              <br />
              If Eula leaves the field, the Lightfall Sword will explode
              immediately.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 245.6,
          multType: 2
        },
        {
          name: "Lightfall Sword Base DMG",
          dmgTypes: ["EB", "Physical"],
          baseMult: 367.05,
          multType: 1,
          getTlBnes: tlBnes_cons4
        },
        {
          name: "DMG per Stack",
          dmgTypes: ["EB", "Physical"],
          baseMult: 74.99,
          multType: 1,
          getTlBnes: tlBnes_cons4
        }
      ],
      otherStats: () => [
        { name: "Maximum Stacks", value: 30 },
        { name: "CD", value: "20s" }
      ],
      energyCost: 80
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Roiling Rime",
      image: "5/59/Talent_Roiling_Rime",
      desc: (
        <>
          If 2 stacks of Grimheart are consumed upon unleashing the Holding Mode
          of Icetide Vortex, a Shattered Lightfall Sword will be created that
          will explode immediately, dealing <Green b>50%</Green> of the{" "}
          <Green>basic Physical DMG</Green> dealt by a Lightfall Sword created
          by Glacial Illumination.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Wellspring of War-Lust",
      image: "b/b9/Talent_Wellspring_of_War-Lust",
      desc: (
        <>
          When Glacial Illumination is cast, the <Green>CD</Green> of Icetide
          Vortex is <Green>reset</Green> and Eula gains <Green b>1</Green>{" "}
          <Green>stack</Green> of Grimheart.
        </>
      )
    },
    {
      type: "Passive",
      name: "Aristocratic Introspection",
      image: "4/4e/Talent_Aristocratic_Introspection",
      desc: (
        <>
          When Eula crafts <Green>Character Talent Materials</Green>, she has a{" "}
          <Green b>10%</Green> <Green>chance</Green> to receive{" "}
          <Green b>double</Green> the product.
        </>
      )
    }
  ],
  constellation: [
    {
      name: "Tidal Illusion",
      image: "5/54/Constellation_Tidal_Illusion",
      get desc() {
        return (
          <>
            {this.buff}
            <br />
            Each stack consumed will increase the duration of this effect by 6s
            up to a maximum of 18s.
          </>
        );
      },
      buff: (
        <>
          Every time Icetide Vortex's Grimheart stacks are consumed, Eula's{" "}
          <Green>Physical DMG</Green> is increased by <Green b>30%</Green> for
          6s.
        </>
      )
    },
    {
      name: "Lady of Seafoam",
      image: "c/cf/Constellation_Lady_of_Seafoam",
      desc: (
        <>
          Decreases the <Green>CD</Green> of Icetide Vortex's{" "}
          <Green>Holding Mode</Green>, rendering it identical to{" "}
          <Green>Press CD</Green>.
        </>
      )
    },
    {
      name: "Lawrence Pedigree",
      image: "1/15/Constellation_Lawrence_Pedigree",
      desc: "Glacial Illumination"
    },
    {
      name: "The Obstinacy of One's Inferiors",
      image: "2/21/Constellation_The_Obstinacy_of_One%27s_Inferiors",
      desc: (
        <>
          <Green>Lightfall Swords</Green> deal <Green b>25%</Green> increased{" "}
          <Green>DMG</Green> against opponents with less than 50% HP.
        </>
      )
    },
    {
      name: "Chivalric Quality",
      image: "e/e7/Constellation_Chivalric_Quality",
      desc: "Icetide Vortex"
    },
    {
      name: "Noble Obligation",
      image: "3/34/Constellation_Noble_Obligation",
      desc: (
        <>
          Lightfall Swords created by Glacial Illumination start with{" "}
          <Green b>5</Green> <Green>stacks</Green> of energy. Normal Attacks,
          Elemental Skills, and Elemental Bursts have a <Green b>50%</Green>{" "}
          <Green>chance</Green> to grant the Lightfall Sword{" "}
          <Green>an additional stack</Green> of energy.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Constellation 1",
      desc: () => Eula.constellation[0].buff,
      isGranted: checkCons[1],
      affect: "self",
      addBnes: simpleAnTmaker("ATTRs", "Physical DMG Bonus", 30)
    },
    {
      index: 1,
      src: "Constellation 4",
      desc: () => Eula.constellation[3].desc,
      isGranted: checkCons[4],
      affect: "self"
    }
  ],
  debuffs: [
    {
      index: 0,
      src: "Elemental Skill",
      desc: ({ fromSelf, char, inputs, partyData }) => (
        <>
          {Eula.actvTalents[1].desc[2].debuff} by{" "}
          <Green b>
            {Eula.debuffs[0].pntValue(fromSelf, char, inputs, partyData)}%
          </Green>
          .
        </>
      ),
      isGranted: () => true,
      labels: ["Elemental Skill Level"],
      inputTypes: ["text"],
      addPntes: (obj) => {
        const fields = ["Physical_rd", "Cryo_rd"];
        const args = [obj.fromSelf, obj.char, obj.inputs, obj.partyData];
        const pntValue = Eula.debuffs[0].pntValue(...args);
        addAndTrack(obj.tkDesc, obj.rdMult, fields, pntValue, obj.tracker);
      },
      pntValue: (fromSelf, char, inputs, partyData) => {
        const level = fromSelf
          ? getFinalTlLv(char, Eula.actvTalents[1], partyData)
          : inputs[0];
        return level ? Math.min(15 + level, 25) : 0;
      }
    }
  ]
};

export default Eula;
