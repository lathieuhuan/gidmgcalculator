import clsx from "clsx";
import { useMemo, useState } from "react";
import { FaTimes } from "react-icons/fa";

import type { UserArtifact } from "@Src/types";
import { MAX_USER_ARTIFACTS } from "@Src/constants";
import { useIconSelect } from "@Src/hooks";
import { findById, indexById } from "@Src/utils";

// Store
import { useDispatch, useSelector } from "@Store/hooks";
import { selectUserArts } from "@Store/userDatabaseSlice/selectors";
// Action
import { addUserArtifact, sortArtifacts } from "@Store/userDatabaseSlice";
import { updateMessage } from "@Store/calculatorSlice";

// Component
import { ButtonGroup, Modal, WarehouseLayout } from "@Src/pure-components";
import { InventoryRack, PickerArtifact, ArtifactFilter, ArtifactFilterState } from "@Src/components";
import { ChosenArtifactView } from "./ChosenArtifactView";

type ModalType = "ADD_ARTIFACT" | "FITLER" | "";

export default function MyArtifacts() {
  const dispatch = useDispatch();
  const userArts = useSelector(selectUserArts);

  const [chosenID, setChosenID] = useState(0);
  const [modalType, setModalType] = useState<ModalType>("");
  const [filterCondition, setFilterCondition] = useState<ArtifactFilterState>(ArtifactFilter.DEFAULT_CONDITION);

  const { updateTypes, renderTypeSelect } = useIconSelect.Artifact(null, {
    onChange: (selectedTypes) => {
      setFilterCondition((prev) => ({
        ...prev,
        types: selectedTypes,
      }));
    },
  });

  const filteredArtifacts = useMemo(
    () => ArtifactFilter.filterArtifacts(userArts, filterCondition),
    [userArts, filterCondition]
  );
  const chosenArtifact = findById(filteredArtifacts, chosenID);

  const closeModal = () => setModalType("");

  const isMaxArtifactsReached = () => {
    if (userArts.length >= MAX_USER_ARTIFACTS) {
      dispatch(
        updateMessage({
          type: "error",
          content: "Number of stored artifacts has reached its limit.",
        })
      );
      return true;
    }
  };

  const onClickAddArtifact = () => {
    if (!isMaxArtifactsReached()) {
      setModalType("ADD_ARTIFACT");
    }
  };

  const onClickSortArtifact = () => {
    dispatch(sortArtifacts());
  };

  const onRemoveArtifact = () => {
    const removedIndex = indexById(filteredArtifacts, chosenID);

    if (removedIndex !== -1) {
      if (filteredArtifacts.length > 1) {
        const move = removedIndex === filteredArtifacts.length - 1 ? -1 : 1;

        setChosenID(filteredArtifacts[removedIndex + move].ID);
      } else {
        setChosenID(0);
      }
    }
  };

  const isFiltered =
    filterCondition.types.length ||
    filterCondition.codes.length ||
    filterCondition.stats.main !== "All" ||
    filterCondition.stats.subs.some((s) => s !== "All");

  return (
    <WarehouseLayout.Wrapper>
      <WarehouseLayout>
        <WarehouseLayout.ButtonBar className="space-x-4">
          <ButtonGroup
            buttons={[
              { text: "Add", onClick: onClickAddArtifact },
              { text: "Sort", onClick: onClickSortArtifact },
            ]}
          />

          {window.innerWidth >= 600 && renderTypeSelect()}

          <div className="flex cursor-pointer">
            <button
              className={clsx(
                "pl-4 py-1 text-black glow-on-hover",
                isFiltered ? "pr-2 bg-green-200 rounded-l-2xl" : "pr-4 bg-light-600 rounded-2xl"
              )}
              onClick={() => setModalType("FITLER")}
            >
              <p className="font-bold">Filter</p>
            </button>

            {isFiltered && (
              <div
                className="pl-2 pr-3 rounded-r-2xl text-black bg-light-400 flex-center glow-on-hover"
                onClick={() => {
                  const { DEFAULT_CONDITION } = ArtifactFilter;
                  setFilterCondition(DEFAULT_CONDITION);
                  updateTypes(DEFAULT_CONDITION.types);
                }}
              >
                <FaTimes />
              </div>
            )}
          </div>
        </WarehouseLayout.ButtonBar>

        <WarehouseLayout.Body className="hide-scrollbar gap-2">
          <InventoryRack
            data={filteredArtifacts}
            emptyText="No artifacts found"
            itemCls="max-w-1/3 basis-1/3 xm:max-w-1/4 xm:basis-1/4 lg:max-w-1/6 lg:basis-1/6 xl:max-w-1/8 xl:basis-1/8"
            chosenID={chosenID || 0}
            onClickItem={(item) => setChosenID(item.ID)}
          />

          <ChosenArtifactView artifact={chosenArtifact} onRemoveArtifact={onRemoveArtifact} />
        </WarehouseLayout.Body>
      </WarehouseLayout>

      <Modal
        active={modalType === "FITLER"}
        preset="large"
        title="Artifact Filter"
        bodyCls="grow hide-scrollbar"
        onClose={closeModal}
      >
        <ArtifactFilter
          showTypeFilter
          artifacts={userArts}
          initialCondition={filterCondition}
          onConfirm={(contition) => {
            setFilterCondition(contition);
            updateTypes(contition.types);
          }}
          onClose={closeModal}
        />
      </Modal>

      <PickerArtifact
        active={modalType === "ADD_ARTIFACT"}
        hasMultipleMode
        hasConfigStep
        onPickArtifact={(item) => {
          if (isMaxArtifactsReached()) return false;

          const newArtifact: UserArtifact = {
            ...item,
            ID: Date.now(),
            owner: null,
          };

          dispatch(addUserArtifact(newArtifact));
          setChosenID(newArtifact.ID);
          return true;
        }}
        onClose={closeModal}
      />
    </WarehouseLayout.Wrapper>
  );
}
