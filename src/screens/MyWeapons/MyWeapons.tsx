import clsx from "clsx";
import { useState } from "react";
import { FaEllipsisH } from "react-icons/fa";
import type { WeaponType } from "@Src/types";

import { MAX_USER_WEAPONS } from "@Src/constants";
import { findById, indexById } from "@Src/utils";
import { useTypeFilter } from "@Src/hooks";
import { $AppData } from "@Src/services";

// Store
import { useDispatch, useSelector } from "@Store/hooks";
import { selectWeaponInventory } from "@Store/userDatabaseSlice/selectors";
import { addUserWeapon, removeWeapon, sortWeapons, swapWeaponOwner, updateUserWeapon } from "@Store/userDatabaseSlice";
import { updateMessage } from "@Store/calculatorSlice";

// Component
import { ButtonGroup, CollapseSpace, WarehouseLayout, Button, ConfirmModal } from "@Src/pure-components";
import { OwnerLabel, WeaponCard, InventoryRack, PickerCharacter, PickerWeapon } from "@Src/components";

import styles from "../styles.module.scss";

type ModalType = "" | "ADD_WEAPON" | "PICK_CHARACTER_FOR_EQUIP" | "REMOVE_WEAPON";

export default function MyWeapons() {
  const dispatch = useDispatch();

  const [chosenID, setChosenID] = useState(0);
  const [modalType, setModalType] = useState<ModalType>("");
  const [filterIsActive, setFilterIsActive] = useState(false);

  const { filteredTypes, renderTypeFilter } = useTypeFilter("weapon");
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

  const onClickAddWeapon = () => {
    if (!checkIfMaxWeaponsReached()) {
      setModalType("ADD_WEAPON");
    }
  };

  return (
    <WarehouseLayout.Wrapper>
      <WarehouseLayout>
        <WarehouseLayout.ButtonBar>
          <ButtonGroup
            className="mr-4"
            buttons={[
              { text: "Add", onClick: onClickAddWeapon },
              {
                text: "Sort",
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
                  justify="end"
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

      <PickerWeapon
        active={modalType === "ADD_WEAPON"}
        hasMultipleMode
        hasConfigStep
        onPickWeapon={(item) => {
          if (checkIfMaxWeaponsReached()) {
            return {
              isValid: false,
            };
          }

          const newWeapon = {
            ...item,
            ID: Date.now(),
            owner: null,
          };

          dispatch(addUserWeapon(newWeapon));
          setChosenID(newWeapon.ID);
        }}
        onClose={closeModal}
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

      {chosenWeapon ? (
        <ConfirmModal
          active={modalType === "REMOVE_WEAPON"}
          message={
            <>
              Remove "<b>{$AppData.getWeaponData(chosenWeapon.code).name}</b>"?{" "}
              {chosenWeapon.owner ? (
                <>
                  It is currently used by <b>{chosenWeapon.owner}</b>.
                </>
              ) : null}
            </>
          }
          focusConfirm
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
      ) : null}
    </WarehouseLayout.Wrapper>
  );
}
