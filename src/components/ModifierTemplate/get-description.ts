export const decoCharacterDescription = (pot: string | number) => {
  if (typeof pot === "string") {
    return pot.replace(/\{[a-zA-Z0-9,\.%\[\] ]+\}#\[[a-zA-Z0-9,]+\]/g, (match) => {
      let [content, colorCode = ""] = match.split("#");
      let classNames = "";

      colorCode
        .slice(1, -1)
        .split(",")
        .forEach((config, i) => {
          const colorCodeToCls: Record<string, string> = {
            B: "font-bold",
            Gr: "text-green",
            R: "text-rose-500",
            G: "text-lightgold",
            anemo: "text-anemo",
          };
          classNames += (i ? " " : "") + colorCodeToCls[config];
        });
      return `<span class='${classNames}'>${content.slice(1, -1)}</span>`;
    });
  }
  return "";
};
