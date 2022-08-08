import cn from "classnames";
import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { Modal } from "@Components/modals";
import { IntroButton, mobileNavButtonStyles, Tabs } from "./components";

interface NavBarProps {
  //
}
export function NavBar(props: NavBarProps) {
  const [active, setActive] = useState(false);
  return (
    <div className="bg-black/60">
      {window.innerWidth >= 1050 ? (
        <div className="flex justify-between">
          <div className="flex">
            <Tabs className="px-2 py-1" />
          </div>
          <div className="px-1 flex bg-darkblue-3">
            <IntroButton className="px-2 py-1" />
            {/* <Download />
            <Upload loadData={loadData} outdates={outdates} /> */}
          </div>
        </div>
      ) : (
        <div className="flex">
          <div className="mr-auto relative">
            <button
              className={cn(
                "flex-center",
                mobileNavButtonStyles.base,
                active ? mobileNavButtonStyles.active : mobileNavButtonStyles.idle
              )}
              onClick={() => setActive(!active)}
            >
              <FaBars />
            </button>
            {active && (
              <Modal onClose={() => setActive(false)}>
                <div className="rounded flex flex-col shadow-white-glow">
                  <IntroButton className="px-6 py-2 rounded-t bg-darkblue-3 border-b border-white/40" />
                  <Tabs
                    className="px-6 py-2 border-b border-white/40 last:rounded-b"
                    onClick={() => setActive(false)}
                  />
                  {/* <Download />
                  <Upload loadData={loadData} closeMenu={close} /> */}
                </div>
              </Modal>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
