import { Green } from "@Components/atoms";

export const SettingsGuide = () => {
  return (
    <>
      <p>
        - Be careful when the Calculator is under the effect of{" "}
        <Green>Separate Character's Info</Green> (level, constellation, talents) on each Setup. It
        can make things complicated.
      </p>
      <p>
        - When Separate Character's Info is deactivated. Info on the current Setup will be used for
        others.
      </p>
      <p>
        - Separate Character's Info will be reset to NOT activated at the start of every calculating
        session.
      </p>
    </>
  );
};
