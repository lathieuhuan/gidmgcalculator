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
import { ConfirmModal } from "@Src/pure-components";
import { ArtifactCard, Tavern } from "@Src/components";

interface ChosenArtifactViewProps {
  artifact?: UserArtifact;
  onRemoveArtifact?: (artifact: UserArtifact) => void;
}
export const ChosenArtifactView = ({ artifact, onRemoveArtifact }: ChosenArtifactViewProps) => {
  const dispatch = useDispatch();
  const [modalType, setModalType] = useState<"REMOVE_ARTIFACT" | "EQUIP_CHARACTER" | "">("");
  const [newOwner, setNewOwner] = useState("");

  const closeModal = () => setModalType("");

  const swapOwner = (name: string) => {
    if (artifact?.ID) {
      dispatch(swapArtifactOwner({ newOwner: name, artifactID: artifact.ID }));
    }
  };

  return (
    <Fragment>
      <ArtifactCard
        style={{ width: "19rem" }}
        artifact={artifact}
        mutable
        withOwnerLabel
        onEnhance={(level, artifact) => {
          dispatch(updateUserArtifact({ ID: artifact.ID, level }));
        }}
        onChangeMainStatType={(type, artifact) => {
          dispatch(
            updateUserArtifact({
              ID: artifact.ID,
              mainStatType: type as AttributeStat,
            })
          );
        }}
        onChangeSubStat={(subStatIndex, changes, artifact) => {
          dispatch(
            updateUserArtifactSubStat({
              ID: artifact.ID,
              subStatIndex,
              ...changes,
            })
          );
        }}
        actions={[
          { text: "Remove", onClick: () => setModalType("REMOVE_ARTIFACT") },
          { text: "Equip", onClick: () => setModalType("EQUIP_CHARACTER") },
        ]}
      />

      <Tavern
        active={modalType === "EQUIP_CHARACTER" && !!artifact}
        sourceType="user"
        filter={(character) => character.name !== artifact?.owner}
        onSelectCharacter={(character) => {
          artifact?.owner ? setNewOwner(character.name) : swapOwner(character.name);
        }}
        onClose={closeModal}
      />

      {artifact ? (
        <ConfirmModal
          active={newOwner !== ""}
          message={
            <>
              <b>{artifact.owner}</b> is currently using "
              <b>{$AppData.getArtifact(artifact)?.name || "<name missing>"}</b>
              ". Swap?
            </>
          }
          focusConfirm
          onConfirm={() => swapOwner(newOwner)}
          onClose={() => setNewOwner("")}
        />
      ) : null}

      {artifact ? (
        <ConfirmModal
          active={modalType === "REMOVE_ARTIFACT"}
          danger
          message={
            <>
              Remove "<b>{$AppData.getArtifactSet(artifact.code)?.name}</b>" ({artifact.type})?{" "}
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
            onRemoveArtifact?.(artifact);
          }}
          onClose={closeModal}
        />
      ) : null}
    </Fragment>
  );
};
