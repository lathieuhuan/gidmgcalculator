import { useState } from "react";
import Modal from "../Modal";
import Body from "./Body";
import Header from "./Header";
import type { DataType } from "./types";

interface PickerProps {
  data: any;
  dataType: DataType;
  needMassAdd: boolean;
  pick: (item: any) => void;
  close: () => void;
}

export default function Picker({
  data,
  dataType,
  needMassAdd,
  pick,
  close,
}: PickerProps) {
  //
  const [filter, setFilter] = useState(initFilter);
  const [massAdd, setMassAdd] = useState(false);
  const [total, setTotal] = useState(0);
  const [each, setEach] = useState(data.map(() => 0));

  return (
    <Modal standard close={close}>
      <div className="p-2 h-[10%]">
        <Header
          dataType={dataType}
          needMassAdd={needMassAdd}
          massAdd={massAdd}
          toggleMassAdd={() => setMassAdd((prev) => !prev)}
          count={total}
          filter={filter}
          setFilter={setFilter}
          close={close}
        />
      </div>
      <div className="px-3 pt-2 pb-3 h-[90%]">
        <Body
          data={data}
          forChar={dataType === "character"}
          filter={filter}
          massAdd={massAdd}
          each={each}
          pick={(item, i) => {
            pick(item);
            if (!massAdd) {
              close();
            } else {
              setTotal((prev) => prev + 1);
              if (dataType !== "Character")
                setEach((prev) => {
                  const arr = [...prev];
                  arr[i]++;
                  return arr;
                });
            }
          }}
        />
      </div>
    </Modal>
  );
}
