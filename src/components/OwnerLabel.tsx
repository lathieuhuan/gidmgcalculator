import { CSSProperties, useEffect, useState } from "react";
import { FaPuzzlePiece } from "react-icons/fa";

import { UserItem } from "@Src/types";
import { useCheckContainerSetups } from "@Src/hooks/useCheckContainerSetups";
import { isUserWeapon } from "@Src/utils";

// Store
import { useDispatch } from "@Store/hooks";
import { updateUserArtifact, updateUserWeapon } from "@Store/userDatabaseSlice";

// Component
import { Popover } from "@Src/pure-components";

interface SetupListProps {
  item: UserItem;
}
const SetupList = ({ item }: SetupListProps) => {
  const dispatch = useDispatch();
  const result = useCheckContainerSetups(item);

  useEffect(() => {
    return () => {
      if (result.invalidIds.length) {
        const changes = {
          ID: item.ID,
          setupIDs: item.setupIDs?.filter((id) => !result.invalidIds.includes(id)),
        };

        isUserWeapon(item) ? dispatch(updateUserWeapon(changes)) : dispatch(updateUserArtifact(changes));
      }
    };
  }, []);

  return (
    <div className="flex flex-col overflow-auto">
      <p className="text-orange font-medium">This item is used on these setups:</p>
      {result.foundSetups.length ? (
        <ul className="mt-1 pl-4 list-disc overflow-auto custom-scrollbar">
          {result.foundSetups.map((setup, i) => {
            return <li key={i}>{setup.name}</li>;
          })}
        </ul>
      ) : (
        <p className="text-center">[No valid setups found]</p>
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
          <button className="w-8 h-8 flex-center" onClick={onClickPuzzlePiece}>
            <FaPuzzlePiece className="w-5 h-5" />
          </button>
          <Popover
            as="div"
            className="bottom-full right-2 mb-2 px-4 py-2 shadow-white-glow"
            active={list.isVisible}
            withTooltipStyle
            origin="bottom-right"
          >
            {list.isMounted && <SetupList item={item} />}
          </Popover>
        </>
      ) : null}
    </div>
  );
};
