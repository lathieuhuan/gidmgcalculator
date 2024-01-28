import { FaUnlink, FaWrench } from "react-icons/fa";

import { useDispatch, useSelector } from "@Store/hooks";
import { updateUI } from "@Store/uiSlice";
import { selectMySetupModalType } from "@Store/uiSlice/selectors";

// Component
import { Yellow, Modal, Red } from "@Src/pure-components";
import { CombineMore, FirstCombine } from "../modal-content";

interface MySetupsModalClusterProps {
  combineMoreId?: number;
}
export const MySetupsModalCluster = (props: MySetupsModalClusterProps) => {
  const dispatch = useDispatch();
  const modalType = useSelector(selectMySetupModalType);

  const closeModal = () => {
    dispatch(updateUI({ mySetupsModalType: "" }));
  };

  return (
    <>
      <Modal
        active={modalType === "TIPS"}
        title="Tips"
        preset="large"
        bodyCls="grow custom-scrollbar"
        {...props}
        onClose={closeModal}
      >
        <ul className="pl-4 pr-2 list-disc space-y-1 contains-inline-svg">
          <li>
            <Yellow>Update setups</Yellow>: When you press <FaWrench /> on a saved setup, you're pushing a{" "}
            <Red>copy</Red> of it to the Calculator, so don't forget to save the modified copy if you want to apply the
            changes to that setup.
          </li>
          <li>
            <Yellow>Teammate details</Yellow> on a setup can be viewed when you press a teammate icon. Here you can
            build a setup for that teammate based on the main setup. Party members and Target will be the same. Some
            modifiers will remain activated and keep their inputs.
          </li>
          <li>
            <Yellow>Complex Setup</Yellow> is the result of combining setups of the same 4 party members. You can break
            this complex into individual setups again by pressing the <FaUnlink /> before its name. Now at teammate
            details you can switch to that setup.
          </li>
          <li>
            You CANNOT change teammates when modifying the direct copy of a setup that is in a complex. However you can
            make a copy of that copy in the Calculator and work on it.
          </li>
        </ul>
      </Modal>

      <Modal
        active={modalType === "FIRST_COMBINE"}
        className={[Modal.LARGE_HEIGHT_CLS, "bg-dark-700"]}
        style={{
          minWidth: 300,
        }}
        onClose={closeModal}
      >
        <FirstCombine onClose={closeModal} />
      </Modal>

      <Modal
        active={modalType === "COMBINE_MORE"}
        className={[Modal.LARGE_HEIGHT_CLS, "bg-dark-700"]}
        style={{
          minWidth: 300,
        }}
        onClose={closeModal}
      >
        {props.combineMoreId && <CombineMore setupID={props.combineMoreId} onClose={closeModal} />}
      </Modal>
    </>
  );
};
