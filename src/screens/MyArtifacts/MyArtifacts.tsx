import clsx from "clsx";
import { useMemo, useState } from "react";
import { FaTimes } from "react-icons/fa";

import type { ArtifactType, UserArtifact } from "@Src/types";
import { ARTIFACT_ICONS, MAX_USER_ARTIFACTS } from "@Src/constants";
import { useTypeFilter } from "@Src/hooks";
import { findById, indexById } from "@Src/utils";

// Store
import { useDispatch, useSelector } from "@Store/hooks";
import { selectUserArts } from "@Store/userDatabaseSlice/selectors";
// Action
import { addUserArtifact, sortArtifacts } from "@Store/userDatabaseSlice";
import { updateMessage } from "@Store/calculatorSlice";

// Component
import { ButtonGroup, Modal, ModalHeader, WarehouseLayout } from "@Src/pure-components";
import { TypeSelect, InventoryRack, PickerArtifact, ArtifactFilter, ArtifactFilterCondition } from "@Src/components";
import { ChosenArtifactView } from "./ChosenArtifactView";

import styles from "../styles.module.scss";

export default function MyArtifacts() {
  const dispatch = useDispatch();
  const userArts = useSelector(selectUserArts);

  const [chosenID, setChosenID] = useState(0);
  const [modalType, setModalType] = useState<"PICK_ARTIFACT_TYPE" | "FITLER" | "">("");
  const [artifactPicker, setArtifactPicker] = useState<{ active: boolean; type: ArtifactType }>({
    active: false,
    type: "flower",
  });
  const [filterCondition, setFilterCondition] = useState<ArtifactFilterCondition>(ArtifactFilter.DEFAULT_CONDITION);

  const { operate, renderTypeFilter } = useTypeFilter("artifact", undefined, (filteredTypes) => {
    setFilterCondition((prev) => ({
      ...prev,
      types: filteredTypes as ArtifactType[],
    }));
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
      setModalType("PICK_ARTIFACT_TYPE");
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
        <WarehouseLayout.ButtonBar>
          <ButtonGroup
            className="mr-4"
            buttons={[
              { text: "Add", onClick: onClickAddArtifact },
              { text: "Sort", onClick: onClickSortArtifact },
            ]}
          />

          {window.innerWidth >= 600 && renderTypeFilter()}

          <div className="flex cursor-pointer">
            <button
              className={clsx(
                "pl-4 py-1 glow-on-hover",
                isFiltered ? "pr-2 bg-yellow-400 rounded-l-2xl" : "pr-4 bg-light-400 rounded-2xl"
              )}
              onClick={() => setModalType("FITLER")}
            >
              <p className="text-black font-bold">Filter</p>
            </button>

            {isFiltered && (
              <div
                className="pl-2 pr-3 rounded-r-2xl bg-red-600 flex-center glow-on-hover"
                onClick={() => {
                  const { DEFAULT_CONDITION } = ArtifactFilter;
                  setFilterCondition(DEFAULT_CONDITION);
                  operate.updateFilter(DEFAULT_CONDITION.types);
                }}
              >
                <FaTimes />
              </div>
            )}
          </div>
        </WarehouseLayout.ButtonBar>

        <WarehouseLayout.Body className="hide-scrollbar">
          <InventoryRack
            listClassName={styles.list}
            itemClassName={styles.item}
            chosenID={chosenID || 0}
            itemType="artifact"
            items={filteredArtifacts}
            onClickItem={(item) => setChosenID(item.ID)}
          />
          <ChosenArtifactView artifact={chosenArtifact} onRemoveArtifact={onRemoveArtifact} />
        </WarehouseLayout.Body>
      </WarehouseLayout>

      <Modal active={modalType === "FITLER"} preset="large" withCloseButton={false} onClose={closeModal}>
        <div className="h-full flex flex-col">
          <div className="pt-2 px-2">
            <ModalHeader>
              <div />
              <ModalHeader.Text>Filter</ModalHeader.Text>
              <ModalHeader.RightEnd onClickClose={closeModal} />
            </ModalHeader>
          </div>
          <div className="grow hide-scrollbar relative">
            <ArtifactFilter
              showTypeFilter
              artifacts={userArts}
              initialCondition={filterCondition}
              onConfirm={(contition) => {
                setFilterCondition(contition);
                operate.updateFilter(contition.types);
              }}
              onClose={closeModal}
            />
          </div>
        </div>
      </Modal>

      <TypeSelect
        active={modalType === "PICK_ARTIFACT_TYPE"}
        options={ARTIFACT_ICONS}
        onSelect={(artifactType) => {
          setArtifactPicker({
            active: true,
            type: artifactType as ArtifactType,
          });
          closeModal();
        }}
        onClose={closeModal}
      />

      <PickerArtifact
        active={artifactPicker.active}
        needMassAdd
        artifactType={artifactPicker.type}
        onPickArtifact={(item) => {
          if (isMaxArtifactsReached()) {
            return {
              isValid: false,
            };
          }
          const newArtifact: UserArtifact = {
            ID: Date.now(),
            ...item,
            owner: null,
          };

          dispatch(addUserArtifact(newArtifact));
          setChosenID(newArtifact.ID);
        }}
        onClose={() => setArtifactPicker((prev) => ({ ...prev, active: false }))}
      />
    </WarehouseLayout.Wrapper>
  );
}
