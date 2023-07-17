import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { Green } from "@Src/pure-components";
import { makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs } from "../utils";

const Lisa: DefaultAppCharacter = {
  code: 10,
  name: "Lisa",
  icon: "6/65/Lisa_Icon",
  sideIcon: "2/26/Lisa_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "electro",
  weaponType: "catalyst",
  EBcost: 80,
  debuffs: [
    {
      index: 0,
      src: EModSrc.A4,
      desc: () => (
        <>
          Opponents hit by Lightning Rose [EB] have their <Green>DEF</Green> decreased by <Green b>15%</Green> for 10s.
        </>
      ),
      isGranted: checkAscs[4],
      applyDebuff: makeModApplier("resistReduct", "def", 15),
    },
  ],
};

export default Lisa as AppCharacter;
