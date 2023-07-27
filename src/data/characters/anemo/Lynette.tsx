import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Anemo, Green } from "@Src/pure-components";
import { countVision } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons } from "../utils";

const Lynette: DefaultAppCharacter = {
  code: 72,
  name: "Lynette",
  icon: "https://images2.imgbox.com/5b/1a/kApSKvQl_o.png",
  sideIcon: "",
  rarity: 4,
  nation: "fontaine",
  vision: "anemo",
  weaponType: "sword",
  EBcost: 70,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.PARTY,
      desc: () => (
        <>
          Within 10s after using Magic Trick: Astonishing Shift [EB], when there are 1/2/3/4 Elemental Types in the
          party, all party members' <Green>ATK</Green> will be increased by <Green b>8%/12%/16%/20%</Green>{" "}
          respectively.
        </>
      ),
      isGranted: checkAscs[1],
      applyBuff: ({ totalAttr, charData, partyData, desc, tracker }) => {
        const numOfElmts = Object.keys(countVision(partyData, charData)).length;
        applyModifier(desc, totalAttr, "atk_", 4 * (numOfElmts + 1), tracker);
      },
    },
    {
      index: 1,
      src: EModSrc.A4,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          After the Bogglecat Box [~EB] performs Elemental Coversion, Lynette's <Green>Elemental Burst DMG</Green> will
          be increased by <Green b>15%</Green>. This effect will persist until the Bogglecat Box's duration ends.
        </>
      ),
      isGranted: checkAscs[4],
      applyBuff: makeModApplier("attPattBonus", "EB.pct_", 15),
    },
    {
      index: 2,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          When Lynette uses Enigma Thrust [~ES], she will gain an <Anemo>Anemo Infusion</Anemo> and <Green>20%</Green>{" "}
          <Green>Anemo DMG Bonus</Green> for 6s.
        </>
      ),
      isGranted: checkCons[6],
      applyBuff: makeModApplier("totalAttr", "anemo", 20),
      infuseConfig: {
        overwritable: false,
      },
    },
  ],
};

export default Lynette as AppCharacter;
