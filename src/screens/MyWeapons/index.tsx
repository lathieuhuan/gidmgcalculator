import clsx from "clsx";
import { Fragment, useState } from "react";
import { FaEllipsisH } from "react-icons/fa";
import type { WeaponType } from "@Src/types";

// Constant
import { WEAPON_ICONS } from "@Src/constants";

// Action
import {
  addUserWeapon,
  removeWeapon,
  sortWeapons,
  swapWeaponOwner,
  updateUserWeapon,
} from "@Store/userDatabaseSlice";
import { updateMessage } from "@Store/calculatorSlice";

// Selector
import {
  selectFilteredWeaponIDs,
  selectUserWps,
  selectWeaponById,
} from "@Store/userDatabaseSlice/selectors";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";
import { useInventoryRack, useTypeFilter } from "@Components/templates/inventories/hooks";

// Component
import { IconButton, CollapseSpace } from "@Components/atoms";
import { ButtonBar } from "@Components/molecules";
import { ItemRemoveConfirm, TypeSelect, WeaponCard, OwnerLabel } from "@Components/organisms";
import { PickerCharacter, PickerWeapon, WareHouse } from "@Components/templates";

import styles from "../styles.module.scss";

type ModalType = "" | "PICK_WEAPON_TYPE" | "EQUIP_CHARACTER" | "REMOVE_WEAPON";

export default function MyWeapons() {
  const [modalType, setModalType] = useState<ModalType>("");
  const [filterDropped, setFilterDropped] = useState(false);
  const [weaponPicker, setWeaponPicker] = useState<{ active: boolean; type: WeaponType }>({
    active: false,
    type: "sword",
  });

  const dispatch = useDispatch();

  const { filteredTypes, renderTypeFilter } = useTypeFilter({ itemType: "weapon" });
  const filteredIds = useSelector((state) =>
    selectFilteredWeaponIDs(state, filteredTypes as WeaponType[])
  );

  const { inventoryRack, chosenID, setChosenID } = useInventoryRack({
    listClassName: styles.list,
    itemClassName: styles.item,
    items: useSelector(selectUserWps),
    itemType: "weapon",
    filteredIds,
  });
  const weapon = useSelector((state) => selectWeaponById(state, chosenID));

  const openModal = (type: ModalType) => () => setModalType(type);
  const closeModal = () => setModalType("");

  return (
    <WareHouse.Wrapper>
      <WareHouse>
        <WareHouse.ButtonBar>
          <ButtonBar
            className="mr-4 space-x-4"
            buttons={[
              {
                text: "Add",
                variant: "positive",
                onClick: openModal("PICK_WEAPON_TYPE"),
              },
              {
                text: "Sort",
                variant: "positive",
                onClick: () => dispatch(sortWeapons()),
              },
            ]}
          />
          {window.innerWidth >= 500 ? (
            renderTypeFilter()
          ) : (
            <Fragment>
              <IconButton
                className={clsx("ml-1", filterDropped ? "bg-green" : "bg-white")}
                onClick={() => setFilterDropped(!filterDropped)}
              >
                <FaEllipsisH />
              </IconButton>

              <CollapseSpace
                className="w-full absolute top-full left-0 z-20"
                active={filterDropped}
              >
                <div className="px-4 py-6 shadow-common bg-darkblue-2">{renderTypeFilter()}</div>
              </CollapseSpace>
            </Fragment>
          )}
        </WareHouse.ButtonBar>

        <WareHouse.Body className="hide-scrollbar">
          {inventoryRack}

          <div className="flex flex-col">
            <div className="p-4 grow rounded-lg bg-darkblue-1 flex flex-col hide-scrollbar">
              <div className="w-75 grow hide-scrollbar">
                {weapon ? (
                  <WeaponCard
                    mutable
                    weapon={weapon}
                    upgrade={(level) => dispatch(updateUserWeapon({ ID: weapon.ID, level }))}
                    refine={(refi) => dispatch(updateUserWeapon({ ID: weapon.ID, refi }))}
                  />
                ) : null}
              </div>
              {weapon ? (
                <ButtonBar
                  className="mt-4"
                  buttons={[
                    {
                      text: "Remove",
                      onClick: () => {
                        if (weapon.setupIDs?.length) {
                          dispatch(
                            updateMessage({
                              type: "info",
                              content: "This weapon cannot be deleted. It is used by some Setups.",
                            })
                          );
                        } else {
                          openModal("REMOVE_WEAPON");
                        }
                      },
                    },
                    { text: "Equip", onClick: openModal("EQUIP_CHARACTER") },
                  ]}
                />
              ) : null}
            </div>

            <OwnerLabel key={weapon?.ID} owner={weapon?.owner} setupIDs={weapon?.setupIDs} />
          </div>
        </WareHouse.Body>
      </WareHouse>

      <TypeSelect
        active={modalType === "PICK_WEAPON_TYPE"}
        choices={WEAPON_ICONS}
        onClickChoice={(weaponType) => {
          setWeaponPicker({
            active: true,
            type: weaponType as WeaponType,
          });
          closeModal();
        }}
        onClose={closeModal}
      />

      <PickerWeapon
        active={weaponPicker.active}
        needMassAdd
        weaponType={weaponPicker.type}
        onPickWeapon={(item) => {
          const ID = Date.now();
          dispatch(addUserWeapon({ ID, ...item, owner: null }));
          setChosenID(ID);
        }}
        onClose={() => setWeaponPicker((prev) => ({ ...prev, active: false }))}
      />

      {weapon && (
        <PickerCharacter
          active={modalType === "EQUIP_CHARACTER"}
          sourceType="userData"
          filter={({ name, weaponType }) => {
            return weaponType === weapon.type && name !== weapon.owner;
          }}
          onPickCharacter={({ name }) => {
            if (weapon.ID) {
              dispatch(swapWeaponOwner({ weaponID: weapon.ID, newOwner: name }));
            }
          }}
          onClose={closeModal}
        />
      )}

      {weapon && (
        <ItemRemoveConfirm
          active={modalType === "REMOVE_WEAPON"}
          item={weapon}
          itemType="weapon"
          filteredIds={filteredIds}
          removeItem={(item) => {
            dispatch(removeWeapon({ ...item, type: item.type as WeaponType }));
          }}
          updateChosenID={setChosenID}
          onClose={closeModal}
        />
      )}
    </WareHouse.Wrapper>
  );
}
