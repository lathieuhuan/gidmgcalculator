import clsx from "clsx";
import { Fragment, useState } from "react";
import { FaEllipsisH } from "react-icons/fa";
import type { UserWeapon, WeaponType } from "@Src/types";

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
import { selectFilteredWeapons } from "@Store/userDatabaseSlice/selectors";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";
import { useTypeFilter } from "@Components/templates/inventories/hooks";

// Util
import { indexById } from "@Src/utils";

// Component
import { IconButton, CollapseSpace } from "@Components/atoms";
import { ButtonBar } from "@Components/molecules";
import { ItemRemoveConfirm, TypeSelect, WeaponCard, OwnerLabel } from "@Components/organisms";
import { InventoryRack, PickerCharacter, PickerWeapon, WareHouse } from "@Components/templates";

import styles from "../styles.module.scss";

type ModalType = "" | "PICK_WEAPON_TYPE" | "EQUIP_CHARACTER" | "REMOVE_WEAPON";

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
  const filteredWeapons = useSelector((state) =>
    selectFilteredWeapons(state, filteredTypes as WeaponType[])
  );

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
                          openModal("REMOVE_WEAPON")();
                        }
                      },
                    },
                    { text: "Equip", onClick: openModal("EQUIP_CHARACTER") },
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
          const newWeapon = { ID: Date.now(), ...item, owner: null };

          dispatch(addUserWeapon(newWeapon));
          setChosenWeapon(newWeapon);
        }}
        onClose={() => setWeaponPicker((prev) => ({ ...prev, active: false }))}
      />

      {chosenWeapon && (
        <PickerCharacter
          active={modalType === "EQUIP_CHARACTER"}
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

            const index = indexById(filteredWeapons, chosenWeapon.ID);

            if (index !== -1 && filteredWeapons.length > 1) {
              const move = index < filteredWeapons.length - 1 ? 1 : -1;

              setChosenWeapon(filteredWeapons[index + move]);
            }
          }}
          onClose={closeModal}
        />
      )}
    </WareHouse.Wrapper>
  );
}
