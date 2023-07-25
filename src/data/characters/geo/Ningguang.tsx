import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Green } from "@Src/pure-components";
import { makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs } from "../utils";

const Ningguang: DefaultAppCharacter = {
  code: 13,
  name: "Ningguang",
  icon: "e/e0/Ningguang_Icon",
  sideIcon: "2/25/Ningguang_Side_Icon",
  rarity: 4,
  nation: "liyue",
  vision: "geo",
  weaponType: "catalyst",
  EBcost: 40,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  buffs: [
    {
      index: 0,
      src: EModSrc.A4,
      affect: EModAffect.PARTY,
      desc: () => (
        <>
          A character that passes through the Jade Screen [~ES] will gain a <Green b>12%</Green>{" "}
          <Green>Geo DMG Bonus</Green> for 10s.
        </>
      ),
      isGranted: checkAscs[4],
      applyBuff: makeModApplier("totalAttr", "geo", 12),
    },
  ],
};

export default Ningguang as AppCharacter;
