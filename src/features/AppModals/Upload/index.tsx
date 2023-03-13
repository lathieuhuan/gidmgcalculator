import { useState, useRef, useEffect } from "react";
import type { BooRecord } from "@Src/types";
import type { UploadedData, UploadStep } from "./types";

import { MAX_USER_ARTIFACTS, MAX_USER_WEAPONS } from "@Src/constants";
import { useDispatch } from "@Store/hooks";
import { addUserDatabase } from "@Store/userDatabaseSlice";
import { notification } from "@Src/utils";

// Component
import { ModalControl } from "@Components/molecules";
import { UploadOptions } from "./UploadOptions";
import { WeaponSelect } from "./WeaponSelect";
import { ArtifactSelect } from "./ArtifactSelect";

const UploadCore = (props: ModalControl) => {
  const dispatch = useDispatch();
  const uploadSteps = useRef<UploadStep[]>(["SELECT_OPTION"]);
  const uploadedData = useRef<UploadedData>();
  const removedWeaponIDs = useRef<BooRecord>({});
  const removedArtifactIDs = useRef<BooRecord>({});

  const [stepNo, setStepNo] = useState(-1);

  const currentStep = uploadSteps.current[stepNo];
  const { weapons = [], artifacts = [] } = uploadedData.current || {};

  useEffect(() => {
    setStepNo(0);
  }, []);

  const onClose = (atStep: UploadStep) => () => {
    if (atStep === currentStep) {
      setStepNo(-1);
      uploadSteps.current = ["SELECT_OPTION"];
      uploadedData.current = undefined;
      removedWeaponIDs.current = {};
      removedArtifactIDs.current = {};

      setTimeout(props.onClose, 150);
    }
  };

  const toNextStep = () => {
    if (stepNo !== uploadSteps.current.length - 1) {
      const nextStepNo = stepNo + 1;
      const key: string = uploadSteps.current[nextStepNo];
      const itemType = {
        CHECK_WEAPONS: "weapons",
        CHECK_ARTIFACTS: "artifacts",
      }[key];

      setStepNo(nextStepNo);

      return notification.warn({
        content: `Too many ${itemType}! Please select ${itemType} to be left out.`,
      });
    }

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
      <UploadOptions
        active={props.active && currentStep === "SELECT_OPTION"}
        onRequestSelect={(data, steps) => {
          uploadedData.current = data;
          uploadSteps.current.push(...steps);

          toNextStep();
        }}
        onClose={onClose("SELECT_OPTION")}
      />
      <WeaponSelect
        active={props.active && currentStep === "CHECK_WEAPONS"}
        items={weapons}
        max={weapons.length - MAX_USER_WEAPONS}
        onConfirm={(data) => {
          removedWeaponIDs.current = data;
          toNextStep();
        }}
        onClose={onClose("CHECK_WEAPONS")}
      />
      <ArtifactSelect
        active={props.active && currentStep === "CHECK_ARTIFACTS"}
        items={artifacts}
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
