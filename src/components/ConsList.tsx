import { useEffect, useState } from "react";
import cn from "classnames";
import { findCharacter } from "@Data/controllers";
import { CalcChar } from "@Src/types";
import { Green } from "@Styled/DataDisplay";
import { CloseButton } from "@Styled/Inputs";
import { colorByVision } from "@Styled/tw-compounds";
import { InfoSign, SharedSpace } from "./minors";
import AbilityIcon from "./ability-components/Icon";
import SlideShow from "./ability-components/SlideShow";

interface ConsListProps {
  char: NonNullable<CalcChar>;
  onClickIcon: (index: number) => void;
}
export default function ConsList({ char, onClickIcon }: ConsListProps) {
  const [consLv, setConsLv] = useState(0);
  const [atDetails, setAtDetails] = useState(false);

  const { code, vision, constellation } = findCharacter(char)!;

  useEffect(() => {
    setAtDetails(false);
  }, [code]);

  if (!constellation.length) {
    return (
      <p className="pt-3 px-3 text-h5 text-center">
        The time has not yet come for this person's corner of the night sky to light up.
      </p>
    );
  }
  const { name } = constellation[consLv - 1];
  const desc = "No description yet";

  return (
    <SharedSpace
      atLeft={atDetails}
      leftPart={
        <div className="h-full hide-scrollbar flex flex-col gap-4">
          {constellation.map((cons, i) => {
            return (
              <div key={i} className="flex">
                <div className="flex-center">
                  <AbilityIcon
                    className="my-1 mr-2 cursor-pointer"
                    img={cons.image}
                    active={consLv >= i + 1}
                    vision={vision}
                    onClick={() => onClickIcon(i)}
                  />
                </div>
                <div
                  className={"grow-1 flex align-center group"}
                  onClick={() => {
                    setAtDetails(true);
                    setConsLv(i + 1);
                  }}
                >
                  <p className={cn("px-2 text-h6 font-bold", consLv < i + 1 && "opacity-50")}>
                    {cons.name}
                  </p>
                  <InfoSign className="ml-auto" />
                </div>
              </div>
            );
          })}
        </div>
      }
      rightPart={
        consLv ? (
          <div className="full-h flex-col">
            <div className="hide-scrollbar">
              <SlideShow
                forTalent={false}
                currentIndex={consLv - 1}
                images={constellation.map((cons) => cons.image)}
                vision={vision}
                onClickBack={() => setConsLv(consLv - 1)}
                onClickNext={() => setConsLv(consLv + 1)}
              />
              <div className="py-2 cons_details">
                <p className={cn("text-h5 font-bold", colorByVision[vision])}>{name}</p>
                <p className="text-h6">
                  Constellation Lv. <Green b>{consLv}</Green>
                </p>
                <p className="mt-3">
                  {consLv === 3 || consLv === 5 ? (
                    <>
                      Increases the Level of <Green>{desc}</Green> by <Green b>3</Green>.<br />{" "}
                      Maximum upgrade level is 15.
                    </>
                  ) : (
                    desc
                  )}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <CloseButton
                className="mx-auto"
                onClick={() => {
                  setAtDetails(false);
                  setTimeout(() => setConsLv(0), 200);
                }}
              />
            </div>
          </div>
        ) : null
      }
    />
  );
}