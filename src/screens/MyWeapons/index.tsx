import clsx from "clsx";
import { Fragment, useState } from "react";
import { FaEllipsisH } from "react-icons/fa";
import type { UserWeapon, WeaponType } from "@Src/types";

// Constant
import { MAX_USER_WEAPONS, WEAPON_ICONS } from "@Src/constants";

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
import { selectWeaponInventory } from "@Store/userDatabaseSlice/selectors";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";
import { useTypeFilter } from "@Components/templates/inventories/hooks";

// Util
import { indexById } from "@Src/utils";

// Component
import { IconButton, CollapseSpace } from "@Components/atoms";
import { ButtonBar } from "@Components/molecules";
import {
  ItemRemoveConfirm,
  TypeSelect,
  WeaponCard,
  OwnerLabel,
  WareHouse,
} from "@Components/organisms";
import { InventoryRack, PickerCharacter, PickerWeapon } from "@Components/templates";

import styles from "../styles.module.scss";

type ModalType = "" | "PICK_WEAPON_TYPE" | "PICK_CHARACTER_FOR_EQUIP" | "REMOVE_WEAPON";

export default function MyWeapons() {
  const dispatch = useDispatch();

  const [chosenWeapon, setChosenWeapon] = useState<UserWeapon>();
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
          <ButtonBar
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

              <CollapseSpace
                className="w-full absolute top-full left-0 z-20"
                active={filterIsActive}
              >
                <div className="px-4 py-6 shadow-common bg-darkblue-2">{renderTypeFilter()}</div>
              </CollapseSpace>
            </Fragment>
          )}
        </WareHouse.ButtonBar>

        <WareHouse.Body className="hide-scrollbar">
          <InventoryRack
            listClassName={styles.list}
            itemClassName={styles.item}
            chosenID={chosenWeapon?.ID || 0}
            itemType="weapon"
            items={filteredWeapons}
            onClickItem={(item) => setChosenWeapon(item as UserWeapon)}
          />

          <div className="flex flex-col">
            <div className="p-4 grow rounded-lg bg-darkblue-1 flex flex-col hide-scrollbar">
              <div className="w-75 grow hide-scrollbar">
                {chosenWeapon ? (
                  <WeaponCard
                    mutable
                    weapon={chosenWeapon}
                    upgrade={(level) => dispatch(updateUserWeapon({ ID: chosenWeapon.ID, level }))}
                    refine={(refi) => dispatch(updateUserWeapon({ ID: chosenWeapon.ID, refi }))}
                  />
                ) : null}
              </div>
              {chosenWeapon ? (
                <ButtonBar
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

            <OwnerLabel
              key={chosenWeapon?.ID}
              owner={chosenWeapon?.owner}
              setupIDs={chosenWeapon?.setupIDs}
            />
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
          setChosenWeapon(newWeapon);
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
            if (chosenWeapon.ID) {
              dispatch(swapWeaponOwner({ weaponID: chosenWeapon.ID, newOwner: name }));
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

            const removedIndex = indexById(filteredWeapons, chosenWeapon.ID);

            if (removedIndex !== -1) {
              if (filteredWeapons.length > 1) {
                const move = removedIndex === filteredWeapons.length - 1 ? -1 : 1;

                setChosenWeapon(filteredWeapons[removedIndex + move]);
              } else {
                setChosenWeapon(undefined);
              }
            }
          }}
          onClose={closeModal}
        />
      )}
    </WareHouse.Wrapper>
  );
}
