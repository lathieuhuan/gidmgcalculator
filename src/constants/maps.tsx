import { Green } from "@Components/atoms";

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
  hydro: {
    name: "Soothing Water",
    desc: (
      <>
        Increases <Green>Max HP</Green> by <Green b>25%</Green>.
      </>
    ),
  },
  dendro: {
    name: "Sprawling Greenery",
    desc: (
      <>
        Increases <Green>Elemental Mastery</Green> by <Green b>50</Green>. After triggering Burning,
        Quicken, or Bloom reactions, all nearby party members gain <Green>30</Green>{" "}
        <Green>Elemental Mastery</Green> for 6s. After triggering Aggravate, Spread, Hyperbloom, or
        Burgeon reactions, all nearby party members gain <Green>20</Green>{" "}
        <Green>Elemental Mastery</Green> for 6s. The durations of the aforementioned effects will be
        counted independently.
      </>
    ),
  },
};
