import { Fragment, useState } from "react";

import { AttributeStat, UserArtifact } from "@Src/types";
import { $AppData } from "@Src/services";

// Store
import { useDispatch } from "@Store/hooks";
import {
  removeArtifact,
  swapArtifactOwner,
  updateUserArtifact,
  updateUserArtifactSubStat,
} from "@Store/userDatabaseSlice";

// Component
import { ButtonGroup, ConfirmModal } from "@Src/pure-components";
import { ArtifactCard, OwnerLabel, PickerCharacter } from "@Src/components";

interface ChosenArtifactViewProps {
  artifact?: UserArtifact;
  onRemoveArtifact?: () => void;
}
export const ChosenArtifactView = ({ artifact, onRemoveArtifact }: ChosenArtifactViewProps) => {
  const dispatch = useDispatch();
  const [modalType, setModalType] = useState<"REMOVE_ARTIFACT" | "EQUIP_CHARACTER" | "">("");
  const [newOwner, setNewOwner] = useState<string | null>(null);

  const closeModal = () => setModalType("");

  const swapOwner = (name: string) => {
    if (artifact?.ID) {
      dispatch(swapArtifactOwner({ newOwner: name, artifactID: artifact.ID }));
    }
  };

  return (
    <Fragment>
      <div className="flex flex-col">
        <div className="p-4 rounded-lg bg-dark-900 grow flex flex-col">
          <div className="w-75 grow hide-scrollbar" style={{ height: "26rem" }}>
            {artifact ? (
              <ArtifactCard
                artifact={artifact}
                mutable
                onEnhance={(level) => {
                  dispatch(updateUserArtifact({ ID: artifact.ID, level }));
                }}
                onChangeMainStatType={(type) => {
                  dispatch(
                    updateUserArtifact({
                      ID: artifact.ID,
                      mainStatType: type as AttributeStat,
                    })
                  );
                }}
                onChangeSubStat={(subStatIndex, changes) => {
                  dispatch(
                    updateUserArtifactSubStat({
                      ID: artifact.ID,
                      subStatIndex,
                      ...changes,
                    })
                  );
                }}
              />
            ) : null}
          </div>

          {artifact ? (
            <ButtonGroup
              className="mt-4"
              justify="end"
              buttons={[
                { text: "Remove", onClick: () => setModalType("REMOVE_ARTIFACT") },
                { text: "Equip", onClick: () => setModalType("EQUIP_CHARACTER") },
              ]}
            />
          ) : null}
        </div>

        <OwnerLabel key={artifact?.ID} className="mt-4" item={artifact} />
      </div>

      <PickerCharacter
        active={modalType === "EQUIP_CHARACTER" && !!artifact}
        sourceType="user"
        filter={({ name }) => name !== artifact?.owner}
        onPickCharacter={({ name }) => {
          artifact?.owner ? setNewOwner(name) : swapOwner(name);
          return true;
        }}
        onClose={closeModal}
      />

      {artifact ? (
        <ConfirmModal
          active={!!newOwner}
          message={
            <>
              <b>{artifact.owner}</b> is currently using "
              <b>{$AppData.getArtifactData(artifact)?.name || "<name missing>"}</b>
              ". Swap?
            </>
          }
          focusConfirm
          onConfirm={() => swapOwner(newOwner!)}
          onClose={() => setNewOwner(null)}
        />
      ) : null}

      {artifact ? (
        <ConfirmModal
          active={modalType === "REMOVE_ARTIFACT"}
          message={
            <>
              Remove "<b>{$AppData.getArtifactSetData(artifact.code)?.name}</b>" ({artifact.type})?{" "}
              {artifact.owner ? (
                <>
                  It is currently used by <b>{artifact.owner}</b>.
                </>
              ) : null}
            </>
          }
          focusConfirm
          onConfirm={() => {
            dispatch(removeArtifact(artifact));
            onRemoveArtifact?.();
          }}
          onClose={closeModal}
        />
      ) : null}
    </Fragment>
  );
};
