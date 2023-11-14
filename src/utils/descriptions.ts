import { DescriptionSeedGetter, DescriptionSeedGetterArgs } from "@Src/types";
import { round } from "./pure-utils";

const typeToCls: Record<string, string> = {
  k: "text-green-300", // key
  v: "text-green-300 font-bold", // value
  m: "text-red-rose", // max
  n: "text-light-800", // note
  ms: "text-yellow-400", // milestone
  anemo: "text-anemo",
  cryo: "text-cryo",
  dendro: "text-dendro",
  electro: "text-electro",
  geo: "text-geo",
  hydro: "text-hydro",
  pyro: "text-pyro",
};

const wrapText = (text: string | number, type = "") => {
  return `<span class="${typeToCls[type] || ""}">${text}</span>`;
};

export const parseCharacterDescription = (
  description: string | number,
  getterArgs: DescriptionSeedGetterArgs,
  dsGetters: DescriptionSeedGetter[] = []
) => {
  if (typeof description === "string") {
    const pattern = /\{[\w \-/,%^"@\.\[\]]+\}#\[\w*\]/g;

    return description.replace(pattern, (match) => {
      let [body, type = ""] = match.split("#");
      body = body.slice(1, -1);
      type = type.slice(1, -1);

      if (body.includes("@")) {
        body = body.slice(1);

        if (!isNaN(+body)) {
          body = dsGetters[+body]?.(getterArgs) || "?";
        } else {
          body = "?";
        }
      }
      return wrapText(body, type);
    });
  }
  return "";
};

export const parseArtifactDescription = (description: string) => {
  return description.replace(/\{[\w \-,%]+\}#\[[kvm]\]/g, (match) => {
    let [body, type = ""] = match.split("#");
    body = body.slice(1, -1);
    type = type?.slice(1, -1);
    return wrapText(body, type);
  });
};

const scaleRefi = (base: number, refi: number, increment = base / 3) => round(base + increment * refi, 3);

export const parseWeaponDescription = (description: string, refi: number) => {
  return description.replace(/\{[\w \-,%'"^$]+\}(#\[[kvm]\])?/g, (match) => {
    let [body, type = ""] = match.split("#");
    body = body.slice(1, -1);
    type = type?.slice(1, -1);
    let suffix = "";

    if (body[body.length - 1] === "%") {
      body = body.slice(0, -1);
      suffix = "%";
    }

    if (body.includes("^")) {
      const [base, increment] = body.split("^");
      return wrapText(scaleRefi(+base, refi, increment ? +increment : undefined) + suffix, type);
    }
    if (body.includes("$")) {
      const values = body.split("$");
      return wrapText(values[refi - 1] + suffix, type);
    }
    return wrapText(body + suffix, type);
  });
};
