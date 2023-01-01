import { useState } from "react";
import { FaPuzzlePiece } from "react-icons/fa";

// Selector
import { selectMySetups } from "@Store/userDatabaseSlice/selectors";

// Hook
import { useSelector } from "@Store/hooks";

// Util
import { findById } from "@Src/utils";

// Component
import { Modal } from "@Components/molecules";

const SetupList = ({ setupIDs }: { setupIDs?: number[] }) => {
  const userSetups = useSelector(selectMySetups);

  return (
    <div className="flex flex-col overflow-auto">
      <p className="text-lg text-orange leading-6 font-medium">
        This item is used on these setups:
      </p>
      <ul className="mt-2 pl-4 list-disc overflow-auto custom-scrollbar">
        {setupIDs?.map((ID, i) => {
          const { name } = findById(userSetups, ID) || {};
          return name ? <li key={i}>{name}</li> : null;
        })}
      </ul>
    </div>
  );
};

interface OwnerLabelProps {
  owner?: string | null;
  setupIDs?: number[];
}
export function OwnerLabel({ owner, setupIDs }: OwnerLabelProps) {
  const [isVisibleList, setIsVisibleList] = useState(false);

  return owner === undefined ? null : (
    <div className="mt-4 pl-4 font-bold text-black bg-[#ffe7bb] flex justify-between">
      <p className="py-1">Equipped: {owner || "None"}</p>
      {setupIDs?.length ? (
        <button className="w-8 h-8 flex-center" onClick={() => setIsVisibleList(true)}>
          <FaPuzzlePiece className="w-5 h-5" />
        </button>
      ) : null}

      <Modal
        active={isVisibleList}
        className="p-4 bg-darkblue-2 rounded-md shadow-white-glow max-w-95 flex flex-col overflow-auto"
        style={{ maxHeight: "60vh", minWidth: 300 }}
        onClose={() => setIsVisibleList(false)}
      >
        <SetupList setupIDs={setupIDs} />
      </Modal>
    </div>
  );
}
