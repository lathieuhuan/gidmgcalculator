import { useState, useRef } from "react";
import type { BooRecord } from "@Src/types";

import { MAX_USER_WEAPONS } from "@Src/constants";
import { useDispatch } from "@Store/hooks";
import { addUserDatabase } from "@Store/userDatabaseSlice";

// Component
import { ModalControl } from "@Components/molecules";
import { UploadedData, UploadOptions } from "./UploadOptions";
import { WeaponChecker } from "./WeaponChecker";
import { notification } from "@Src/utils";

const UPLOAD_STEPS = ["SELECT_OPTION", "CHECK_WEAPONS", "CHECK_ARTIFACTS", "FINISH"] as const;

export const Upload = (props: ModalControl) => {
  // const dispatch = useDispatch();

  const [step, setStep] = useState<typeof UPLOAD_STEPS[number]>("SELECT_OPTION");
  const uploadedData = useRef<UploadedData>();
  const removedWeaponIDs = useRef<BooRecord>();

  const onClose = (atStep: typeof step) => () => {
    if (atStep === step) {
      setStep("SELECT_OPTION");
      uploadedData.current = undefined;
      removedWeaponIDs.current = undefined;
      props.onClose();
    }
  };

  // dispatch(addUserDatabase(database));

  return (
    <>
      <UploadOptions
        active={props.active && step === "SELECT_OPTION"}
        onSuccessUpload={(data) => {
          uploadedData.current = data;

          notification.info();
          setStep("CHECK_WEAPONS");
          // if (data.weapons.length > MAX_USER_WEAPONS) {
          // }
        }}
        onClose={onClose("SELECT_OPTION")}
      />
      <WeaponChecker
        active={props.active && step === "CHECK_WEAPONS"}
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
