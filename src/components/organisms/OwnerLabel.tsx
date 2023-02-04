import { CSSProperties, useState } from "react";
import { FaPuzzlePiece } from "react-icons/fa";

// Selector
import { selectUserSetups } from "@Store/userDatabaseSlice/selectors";

// Hook
import { useSelector } from "@Store/hooks";

// Util
import { findById } from "@Src/utils";

const SetupList = ({ setupIDs }: { setupIDs?: number[] }) => {
  const userSetups = useSelector(selectUserSetups);

  return (
    <div className="flex flex-col overflow-auto">
      <p className="text-orange font-medium">This item is used on these setups:</p>
      <ul className="mt-1 pl-4 list-disc overflow-auto custom-scrollbar">
        {setupIDs?.map((ID, i) => {
          const { name } = findById(userSetups, ID) || {};
          return name ? <li key={i}>{name}</li> : null;
        })}
      </ul>
    </div>
  );
};

interface OwnerLabelProps {
  className?: string;
  style?: CSSProperties;
  owner?: string | null;
  setupIDs?: number[];
}
export const OwnerLabel = ({ className, style, owner, setupIDs }: OwnerLabelProps) => {
  const [list, setList] = useState({
    isVisible: false,
    isMounted: false,
  });

  const onClickPuzzlePiece = () => {
    setList((prevList) => {
      return {
        isVisible: !prevList.isVisible,
        isMounted: prevList.isVisible ? prevList.isMounted : true,
      };
    });

    setTimeout(() => {
      setList((prevList) => {
        return prevList.isVisible
          ? prevList
          : {
              ...prevList,
              isMounted: false,
            };
      });
    }, 200);
  };

  return owner === undefined ? null : (
    <div
      className={
        "mt-4 pl-4 font-bold text-black flex justify-between relative " + (className || "")
      }
      style={{
        backgroundColor: "#FFE7BB",
        ...style,
      }}
    >
      <p className="py-1">Equipped: {owner || "None"}</p>
      {setupIDs?.length ? (
        <button className="w-8 h-8 flex-center" onClick={onClickPuzzlePiece}>
          <FaPuzzlePiece className="w-5 h-5" />
        </button>
      ) : null}

      <div
        className={
          "absolute bottom-full right-2 mb-2 px-4 py-2 text-default small-tooltip origin-bottom-right shadow-white-glow " +
          (list.isVisible ? "scale-100" : "scale-0")
        }
      >
        {list.isMounted && <SetupList setupIDs={setupIDs} />}
      </div>
    </div>
  );
};
