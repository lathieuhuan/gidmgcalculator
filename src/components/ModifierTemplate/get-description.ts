import type { AppWeapon, DescriptionSeedGetter, DescriptionSeedGetterArgs, WeaponBuff } from "@Src/types";
import { WeaponCard } from "../WeaponCard";

export const parseCharacterDescription = (
  description: string | number,
  getterArgs: DescriptionSeedGetterArgs,
  dsGetters: DescriptionSeedGetter[] = []
) => {
  if (typeof description === "string") {
    const colorCodeToCls: Record<string, string> = {
      b: "font-bold",
      gr: "text-green",
      r: "text-rose-500",
      g: "text-lightgold",
      l: "text-lesser",
      anemo: "text-anemo",
      cryo: "text-cryo",
      dendro: "text-dendro",
      electro: "text-electro",
      geo: "text-geo",
      hydro: "text-hydro",
      pyro: "text-pyro",
    };

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

export const getWeaponDescription = (descriptions: AppWeapon["descriptions"], buff: WeaponBuff, refi: number) => {
  if (descriptions?.length) {
    let { description = 0 } = buff;
    description = typeof description === "number" ? descriptions[description] : description;
    return WeaponCard.parseDescription(description || "", refi);
  }
  return "";
};
