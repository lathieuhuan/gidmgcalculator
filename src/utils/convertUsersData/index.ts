import type { ConvertUsersDataArgs } from "./types";
import { toVersion3_0 } from "./toVersion3_0";

const ERROR = {
  cannotRecognise: "We cannot recognise your version of data.",
  databaseTooOld: "Your database are too old and cannot be converted to the current version",
};

export function convertUsersData(data: ConvertUsersDataArgs) {
  const version = +data.version;

  if (isNaN(version)) {
    throw new Error(ERROR.cannotRecognise);
  }

  if (version < 2.1) {
    throw new Error(ERROR.databaseTooOld);
  }

  if (version === 2.1) {
    return toVersion3_0(data);
  }

  return {
    version: 3,
    Characters: [],
    Weapons: [],
    Artifacts: [],
    Setups: [],
    outdates: [],
  };
}
