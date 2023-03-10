import { FaBars, FaCog } from "react-icons/fa";
import { Lightgold } from "@Components/atoms";

export const SettingsGuide = () => {
  return (
    <div className="space-y-1 contains-inline-svg">
      <p>
        - The App settings can be change via <FaCog /> Settings on the <FaBars /> Menu.
      </p>
      <p>
        - Be careful when the Calculator is under the effect of{" "}
        <Lightgold>Separate main character's info on each setup</Lightgold> (level, constellation,
        talents) on each setup. It can make things complicated.
      </p>
      <p>
        - When the "Separate main character's info on each setup" option is deactivated. Info on the
        current setup will be used for others. This setting will be reset to NOT activated at the
        start of every calculating session (e.g. when select new main character).
      </p>
      <p>
        - <Lightgold>Default values</Lightgold> will be used whenever a new character or item is
        created in your data or the Calculator.
      </p>
    </div>
  );
};
