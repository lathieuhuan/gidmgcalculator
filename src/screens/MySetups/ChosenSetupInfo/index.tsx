import type { UserArtifacts, UserSetup, UserWeapon } from "@Src/types";
import type { MySetupModal } from "../types";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";

// Action
import { removeSetup } from "@Store/userDatabaseSlice";

// Selector
import { selectUserArts, selectUserWps } from "@Store/userDatabaseSlice/selectors";

// Util
import { getArtifactSetBonuses } from "@Src/utils/calculation";
import { calculateChosenSetup } from "./utils";

// Component
import { AttributeTable, Modal, SetBonusesDisplay } from "@Components/molecules";
import {
  ArtifactCard,
  ConfirmModal,
  DamageDisplay,
  OwnerLabel,
  SetupExporter,
  WeaponCard,
} from "@Components/organisms";
import { ChosenSetupModifiers } from "./ChosenSetupModifiers";

interface ChosenSetupInfoProps {
  chosenSetup: UserSetup;
  weapon: UserWeapon | null;
  artifacts: UserArtifacts;
  modal: MySetupModal;
  onCloseModal: () => void;
}
export const ChosenSetupInfo = ({
  chosenSetup,
  weapon,
  artifacts,
  modal,
  onCloseModal,
}: ChosenSetupInfoProps) => {
  const dispatch = useDispatch();
  const userWps = useSelector(selectUserWps);
  const userArts = useSelector(selectUserArts);

  const calcResult = calculateChosenSetup(chosenSetup, userWps, userArts);
  const setBonuses = getArtifactSetBonuses(artifacts);

  return (
    <div className="h-full flex flex-col">
      <div>
        <p className="text-sm text-center truncate">{chosenSetup.name}</p>
      </div>
      <div className="mt-2 grow hide-scrollbar">
        {calcResult?.damage && (
          <DamageDisplay
            char={chosenSetup.char}
            party={chosenSetup.party}
            damageResult={calcResult.damage}
          />
        )}
      </div>

      <ConfirmModal
        active={modal.type === "REMOVE_SETUP"}
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
        onClose={onCloseModal}
      />

      <Modal active={modal.type === "SHARE_SETUP"} onClose={onCloseModal}>
        <SetupExporter data={chosenSetup} onClose={onCloseModal} />
      </Modal>

      <Modal
        active={modal.type === "WEAPON"}
        className="p-4 flex overflow-auto bg-darkblue-1 rounded-lg shadow-white-glow"
        onClose={onCloseModal}
      >
        <div className="relative">
          <div className="w-75 hide-scrollbar" style={{ height: "30rem" }}>
            {weapon && <WeaponCard weapon={weapon} />}
          </div>
          <OwnerLabel owner={weapon?.owner} setupIDs={weapon?.setupIDs} />
        </div>
      </Modal>

      <Modal
        active={modal.type === "ARTIFACTS"}
        className="p-4 flex overflow-auto bg-darkblue-1 rounded-lg shadow-white-glow"
        onClose={onCloseModal}
      >
        {artifacts?.map((artifact, i) => {
          if (artifact) {
            return (
              <div key={i} className="px-1 shrink-0" style={{ width: "14.5rem" }}>
                <ArtifactCard artifact={artifact} space="mx-2" />
                <OwnerLabel owner={artifact?.owner} setupIDs={artifact?.setupIDs} />
              </div>
            );
          }
          return null;
        })}
      </Modal>

      <Modal
        active={modal.type === "STATS"}
        className="h-large-modal hide-scrollbar bg-darkblue-1 rounded-lg shadow-white-glow"
        onClose={onCloseModal}
      >
        <div className="h-full flex divide-x-2 divide-darkblue-2">
          <div className="w-80 pt-2 px-4 pb-4 flex flex-col " style={{ minWidth: "20rem" }}>
            <p className="text-lg text-orange font-bold">Final Attributes</p>
            <div className="mt-1 hide-scrollbar">
              {calcResult?.totalAttr && <AttributeTable attributes={calcResult.totalAttr} />}
            </div>
          </div>

          <div className="w-80 pt-2 px-4 pb-4 flex flex-col" style={{ minWidth: "20rem" }}>
            <p className="text-lg text-orange font-bold">Artifact Stats</p>
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
          active={modal.type === "MODIFIERS"}
          className="h-large-modal hide-scrollbar bg-darkblue-1 rounded-lg shadow-white-glow"
          onClose={onCloseModal}
        >
          <ChosenSetupModifiers
            calcResult={calcResult}
            chosenSetup={chosenSetup}
            setBonuses={setBonuses}
            weapon={weapon}
          />
        </Modal>
      )}
    </div>
  );
};
