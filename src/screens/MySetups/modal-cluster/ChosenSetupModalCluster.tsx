import type { UserArtifacts, UserSetup, UserWeapon } from "@Src/types";

// Util
import { getArtifactSetBonuses } from "@Src/utils/calculation";
import { userSetupToCalcSetup } from "@Src/utils/setup";
import { calculateChosenSetup } from "../utils";

// Store
import { useDispatch, useSelector } from "@Store/hooks";
import { selectMySetupModalType } from "@Store/uiSlice/selectors";
// Action
import { updateUI } from "@Store/uiSlice";
import { removeSetup } from "@Store/userDatabaseSlice";

// Component
import { CloseButton, ConfirmModal, Modal } from "@Src/pure-components";
import {
  ArtifactCard,
  AttributeTable,
  OwnerLabel,
  SetBonusesDisplay,
  SetupExporter,
  WeaponCard,
} from "@Src/components";
import { ChosenSetupModifiers } from "../modal-content";

interface ModalClusterProps {
  chosenSetup: UserSetup;
  weapon: UserWeapon | null;
  artifacts: UserArtifacts;
  calcResult?: ReturnType<typeof calculateChosenSetup>;
}
export const ChosenSetupModalCluster = ({ chosenSetup, weapon, artifacts, calcResult }: ModalClusterProps) => {
  const dispatch = useDispatch();
  const modalType = useSelector(selectMySetupModalType);

  const setBonuses = getArtifactSetBonuses(artifacts);

  const closeModal = () => {
    dispatch(updateUI({ mySetupsModalType: "" }));
  };

  return (
    <>
      <ConfirmModal
        active={modalType === "REMOVE_SETUP"}
        message={
          <>
            Remove "<b>{chosenSetup.name}</b>"?
          </>
        }
        buttons={[
          undefined,
          {
            onClick: () => dispatch(removeSetup(chosenSetup.ID)),
          },
        ]}
        onClose={closeModal}
      />

      {weapon && (
        <SetupExporter
          active={modalType === "SHARE_SETUP"}
          setupName={chosenSetup.name}
          calcSetup={userSetupToCalcSetup(chosenSetup, weapon, artifacts)}
          target={chosenSetup.target}
          onClose={closeModal}
        />
      )}

      <Modal
        active={modalType === "WEAPON"}
        className="p-4 flex overflow-auto bg-dark-900 rounded-lg shadow-white-glow"
        onClose={closeModal}
      >
        <div className="relative">
          <div className="w-75 hide-scrollbar" style={{ height: "30rem" }}>
            {weapon && <WeaponCard weapon={weapon} />}
          </div>
          <OwnerLabel item={weapon ?? undefined} />
        </div>
      </Modal>

      <Modal
        active={modalType === "ARTIFACTS"}
        className="p-4 flex overflow-auto bg-dark-900 rounded-lg shadow-white-glow"
        onClose={closeModal}
      >
        {artifacts?.map((artifact, i) => {
          if (artifact) {
            return (
              <div key={i} className="px-1 shrink-0" style={{ width: "14.5rem" }}>
                <ArtifactCard artifact={artifact} space="mx-2" />
                <OwnerLabel item={artifact} />
              </div>
            );
          }
          return null;
        })}
      </Modal>

      <Modal
        active={modalType === "STATS"}
        className="h-large-modal hide-scrollbar bg-dark-900 rounded-lg shadow-white-glow"
        onClose={closeModal}
      >
        <CloseButton className="absolute top-1 right-1" boneOnly onClick={closeModal} />

        <div className="h-full flex divide-x-2 divide-dark-700">
          <div className="w-80 pt-2 px-4 pb-4 flex flex-col " style={{ minWidth: "20rem" }}>
            <p className="text-lg text-orange-500 font-bold">Final Attributes</p>
            <div className="mt-1 hide-scrollbar">
              {calcResult?.totalAttr && <AttributeTable attributes={calcResult.totalAttr} />}
            </div>
          </div>

          <div className="w-80 pt-2 px-4 pb-4 flex flex-col" style={{ minWidth: "20rem" }}>
            <p className="text-lg text-orange-500 font-bold">Artifact Stats</p>
            <div className="mt-1 hide-scrollbar">
              {calcResult?.artAttr && <AttributeTable attributes={calcResult.artAttr} />}
            </div>
          </div>

          <div className="w-80 pt-2 px-4 pb-4 flex flex-col " style={{ minWidth: "20rem" }}>
            <div className="h-full hide-scrollbar">
              <SetBonusesDisplay setBonuses={setBonuses} />
            </div>
          </div>
        </div>
      </Modal>

      {calcResult && weapon && (
        <Modal
          active={modalType === "MODIFIERS"}
          className="h-large-modal hide-scrollbar bg-dark-900 rounded-lg shadow-white-glow"
          onClose={closeModal}
        >
          <CloseButton className="absolute top-1 right-1" boneOnly onClick={closeModal} />

          <ChosenSetupModifiers
            calcResult={calcResult}
            chosenSetup={chosenSetup}
            setBonuses={setBonuses}
            weapon={weapon}
          />
        </Modal>
      )}
    </>
  );
};
