export const decoCharacterDescription = (pot: string | number) => {
  if (typeof pot === "string") {
    return pot.replace(/\{[a-zA-Z0-9 /,%\.\[\]]+\}#\[[a-zA-Z0-9,]+\]/g, (match) => {
      const [content, colorCode = ""] = match.split("#");
      let classNames = "";

      colorCode
        .slice(1, -1)
        .split(",")
        .forEach((config, i) => {
          const colorCodeToCls: Record<string, string> = {
            b: "font-bold",
            gr: "text-green",
            r: "text-rose-500",
            g: "text-lightgold",
            anemo: "text-anemo",
            cryo: "text-cryo",
            dendro: "text-dendro",
            electro: "text-electro",
            geo: "text-geo",
            hydro: "text-hydro",
            pyro: "text-pyro",
          };
          classNames += (i ? " " : "") + colorCodeToCls[config];
        });
      return `<span class='${classNames}'>${content.slice(1, -1)}</span>`;
    });
  }
  return "";
};
