export const statsMap: Record<string, string> = {
  HP: "hp",
  ATK: "atk",
  DEF: "def",
  "HP%": "hp_",
  "ATK%": "atk_",
  "DEF%": "def_",
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

export const resonanceMap: Record<string, "pyro" | "hydro" | "cryo" | "geo" | "dendro"> = {
  "Fervent Flames": "pyro",
  "Shattering Ice": "cryo",
  "Enduring Rock": "geo",
  "Soothing Water": "hydro",
  "Sprawling Greenery": "dendro",
};
