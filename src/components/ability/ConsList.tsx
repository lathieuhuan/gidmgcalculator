import cn from "classnames";
import { type ReactNode, useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import type { CharInfo } from "@Src/types";
import { GENSHIN_DEV_URL } from "@Src/constants";
import { findCharacter } from "@Data/controllers";

import { Green, CloseButton } from "@Src/styled-components";
import { InfoSign, SharedSpace } from "@Components/minors";
import { AbilityIcon, SlideShow } from "./components";

interface ConsListProps {
  char: CharInfo;
  onClickIcon: (index: number) => void;
}
export function ConsList({ char, onClickIcon }: ConsListProps) {
  const [consLv, setConsLv] = useState(0);
  const [atDetails, setAtDetails] = useState(false);

  const { code, beta, vision, constellation } = findCharacter(char)!;
  const { name, desc } = constellation[consLv - 1] || {};

  useEffect(() => {
    setAtDetails(false);
  }, [code]);

  if (!constellation.length) {
    return (
      <p className="pt-4 px-4 text-h5 text-center">
        The time has not yet come for this person's corner of the night sky to light up.
      </p>
    );
  }

  return (
    <SharedSpace
      atLeft={!atDetails}
      leftPart={
        <div className="h-full hide-scrollbar flex flex-col space-y-4">
          {constellation.map((cons, i) => {
            return (
              <div key={i} className="flex">
                <div className="flex-center">
                  <AbilityIcon
                    className="my-1 mr-2 cursor-pointer"
                    img={cons.image}
                    active={char.cons >= i + 1}
                    vision={vision}
                    onClick={() => onClickIcon(i)}
                  />
                </div>
                <div
                  className={"grow flex items-center group"}
                  onClick={() => {
                    setAtDetails(true);
                    setConsLv(i + 1);
                  }}
                >
                  <p className={cn("px-2 text-h6 font-bold", char.cons < i + 1 && "opacity-50")}>
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
                <p className={`text-h5 text-${vision} font-bold`}>{name}</p>
                <p className="text-h6">
                  Constellation Lv. <Green b>{consLv}</Green>
                </p>
                {atDetails && (
                  <ConstellationDetailDesc
                    charName={char.name}
                    beta={beta}
                    consLv={consLv}
                    desc={desc}
                  />
                )}
              </div>
            </div>
            <div className="mt-4">
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

interface IConstellationDetailDescProps {
  charName: string;
  beta?: boolean;
  consLv: number;
  desc: ReactNode;
}
function ConstellationDetailDesc({ charName, beta, consLv, desc }: IConstellationDetailDescProps) {
  const [descArr, setDescArr] = useState([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("loading");

  useEffect(() => {
    if (!beta) {
      setStatus("loading");

      fetch(GENSHIN_DEV_URL + `/characters/` + charName)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setStatus("error");
          } else {
            const { constellations = [] } = data;
            setDescArr(constellations.map((constellation: any) => constellation.description));
            setStatus("idle");
          }
        });
    }
  }, [beta]);

  if (beta) {
    return <p className="mt-4">{desc}</p>;
  }

  return (
    <p className={cn("mt-4", status === "loading" && "py-4 flex justify-center")}>
      {status === "loading" && <AiOutlineLoading3Quarters className="text-2xl animate-spin" />}
      {status === "error" && "Error. Rebooting... Please comeback later."}
      {status === "idle" && descArr[consLv - 1]}
    </p>
  );
}
