import { EModAffect } from "@Src/constants";
import { Green, Rose } from "@Src/pure-components";
import { DataArtifact } from "@Src/types";
import { findByCode } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";

const fontaineSets: DataArtifact[] = [
  {
    code: 40,
    name: "Golden Troupe",
    variants: [4, 5],
    flower: {
      name: "Flower",
      icon: "https://images2.imgbox.com/03/ec/BOIJmvU5_o.png",
    },
    plume: {
      name: "Plume",
      icon: "https://images2.imgbox.com/57/a9/W8nhGIh5_o.png",
    },
    sands: {
      name: "Sands",
      icon: "https://images2.imgbox.com/a2/40/1OX9MKOW_o.png",
    },
    goblet: {
      name: "Goblet",
      icon: "https://images2.imgbox.com/fc/bf/E4GhjlA9_o.png",
    },
    circlet: {
      name: "Circlet",
      icon: "https://images2.imgbox.com/8d/07/qRBikoYo_o.png",
    },
    setBonuses: [
      {
        desc: (
          <>
            Increases <Green>Elemental Skill DMG</Green> by <Green b>20%</Green>.
          </>
        ),
        applyBuff: makeModApplier("attPattBonus", "ES.pct_", 20),
      },
      {
        get desc() {
          return (
            <>
              Increases <Green>Elemental Skill DMG</Green> by <Green b>20%</Green>. {this.xtraDesc?.[0]}
            </>
          );
        },
        xtraDesc: [
          <>
            When not on the field, <Green>Elemental Skill DMG</Green> will be further increased by <Green b>20%</Green>.
            This effect will be cleared 2s after taking the field
          </>,
        ],
        applyBuff: makeModApplier("attPattBonus", "ES.pct_", 20),
      },
    ],
    buffs: [
      {
        index: 0,
        desc: () => findByCode(fontaineSets, 40)!.setBonuses[1].xtraDesc?.[0],
        affect: EModAffect.SELF,
        applyBuff: makeModApplier("attPattBonus", "ES.pct_", 20),
      },
    ],
  },
  {
    code: 39,
    name: "Marechaussee Hunter",
    variants: [4, 5],
    flower: {
      name: "Flower",
      icon: "https://images2.imgbox.com/62/6f/3vMF9DVE_o.png",
    },
    plume: {
      name: "Plume",
      icon: "https://images2.imgbox.com/c6/d2/lNSN6z4U_o.png",
    },
    sands: {
      name: "Sands",
      icon: "https://images2.imgbox.com/0c/4d/gyOO33rv_o.png",
    },
    goblet: {
      name: "Goblet",
      icon: "https://images2.imgbox.com/e0/c3/virjS4hm_o.png",
    },
    circlet: {
      name: "Circlet",
      icon: "https://images2.imgbox.com/73/4b/C6Hhb7dB_o.png",
    },
    setBonuses: [
      {
        desc: (
          <>
            <Green>Normal and Charged Attack DMG</Green> +<Green b>15%</Green>.
          </>
        ),
        applyBuff: makeModApplier("attPattBonus", ["NA.pct_", "CA.pct_"], 15),
      },
      {
        desc: (
          <>
            When current HP changes, <Green>CRIT Rate</Green> will be increased by <Green>11%</Green> for 5s. Max{" "}
            <Rose>3</Rose> stacks.
          </>
        ),
      },
    ],
    buffs: [
      {
        index: 0,
        desc: () => findByCode(fontaineSets, 39)!.setBonuses[1].desc,
        affect: EModAffect.SELF,
        inputConfigs: [
          {
            type: "stacks",
            max: 3,
          },
        ],
        applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
          applyModifier(desc, totalAttr, "cRate_", 11 * (inputs[0] || 0), tracker);
        },
      },
    ],
  },
];

export default fontaineSets;
