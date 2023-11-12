import clsx from "clsx";
import { useState } from "react";
import { FaEllipsisH } from "react-icons/fa";
import type { WeaponType } from "@Src/types";

import { MAX_USER_WEAPONS, WEAPON_ICONS } from "@Src/constants";
import { findById, indexById } from "@Src/utils";
import { useTypeFilter } from "@Src/components/inventory/hooks";

// Store
import { useDispatch, useSelector } from "@Store/hooks";
import { selectWeaponInventory } from "@Store/userDatabaseSlice/selectors";
import { addUserWeapon, removeWeapon, sortWeapons, swapWeaponOwner, updateUserWeapon } from "@Store/userDatabaseSlice";
import { updateMessage } from "@Store/calculatorSlice";

// Component
import { ButtonGroup, CollapseSpace, WarehouseLayout, Button } from "@Src/pure-components";
import {
  OwnerLabel,
  TypeSelect,
  WeaponCard,
  InventoryRack,
  ItemRemoveConfirm,
  PickerCharacter,
  PickerWeapon,
} from "@Src/components";

import styles from "../styles.module.scss";

type ModalType = "" | "PICK_WEAPON_TYPE" | "PICK_CHARACTER_FOR_EQUIP" | "REMOVE_WEAPON";

export default function MyWeapons() {
  const dispatch = useDispatch();

  const [chosenID, setChosenID] = useState(0);
  const [modalType, setModalType] = useState<ModalType>("");
  const [filterIsActive, setFilterIsActive] = useState(false);
  const [weaponPicker, setWeaponPicker] = useState<{ active: boolean; type: WeaponType }>({
    active: false,
    type: "sword",
  });

  const { filteredTypes, renderTypeFilter } = useTypeFilter({ itemType: "weapon" });
  const { filteredWeapons, totalCount } = useSelector((state) =>
    selectWeaponInventory(state, filteredTypes as WeaponType[])
  );
  const chosenWeapon = findById(filteredWeapons, chosenID);

  const checkIfMaxWeaponsReached = () => {
    if (totalCount + 1 > MAX_USER_WEAPONS) {
      dispatch(
        updateMessage({
          type: "error",
          content: "Number of stored weapons has reached its limit.",
        })
      );

      return true;
    }
  };

  const closeModal = () => setModalType("");

  return (
    <WarehouseLayout.Wrapper>
      <WarehouseLayout>
        <WarehouseLayout.ButtonBar>
          <ButtonGroup
            className="mr-4"
            space="space-x-4"
            buttons={[
              {
                text: "Add",
                variant: "positive",
                onClick: () => {
                  if (!checkIfMaxWeaponsReached()) {
                    setModalType("PICK_WEAPON_TYPE");
                  }
                },
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
            <>
              <Button
                className={clsx("ml-1", filterIsActive ? "bg-green-300" : "bg-light-400")}
                icon={<FaEllipsisH />}
                onClick={() => setFilterIsActive(!filterIsActive)}
              />

              <CollapseSpace className="w-full absolute top-full left-0 z-20" active={filterIsActive}>
                <div className="px-4 py-6 shadow-common bg-dark-700">{renderTypeFilter()}</div>
              </CollapseSpace>
            </>
          )}
        </WarehouseLayout.ButtonBar>

        <WarehouseLayout.Body className="hide-scrollbar">
          <InventoryRack
            listClassName={styles.list}
            itemClassName={styles.item}
            chosenID={chosenID}
            itemType="weapon"
            items={filteredWeapons}
            onClickItem={(item) => setChosenID(item.ID)}
          />

          <div className="flex flex-col">
            <div className="p-4 grow rounded-lg bg-dark-900 flex flex-col hide-scrollbar">
              <div className="w-75 grow hide-scrollbar">
                {chosenWeapon ? (
                  <WeaponCard
                    mutable
                    weapon={chosenWeapon}
                    upgrade={(level) => dispatch(updateUserWeapon({ ID: chosenID, level }))}
                    refine={(refi) => dispatch(updateUserWeapon({ ID: chosenID, refi }))}
                  />
                ) : null}
              </div>
              {chosenWeapon ? (
                <ButtonGroup
                  className="mt-4"
                  buttons={[
                    {
                      text: "Remove",
                      onClick: () => {
                        if (chosenWeapon.setupIDs?.length) {
                          dispatch(
                            updateMessage({
                              type: "info",
                              content: "This weapon cannot be deleted. It is used by some Setups.",
                            })
                          );
                        } else {
                          setModalType("REMOVE_WEAPON");
                        }
                      },
                    },
                    { text: "Equip", onClick: () => setModalType("PICK_CHARACTER_FOR_EQUIP") },
                  ]}
                />
              ) : null}
            </div>

            <OwnerLabel key={chosenID} item={chosenWeapon} />
          </div>
        </WarehouseLayout.Body>
      </WarehouseLayout>

      <TypeSelect
        active={modalType === "PICK_WEAPON_TYPE"}
        options={WEAPON_ICONS}
        onSelect={(weaponType) => {
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
          if (checkIfMaxWeaponsReached()) {
            return {
              isValid: false,
            };
          }

          const newWeapon = {
            ID: Date.now(),
            ...item,
            owner: null,
          };

          dispatch(addUserWeapon(newWeapon));
          setChosenID(newWeapon.ID);
        }}
        onClose={() => setWeaponPicker((prev) => ({ ...prev, active: false }))}
      />

      {chosenWeapon && (
        <PickerCharacter
          active={modalType === "PICK_CHARACTER_FOR_EQUIP"}
          sourceType="user"
          filter={({ name, weaponType }) => {
            return weaponType === chosenWeapon.type && name !== chosenWeapon.owner;
          }}
          onPickCharacter={({ name }) => {
            if (chosenID) {
              dispatch(swapWeaponOwner({ weaponID: chosenID, newOwner: name }));
            }
          }}
          onClose={closeModal}
        />
      )}

      {chosenWeapon && (
        <ItemRemoveConfirm
          active={modalType === "REMOVE_WEAPON"}
          item={chosenWeapon}
          onConfirm={() => {
            dispatch(removeWeapon(chosenWeapon));

            const removedIndex = indexById(filteredWeapons, chosenID);

            if (removedIndex !== -1) {
              if (filteredWeapons.length > 1) {
                const move = removedIndex === filteredWeapons.length - 1 ? -1 : 1;

                setChosenID(filteredWeapons[removedIndex + move].ID);
              } else {
                setChosenID(0);
              }
            }
          }}
          onClose={closeModal}
        />
      )}
    </WarehouseLayout.Wrapper>
  );
}
