import clsx from "clsx";
import { useState, ReactNode, useRef, useEffect, useLayoutEffect } from "react";
import { FaFilter, FaSearch } from "react-icons/fa";

import { useScreenWatcher } from "@Src/features";
import { Modal, Button, Checkbox, Input, Drawer, DrawerProps, Popover } from "@Src/pure-components";

export type EntitySelectRenderArgs = {
  isMultiSelect: boolean;
  searchOn: boolean;
  keyword: string;
  inputRef: React.RefObject<HTMLInputElement>;
};

interface EntitySelectTemplateProps {
  title: string;
  hasMultipleMode?: boolean;
  hasSearch?: boolean;
  hasFilter?: boolean;
  /** Default to 360px */
  filterWrapWidth?: DrawerProps["activeWidth"];
  /** Default to true */
  filterToggleable?: boolean;
  initialFilterOn?: boolean;
  children: (args: EntitySelectRenderArgs) => ReactNode;
  renderFilter?: (setFilterOn: (on: boolean) => void) => ReactNode;
  onClose: () => void;
}
export const EntitySelectTemplate = ({
  title,
  hasMultipleMode,
  hasSearch,
  hasFilter,
  filterWrapWidth = 360,
  filterToggleable = true,
  initialFilterOn = false,
  children,
  renderFilter,
  onClose,
}: EntitySelectTemplateProps) => {
  const screenWatcher = useScreenWatcher();
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutId = useRef<NodeJS.Timeout>();

  const [filterOn, setFilterOn] = useState(initialFilterOn);
  const [searchOn, setSearchOn] = useState(false);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const focus = (e: KeyboardEvent) => {
      if (hasSearch && e.key.length === 1 && document.activeElement !== inputRef.current) {
        inputRef.current?.focus();
      }
    };
    document.body.addEventListener("keydown", focus);

    return () => {
      document.body.removeEventListener("keydown", focus);
    };
  }, []);

  useLayoutEffect(() => {
    if (searchOn) inputRef.current?.focus();
  }, [searchOn]);

  const toggleFilter = (on?: boolean) => {
    if (filterToggleable) setFilterOn(on ?? !filterOn);
  };

  let searchTool: JSX.Element | null = null;
  const searchInput = (
    <Input
      ref={inputRef}
      className="w-28 px-2 py-1 text-base leading-5 font-semibold shadow-common"
      placeholder="Search..."
      disabled={filterOn}
      value={keyword}
      onChange={(value) => {
        clearTimeout(timeoutId.current);

        timeoutId.current = setTimeout(() => {
          setKeyword(value);
        }, 150);
      }}
      // onKeyDown={(e) => {
      //   if (e.key === "Enter" && e.currentTarget.value.length) {
      //     const itemElmts = observedAreaRef.current?.querySelectorAll(`.${observedItemCls}`) || [];

      //     for (const elmt of itemElmts) {
      //       if (window.getComputedStyle(elmt).display !== "none") {
      //         const code = elmt.getAttribute("data-id");
      //         const foundItem = code ? data.find((item) => item.code === +code) : undefined;

      //         if (foundItem) onClickPickerItem(foundItem);
      //         return;
      //       }
      //     }
      //   }
      // }}
    />
  );

  if (hasSearch) {
    if (screenWatcher.isFromSize("sm")) {
      searchTool = searchInput;
    } else {
      searchTool = (
        <div className="relative">
          <Button
            className="shadow-common"
            variant={searchOn ? "neutral" : "default"}
            shape="square"
            size="small"
            disabled={filterOn}
            icon={<FaSearch />}
            onClick={() => {
              const newSearchOn = !searchOn;
              setSearchOn(newSearchOn);
              if (!newSearchOn) setKeyword("");
            }}
          />

          <Popover as="div" active={searchOn} className="mt-4" origin="top-left">
            {searchInput}
          </Popover>
        </div>
      );
    }
  }

  return (
    <div className="h-full flex flex-col rounded-lg shadow-white-glow">
      <Modal.CloseButton onClick={onClose} />

      <Modal.Header withDivider>
        <div className="flex items-center justify-between relative">
          <div>{title}</div>

          <div className="mr-4 pr-4 flex items-center">
            <div className="flex items-center gap-3">
              {searchTool}

              {hasFilter ? (
                <Button
                  className="shadow-common"
                  variant={filterOn ? "neutral" : "default"}
                  shape="square"
                  size="small"
                  icon={<FaFilter />}
                  disabled={!filterToggleable}
                  onClick={() => toggleFilter()}
                />
              ) : null}
            </div>

            {hasMultipleMode ? (
              <label
                className={clsx(
                  "pl-2 h-6 flex items-center",
                  (hasSearch || hasFilter) && "ml-2 border-l border-dark-300"
                )}
              >
                <Checkbox className="mr-2" onChange={setIsMultiSelect} />
                <span className="text-base text-light-400">Multiple</span>
              </label>
            ) : null}
          </div>
        </div>
      </Modal.Header>

      <div className="p-3 pb-4 sm:p-4 grow overflow-hidden relative">
        {children({
          isMultiSelect,
          searchOn,
          keyword,
          inputRef,
        })}

        <Drawer
          active={filterOn}
          activeWidth={screenWatcher.isFromSize("sm") ? filterWrapWidth : "100%"}
          closeOnMaskClick={filterToggleable}
          onClose={() => toggleFilter(false)}
        >
          {renderFilter?.(setFilterOn)}
        </Drawer>
      </div>
    </div>
  );
};
