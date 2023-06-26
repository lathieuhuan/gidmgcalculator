import clsx from "clsx";
import { Fragment, useState } from "react";
import { FaEllipsisH } from "react-icons/fa";

import type { WeaponType } from "@Src/types";
import { MAX_USER_WEAPONS, WEAPON_ICONS } from "@Src/constants";
import { selectWeaponInventory } from "@Store/userDatabaseSlice/selectors";
import { findById, indexById } from "@Src/utils";

// Action
import { addUserWeapon, removeWeapon, sortWeapons, swapWeaponOwner, updateUserWeapon } from "@Store/userDatabaseSlice";
import { updateMessage } from "@Store/calculatorSlice";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";
import { useTypeFilter } from "@Components/inventory/hooks";

// Component
import { PickerCharacter, PickerWeapon } from "@Src/features";
import {
  IconButton,
  CollapseSpace,
  ButtonGroup,
  OwnerLabel,
  TypeSelect,
  WeaponCard,
  WareHouse,
  InventoryRack,
  ItemRemoveConfirm,
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
    <WareHouse.Wrapper>
      <WareHouse>
        <WareHouse.ButtonBar>
          <ButtonGroup
            className="mr-4 space-x-4"
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
            <Fragment>
              <IconButton
                className={clsx("ml-1", filterIsActive ? "bg-green" : "bg-white")}
                onClick={() => setFilterIsActive(!filterIsActive)}
              >
                <FaEllipsisH />
              </IconButton>

              <CollapseSpace className="w-full absolute top-full left-0 z-20" active={filterIsActive}>
                <div className="px-4 py-6 shadow-common bg-darkblue-2">{renderTypeFilter()}</div>
              </CollapseSpace>
            </Fragment>
          )}
        </WareHouse.ButtonBar>

        <WareHouse.Body className="hide-scrollbar">
          <InventoryRack
            listClassName={styles.list}
            itemClassName={styles.item}
            chosenID={chosenID}
            itemType="weapon"
            items={filteredWeapons}
            onClickItem={(item) => setChosenID(item.ID)}
          />

          <div className="flex flex-col">
            <div className="p-4 grow rounded-lg bg-darkblue-1 flex flex-col hide-scrollbar">
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

            <OwnerLabel key={chosenID} owner={chosenWeapon?.owner} setupIDs={chosenWeapon?.setupIDs} />
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
          if (checkIfMaxWeaponsReached()) {
            return {
              shouldStopPicking: true,
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
          sourceType="userData"
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
          itemType="weapon"
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
    </WareHouse.Wrapper>
  );
}
