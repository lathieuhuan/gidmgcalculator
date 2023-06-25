import { useState, useRef, useEffect } from "react";
import type { BooRecord, UserArtifact, UserWeapon } from "@Src/types";
import type { UploadedData, UploadStep } from "./types";
import type { ModalControl } from "@Components";

import { MAX_USER_ARTIFACTS, MAX_USER_WEAPONS } from "@Src/constants";
import { notification } from "@Src/utils";
import { useDispatch } from "@Store/hooks";
import { addUserDatabase } from "@Store/userDatabaseSlice";

// Component
import { ItemMultiSelect } from "@Components";
import { FileUpload } from "./FileUpload";

const UploadCore = (props: ModalControl) => {
  const dispatch = useDispatch();
  const uploadSteps = useRef<UploadStep[]>(["SELECT_OPTION"]);
  const uploadedData = useRef<UploadedData>();
  const removedWeaponIDs = useRef<BooRecord>({});
  const removedArtifactIDs = useRef<BooRecord>({});
  const notiId = useRef<number>();

  const [stepNo, setStepNo] = useState(-1);

  const currentStep = uploadSteps.current[stepNo];
  const { weapons = [], artifacts = [] } = uploadedData.current || {};
  const selectingWeapons = props.active && currentStep === "CHECK_WEAPONS";
  const selectingArtifacts = props.active && currentStep === "CHECK_ARTIFACTS";
  let filteredWeapons: UserWeapon[] = [];
  let filteredArtifacts: UserArtifact[] = [];

  if (selectingWeapons) {
    filteredWeapons = weapons.filter((weapon) => !weapon.owner && !weapon.setupIDs?.length);
  }
  if (selectingArtifacts) {
    filteredArtifacts = artifacts.filter((artifact) => !artifact.owner && !artifact.setupIDs?.length);
  }

  useEffect(() => {
    setStepNo(0);
  }, []);

  const onClose = (atStep: UploadStep) => () => {
    if (atStep === currentStep) {
      setStepNo(-1);

      if (notiId.current !== undefined) {
        notification.destroy(notiId.current);
      }

      setTimeout(props.onClose, 150);
    }
  };

  const toNextStep = () => {
    if (notiId.current !== undefined) {
      notification.destroy(notiId.current);

      notiId.current = undefined;
    }

    if (stepNo !== uploadSteps.current.length - 1) {
      const nextStepNo = stepNo + 1;
      const key: string = uploadSteps.current[nextStepNo];
      const itemType = {
        CHECK_WEAPONS: "weapons",
        CHECK_ARTIFACTS: "artifacts",
      }[key];

      setStepNo(nextStepNo);

      notiId.current = notification.warn({
        content: `Too many ${itemType}! Please select ${itemType} to be left out.`,
        duration: 0,
      });

      return;
    }

    notification.success({
      content: "Successfully uploaded your data!",
    });

    const { weapons = [], artifacts = [] } = uploadedData.current || {};

    dispatch(
      addUserDatabase({
        ...uploadedData.current,
        weapons: weapons.filter((weapon) => !removedWeaponIDs.current[weapon.ID]),
        artifacts: artifacts.filter((artifact) => !removedArtifactIDs.current[artifact.ID]),
      })
    );

    onClose(currentStep)();
  };

  return (
    <>
      <FileUpload
        active={props.active && currentStep === "SELECT_OPTION"}
        onSuccessUploadFile={(data) => {
          uploadedData.current = data;

          if (data.weapons.length > MAX_USER_WEAPONS) {
            uploadSteps.current.push("CHECK_WEAPONS");
          }
          if (data.artifacts.length > MAX_USER_ARTIFACTS) {
            uploadSteps.current.push("CHECK_ARTIFACTS");
          }

          toNextStep();
        }}
        onClose={onClose("SELECT_OPTION")}
      />
      <ItemMultiSelect
        active={props.active && currentStep === "CHECK_WEAPONS"}
        itemType="weapon"
        items={filteredWeapons}
        max={weapons.length - MAX_USER_WEAPONS}
        onConfirm={(data) => {
          removedWeaponIDs.current = data;
          toNextStep();
        }}
        onClose={onClose("CHECK_WEAPONS")}
      />
      <ItemMultiSelect
        active={props.active && currentStep === "CHECK_ARTIFACTS"}
        itemType="artifact"
        items={filteredArtifacts}
        max={artifacts.length - MAX_USER_ARTIFACTS}
        onConfirm={(data) => {
          removedArtifactIDs.current = data;
          toNextStep();
        }}
        onClose={onClose("CHECK_ARTIFACTS")}
      />
    </>
  );
};

export const Upload = (props: ModalControl) => {
  return props.active ? <UploadCore {...props} /> : null;
};
