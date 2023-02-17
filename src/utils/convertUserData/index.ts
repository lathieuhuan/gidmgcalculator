import { toVersion3_0 } from "./toVersion3_0";
export * from "./fromGoodFormat";

const ERROR = {
  cannotRecognise: "We cannot recognise your version of data.",
  databaseTooOld: "Your database are too old and cannot be converted to the current version",
};

export function convertUserData(data: any) {
  const version = +data.version;

  if (version < 2.1) {
    throw new Error(ERROR.databaseTooOld);
  }
  if (version === 2.1) {
    return toVersion3_0(data);
  }
  if (version === 3) {
    return data;
  }

  throw new Error(ERROR.cannotRecognise);
}
