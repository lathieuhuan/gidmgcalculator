import { Green } from "@Src/styled-components";

export const statsMap: Record<string, string> = {
  HP: "hp",
  ATK: "atk",
  DEF: "def",
  "HP%": "hp",
  "ATK%": "atk_",
  "DEF%": "def",
  "Elemental Mastery": "em",
  "CRIT Rate": "cRate",
  "CRIT DMG": "cDmg",
  "Energy Recharge": "er",
  "Pyro DMG Bonus": "pyro",
  "Hydro DMG Bonus": "hydro",
  "Electro DMG Bonus": "electro",
  "Cryo DMG Bonus": "cryo",
  "Geo DMG Bonus": "geo",
  "Anemo DMG Bonus": "anemo",
  "Dendro DMG Bonus": "dendro",
  "Physical DMG Bonus": "phys",
  "Healing Bonus": "healBn",
};

export const resonanceRenderInfo = {
  pyro: {
    name: "Fervent Flames",
    desc: (
      <>
        Increases <Green>ATK</Green> by <Green b>25%</Green>.
      </>
    ),
  },
  cryo: {
    name: "Shattering Ice",
    desc: (
      <>
        Increases <Green>CRIT Rate</Green> against enemies that are Frozen or affected by Cryo by{" "}
        <Green b>15%</Green>.
      </>
    ),
  },
  geo: {
    name: "Enduring Rock",
    desc: (
      <>
        Increases <Green>Shield Strength</Green> by <Green b>15%</Green>. Increases{" "}
        <Green>DMG</Green> dealt by characters that protected by a shield by <Green b>15%</Green>.
      </>
    ),
  },
  dendro: {
    name: "Dendro Resonance",
    desc: <></>,
  },
};
