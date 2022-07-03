import { mediumPAs } from "../configs";
import type { ICharacter } from "../types";

const Albedo: ICharacter = {
  id: 29,
  name: "Albedo",
  icon: "0/00/Character_Albedo_Thumb",
  sideIcon: "1/12/Character_Albedo_Side_Icon",
  rarity: 5,
  nation: "mondstadt",
  vision: "geo",
  weapon: "sword",
  stats: [
    { base_hp: 1030, base_atk: 20, base_def: 68 },
    { base_hp: 2671, base_atk: 51, base_def: 177 },
    { base_hp: 3554, base_atk: 67, base_def: 235 },
    { base_hp: 5317, base_atk: 101, base_def: 352 },
    { base_hp: 5944, base_atk: 113, base_def: 394, geo_: 7.2 },
    { base_hp: 6839, base_atk: 130, base_def: 453, geo_: 7.2 },
    { base_hp: 7675, base_atk: 146, base_def: 508, geo_: 14.4 },
    { base_hp: 8579, base_atk: 163, base_def: 568, geo_: 14.4 },
    { base_hp: 9207, base_atk: 175, base_def: 610, geo_: 14.4 },
    { base_hp: 10119, base_atk: 192, base_def: 670, geo_: 14.4 },
    { base_hp: 10746, base_atk: 204, base_def: 712, geo_: 21.6 },
    { base_hp: 11669, base_atk: 222, base_def: 773, geo_: 21.6 },
    { base_hp: 12296, base_atk: 233, base_def: 815, geo_: 28.8 },
    { base_hp: 13226, base_atk: 251, base_def: 876, geo_: 28.8 },
  ],
  activeTalents: [
    {
      name: "Favonius Bladework - Weiss",
      NA: [
        { name: "1-Hit", baseMult: 36.74, multType: 1 },
        { name: "2-Hit", baseMult: 36.74, multType: 1 },
        { name: "3-Hit", baseMult: 47.45, multType: 1 },
        { name: "4-Hit", baseMult: 49.75, multType: 1 },
        { name: "5-Hit", baseMult: 62.07, multType: 1 },
      ],
      CA: [{ name: "Charged Attack", baseMult: [47.3, 60.2], multType: 1 }],
      PA: mediumPAs,
      caStamina: 20,
    },
    {
      name: "Abiogenesis: Solar Isotoma",
      image: "0/0e/Talent_Abiogenesis_Solar_Isotoma",
      xtraLvAtCons: 3,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["ES", "elmt"],
          baseMult: 130.4,
          multType: 2,
        },
        {
          name: "Transient Blossom",
          dmgTypes: ["ES", "elmt"],
          baseSType: "def",
          baseMult: 133.6,
          multType: 2,
          // getTlBnes: ({ char, selfMCs }) =>
          //   makeTlBnes(
          //     checkCharMC(Albedo.buffs, char, selfMCs.BCs, 0),
          //     "pct",
          //     [1, 1],
          //     25
          //   ),
        },
      ],
    },
  ],
};

export default Albedo;
