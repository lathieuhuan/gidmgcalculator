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
import { ConfirmModal, Modal } from "@Src/pure-components";
import { ArtifactCard, AttributeTable, SetBonusesDisplay, SetupExporter, WeaponCard } from "@Src/components";
import { ChosenSetupModifiers } from "./ChosenSetupModifiers";

interface ChosenSetupModalsProps {
  chosenSetup: UserSetup;
  weapon: UserWeapon | null;
  artifacts: UserArtifacts;
  result?: ReturnType<typeof calculateChosenSetup>;
}
export const ChosenSetupModals = ({ chosenSetup, weapon, artifacts, result }: ChosenSetupModalsProps) => {
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
        danger
        message={
          <>
            Remove "<b>{chosenSetup.name}</b>"?
          </>
        }
        focusConfirm
        onConfirm={() => dispatch(removeSetup(chosenSetup.ID))}
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

      {weapon && (
        <Modal active={modalType === "WEAPON"} className="bg-dark-900" title="Weapon" onClose={closeModal}>
          <WeaponCard wrapperCls="w-76" style={{ height: "30rem" }} withGutter={false} withOwnerLabel weapon={weapon} />
        </Modal>
      )}

      <Modal active={modalType === "ARTIFACTS"} className="bg-dark-900" title="Artifacts" onClose={closeModal}>
        <div className="flex space-x-1 hide-scrollbar">
          {artifacts?.map((artifact, i) => {
            if (artifact) {
              return (
                <ArtifactCard
                  key={i}
                  wrapperCls="shrink-0"
                  className="w-60"
                  withGutter={false}
                  withOwnerLabel
                  artifact={artifact}
                />
              );
            }
            return null;
          })}
        </div>
      </Modal>

      <Modal
        active={modalType === "STATS"}
        className={[Modal.LARGE_HEIGHT_CLS, "bg-dark-900"]}
        title="Stats"
        bodyCls="grow overflow-auto"
        onClose={closeModal}
      >
        <div className="h-full flex hide-scrollbar gap-8">
          <div className="w-75 flex flex-col shrink-0">
            <p className="text-lg text-center font-semibold">Final Attributes</p>
            <div className="mt-1 custom-scrollbar">
              {result?.totalAttr && <AttributeTable attributes={result.totalAttr} />}
            </div>
          </div>

          <div className="w-75 flex flex-col shrink-0">
            <p className="text-lg text-center font-semibold">Artifact Stats</p>
            <div className="mt-1 custom-scrollbar">
              {result?.artAttr && <AttributeTable attributes={result.artAttr} />}
            </div>
          </div>

          <div className="w-72 flex flex-col shrink-0">
            <p className="text-lg text-center font-semibold">Set bonus</p>
            <div className="grow custom-scrollbar">
              <SetBonusesDisplay noTitle setBonuses={setBonuses} />
            </div>
          </div>
        </div>
      </Modal>

      {result && weapon && (
        <Modal
          active={modalType === "MODIFIERS"}
          className={[Modal.LARGE_HEIGHT_CLS, "bg-dark-900"]}
          title="Modifiers"
          bodyCls="grow hide-scrollbar"
          onClose={closeModal}
        >
          <ChosenSetupModifiers {...{ result, chosenSetup, setBonuses, weapon }} />
        </Modal>
      )}
    </>
  );
};
