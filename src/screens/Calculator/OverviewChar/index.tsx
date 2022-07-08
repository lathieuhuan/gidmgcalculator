import cn from "classnames";
import { useState } from "react";
import { selectCharData } from "@Store/calculatorSlice/selectors";
import { useDispatch, useSelector } from "@Store/hooks";
import { Button } from "@Styled/Inputs";
import styles from "../styles.module.scss";
import { findByName } from "@Src/utils";
import Content from "./Content";
import characters from "@Data/characters";

export default function OverviewChar() {
  const charData = useSelector(selectCharData);
  const [pickerOn, setPickerOn] = useState(false);
  return (
    <div className={cn("px-4 py-3 flex-col bg-darkblue-1", styles.card)}>
      {charData ? (
        <Content openPicker={() => setPickerOn(true)} />
      ) : (
        <Button className="mx-auto" variant="positive" onClick={() => setPickerOn(true)}>
          Choose a Character
        </Button>
      )}
      {pickerOn && <CharPicker close={() => setPickerOn(false)} />}
    </div>
  );
}

function CharPicker({ close }: { close: () => void }) {
  const myChars = useSelector((state) => state.database.myChars);
  const dispatch = useDispatch();

  const mixedList = [];
  for (const { name, code, beta, icon, rarity, vision, weapon } of characters) {
    const char = { code, beta, icon, rarity, vision, weapon };
    const existedChar = findByName(myChars, name);
    
    if (existedChar) {
      mixedList.push({ ...existedChar, ...char });
    } else {
      mixedList.push({ name, ...char });
    }
  }
  return (
    <Picker
      data={mixedList}
      dataType="Character"
      close={close}
      pick={(pickedChar) => dispatch(initSessionWithChar(pickedChar))}
    />
  );
}
