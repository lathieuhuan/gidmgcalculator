import type { UserArtifact, UserWeapon } from "@Src/types";
import { findDataArtifact, findDataWeapon } from "@Data/controllers";

export const getWeaponInfo = ({ type, code, owner, refi, level, setupIDs }: UserWeapon) => {
  const { beta, name, icon = "", rarity = 5 } = findDataWeapon({ type, code }) || {};
  return { beta, name, icon, rarity, level, refi, owner, setupIDs };
};

export const getArtifactInfo = ({ code, type, owner, rarity, level, setupIDs }: UserArtifact) => {
  const { beta, name, icon = "" } = findDataArtifact({ code, type }) || {};
  return { beta, name, icon, rarity, level, owner, setupIDs };
};

export const checkIfWeapon = (item: UserWeapon | UserArtifact): item is UserWeapon => "refi" in item;

export const getDataId = (item: UserWeapon | UserArtifact) => `${item.type}-${item.code}`;
