import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import type { DataCharacter } from "@Src/types";

// Constant
import { GENSHIN_DEV_URL } from "@Src/constants";

// Conponent
import { CloseButton, Green, Lesser } from "@Components/atoms";
import { SlideShow } from "../molecules";

interface ConsDetailProps {
  dataChar: DataCharacter;
  consLv: number;
  onChangeConsLv?: (newLv: number) => void;
  onClose?: () => void;
}
export const ConsDetail = ({ dataChar, consLv, onChangeConsLv, onClose }: ConsDetailProps) => {
  const [descArr, setDescArr] = useState([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("loading");

  const {
    name: charName,
    vision,
    isReverseXtraLv,
    activeTalents: { ES, EB },
    constellation,
  } = dataChar;
  const consInfo = constellation[consLv - 1] || {};
  let abilityName = "";

  if (consLv === 3) {
    abilityName = isReverseXtraLv ? EB.name : ES.name;
  }
  if (consLv === 5) {
    abilityName = isReverseXtraLv ? ES.name : EB.name;
  }

  const consDesc = abilityName ? (
    <>
      Increases the Level of {abilityName} by 3.
      <br />
      Maximum upgrade level is 15.
    </>
  ) : (
    consInfo.desc
  );

  useEffect(() => {
    if (!constellation[0].desc) {
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
  }, []);

  return (
    <div className="full-h flex-col">
      <div className="hide-scrollbar">
        <SlideShow
          forTalent={false}
          currentIndex={consLv - 1}
          images={constellation.map((cons) => cons.image)}
          vision={vision}
          onClickBack={() => onChangeConsLv?.(consLv - 1)}
          onClickNext={() => onChangeConsLv?.(consLv + 1)}
        />
        <p className={`text-xl text-${vision} font-bold`}>{consInfo.name}</p>
        <p className="text-lg">
          Constellation Lv. <Green b>{consLv}</Green>
        </p>
        {consDesc ? (
          <p className="mt-4">{consDesc}</p>
        ) : (
          <p className={"mt-4" + (status === "loading" ? " py-4 flex justify-center" : "")}>
            {status === "loading" && (
              <AiOutlineLoading3Quarters className="text-2xl animate-spin" />
            )}
            {status === "error" && <Lesser>Error. Rebooting...</Lesser>}
            {status === "idle" && descArr[consLv - 1]}
          </p>
        )}
      </div>
      <div className="mt-4">
        <CloseButton className="mx-auto" onClick={onClose} />
      </div>
    </div>
  );
};