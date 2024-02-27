import { CSSProperties, useRef, useState } from "react";
import { FaPuzzlePiece } from "react-icons/fa";

import { UserItem, UserSetup, UserWeapon } from "@Src/types";
import { useClickOutside, ClickOutsideHandler } from "@Src/pure-hooks";
import { BoundingItem, useItemBoundSetups } from "@Src/hooks";

// Component
import { Popover } from "@Src/pure-components";

interface SetupListProps {
  setups: UserSetup[];
  onClickOutside: ClickOutsideHandler;
}
const SetupList = ({ setups, onClickOutside }: SetupListProps) => {
  const listRef = useRef<HTMLDivElement>(null);

  useClickOutside(listRef, onClickOutside);

  return (
    <div ref={listRef} className="px-4 py-2 flex flex-col overflow-auto">
      <p className="text-orange-500 font-medium">This item is used on these setups:</p>
      <ul className="mt-1 pl-4 list-disc overflow-auto custom-scrollbar">
        {setups.map((setup, i) => {
          return <li key={i}>{setup.name}</li>;
        })}
      </ul>
      {/* <p className="text-center text-light-800">[No valid setups found]</p> */}
    </div>
  );
};

interface OwnerLabelProps {
  className?: string;
  style?: CSSProperties;
  item?: BoundingItem & {
    owner?: UserItem["owner"];
    refi?: UserWeapon["refi"];
  };
}
export const OwnerLabel = ({ className = "", style, item }: OwnerLabelProps) => {
  const puzzleBtnRef = useRef<HTMLButtonElement>(null);
  const [list, setList] = useState({
    isVisible: false,
    isMounted: false,
  });

  const containingSetups = useItemBoundSetups(item, item && "refi" in item);

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

  const cls = `pl-4 rounded-sm font-bold bg-yellow-200 text-black flex justify-between relative ${className}`;

  if (!item) {
    return <div className={`h-8 ${cls}`} style={style} />;
  }

  return (
    <div className={cls} style={style}>
      <p className="py-1">Equipped: {item.owner || "None"}</p>

      {containingSetups.length ? (
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
            {list.isMounted && <SetupList setups={containingSetups} onClickOutside={onClickOutsideList} />}
          </Popover>
        </>
      ) : null}
    </div>
  );
};
