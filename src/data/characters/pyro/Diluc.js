import { addAndTrack, simpleAnTmaker } from "../../../calculators/helpers";
import { NAs } from "../../../configs";
import { Green, Pyro, pyroDmg } from "../../../styledCpns/DataDisplay";
import { CaStaminaClaymore, ClaymoreDesc_4slash } from "../config";
import { checkAscs, checkCons, xtraTlLv } from "../helpers";

const Diluc = {
  code: 20,
  name: "Diluc",
  icon: "0/02/Character_Diluc_Thumb",
  sideIcon: "a/af/Character_Diluc_Side_Icon",
  rarity: 5,
  nation: "Mondstadt",
  vision: "Pyro",
  weapon: "Claymore",
  stats: [
    { "Base HP": 1011, "Base ATK": 26, "Base DEF": 61 },
    { "Base HP": 2621, "Base ATK": 68, "Base DEF": 158 },
    { "Base HP": 3488, "Base ATK": 90, "Base DEF": 211 },
    { "Base HP": 5219, "Base ATK": 135, "Base DEF": 315 },
    { "Base HP": 5834, "Base ATK": 151, "Base DEF": 352, "CRIT Rate": 4.8 },
    { "Base HP": 6712, "Base ATK": 173, "Base DEF": 405, "CRIT Rate": 4.8 },
    { "Base HP": 7533, "Base ATK": 194, "Base DEF": 455, "CRIT Rate": 9.6 },
    { "Base HP": 8421, "Base ATK": 217, "Base DEF": 509, "CRIT Rate": 9.6 },
    { "Base HP": 9036, "Base ATK": 233, "Base DEF": 546, "CRIT Rate": 9.6 },
    { "Base HP": 9932, "Base ATK": 256, "Base DEF": 600, "CRIT Rate": 9.6 },
    { "Base HP": 10547, "Base ATK": 272, "Base DEF": 637, "CRIT Rate": 14.4 },
    { "Base HP": 11453, "Base ATK": 295, "Base DEF": 692, "CRIT Rate": 14.4 },
    { "Base HP": 12068, "Base ATK": 311, "Base DEF": 729, "CRIT Rate": 19.2 },
    { "Base HP": 12981, "Base ATK": 335, "Base DEF": 784, "CRIT Rate": 19.2 }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Tempered Sword",
      desc: ClaymoreDesc_4slash,
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 89.7,
          multType: 1
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 87.63,
          multType: 1
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 98.81,
          multType: 1
        },
        {
          name: "4-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 133.99,
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
          baseMult: 124.7,
          multType: 1
        },
        ...CaStaminaClaymore,
        {
          name: "Plunge DMG",
          dmgTypes: ["PA", "Physical"],
          baseMult: 89.51,
          multType: 7
        },
        {
          name: "Low Plunge",
          dmgTypes: ["PA", "Physical"],
          baseMult: 178.97,
          multType: 7
        },
        {
          name: "High Plunge",
          dmgTypes: ["PA", "Physical"],
          baseMult: 223.55,
          multType: 7
        }
      ]
    },
    {
      type: "Elemental Skill",
      name: "Searing Onslaught",
      image: "5/53/Talent_Searing_Onslaught",
      desc: [
        {
          content: <>Performs a forward slash that deals {pyroDmg}.</>
        },
        {
          content: (
            <>
              This skill can be consecutively used 3 times. Enters CD if not
              cast again within a short period.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "1-Hit DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 94.4,
          multType: 2
        },
        {
          name: "2-Hit DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 97.6,
          multType: 2
        },
        {
          name: "3-Hit DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 128.8,
          multType: 2
        }
      ],
      otherStats: () => [{ name: "CD", value: "10s" }]
    },
    {
      type: "Elemental Burst",
      name: "Dawn",
      image: "f/f5/Talent_Dawn",
      desc: [
        {
          get content() {
            return (
              <>
                Releases intense flames to knock back nearby opponents, dealing{" "}
                {pyroDmg}. The flames then converge into the weapon, summoning a
                Phoenix that flies forward and deals massive {pyroDmg} to all
                opponents in its path. The Phoenix explodes upon reaching its
                destination, causing a large amount of AoE {pyroDmg}.
                <br />
                {this.buff}
              </>
            );
          },
          buff: (
            <>
              The searing flames that run down his blade cause it to be{" "}
              <Green>infused</Green> with <Pyro>Pyro</Pyro>.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Splashing DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 204,
          multType: 2
        },
        {
          name: "DoT",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 60,
          multType: 2
        },
        {
          name: "Explosion DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 204,
          multType: 2
        }
      ],
      otherStats: () => [
        { name: "CD", value: "12s" },
        { name: "Infustion Durtion", value: "12s" }
      ],
      energyCost: 40
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Relentless",
      image: "5/5f/Talent_Relentless",
      desc: (
        <>
          Diluc's <Green>Charged Attack Stamina Cost</Green> is decreased by{" "}
          <Green b>50%</Green>, and its <Green>duration</Green> is increased by{" "}
          <Green b>3s</Green>.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Blessing of Phoenix",
      image: "c/c3/Talent_Blessing_of_Phoenix",
      get desc() {
        return (
          <>
            The Pyro Enchantment provided by Dawn lasts for <Green b>4s</Green>{" "}
            <Green>longer</Green>. Additionally, {this.buff} this effect.
          </>
        );
      },
      buff: (
        <>
          Diluc gains <Green b>20%</Green> <Green>Pyro DMG Bonus</Green> during
          the duration of
        </>
      )
    },
    {
      type: "Passive",
      name: "Tradition of the Dawn Knight",
      image: "a/af/Talent_Tradition_of_the_Dawn_Knight",
      desc: (
        <>
          Refunds <Green b>15%</Green> of the <Green>ores</Green> used when
          crafting <Green>Claymore-type</Green> weapons.
        </>
      )
    }
  ],
  constellation: [
    {
      name: "Conviction",
      image: "7/72/Constellation_Conviction",
      desc: (
        <>
          Diluc deals <Green b>15%</Green> <Green>more DMG</Green> to opponents
          whose HP is above 50%.
        </>
      )
    },
    {
      name: "Searing Ember",
      image: "b/b4/Constellation_Searing_Ember",
      get desc() {
        return (
          <>
            {this.buff}. Lasts for 10s.
            <br />
            This effect can stack up to <Green b>
              3
            </Green> <Green>times</Green> and can only occur once every 1.5s.
          </>
        );
      },
      buff: (
        <>
          When Diluc takes DMG, his <Green>ATK</Green> increases by{" "}
          <Green b>10%</Green> and <Green>ATK SPD</Green> increases by{" "}
          <Green b>5%</Green>
        </>
      )
    },
    {
      name: "Fire and Steel",
      image: "5/52/Constellation_Fire_and_Steel",
      desc: "Searing Onslaught"
    },
    {
      name: "Flowing Flame",
      image: "a/a1/Constellation_Flowing_Flame",
      get desc() {
        return (
          <>
            Casting Searing Onslaught in rhythm greatly increases damage dealt.
            <br />
            {this.buff}
          </>
        );
      },
      buff: (
        <>
          2s after casting Searing Onslaught, casting the next{" "}
          <Green>Searing Onslaught</Green> in the combo deals{" "}
          <Green b>40%</Green> <Green>additional DMG</Green>. This effect lasts
          for 2s.
        </>
      )
    },
    {
      name: "Phoenix, Harbinger of Dawn",
      image: "d/dc/Constellation_Phoenix%2C_Harbinger_of_Dawn",
      desc: "Dawn"
    },
    {
      name: "Flaming Sword, Nemesis of the Dark",
      image: "1/1c/Constellation_Flaming_Sword%2C_Nemesis_of_the_Dark",
      get desc() {
        return (
          <>
            {this.buff}
            <br />
            Additionally, Searing Onslaught will not interrupt the Normal Attack
            combo.
          </>
        );
      },
      buff: (
        <>
          After casting Searing Onslaught, the next <Green b>2</Green>{" "}
          <Green>Normal Attacks</Green> within the next 6s will have their{" "}
          <Green>DMG</Green> and <Green>ATK SPD</Green> increased by{" "}
          <Green b>30%</Green>.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Elemental Burst",
      desc: () => Diluc.actvTalents[2].desc[0].buff,
      isGranted: () => true,
      affect: "self",
      canInfuse: () => true,
      infuseRange: NAs,
      canBeOverrided: true
    },
    {
      index: 1,
      src: "Ascension 4 Passive Talent",
      desc: () => (
        <>{Diluc.pasvTalents[1].buff} the Pyro Enchantment provided by Dawn.</>
      ),
      isGranted: checkAscs[4],
      affect: "self",
      addBnes: simpleAnTmaker("ATTRs", "Pyro DMG Bonus", 20)
    },
    {
      index: 2,
      src: "Constellation 1",
      desc: () => Diluc.constellation[0].desc,
      isGranted: checkCons[1],
      affect: "self",
      addBnes: simpleAnTmaker("hitBnes", "All.pct", 15)
    },
    {
      index: 3,
      src: "Constellation 2",
      desc: () => (
        <>
          {Diluc.constellation[1].buff} for 10s, up to <Green b>3</Green> times.
        </>
      ),
      isGranted: checkCons[2],
      affect: "self",
      selfLabels: ["Stacks"],
      inputs: [1],
      inputTypes: ["select"],
      maxs: [3],
      addBnes: ({ ATTRs, inputs, tkDesc, tracker }) => {
        const value1 = 10 * inputs[0];
        const value2 = 5 * inputs[0];
        const fields = ["ATK%", "Normal ATK SPD", "Charged ATK SPD"];
        addAndTrack(tkDesc, ATTRs, fields, [value1, value2, value2], tracker);
      }
    },
    {
      index: 4,
      src: "Constellation 4",
      desc: () => Diluc.constellation[3].buff,
      isGranted: checkCons[4],
      affect: "self",
      addBnes: simpleAnTmaker("hitBnes", "ES.pct", 40)
    },
    {
      index: 5,
      src: "Constellation 6",
      desc: () => Diluc.constellation[5].buff,
      isGranted: checkCons[6],
      affect: "self",
      addBnes: ({ ATTRs, hitBnes, tkDesc, tracker }) => {
        addAndTrack(tkDesc, hitBnes, "NA.pct", 30, tracker);
        addAndTrack(tkDesc, ATTRs, "Normal ATK SPD", 30, tracker);
      }
    }
  ]
};

export default Diluc;
