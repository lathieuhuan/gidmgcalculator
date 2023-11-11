import { CSSProperties, useRef, useState } from "react";
import { FaPuzzlePiece } from "react-icons/fa";

import { UserItem } from "@Src/types";
import { useClickOutside, ClickOutsideHandler } from "@Src/hooks";
import { useCheckContainerSetups } from "@Src/hooks/useCheckContainerSetups";

// Component
import { Popover } from "@Src/pure-components";

interface SetupListProps {
  item: UserItem;
  onClickOutside: ClickOutsideHandler;
}
const SetupList = ({ item, onClickOutside }: SetupListProps) => {
  const result = useCheckContainerSetups(item);
  const listRef = useRef<HTMLDivElement>(null);

  useClickOutside(listRef, onClickOutside);

  return (
    <div ref={listRef} className="px-4 py-2 flex flex-col overflow-auto">
      <p className="text-orange font-medium">This item is used on these setups:</p>
      {result.foundSetups.length ? (
        <ul className="mt-1 pl-4 list-disc overflow-auto custom-scrollbar">
          {result.foundSetups.map((setup, i) => {
            return <li key={i}>{setup.name}</li>;
          })}
        </ul>
      ) : (
        <p className="text-center text-lesser">[No valid setups found]</p>
      )}
    </div>
  );
};

interface OwnerLabelProps {
  className?: string;
  style?: CSSProperties;
  item?: UserItem;
}
export const OwnerLabel = ({ className, style, item }: OwnerLabelProps) => {
  const puzzleBtnRef = useRef<HTMLButtonElement>(null);
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

  const onClickOutsideList: ClickOutsideHandler = (target) => {
    if (puzzleBtnRef.current && !puzzleBtnRef.current.contains(target)) {
      onClickPuzzlePiece();
    }
  };

  return (
    <div
      className={"mt-4 pl-4 font-bold text-black flex justify-between relative " + (className || "")}
      style={{
        backgroundColor: "#FFE7BB",
        ...style,
      }}
    >
      <p className="py-1">Equipped: {item?.owner || "None"}</p>

      {item?.setupIDs?.length ? (
        <>
          <button ref={puzzleBtnRef} className="w-8 h-8 flex-center" onClick={onClickPuzzlePiece}>
            <FaPuzzlePiece className="w-5 h-5" />
          </button>

          <Popover
            as="div"
            className="bottom-full right-2 mb-2 shadow-white-glow"
            active={list.isVisible}
            withTooltipStyle
            origin="bottom-right"
          >
            {list.isMounted && <SetupList item={item} onClickOutside={onClickOutsideList} />}
          </Popover>
        </>
      ) : null}
    </div>
  );
};
