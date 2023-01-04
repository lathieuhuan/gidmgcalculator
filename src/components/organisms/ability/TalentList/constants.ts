import type { Vision, WeaponType } from "@Src/types";

export const NORMAL_ATTACK_ICONS: Partial<Record<`${WeaponType}_${Vision}`, string>> = {
  bow_pyro: "7/7f/Bow_Pyro",
  bow_cryo: "a/a9/Bow_Cryo",
  bow_hydro: "6/62/Bow_Hydro",
  bow_electro: "9/98/Bow_Electro",
  bow_geo: "7/71/Bow_Geo",
  bow_anemo: "5/5b/Bow_Anemo",
  bow_dendro: "a/a9/Bow_Dendro",
  catalyst_pyro: "8/80/Catalyst_Pyro",
  catalyst_hydro: "7/77/Catalyst_Hydro",
  catalyst_electro: "e/e7/Catalyst_Electro",
  catalyst_geo: "e/e1/Catalyst_Geo",
  catalyst_anemo: "d/dd/Catalyst_Anemo",
  catalyst_dendro: "c/c4/Catalyst_Dendro",
  claymore_pyro: "5/57/Claymore_Pyro",
  claymore_cryo: "9/99/Claymore_Cryo",
  claymore_geo: "6/65/Claymore_Geo",
  claymore_electro: "0/0f/Claymore_Electro",
  claymore_anemo: "c/c7/Claymore_Anemo",
  polearm_pyro: "f/fe/Polearm_Pyro",
  polearm_cryo: "9/91/Polearm_Cryo",
  polearm_hydro: "7/73/Polearm_Hydro",
  polearm_electro: "0/06/Polearm_Electro",
  polearm_anemo: "e/ee/Polearm_Anemo",
  polearm_geo: "9/99/Polearm_Geo",
  sword_pyro: "0/0d/Sword_Pyro",
  sword_cryo: "6/6a/Sword_Cryo",
  sword_hydro: "e/ea/Sword_Hydro",
  sword_electro: "6/68/Talent_Yunlai_Swordsmanship",
  sword_geo: "7/79/Sword_Geo",
  sword_anemo: "0/04/Sword_Anemo",
  sword_dendro: "5/5e/Sword_Dendro",
};
