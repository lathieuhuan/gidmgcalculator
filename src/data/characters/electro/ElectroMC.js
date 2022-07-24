import { addAndTrack, simpleAnTmaker } from "../../../calculators/helpers";
import { electroDmg, Green } from "../../../styledCpns/DataDisplay";
import { SwordDesc, TravelerInfo, TravelerNCPAs } from "../config";
import { checkAscs, checkCharMC, checkCons, xtraTlLv } from "../helpers";

const ElectroMC = {
  ...TravelerInfo,
  code: 46,
  name: "Electro Traveler",
  vision: "Electro",
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Foreign Thundershock",
      desc: SwordDesc,
      stats: TravelerNCPAs
    },
    {
      type: "Elemental Skill",
      name: "Lightning Blade",
      image: "0/03/Talent_Lightning_Blade",
      desc: [
        {
          content: (
            <>
              Unleashes three swift thunder shadows that deal {electroDmg} to
              opponents and leave an Abundance Amulet behind after hitting an
              opponent.
              <br />2 Abundance Amulets can be created initially. Using this
              skill will reset any Abundance Amulets that were generated.
            </>
          )
        },
        {
          heading: "Abundance Amulets",
          get content() {
            return (
              <>
                When a character is near an Abundance Amulet, they will absorb
                it and obtain the following effects:
                <br />• Restores Elemental Energy.
                <br />• {this.buff}
              </>
            );
          },
          buff: (
            <>
              Increases <Green>Energy Recharge</Green> during the Abundance
              Amulet's duration.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 78.66,
          multType: 2
        }
      ],
      otherStats: (lv) => [
        {
          name: "Energy Regeneration	",
          value: Math.min(2.5 + Math.ceil(lv / 3) * 0.5, 4) + " per Amulet"
        },
        { name: "Energy Recharge Increase", value: "20%" },
        { name: "Duration", value: "6s" },
        { name: "Abundance Amulet Duration", value: "15s" },
        { name: "CD", value: "13.5s" }
      ]
    },
    {
      type: "Elemental Burst",
      name: "Bellowing Thunder",
      image: "a/a7/Talent_Bellowing_Thunder",
      desc: [
        {
          content: (
            <>
              You call upon the protection of lightning, knocking nearby
              opponents back and dealing {electroDmg} to them.
            </>
          )
        },
        {
          heading: "Lightning Shroud",
          content: (
            <>
              When your active character's Normal or Charged Attacks hit
              opponents, they will call Falling Thunder forth, dealing{" "}
              {electroDmg}.
              <br />
              When Falling Thunder hits opponents, it will regenerate Energy for
              that character.
              <br />
              One instance of Falling Thunder can be generated every 0.5s.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 114.4,
          multType: 2
        },
        {
          name: "Falling Thunder",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 32.8,
          multType: 2
        }
      ],
      otherStats: (lv) => [
        {
          name: "Energy Regeneration",
          value: Math.min((7 + Math.ceil(lv / 3) * 1) / 10, 1)
        },
        { name: "Duration", value: "12s" },
        { name: "CD", value: "20s" }
      ],
      energyCost: 80
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Thunderflash",
      image: "1/16/Talent_Thunderflash",
      desc: (
        <>
          When another nearby character in the party obtains an Abundance Amulet
          created by Lightning Blade, Lightning Blade's <Green>CD</Green> is
          decreased by <Green b>1.5s</Green>.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Resounding Roar",
      image: "2/26/Talent_Resounding_Roar",
      desc: (
        <>
          Increases the <Green>Energy Recharge</Green> effect granted by
          Lightning Blade's Abundance Amulet by <Green b>10%</Green> of the
          Traveler's <Green>Energy Recharge</Green>.
        </>
      )
    }
  ],
  constellation: [
    {
      name: "Spring Thunder of Fertility",
      image: "2/2f/Constellation_Spring_Thunder_of_Fertility",
      desc: (
        <>
          The number of <Green>Abundance Amulets</Green> that can be generated
          using Lightning Blade is increased to <Green b>3</Green>.
        </>
      )
    },
    {
      name: "Violet Vehemence",
      image: "8/8f/Constellation_Violet_Vehemence",
      desc: (
        <>
          When Falling Thunder created by Bellowing Thunder hits an opponent, it
          will decrease their <Green>Electro RES</Green> by <Green b>15%</Green>{" "}
          for 8s.
        </>
      )
    },
    {
      name: "Distant Crackling",
      image: "c/c0/Constellation_Distant_Crackling",
      desc: "Bellowing Thunder"
    },
    {
      name: "Fickle Cloudstrike",
      image: "8/84/Constellation_Fickle_Cloudstrike",
      desc: (
        <>
          When a character obtains Abundance Amulets generated by Lightning
          Blade, if this character's Energy is less than 35%, the{" "}
          <Green>Energy</Green> restored by the <Green>Abundance Amulets</Green>{" "}
          is increased by <Green b>100%</Green>.
        </>
      )
    },
    {
      name: "Clamor in the Wilds",
      image: "8/80/Constellation_Clamor_in_the_Wilds",
      desc: "Lightning Blade"
    },
    {
      name: "World-Shaker",
      image: "7/76/Constellation_World-Shaker",
      desc: (
        <>
          Every 2 Falling Thunder attacks triggered by Bellowing Thunder will
          significantly increase the DMG dealt by the next Falling Thunder,
          dealing <Green b>200%</Green> of its <Green>original DMG</Green>, and
          will restore an <Green>additional</Green> <Green b>1</Green>{" "}
          <Green>Energy</Green> to the current character.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Elemental Skill",
      desc: () => ElectroMC.actvTalents[1].desc[1].buff,
      isGranted: () => true,
      affect: "party",
      labels: ["A4 Passive Talent", "Energy Recharge"],
      inputs: [false, 100],
      inputTypes: ["check", "text"],
      maxs: [null, 999],
      addBnes: ({ ATTRs, char, inputs, toSelf, charBCs, tkDesc, tracker }) => {
        const field = "Energy Recharge";
        let bnValue = 20;
        const boosted = toSelf
          ? checkCharMC(ElectroMC.buffs, char, charBCs, 1)
          : inputs[0];
        if (boosted) {
          const ER = toSelf ? ATTRs[field] : inputs[1];
          bnValue += Math.round(ER) / 10;
        }
        addAndTrack(tkDesc, ATTRs, field, bnValue, tracker);
      }
    },
    {
      index: 1,
      src: "Ascension 4 Passive Talent",
      desc: () => ElectroMC.pasvTalents[1].desc,
      isGranted: checkAscs[4],
      affect: "self"
    }
  ],
  debuffs: [
    {
      index: 0,
      src: "Constellation 2",
      desc: () => ElectroMC.constellation[1].desc,
      isGranted: checkCons[2],
      addPntes: simpleAnTmaker("rdMult", "Electro_rd", 15)
    }
  ]
};

export default ElectroMC;
