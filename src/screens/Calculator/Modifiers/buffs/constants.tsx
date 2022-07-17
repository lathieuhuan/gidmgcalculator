import { Green } from "@Styled/DataDisplay";

export const RESONANCE_BUFF_INFO = {
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
} as const;
