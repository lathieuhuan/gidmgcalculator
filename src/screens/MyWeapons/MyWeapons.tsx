import clsx from "clsx";
import { useState } from "react";
import { FaEllipsisH } from "react-icons/fa";
import { createSelector } from "@reduxjs/toolkit";

import { MAX_USER_WEAPONS } from "@Src/constants";
import { findById, indexById } from "@Src/utils";
import { useIconSelect } from "@Src/hooks";
import { $AppData } from "@Src/services";
import { UserWeapon, WeaponType } from "@Src/types";

// Store
import { useDispatch, useSelector } from "@Store/hooks";
import { addUserWeapon, removeWeapon, sortWeapons, swapWeaponOwner, updateUserWeapon } from "@Store/userDatabaseSlice";
import { selectUserWps } from "@Store/userDatabaseSlice/selectors";
import { updateMessage } from "@Store/calculatorSlice";

// Component
import { ButtonGroup, CollapseSpace, WarehouseLayout, Button, ConfirmModal } from "@Src/pure-components";
import { OwnerLabel, WeaponCard, InventoryRack, Tavern, WeaponForge } from "@Src/components";

type ModalType = "ADD_WEAPON" | "PICK_CHARACTER_FOR_EQUIP" | "REMOVE_WEAPON" | "";

const selectWeaponInventory = createSelector(
  selectUserWps,
  (_: unknown, types: WeaponType[]) => types,
  (userWps, types) => ({
    filteredWeapons: types.length ? userWps.filter((wp) => types.includes(wp.type)) : userWps,
    totalCount: userWps.length,
  })
);

export default function MyWeapons() {
  const dispatch = useDispatch();

  const [chosenID, setChosenID] = useState(0);
  const [modalType, setModalType] = useState<ModalType>("");
  const [filterIsActive, setFilterIsActive] = useState(false);

  const { selectedTypes, renderTypeSelect } = useIconSelect.Weapon();
  const { filteredWeapons, totalCount } = useSelector((state) => selectWeaponInventory(state, selectedTypes));
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
            renderTypeSelect()
          ) : (
            <>
              <Button
                className={clsx("ml-1", filterIsActive ? "bg-green-300" : "bg-light-400")}
                icon={<FaEllipsisH />}
                onClick={() => setFilterIsActive(!filterIsActive)}
              />

              <CollapseSpace className="w-full absolute top-full left-0 z-20" active={filterIsActive}>
                <div className="px-4 py-6 shadow-common bg-dark-700">{renderTypeSelect()}</div>
              </CollapseSpace>
            </>
          )}
        </WarehouseLayout.ButtonBar>

        <WarehouseLayout.Body className="hide-scrollbar gap-2">
          <InventoryRack
            data={filteredWeapons}
            emptyText="No weapons found"
            itemCls="max-w-1/3 basis-1/3 xm:max-w-1/4 xm:basis-1/4 lg:max-w-1/6 lg:basis-1/6 xl:max-w-1/8 xl:basis-1/8"
            chosenID={chosenID}
            onClickItem={(item) => setChosenID(item.ID)}
          />

          <div className="flex flex-col">
            <div className="p-4 grow rounded-lg bg-dark-900 flex flex-col hide-scrollbar">
              <div className="w-68 grow hide-scrollbar">
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

      <WeaponForge
        active={modalType === "ADD_WEAPON"}
        hasMultipleMode
        hasConfigStep
        onForgeWeapon={(weapon) => {
          if (checkIfMaxWeaponsReached()) return;

          const newUserWeapon: UserWeapon = {
            ...weapon,
            ID: Date.now(),
            owner: null,
          };

          dispatch(addUserWeapon(newUserWeapon));
          setChosenID(newUserWeapon.ID);
        }}
        onClose={closeModal}
      />

      {chosenWeapon && (
        <Tavern
          active={modalType === "PICK_CHARACTER_FOR_EQUIP"}
          sourceType="user"
          filter={(character) => {
            return character.weaponType === chosenWeapon.type && character.name !== chosenWeapon.owner;
          }}
          onSelectCharacter={(character) => {
            if (chosenID) {
              dispatch(swapWeaponOwner({ weaponID: chosenID, newOwner: character.name }));
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
              Remove "<b>{$AppData.getWeapon(chosenWeapon.code).name}</b>"?{" "}
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
