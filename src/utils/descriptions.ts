import { DescriptionSeedGetter, DescriptionSeedGetterArgs } from "@Src/types";
import { round } from "./pure-utils";

const colorCodeToCls: Record<string, string> = {
  b: "font-bold",
  gr: "text-green-300",
  r: "text-red-rose",
  g: "text-yellow-400",
  l: "text-light-800",
  anemo: "text-anemo",
  cryo: "text-cryo",
  dendro: "text-dendro",
  electro: "text-electro",
  geo: "text-geo",
  hydro: "text-hydro",
  pyro: "text-pyro",
};

export const parseCharacterDescription = (
  description: string | number,
  getterArgs: DescriptionSeedGetterArgs,
  dsGetters: DescriptionSeedGetter[] = []
) => {
  if (typeof description === "string") {
    return description.replace(/\{[a-zA-Z0-9 /,%-^"\.\[\]]+\}#\[[a-zA-Z0-9,]*\]/g, (match) => {
      let [content, colorCode = ""] = match.split("#");
      content = content.slice(1, -1);

      const classNames = colorCode
        .slice(1, -1)
        .split(",")
        .reduce((acc, code, i) => acc + (i ? " " : "") + colorCodeToCls[code], "");

      if (content.includes("@")) {
        content = content.slice(1);

        if (!isNaN(+content)) {
          content = dsGetters[+content]?.(getterArgs) || "?";
        } else {
          content = "?";
        }
      }
      return `<span class='${classNames}'>${content}</span>`;
    });
  }
  return "";
};

const typeToCls: Record<string, string> = {
  k: "text-green-300",
  v: "text-green-300 font-bold",
  m: "text-red-rose",
};
const wrapText = (text: string | number, type: string) => {
  return `<span class="${typeToCls[type] || ""}">${text}</span>`;
};

export const parseArtifactDescription = (description: string) => {
  return description.replace(/\{[a-zA-Z0-9 ,%-]+\}#\[[kvm]\]/g, (match) => {
    const [bodyPart, typePart = ""] = match.split("#");
    const body = bodyPart.slice(1, -1);
    const type = typePart?.slice(1, -1);
    return wrapText(body, type);
  });
};

const scaleRefi = (base: number, refi: number, increment = base / 3) => round(base + increment * refi, 3);

export const parseWeaponDescription = (description: string, refi: number) => {
  return description.replace(/\{[a-zA-Z0-9 ',-^$%]+\}(#\[[kvm]\])?/g, (match) => {
    const [bodyPart, typePart = ""] = match.split("#");
    const type = typePart?.slice(1, -1);
    let body = bodyPart.slice(1, -1);
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
