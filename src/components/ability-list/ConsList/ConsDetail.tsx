import { useState } from "react";
// import { AiOutlineLoading3Quarters } from "react-icons/ai";

import type { AppCharacter } from "@Src/types";
// import { GENSHIN_DEV_URL } from "@Src/constants";

// Conponent
import { CloseButton, Green, Lesser } from "@Src/pure-components";
import { SlideShow } from "../components";

interface ConsDetailProps {
  dataChar: AppCharacter;
  consLv: number;
  onChangeConsLv?: (newLv: number) => void;
  onClose?: () => void;
}
export const ConsDetail = ({ dataChar, consLv, onChangeConsLv, onClose }: ConsDetailProps) => {
  // #to-do
  const [status, setStatus] = useState<"idle" | "loading" | "error">("loading");

  const { vision, constellation } = dataChar;
  const consInfo = constellation[consLv - 1] || {};

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
      {consInfo.description ? (
        <p className="mt-4">{consInfo.description}</p>
      ) : (
        <p className={"mt-4" + (status === "loading" ? " py-4 flex justify-center" : "")}>
          {status === "error" && <Lesser>Error. Rebooting...</Lesser>}
          {/* {status === "loading" && <AiOutlineLoading3Quarters className="text-2xl animate-spin" />} */}
        </p>
      )}

      <div className="mt-4">
        <CloseButton className="mx-auto" size="small" onClick={onClose} />
      </div>
    </div>
  );
};
