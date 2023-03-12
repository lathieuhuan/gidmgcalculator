import { useState, useRef } from "react";
import type { BooRecord } from "@Src/types";
import type { UploadedData, UploadStep } from "./types";

import { MAX_USER_WEAPONS } from "@Src/constants";
import { useDispatch } from "@Store/hooks";
import { addUserDatabase } from "@Store/userDatabaseSlice";
import { notification } from "@Src/utils";

// Component
import { ModalControl } from "@Components/molecules";
import { UploadOptions } from "./UploadOptions";
import { WeaponSelect } from "./WeaponSelect";

const UploadCore = (props: ModalControl) => {
  // const dispatch = useDispatch();
  const uploadSteps = useRef<UploadStep[]>(["SELECT_OPTION"]);
  const uploadedData = useRef<UploadedData>();
  const removedWeaponIDs = useRef<BooRecord>();

  const [stepNo, setStepNo] = useState(0);

  const currentStep = uploadSteps.current[stepNo];

  const onClose = (atStep: UploadStep) => () => {
    if (atStep === currentStep) {
      setStepNo(0);
      uploadSteps.current = ["SELECT_OPTION"];
      uploadedData.current = undefined;
      removedWeaponIDs.current = undefined;
      props.onClose();
    }
  };

  const toNextStep = () => {
    const nextStepNo = stepNo + 1;

    setStepNo(nextStepNo);

    switch (uploadSteps.current[nextStepNo]) {
      case "CHECK_WEAPONS":
        return notification.warn({
          content: "Too many weapons! Select weapons to be discarded.",
        });
    }
  };

  // dispatch(addUserDatabase(database));

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
        items={uploadedData.current?.weapons || []}
        onConfirm={(data) => {
          removedWeaponIDs.current = data;

          console.log(data);
        }}
        onClose={onClose("CHECK_WEAPONS")}
      />
    </>
  );
};

export const Upload = (props: ModalControl) => {
  return props.active ? <UploadCore {...props} /> : null;
};
