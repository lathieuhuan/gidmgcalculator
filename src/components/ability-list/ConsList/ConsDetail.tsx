import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import type { DataCharacter, Talent } from "@Src/types";
import { GENSHIN_DEV_URL } from "@Src/constants";

// Conponent
import { CloseButton, Green, Lesser } from "@Src/pure-components";
import { SlideShow } from "../components";

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
    bonusLvFromCons,
    NAsConfig: { name },
    activeTalents: { ES, EB },
    constellation,
  } = dataChar;
  const consInfo = constellation[consLv - 1] || {};
  let abilityName = "";

  const getName = (talent: Talent) => {
    const nameMap: Partial<Record<Talent, string>> = {
      NAs: name,
      ES: ES.name,
      EB: EB.name,
    };
    return nameMap[talent] || "";
  };

  if (consLv === 3) {
    abilityName = getName(bonusLvFromCons[0]);
  }
  if (consLv === 5) {
    abilityName = getName(bonusLvFromCons[1]);
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
    <div className="h-full flex-col hide-scrollbar">
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
          {status === "loading" && <AiOutlineLoading3Quarters className="text-2xl animate-spin" />}
          {status === "error" && <Lesser>Error. Rebooting...</Lesser>}
          {status === "idle" && descArr[consLv - 1]}
        </p>
      )}

      <div className="mt-4">
        <CloseButton className="mx-auto" size="small" onClick={onClose} />
      </div>
    </div>
  );
};
