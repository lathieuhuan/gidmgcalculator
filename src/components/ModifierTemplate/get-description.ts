import clsx from "clsx";

export const decoCharacterDescription = (pot: string | number) => {
  if (typeof pot === "string") {
    return pot.replace(/\{[a-zA-Z0-9 ]+\}%?/g, (match) => {
      let content: string | number = "";
      let suffix = "";

      if (match[match.length - 1] === "%") {
        content = +match.slice(1, -2);
        suffix = "%";
      } else {
        content = match.slice(1, -1);
      }
      console.log("content", content);

      return `<span class='${clsx("text-green", !isNaN(+content) && "font-bold")}'>${content + suffix}</span>`;
    });
  }
  return "";
};
